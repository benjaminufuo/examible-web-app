import React from "react";
import { RiCloseLine } from "react-icons/ri";
import "../styles/dashboardCss/legacybot.css";
import { IoMdSend } from "react-icons/io";
import LegacyChatbot from "./LegacyChatbot";

const ChatBot = ({ closeBot }) => {
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h4>Legacy Assistant</h4>
        <RiCloseLine
          size={30}
          onClick={closeBot}
          style={{ cursor: "pointer" }}
        />
      </div>
      <div className="chatbot-body">
        <LegacyChatbot/>
      </div>
      {/* <div className="messagecontainer">
        <textarea
          className="textarea"
          name="input"
          placeholder="Ask me questions related to your Academics"
        ></textarea>
        <IoMdSend className="legacysendicon" />
      </div> */}
    </div>
  );
};

export default ChatBot;
