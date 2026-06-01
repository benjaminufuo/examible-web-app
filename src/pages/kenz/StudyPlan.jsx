import React, { useState } from "react";
import "../../styles/dashboardCss/study-plan.css";
import { FiCalendar, FiTarget, FiCheckCircle, FiLock } from "react-icons/fi";
import { useSelector } from "react-redux";

const StudyPlan = () => {
  const user = useSelector((state) => state.user);
  const [selectedDay, setSelectedDay] = useState(0);

  const studyPlan = {
    week1: [
      { day: "Monday", subject: "English", topic: "Essay Writing", duration: "45 mins", completed: false },
      { day: "Tuesday", subject: "Mathematics", topic: "Algebra Basics", duration: "60 mins", completed: false },
      { day: "Wednesday", subject: "Physics", topic: "Kinematics", duration: "50 mins", completed: false },
      { day: "Thursday", subject: "Chemistry", topic: "Organic Chemistry", duration: "55 mins", completed: false },
      { day: "Friday", subject: "Biology", topic: "Cell Biology", duration: "50 mins", completed: false },
      { day: "Saturday", subject: "Review", topic: "Weekly Mock Exam", duration: "120 mins", completed: false },
      { day: "Sunday", subject: "Rest", topic: "Light revision", duration: "30 mins", completed: false },
    ],
  };

  const weeklyTargets = [
    { title: "Complete Assignments", progress: 75, target: 5 },
    { title: "Mock Exams", progress: 60, target: 2 },
    { title: "Past Questions", progress: 45, target: 50 },
    { title: "Study Hours", progress: 88, target: 20 },
  ];

  return (
    <div className="study-plan-premium">
      <div className="plan-header">
        <h1>Your Study Plan</h1>
        <p>Stay organized and track your daily progress towards exam success</p>
      </div>

      <div className="plan-container">
        {/* Weekly Targets */}
        <section className="targets-section">
          <h2 className="section-title">This Week's Targets</h2>
          <div className="targets-grid">
            {weeklyTargets.map((target, idx) => (
              <div key={idx} className="target-card">
                <h3>{target.title}</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${target.progress}%` }}></div>
                </div>
                <p>{Math.round(target.progress)}% - {target.target} goals</p>
              </div>
            ))}
          </div>
        </section>

        {/* Study Schedule */}
        <section className="schedule-section">
          <h2 className="section-title">Weekly Schedule</h2>
          <div className="schedule-container">
            <div className="days-selector">
              {studyPlan.week1.map((item, idx) => (
                <button
                  key={idx}
                  className={`day-btn ${selectedDay === idx ? "active" : ""}`}
                  onClick={() => setSelectedDay(idx)}
                >
                  {item.day.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="schedule-detail">
              {studyPlan.week1[selectedDay] && (
                <div className="detail-card">
                  <div className="detail-header">
                    <h3>{studyPlan.week1[selectedDay].day}</h3>
                    <span className="status-badge">Today&apos;s Plan</span>
                  </div>

                  <div className="detail-content">
                    <div className="detail-item">
                      <span className="item-label">Subject</span>
                      <span className="item-value">{studyPlan.week1[selectedDay].subject}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">Topic</span>
                      <span className="item-value">{studyPlan.week1[selectedDay].topic}</span>
                    </div>
                    <div className="detail-item">
                      <span className="item-label">Duration</span>
                      <span className="item-value">{studyPlan.week1[selectedDay].duration}</span>
                    </div>
                  </div>

                  <button className="start-btn">Start Learning</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recommended Topics */}
        <section className="recommendations-section">
          <h2 className="section-title">Recommended Topics</h2>
          <div className="recommendations-grid">
            {["Quadratic Equations", "Photosynthesis", "Atomic Structure", "Literary Devices"].map((topic, idx) => (
              <div key={idx} className="recommendation-card">
                <div className="recommendation-icon">
                  {user?.plan === "Freemium" && idx > 1 ? <FiLock /> : <FiTarget />}
                </div>
                <h4>{topic}</h4>
                <p>2-3 hours</p>
                <button disabled={user?.plan === "Freemium" && idx > 1}>
                  {user?.plan === "Freemium" && idx > 1 ? "Premium" : "Study"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudyPlan;
