import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBrain,
  FaClock,
  FaTrophy,
  FaChartLine,
  FaHistory,
  FaCheckCircle,
  FaFire,
  FaCalendarAlt,
} from "react-icons/fa";
import "../../styles/dashboardCss/performance-summary.css";
import { studentApi } from "../../config/studentApi";
import Loading from "../../components/Loading";

const PerformanceSummary = () => {
  const nav = useNavigate();
  const [timeFilter, setTimeFilter] = useState("all");
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPerformanceData = async () => {
      setLoading(true);
      try {
        const res = await studentApi.myMockTest();
        if (res.data?.data) {
          setRatings(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch performance summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  // Filter the data by selected time period
  const filteredRatings = useMemo(() => {
    if (timeFilter === "all") return ratings;

    const now = new Date();
    const daysMap = { "7days": 7, "30days": 30 };
    const limit = daysMap[timeFilter];

    return ratings.filter((r) => {
      // Fallback if there is no creation date, assume it's valid
      if (!r.createdAt) return true;
      const diff = (now - new Date(r.createdAt)) / (1000 * 60 * 60 * 24);
      return diff <= limit;
    });
  }, [ratings, timeFilter]);

  // Aggregation Logic
  const { overallStats, subjectStats, insights } = useMemo(() => {
    let totalDuration = 0;
    let totalScore = 0;
    const subjects = {};

    filteredRatings.forEach((r) => {
      totalDuration += r.duration || 0;
      totalScore += r.performance || 0;

      if (!subjects[r.subject]) {
        subjects[r.subject] = { attempts: 0, scoreSum: 0, durationSum: 0 };
      }
      subjects[r.subject].attempts += 1;
      subjects[r.subject].scoreSum += r.performance || 0;
      subjects[r.subject].durationSum += r.duration || 0;
    });

    const attemptsCount = filteredRatings.length;

    // Subject Array
    const subjectArray = Object.entries(subjects)
      .map(([name, data]) => ({
        name,
        attempts: data.attempts,
        accuracy: data.scoreSum / data.attempts,
        avgDuration: data.durationSum / data.attempts,
      }))
      .sort((a, b) => b.accuracy - a.accuracy); // Sort highest accuracy first

    // Formatting helpers
    const formatTime = (seconds) => {
      if (!seconds) return "0 mins";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return h > 0 ? `${h}h ${m}m` : `${m} mins`;
    };

    // Insights
    const strongest = subjectArray[0] || null;
    const weakest = subjectArray[subjectArray.length - 1] || null;
    const mostPracticed =
      [...subjectArray].sort((a, b) => b.attempts - a.attempts)[0] || null;

    return {
      overallStats: {
        attempts: attemptsCount,
        avgScore: attemptsCount ? (totalScore / attemptsCount).toFixed(1) : 0,
        totalTime: formatTime(totalDuration),
        avgTime: attemptsCount
          ? formatTime(totalDuration / attemptsCount)
          : "0 mins",
      },
      subjectStats: subjectArray,
      insights: { strongest, weakest, mostPracticed },
    };
  }, [filteredRatings]);

  // Framer Motion Variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Chart Generation Logic
  const chartColors = [
    "#804bf2",
    "#10b981",
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#8b5cf6",
  ];
  const totalAccuracySum =
    subjectStats.reduce((sum, s) => sum + s.accuracy, 0) || 1; // prevent divide by zero
  let currentAngle = 0;
  const conicGradientSlices = subjectStats
    .map((s, i) => {
      const percentage = (s.accuracy / totalAccuracySum) * 100;
      const slice = `${chartColors[i % chartColors.length]} ${currentAngle}% ${currentAngle + percentage}%`;
      currentAngle += percentage;
      return slice;
    })
    .join(", ");

  const getAccuracyClass = (acc) => {
    if (acc >= 80) return "excellent";
    if (acc >= 60) return "good";
    if (acc >= 40) return "average";
    return "poor";
  };

  if (loading) {
    return <Loading text="Analyzing your performance data..." />;
  }

  return (
    <motion.div
      className="perf-summary-main"
      variants={containerVars}
      initial="hidden"
      animate="show"
    >
      <button className="perf-back-btn" onClick={() => nav(-1)}>
        <FaArrowLeft /> Back to Mock Exam
      </button>

      <div className="perf-header">
        <div className="perf-header-content">
          <h1>Performance Summary</h1>
          <p>
            Analyze your mock exam history, identify weak spots, and track your
            improvement.
          </p>
        </div>

        <div className="perf-filters">
          {["7days", "30days", "all"].map((f) => (
            <button
              key={f}
              className={`perf-filter-btn ${timeFilter === f ? "active" : ""}`}
              onClick={() => setTimeFilter(f)}
            >
              {f === "all"
                ? "All Time"
                : f.replace("days", " Days").replace("months", " Months")}
            </button>
          ))}
        </div>
      </div>

      {/* Section 1 & 2: Overall Overview & Time Analytics */}
      <motion.div className="perf-grid-4" variants={itemVars}>
        <div className="perf-card perf-stat-card">
          <div className="perf-stat-header">
            <div className="perf-stat-icon">
              <FaHistory />
            </div>
            Mock Exams Taken
          </div>
          <div className="perf-stat-value">{overallStats.attempts}</div>
          <div className="perf-stat-trend neutral">Completed Sessions</div>
        </div>

        <div className="perf-card perf-stat-card">
          <div className="perf-stat-header">
            <div
              className="perf-stat-icon"
              style={{ color: "#10b981", background: "rgba(16,185,129,0.1)" }}
            >
              <FaCheckCircle />
            </div>
            Average Accuracy
          </div>
          <div className="perf-stat-value">{overallStats.avgScore}%</div>
          <div className="perf-stat-trend positive">Overall Score</div>
        </div>

        <div className="perf-card perf-stat-card">
          <div className="perf-stat-header">
            <div
              className="perf-stat-icon"
              style={{ color: "#f59e0b", background: "rgba(245,158,11,0.1)" }}
            >
              <FaClock />
            </div>
            Total Study Time
          </div>
          <div className="perf-stat-value">{overallStats.totalTime}</div>
          <div className="perf-stat-trend neutral">Time well spent</div>
        </div>

        <div className="perf-card perf-stat-card">
          <div className="perf-stat-header">
            <div
              className="perf-stat-icon"
              style={{ color: "#3b82f6", background: "rgba(59,130,246,0.1)" }}
            >
              <FaFire />
            </div>
            Avg. Completion
          </div>
          <div className="perf-stat-value">{overallStats.avgTime}</div>
          <div className="perf-stat-trend positive">Per Session</div>
        </div>
      </motion.div>

      <div className="perf-grid-2">
        {/* Section 3: Subject Performance Table */}
        <motion.div className="perf-card" variants={itemVars}>
          <h3 className="perf-section-title">Subject Performance</h3>
          {subjectStats.length > 0 ? (
            <div className="perf-table-wrapper">
              <table className="perf-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attempts</th>
                    <th>Avg. Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectStats.map((subject, idx) => (
                    <tr key={idx}>
                      <td className="perf-subject-cell">
                        <div
                          className="perf-legend-color"
                          style={{
                            background: chartColors[idx % chartColors.length],
                          }}
                        />
                        {subject.name}
                      </td>
                      <td>{subject.attempts} Sessions</td>
                      <td>
                        <span
                          className={`perf-accuracy-pill ${getAccuracyClass(subject.accuracy)}`}
                        >
                          {subject.accuracy.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--ex-text-muted)", fontSize: "14px" }}>
              No mock exam data found for this period.
            </p>
          )}
        </motion.div>

        {/* Section 5: Subject Performance Pie Chart */}
        <motion.div className="perf-card" variants={itemVars}>
          <h3 className="perf-section-title">Score Distribution</h3>
          {subjectStats.length > 0 ? (
            <div className="perf-chart-container">
              <div
                className="perf-doughnut"
                style={{ background: `conic-gradient(${conicGradientSlices})` }}
              >
                <div className="perf-doughnut-inner">
                  <span>{overallStats.avgScore}%</span>
                  <small>Overall</small>
                </div>
              </div>
              <div className="perf-chart-legend">
                {subjectStats.map((s, idx) => (
                  <div className="perf-legend-item" key={idx}>
                    <div className="perf-legend-label">
                      <div
                        className="perf-legend-color"
                        style={{
                          background: chartColors[idx % chartColors.length],
                        }}
                      />
                      {s.name}
                    </div>
                    <strong>{s.accuracy.toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p
              style={{
                color: "var(--ex-text-muted)",
                fontSize: "14px",
                textAlign: "center",
                marginTop: "40px",
              }}
            >
              Take an exam to unlock chart.
            </p>
          )}
        </motion.div>
      </div>

      <div className="perf-grid-2">
        {/* Section 6: Performance Insights */}
        <motion.div className="perf-card" variants={itemVars}>
          <h3 className="perf-section-title">Smart Insights</h3>
          <div className="perf-insight-list">
            <div className="perf-insight-row">
              <div className="perf-insight-icon" style={{ color: "#10b981" }}>
                <FaTrophy />
              </div>
              <div className="perf-insight-text">
                <h4>Strongest Subject</h4>
                <p>{insights.strongest ? insights.strongest.name : "N/A"}</p>
              </div>
            </div>
            <div className="perf-insight-row">
              <div className="perf-insight-icon" style={{ color: "#ef4444" }}>
                <FaChartLine style={{ transform: "rotate(180deg)" }} />
              </div>
              <div className="perf-insight-text">
                <h4>Needs Improvement</h4>
                <p>{insights.weakest ? insights.weakest.name : "N/A"}</p>
              </div>
            </div>
            <div className="perf-insight-row">
              <div className="perf-insight-icon" style={{ color: "#804bf2" }}>
                <FaBrain />
              </div>
              <div className="perf-insight-text">
                <h4>Most Practiced</h4>
                <p>
                  {insights.mostPracticed ? insights.mostPracticed.name : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 7: Recent Exams Feed */}
        <motion.div className="perf-card" variants={itemVars}>
          <h3 className="perf-section-title">Recent Sessions</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {filteredRatings.length > 0 ? (
              [...filteredRatings]
                .reverse()
                .slice(0, 4)
                .map((r, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid var(--ex-border)",
                      paddingBottom: "12px",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {r.subject}
                      </strong>
                      <small
                        style={{
                          color: "var(--ex-text-muted)",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaCalendarAlt />{" "}
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : "Recently"}
                      </small>
                    </div>
                    <span
                      className={`perf-accuracy-pill ${getAccuracyClass(r.performance)}`}
                    >
                      {r.performance ? r.performance.toFixed(1) : 0}%
                    </span>
                  </div>
                ))
            ) : (
              <p style={{ color: "var(--ex-text-muted)", fontSize: "14px" }}>
                No recent sessions found.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PerformanceSummary;
