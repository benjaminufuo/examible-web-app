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

const LegacyChatbot = () => {
  const [typing, setTyping] = useState(false);
  const messages = useSelector((state) => state.chatbotMessages);
  const dispatch = useDispatch();

  const processMessage = async (chatMessages) => {
    let apiMessages = chatMessages.map((message) => {
      let role = "";
      if (message.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: message.message };
    });

    const systemMessage = {
      role: "system",
      content:
        "Answer questions related to high school subject like biology, english, Literature in English, Physics, Economics, Geography, Government, history mathematics or other high school related subject. and if there is question not related to this field. please reply it is out of the scope",
    };

    const apiRequest = {
      model: "gpt-4o-mini",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequest),
    })
      .then((data) => data.json())
      .then((data) => {
        dispatch(
          setChatbotMessages([
            ...chatMessages,
            {
              message: data.choices[0].message.content,
              sender: "ChatGPT",
              direction: "Outgoing",
            },
          ])
        );
        setTyping(false);
      });
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
  console.log(messages);
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
            return <Message key={index} model={message} />;
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
