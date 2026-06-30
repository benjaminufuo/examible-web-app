import { useState, useEffect } from "react";
import logo from "../assets/public/logo.png";
import "../styles/authCss/loading.css";

const loadingMessages = [
  "Preparing your learning experience...",
  "Setting up your study environment...",
  "Getting your exam ready...",
  "Personalizing your experience...",
];

const Loading = ({ text }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // If a specific text prop is provided, don't cycle through messages.
    if (text) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="ex-premium-loader-overlay">
      {/* Ambient background glow elements */}
      <div className="ex-ambient-glow glow-1"></div>
      <div className="ex-ambient-glow glow-2"></div>

      <div className="ex-premium-loader-content">
        <div className="ex-loader-logo-container">
          <div className="ex-loader-ring"></div>
          <img src={logo} alt="Examible Logo" className="ex-loader-logo" />
        </div>

        <div className="ex-loader-text-container">
          <h2 className="ex-loader-title">Examible</h2>
          <p className="ex-loader-message" key={text || messageIndex}>
            {text || loadingMessages[messageIndex]}
          </p>
        </div>

        <div className="ex-loader-progress-container">
          <div className="ex-loader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
