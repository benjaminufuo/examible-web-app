import React from "react";
import "../../styles/dashboardCss/performance.css";
import { FiTrendingUp, FiTarget, FiBarChart2 } from "react-icons/fi";
import { useSelector } from "react-redux";

const PerformanceCenter = () => {
  const user = useSelector((state) => state.user);

  const subjectStats = [
    { subject: "Mathematics", accuracy: 72, attempts: 12, trend: "+5%" },
    { subject: "English", accuracy: 68, attempts: 10, trend: "+2%" },
    { subject: "Physics", accuracy: 65, attempts: 11, trend: "+8%" },
    { subject: "Chemistry", accuracy: 70, attempts: 9, trend: "-1%" },
    { subject: "Biology", accuracy: 75, attempts: 10, trend: "+6%" },
  ];

  const performanceTrend = [
    { week: "Week 1", score: 60 },
    { week: "Week 2", score: 65 },
    { week: "Week 3", score: 70 },
    { week: "Week 4", score: 72 },
  ];

  return (
    <div className="performance-premium">
      <div className="performance-header">
        <h1>Performance Center</h1>
        <p>Track your progress across all subjects and exams</p>
      </div>

      <div className="performance-container">
        {/* Overall Stats */}
        <section className="stats-section">
          <h2 className="section-title">Overall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FiBarChart2 />
              </div>
              <h3>Average Accuracy</h3>
              <p className="stat-value">{user?.totalRating?.toFixed(1) || "0"}%</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiTrendingUp />
              </div>
              <h3>Exams Taken</h3>
              <p className="stat-value">{user?.myRating?.length || 0}</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FiTarget />
              </div>
              <h3>Subjects</h3>
              <p className="stat-value">{user?.enrolledSubjects?.length || 0}</p>
            </div>
          </div>
        </section>

        {/* Subject Performance */}
        <section className="subjects-performance">
          <h2 className="section-title">Subject Performance</h2>
          <div className="performance-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Accuracy</th>
                  <th>Attempts</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {subjectStats.map((stat, idx) => (
                  <tr key={idx}>
                    <td className="subject-name">{stat.subject}</td>
                    <td>
                      <div className="accuracy-bar">
                        <div className="bar-fill" style={{ width: `${stat.accuracy}%` }}></div>
                      </div>
                      <span>{stat.accuracy}%</span>
                    </td>
                    <td>{stat.attempts}</td>
                    <td className={stat.trend.includes("+") ? "positive" : "negative"}>
                      {stat.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Performance Trend */}
        <section className="trend-section">
          <h2 className="section-title">Progress Trend</h2>
          <div className="trend-card">
            <div className="trend-bars">
              {performanceTrend.map((item, idx) => (
                <div key={idx} className="trend-item">
                  <div className="bar" style={{ height: `${(item.score / 100) * 200}px` }}></div>
                  <p>{item.week}</p>
                  <span>{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PerformanceCenter;
