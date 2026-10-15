import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState, useMemo, useRef } from "react";
import { setChatbotMessages } from "../global/slice";
import {
  streamChatWithFallback,
  fetchFollowUpSuggestions,
} from "../utils/streamChatWithFallback";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Latex from "react-latex-next";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";

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

const LegacyChatbot = () => {
  const [typing, setTyping] = useState(false);
  const messages = useSelector((state) => state.chatbotMessages);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const rafRef = useRef(null);
  const suggestions = useMemo(() => buildSuggestions(user), [user]);
  const [followUps, setFollowUps] = useState([]);

  const processMessage = async (chatMessages) => {
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

    const apiMessages = chatMessages.map((message) => ({
      role: message.sender === "bot" ? "assistant" : "user",
      content: message.message,
    }));
    const payloadMessages = [systemMessage, ...apiMessages];

    try {
      const botReply = await streamChatWithFallback(payloadMessages, {
        chatMessages,
        dispatch,
        rafRef,
        setTyping,
      });
      // Non-blocking: don't delay the visible reply on this, and just leave the row
      // empty (via the catch below) if it fails — it's a nicety, not a core feature.
      fetchFollowUpSuggestions([
        ...payloadMessages,
        { role: "assistant", content: botReply },
      ])
        .then(setFollowUps)
        .catch(() => setFollowUps([]));
    } catch {
      dispatch(
        setChatbotMessages([
          ...chatMessages,
          {
            message: "Sorry, something went wrong. Please try again.",
            sender: "bot",
            direction: "incoming",
          },
        ]),
      );
    } finally {
      setTyping(false);
    }
  };

  const handleSend = async (message) => {
    if (!message || typing) return;
    const newMessage = {
      message: message,
      sender: "user",
    };
    const newMessages = [...messages, newMessage];
    dispatch(setChatbotMessages(newMessages));
    setFollowUps([]);
    setTyping(true);
    processMessage(newMessages);
  };

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
            style={{ paddingBlockStart: "10px" }}
            scrollBehavior="smooth"
            typingIndicator={
              typing ? (
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
                      onClick={() => handleSend(suggestion)}
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
            onSend={handleSend}
            disabled={typing}
          />
        </ChatContainer>
      </MainContainer>
      {!typing && followUps.length > 0 && (
        <div className="legacybot-followups">
          {followUps.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="legacybot-followup-chip"
              onClick={() => handleSend(suggestion)}
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
