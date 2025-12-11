import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { setChatbotMessages } from "../global/slice";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import Latex from "react-latex-next";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import rehypeKatex from "rehype-katex";

const LegacyChatbot = () => {
  const [typing, setTyping] = useState(false);
  const messages = useSelector((state) => state.chatbotMessages);
  const dispatch = useDispatch();

  const processMessage = async (chatMessages) => {
    let apiMessages = chatMessages.map((message) => {
      let role = "";
      if (message.sender === "Gemini") {
        role = "model";
      } else {
        role = "user";
      }
      return { role: role, parts: [{ text: message.message }] };
    });

    const systemMessage = {
      role: "model",
      parts: [
        {
          text: `You are Examible bot, an AI assistant for students.
          Your purpose is to help students with their academic questions and provide useful information about Examible's services.
          Always respond in a helpful and friendly manner.
          If you are unsure about an answer, it's better to admit it than to provide incorrect information.`,
        },
      ],
    };

    const apiRequest = {
      contents: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "x-goog-api-key": import.meta.env.VITE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiRequest),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      dispatch(
        setChatbotMessages([
          ...chatMessages,
          {
            message: data.candidates[0].content.parts[0].text,
            sender: "Gemini",
            direction: "Outgoing",
          },
        ])
      );
    } catch (error) {
      dispatch(
        setChatbotMessages([
          ...chatMessages,
          {
            message: "Sorry, something went wrong. Please try again.",
            sender: "Gemini",
            direction: "Outgoing",
          },
        ])
      );
    } finally {
      setTyping(false);
    }
  };

  const handleSend = async (message) => {
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
          style={{ padding: 10 }}
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
                      components={{
                        code({ children, ...props }) {
                          return (
                            <code {...props}>
                              <Latex>{children}</Latex>
                            </code>
                          );
                        },
                      }}
                    >
                      {message.message}
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
        />
      </ChatContainer>
    </MainContainer>
  );
};

export default LegacyChatbot;
