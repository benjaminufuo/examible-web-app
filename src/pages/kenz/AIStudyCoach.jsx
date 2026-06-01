import React, { useState } from "react";
import "../../styles/dashboardCss/ai-coach.css";
import { FiMessageSquare, FiTrendingUp, FiAlertCircle } from "react-icons/fi";
import { BiLightbulb } from "react-icons/bi";
import { useSelector } from "react-redux";

const AIStudyCoach = () => {
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const weakAreas = [
    { subject: "Mathematics", topic: "Algebra", accuracy: 45, recommendation: "Spend more time on basic concepts" },
    { subject: "Physics", topic: "Mechanics", accuracy: 52, recommendation: "Practice more numerical problems" },
    { subject: "Chemistry", topic: "Organic", accuracy: 48, recommendation: "Review functional groups" },
  ];

  const suggestedStudySessions = [
    { title: "Algebra Fundamentals", duration: "45 mins", difficulty: "Beginner", focus: "Core Concepts" },
    { title: "Problem Solving", duration: "60 mins", difficulty: "Intermediate", focus: "Practice" },
    { title: "Mock Exam", duration: "120 mins", difficulty: "Advanced", focus: "Full Simulation" },
  ];

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { type: "user", text: inputValue }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "ai", text: "I'm here to help! Based on your performance, I recommend focusing on your weak areas first." }]);
      }, 1000);
      setInputValue("");
    }
  };

  return (
    <div className="ai-coach-premium">
      <div className="coach-header">
        <div className="header-content">
          <h1>AI Study Coach</h1>
          <p>Personalized guidance to optimize your learning</p>
        </div>
        <div className="header-icon">
          <BiLightbulb size={40} />
        </div>
      </div>

      <div className="coach-grid">
        {/* Main Chat Area */}
        <section className="chat-section">
          <div className="chat-area">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <FiMessageSquare size={48} />
                <h3>Hello! I'm your AI Study Coach</h3>
                <p>Ask me anything about your studies or get personalized recommendations</p>
                <div className="quick-prompts">
                  <button onClick={() => setInputValue("What should I focus on?")}>What should I focus on?</button>
                  <button onClick={() => setInputValue("Create a study plan")}>Create a study plan</button>
                  <button onClick={() => setInputValue("How can I improve?")}>How can I improve?</button>
                </div>
              </div>
            ) : (
              <div className="messages-container">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.type}`}>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </section>

        {/* Insights Sidebar */}
        <section className="insights-section">
          {/* Weak Areas */}
          <div className="insights-card">
            <h3 className="insights-title">
              <FiAlertCircle size={20} /> Areas to Improve
            </h3>
            <div className="weak-areas-list">
              {weakAreas.map((area, idx) => (
                <div key={idx} className="area-item">
                  <div className="area-header">
                    <span className="area-name">{area.subject} - {area.topic}</span>
                    <span className="accuracy-badge" style={{ color: area.accuracy > 50 ? '#4caf50' : '#e91e63' }}>
                      {area.accuracy}%
                    </span>
                  </div>
                  <p className="area-recommendation">{area.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Sessions */}
          <div className="insights-card">
            <h3 className="insights-title">
              <FiTrendingUp size={20} /> Recommended Sessions
            </h3>
            <div className="sessions-list">
              {suggestedStudySessions.map((session, idx) => (
                <button key={idx} className="session-btn">
                  <div className="session-info">
                    <h4>{session.title}</h4>
                    <p>{session.duration} • {session.difficulty}</p>
                  </div>
                  <span className="session-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Note */}
          {user?.plan === "Freemium" && (
            <div className="premium-note">
              <p>Unlock advanced AI features with premium</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AIStudyCoach;
