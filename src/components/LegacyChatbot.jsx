import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState, useMemo, useRef, useEffect } from "react";
import { setChatbotMessages } from "../global/slice";
import {
  streamChat,
  fetchFollowUpSuggestions,
  aiTutorErrorMessage,
} from "../utils/aiTutor";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Latex from "react-latex-next";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";
import { useRequireOnline } from "../hooks/useRequireOnline";
import ChatJumpButton from "./ChatJumpButton";
import { useAiReplyInProgress } from "../hooks/useAiReplyInProgress";

const normalizeLatexDelimiters = (text) =>
  text
    // \[...\] → display math — use functions so $$ isn't treated as JS replace-special "$"
    .replace(/\\{1,2}\[[\s]*(?![\d.]+[a-z]{2}\])/g, () => "\n$$\n")
    .replace(/[\s]*\\{1,2}\]/g, () => "\n$$\n")
    // \(...\) → inline math
    .replace(/\\{1,2}\(/g, "$")
    .replace(/\\{1,2}\)/g, "$")
    // remark-math needs $$ on its own line — insert newlines when missing
    .replace(/\$\$([^\n$])/g, (_, c) => `$$\n${c}`)
    .replace(/([^\n$])\$\$/g, (_, c) => `${c}\n$$`)
    // Collapse newlines inside display-math blocks; strip bare % (LaTeX comment markers — the model
    // writes \boxed{% formula} and after collapse KaTeX errors with "comment has no terminating newline")
    .replace(
      /\$\$\n([\s\S]*?)\n\$\$/g,
      (_, math) =>
        `$$\n${math.replace(/\n/g, " ").replace(/(?<!\\)%\s*/g, "")}\n$$`,
    );

const CONTENT_BLOCK_RE =
  /\[\s*\{\s*['"]type['"]\s*:\s*['"]text['"]\s*,\s*['"]text['"]\s*:\s*(["'])([\s\S]*)/;
const unescapeBackslashes = (text) =>
  text
    .replace(/\\\\(?!\n)/g, "\\") // \\ → \ except before newline (LaTeX \\ line break)
    .replace(/\\n(?![a-z])/g, "\n"); // \n → newline (skip \nabla, \nu etc.; uppercase \nF is not a valid LaTeX cmd)

const cleanBotMessage = (text) => {
  const m = text.match(CONTENT_BLOCK_RE);
  if (!m) return unescapeBackslashes(text); // no wrapper — still normalize backslashes
  const quote = m[1];
  let inner = m[2];
  const lastIdx = inner.lastIndexOf(`${quote}}]`);
  if (lastIdx !== -1) inner = inner.slice(0, lastIdx);
  return cleanBotMessage(unescapeBackslashes(inner));
};

const mdComponents = {
  h1: ({ children }) => (
    <p style={{ fontWeight: 700, fontSize: "1rem", margin: "6px 0" }}>
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: "5px 0" }}>
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: "4px 0" }}>
      {children}
    </p>
  ),
  code({ children, ...props }) {
    return (
      <code {...props}>
        <Latex>{children}</Latex>
      </code>
    );
  },
};

// Falls back to generic prompts when the student has no enrolled subjects / CBT history yet
const FALLBACK_SUGGESTIONS = [
  "Explain a tricky concept simply",
  "Quiz me on a topic I'm learning",
  "Help me prepare for an exam",
];

function buildSuggestions(user) {
  const enrolled = Array.isArray(user?.enrolledSubjects)
    ? user.enrolledSubjects
    : [];
  const weakest = user?.lastCbtDetails?.weakestSubject;
  const strongest = user?.lastCbtDetails?.strongestSubject;

  const picks = [];
  if (weakest && weakest !== "N/A") {
    picks.push(`Help me understand ${weakest} better`);
  }
  if (strongest && strongest !== "N/A" && strongest !== weakest) {
    picks.push(`Give me a challenging ${strongest} question`);
  }
  enrolled
    .filter((subject) => subject !== weakest && subject !== strongest)
    .slice(0, 2)
    .forEach((subject) => picks.push(`Quiz me on ${subject}`));

  const uniquePicks = [...new Set(picks)];
  return uniquePicks.length ? uniquePicks : FALLBACK_SUGGESTIONS;
}

// Copied chat text carries its formatting (background, fonts, HTML), and the
// rich-text input would keep it: paste the plain text only
const pastePlainText = (e) => {
  const text = e.clipboardData?.getData("text/plain");
  if (text == null) return;
  e.preventDefault();
  // Inserts at the caret like typing (and keeps undo working)
  document.execCommand("insertText", false, text);
};

const LegacyChatbot = () => {
  const [typing, setTyping] = useState(false);
  const messages = useSelector((state) => state.chatbotMessages);
  // A reply keeps streaming if the chat is closed; reopened meanwhile, the
  // chat waits for it (typing indicator, input disabled) like it never closed
  const replying = useAiReplyInProgress();
  const busy = typing || replying;
  const showTyping =
    typing || (replying && messages[messages.length - 1]?.sender !== "bot");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const requireOnline = useRequireOnline();
  const rafRef = useRef(null);
  const suggestions = useMemo(() => buildSuggestions(user), [user]);
  const [followUps, setFollowUps] = useState([]);
  // Each send is a new turn; follow-ups from an older turn (or after the chat
  // is closed) are ignored
  const turnRef = useRef(0);
  useEffect(
    () => () => {
      turnRef.current += 1;
    },
    [],
  );

  const processMessage = async (chatMessages) => {
    const turn = turnRef.current;
    // Sent as "assistant", not "system", on purpose: that's what the provider
    // accepts for these instructions
    const systemMessage = {
      role: "assistant",
      content:
        "You are Examible bot, an AI assistant for students. Help with academic questions in a friendly and accurate way. Your purpose is to help students with their academic questions and provide useful information about Examible's services. Always respond in a helpful and friendly manner. If you are unsure about an answer, it's better to admit it than to provide incorrect information." +
        "FORMATTING RULES — follow these strictly: " +
        "1. Wrap ALL math — variables, equations, units, symbols — in LaTeX delimiters. Use $...$ for inline math and $$...$$ for display/block equations. " +
        "2. Never write math as plain text. For example write $k = 0.6071\\,\\text{W}\\cdot\\text{m}^{-1}\\cdot\\text{K}^{-1}$ not k=0.6071 W/m/K. " +
        "3. Use $x^{-1}$ for superscripts, $\\frac{a}{b}$ for fractions, $\\sqrt{x}$ for roots. " +
        "4. For multi-line equations use $$\\begin{aligned}...\\end{aligned}$$.",
    };

    // Error lines shown in the chat are for the student, never the model
    const apiMessages = chatMessages
      .filter((message) => !message.error)
      .map((message) => ({
        role: message.sender === "bot" ? "assistant" : "user",
        content: message.message,
      }));
    const payloadMessages = [systemMessage, ...apiMessages];

    try {
      const { text, suggestions, incomplete } = await streamChat(
        payloadMessages,
        { chatMessages, dispatch, rafRef, setTyping },
      );
      // Only when the server has follow-up suggestions switched on, and not
      // for a reply that was cut off.
      // Non-blocking: don't delay the visible reply on this, and just leave the
      // row empty if it fails: it's a nicety, not a core feature.
      if (suggestions === "on" && !incomplete) {
        fetchFollowUpSuggestions([
          ...payloadMessages,
          { role: "assistant", content: text },
        ]).then((list) => {
          if (turnRef.current === turn) setFollowUps(list);
        });
      }
    } catch (error) {
      // Signed out (token expired): the chat has been reset with everything
      // else, so don't write this student's messages back into it
      if (error?.status === 401) return;
      dispatch(
        setChatbotMessages([
          ...chatMessages,
          {
            message: aiTutorErrorMessage(error),
            sender: "bot",
            direction: "incoming",
            error: true,
          },
        ]),
      );
    } finally {
      setTyping(false);
    }
  };

  const handleSend = async (text) => {
    const message = text?.trim();
    if (!message || busy) return;
    const newMessage = {
      message: message,
      sender: "user",
    };
    const newMessages = [...messages, newMessage];
    dispatch(setChatbotMessages(newMessages));
    turnRef.current += 1;
    setFollowUps([]);
    setTyping(true);
    processMessage(newMessages);
  };

  // Installed app offline: explain instead of failing
  const sendIfOnline = requireOnline(
    handleSend,
    "The AI tutor needs internet.",
  );

  // Cache processed text per message object so a streaming reply's per-frame array
  // replacement doesn't re-run the regex-heavy cleanup over the entire history —
  // only the message object that actually changed gets reprocessed.
  const processedCacheRef = useRef(new WeakMap());
  const processedMessages = useMemo(
    () =>
      messages.map((msg) => {
        if (msg.sender !== "bot") return msg;
        const cache = processedCacheRef.current;
        let processed = cache.get(msg);
        if (processed === undefined) {
          processed = normalizeLatexDelimiters(cleanBotMessage(msg.message));
          cache.set(msg, processed);
        }
        return { ...msg, _processed: processed };
      }),
    [messages],
  );

  return (
    <>
      <MainContainer>
        <ChatContainer>
          <MessageList
            className="legacybot-list"
            style={{ paddingBlockStart: "10px" }}
            scrollBehavior="smooth"
            typingIndicator={
              showTyping ? (
                <TypingIndicator content="Examible bot is typing" />
              ) : null
            }
          >
            {processedMessages.length <= 1 ? (
              <div className="legacybot-empty-state">
                <div className="legacybot-empty-state-icon">👋</div>
                <p className="legacybot-empty-state-title">
                  Hey, I&apos;m Examible bot
                </p>
                <p className="legacybot-empty-state-subtitle">
                  Ask me anything, or try one of these:
                </p>
                <div className="legacybot-suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="legacybot-suggestion-chip"
                      onClick={() => sendIfOnline(suggestion)}
                    >
                      <span
                        className="legacybot-suggestion-chip-icon"
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              processedMessages.map((message, index) => {
                return (
                  <Message key={index} model={message}>
                    <Message.CustomContent>
                      <div className="chat-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[
                            [
                              rehypeKatex,
                              { throwOnError: false, errorColor: "#cc0000" },
                            ],
                          ]}
                          components={mdComponents}
                        >
                          {message._processed ?? message.message}
                        </ReactMarkdown>
                        {message.incomplete && (
                          <p className="legacybot-incomplete">
                            This answer was cut off. Ask me to continue.
                          </p>
                        )}
                      </div>
                    </Message.CustomContent>
                  </Message>
                );
              })
            )}
          </MessageList>
          <MessageInput
            attachButton={false}
            placeholder="Type message here"
            // The input is a rich-text box: send its plain text (innerText
            // keeps line breaks), never its HTML
            onSend={(_html, textContent, innerText) =>
              sendIfOnline(innerText ?? textContent)
            }
            onPaste={pastePlainText}
            disabled={busy}
          />
        </ChatContainer>
      </MainContainer>
      {/* Its own component: scroll updates never re-render the message list */}
      <ChatJumpButton
        listClass="legacybot-list"
        hidden={showTyping}
        contentKey={`${messages.length}-${followUps.length}`}
        lastMessage={messages[messages.length - 1]}
      />
      {!busy && followUps.length > 0 && (
        <div className="legacybot-followups">
          {followUps.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="legacybot-followup-chip"
              onClick={() => sendIfOnline(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default LegacyChatbot;
