import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect, useRef } from "react";
import { setChatbotMessages } from "../global/slice";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import Latex from "react-latex-next";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";

const normalizeLatexDelimiters = (text) =>
  text
    .replace(/\\{1,2}\[[\s]*(?![\d.]+[a-z]{2}\])/g, "\n$$\n")
    .replace(/[\s]*\\{1,2}\]/g, "\n$$\n")
    .replace(/\\{1,2}\(/g, "$")
    .replace(/\\{1,2}\)/g, "$");

const CONTENT_BLOCK_RE =
  /\[\s*\{\s*['"]type['"]\s*:\s*['"]text['"]\s*,\s*['"]text['"]\s*:\s*(["'])([\s\S]*)/;
const cleanBotMessage = (text) => {
  const m = text.match(CONTENT_BLOCK_RE);
  if (!m) return text;
  const quote = m[1];
  let inner = m[2];
  const lastIdx = inner.lastIndexOf(`${quote}}]`);
  if (lastIdx !== -1) inner = inner.slice(0, lastIdx);
  inner = inner
    .replace(/\\\\(?=[a-zA-Z()])/g, "\\") // \\cmd, \\(, \\) → single backslash
    .replace(/\\n(?![a-z])/g, "\n") // \n → newline (skip \nabla, \newline etc.)
    .replace(/\\t(?![a-z])/g, "\t"); // \t → tab (skip \text, \theta etc.)
  return cleanBotMessage(inner);
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

const LegacyChatbot = () => {
  const [typing, setTyping] = useState(false);
  const messages = useSelector((state) => state.chatbotMessages);
  const dispatch = useDispatch();

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
      role: message.sender === "ChatGPT" ? "assistant" : "user",
      content: message.message,
    }));

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
          body: JSON.stringify({
            model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
            messages: [systemMessage, ...apiMessages],
            stream: true,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              if (!accumulated) setTyping(false);
              accumulated += delta;
              dispatch(
                setChatbotMessages([
                  ...chatMessages,
                  {
                    message: accumulated,
                    sender: "ChatGPT",
                    direction: "Outgoing",
                  },
                ]),
              );
            }
          } catch {}
        }
      }

      if (!accumulated) throw new Error("No content received");
    } catch (error) {
      dispatch(
        setChatbotMessages([
          ...chatMessages,
          {
            message: "Sorry, something went wrong. Please try again.",
            sender: "ChatGPT",
            direction: "Outgoing",
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
    setTyping(true);
    processMessage(newMessages);
  };
  return (
    <MainContainer>
      <ChatContainer>
        <MessageList
          style={{ paddingBlockStart: "10px" }}
          scrollBehavior="smooth"
          typingIndicator={
            typing ? <TypingIndicator content="Examible bot is typing" /> : null
          }
        >
          {messages.map((message, index) => {
            return (
              <Message key={index} model={message}>
                <Message.CustomContent>
                  <div className="chat-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeSanitize, rehypeKatex]}
                      components={mdComponents}
                    >
                      {message.sender === "ChatGPT"
                        ? normalizeLatexDelimiters(
                            cleanBotMessage(message.message),
                          )
                        : message.message}
                    </ReactMarkdown>
                  </div>
                </Message.CustomContent>
              </Message>
            );
          })}
        </MessageList>
        <MessageInput
          attachButton={false}
          placeholder="Type message here"
          onSend={handleSend}
          disabled={typing}
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default LegacyChatbot;
