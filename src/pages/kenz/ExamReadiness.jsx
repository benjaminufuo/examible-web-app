import React from "react";
import "../../styles/dashboardCss/exam-readiness.css";
import { FiCheckCircle, FiAlertCircle, FiTarget, FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ExamReadiness = () => {
  const user = useSelector((state) => state.user);

  const readinessScore = user?.totalRating || 0;

  const subjectReadiness = [
    { subject: "Mathematics", readiness: 78, status: "Ready" },
    { subject: "English", readiness: 65, status: "Needs Work" },
    { subject: "Physics", readiness: 72, status: "Ready" },
    { subject: "Chemistry", readiness: 60, status: "Needs Work" },
    { subject: "Biology", readiness: 80, status: "Ready" },
  ];

  const recommendations = [
    { title: "Focus on weak areas", priority: "High", action: "Review English and Chemistry" },
    { title: "Practice more exams", priority: "Medium", action: "Take 2 more mock exams" },
    { title: "Time management", priority: "High", action: "Practice completing exams in time" },
  ];

  const getStatusColor = (readiness) => {
    if (readiness >= 75) return "#4caf50";
    if (readiness >= 60) return "#f2ae30";
    return "#e91e63";
  };

  return (
    <div className="exam-readiness-premium">
      <div className="readiness-header">
        <h1>Exam Readiness</h1>
        <p>Your comprehensive exam preparation assessment</p>
      </div>

      <div className="readiness-container">
        {/* Main Readiness Score */}
        <section className="readiness-score-section">
          <h2 className="section-title">Overall Readiness</h2>
          <div className="score-card">
            <div className="readiness-circle">
              <CircularProgressbar
                value={readinessScore}
                text={`${readinessScore?.toFixed(0) || 0}%`}
                styles={{
                  path: {
                    stroke: `linear-gradient(135deg, #804bf2, #f2ae30)`,
                    strokeLinecap: "round",
                  },
                  trail: {
                    stroke: "rgba(128, 75, 242, 0.1)",
                  },
                  text: {
                    fontWeight: 700,
                    fontSize: 32,
                    fill: "#804bf2",
                    fontFamily: '"Montserrat", sans-serif',
                  },
                }}
              />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#804bf2" />
                    <stop offset="100%" stopColor="#f2ae30" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="score-info">
              <h3>
                {readinessScore >= 75
                  ? "Excellent! You're ready"
                  : readinessScore >= 60
                  ? "Good progress, keep going"
                  : "Need more preparation"}
              </h3>
              <p>
                {readinessScore >= 75
                  ? "You have demonstrated strong preparation"
                  : readinessScore >= 60
                  ? "Focus on weak areas to improve"
                  : "Increase your study intensity"}
              </p>
            </div>
          </div>
        </section>

        {/* Subject Readiness */}
        <section className="subject-readiness-section">
          <h2 className="section-title">Subject Readiness</h2>
          <div className="readiness-grid">
            {subjectReadiness.map((item, idx) => (
              <div key={idx} className="readiness-card">
                <div className="readiness-header-card">
                  <h3>{item.subject}</h3>
                  <span className="status-badge" style={{ color: getStatusColor(item.readiness) }}>
                    {item.readiness >= 75 ? (
                      <FiCheckCircle size={18} />
                    ) : (
                      <FiAlertCircle size={18} />
                    )}
                    {item.status}
                  </span>
                </div>
                <div className="readiness-bar">
                  <div
                    className="readiness-fill"
                    style={{
                      width: `${item.readiness}%`,
                      background: getStatusColor(item.readiness),
                    }}
                  ></div>
                </div>
                <p className="readiness-percentage">{item.readiness}%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="recommendations-section">
          <h2 className="section-title">Action Items</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`recommendation-item priority-${rec.priority.toLowerCase()}`}
              >
                <div className="priority-indicator"></div>
                <div className="recommendation-content">
                  <h4>{rec.title}</h4>
                  <p>{rec.action}</p>
                </div>
                <span className="priority-badge">{rec.priority}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */
        <section className="timeline-section">
          <h2 className="section-title">Preparation Timeline</h2>
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Subject Selection</h4>
                <p>Completed</p>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Regular Practice</h4>
                <p>In Progress</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Mock Exams</h4>
                <p>2 weeks</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h4>Final Review</h4>
                <p>1 week</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExamReadiness;
