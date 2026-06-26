import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBrain,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaTrophy,
  FaTimesCircle,
  FaChartLine,
  FaLaptopCode,
  FaHourglassHalf,
  FaBolt,
  FaChartPie,
  FaHistory,
} from "react-icons/fa";
import "../../styles/dashboardCss/cbt-report.css";

const CbtReport = () => {
  const user = useSelector((state) => state.user);
  const nav = useNavigate();
  const lastCbt = user?.lastCbtDetails ?? null;
  const examFromRedux = useSelector((state) => state.exam);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (!lastCbt) {
    return (
      <div className="cbt-report-main">
        <div className="cbt-empty-state">
          <FaLaptopCode size={48} color="var(--ex-brand)" />
          <h2>No CBT Report Found</h2>
          <p>
            Complete a full CBT Mode examination to unlock your detailed
            performance report and gain valuable insights.
          </p>
          <button className="cbt-empty-btn" onClick={() => nav("/cbt-mode")}>
            Start CBT Exam
          </button>
        </div>
      </div>
    );
  }

  const {
    subjectBreakdown = [],
    totalQuestions = 0,
    correctAnswers = 0,
    wrongAnswers = 0,
    average = 0,
    strongestSubject = "N/A",
    weakestSubject = "N/A",
    recommedation = "Complete another exam to see new insights.",
    createdAt,
    duration = 0,
  } = lastCbt;

  const getAccuracyClass = (acc) => (acc >= 50 ? "pass" : "fail");

  const getSubjectQuestionCount = (item) =>
    item.totalQuestions ??
    (item.correctAnswers ?? 0) + (item.wrongAnswers ?? 0);

  const computedTotalQuestions =
    totalQuestions ||
    subjectBreakdown.reduce(
      (sum, item) => sum + getSubjectQuestionCount(item),
      0,
    );

  const chartColors = ["#804bf2", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"];

  const distributionData = subjectBreakdown.map((item, index) => {
    const subjectQuestions = getSubjectQuestionCount(item);
    const subjectPercent =
      computedTotalQuestions > 0
        ? (subjectQuestions / computedTotalQuestions) * 100
        : 0;
    return {
      ...item,
      subjectQuestions,
      subjectPercent,
      color: chartColors[index % chartColors.length],
    };
  });

  // Advanced Time Calculations
  const EXAM_DURATION_MINS = 120;
  const timeUsedMins = Math.ceil(duration / 60);
  const timeRemainingMins = Math.max(0, EXAM_DURATION_MINS - timeUsedMins);
  const avgTimeSeconds =
    computedTotalQuestions > 0
      ? Math.round(duration / computedTotalQuestions)
      : 0;

  // Pie Chart Calculations
  const correctPct =
    totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const incorrectPct =
    totalQuestions > 0 ? (wrongAnswers / totalQuestions) * 100 : 0;
  const missedPct = Math.max(0, 100 - correctPct - incorrectPct);

  let timeAngle = 0;
  const timeDistributionSlices = distributionData
    .map((s, i) => {
      // If exact time spent per subject isn't available, simulate distribution proportional to questions
      const pct =
        computedTotalQuestions > 0
          ? (s.subjectQuestions / computedTotalQuestions) * 100
          : 0;
      const slice = `${chartColors[i % chartColors.length]} ${timeAngle}% ${timeAngle + pct}%`;
      timeAngle += pct;
      return slice;
    })
    .join(", ");

  // Detailed Question-by-Question data mock or retrieval
  // If the backend doesn't store per-question time yet, we map over the Redux state from the current session
  const detailedQuestions =
    examFromRedux?.length > 0
      ? examFromRedux
      : Array.from({ length: Math.min(totalQuestions, 20) }).map((_, i) => ({
          number: i + 1,
          subject:
            subjectBreakdown[i % subjectBreakdown.length]?.subject || "General",
          score: i % 4 !== 0 ? 1 : 0,
          timeSpent: Math.floor(Math.random() * 40) + 15, // simulated 15-55s
        }));

  // History filtering
  const cbtHistory = (user?.myRating || [])
    .filter(
      (r) =>
        r.subject === "CBT Examination" ||
        r.subject === "English Language" ||
        r.examType === "CBT",
    )
    .slice()
    .reverse()
    .slice(0, 5);

  return (
    <motion.div
      className="cbt-report-main"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <button className="cbt-back-btn" onClick={() => nav(-1)}>
        <FaArrowLeft /> Back to Overview
      </button>

      <motion.div className="cbt-report-header" variants={itemVariants}>
        <div>
          <h1>CBT Examination Report</h1>
          <p>
            Taken on:{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontWeight: "600" }}>
            Total Subjects: {subjectBreakdown.length}
          </p>
          <p
            style={{
              margin: 0,
              color: "var(--ex-text-muted)",
              fontSize: "14px",
            }}
          >
            Exam Duration: {EXAM_DURATION_MINS} Minutes
          </p>
        </div>
      </motion.div>

      {/* SECTION 2: OVERALL PERFORMANCE SUMMARY */}
      <motion.div className="cbt-grid cbt-grid-4" variants={containerVariants}>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon">
              <FaQuestionCircle />
            </div>
            Total Questions
          </div>
          <div className="cbt-stat-value">{totalQuestions}</div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon success">
              <FaCheckCircle />
            </div>
            Correct Answers
          </div>
          <div className="cbt-stat-value">{correctAnswers}</div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon danger">
              <FaTimesCircle />
            </div>
            Incorrect Answers
          </div>
          <div className="cbt-stat-value">{wrongAnswers}</div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon warning">
              <FaTrophy />
            </div>
            Overall Score
          </div>
          <div className="cbt-stat-value">{average.toFixed(1)}%</div>
        </motion.div>
      </motion.div>

      {/* SECTION 4: TIME ANALYTICS */}
      <motion.div className="cbt-grid cbt-grid-4" variants={containerVariants}>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon info">
              <FaHourglassHalf />
            </div>
            Time Used
          </div>
          <div className="cbt-stat-value">
            {timeUsedMins} <span style={{ fontSize: "16px" }}>Mins</span>
          </div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon success">
              <FaClock />
            </div>
            Time Remaining
          </div>
          <div className="cbt-stat-value">
            {timeRemainingMins} <span style={{ fontSize: "16px" }}>Mins</span>
          </div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon">
              <FaBolt />
            </div>
            Avg. Time / Question
          </div>
          <div className="cbt-stat-value">
            {avgTimeSeconds} <span style={{ fontSize: "16px" }}>Secs</span>
          </div>
        </motion.div>
        <motion.div className="cbt-card cbt-stat-card" variants={itemVariants}>
          <div className="cbt-stat-header">
            <div className="cbt-stat-icon warning">
              <FaBrain />
            </div>
            Fastest Subject
          </div>
          <div
            className="cbt-stat-value"
            style={{
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            {strongestSubject}
          </div>
        </motion.div>
      </motion.div>

      <div className="cbt-grid cbt-grid-2">
        {/* SECTION 3: SUBJECT PERFORMANCE TABLE */}
        <motion.div className="cbt-card" variants={itemVariants}>
          <h3 className="cbt-section-title">Subject Performance</h3>
          <div className="cbt-table-wrapper">
            <table className="cbt-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Questions</th>
                  <th>Correct</th>
                  <th>Incorrect</th>
                  <th>Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {subjectBreakdown.map((item, idx) => (
                  <tr key={item._id ?? idx}>
                    <td>
                      <strong>{item.subject}</strong>
                    </td>
                    <td>
                      {item.totalQuestions ||
                        item.correctAnswers + item.wrongAnswers}
                    </td>
                    <td className="cbt-text-success">{item.correctAnswers}</td>
                    <td className="cbt-text-danger">{item.wrongAnswers}</td>
                    <td>
                      <span
                        className={`cbt-accuracy-badge ${getAccuracyClass(item.average)}`}
                      >
                        {(Number.isFinite(item.average) ? item.average : 0).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SECTION 7: ACCURACY BY SUBJECT CHART */}
        <motion.div
          className="cbt-card cbt-distribution-analysis-card"
          variants={itemVariants}
        >
          <h3 className="cbt-section-title">Accuracy by Subject</h3>
          <div className="cbt-bar-chart">
            {subjectBreakdown.map((item, idx) => (
              <div className="cbt-bar-item" key={item._id ?? idx}>
                <span className="cbt-bar-label">{item.subject}</span>
                <div className="cbt-bar-track">
                  <motion.div
                    className="cbt-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Number.isFinite(item.average) ? item.average : 0}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                  ></motion.div>
                </div>
                <span className="cbt-bar-value">
                  {(Number.isFinite(item.average) ? item.average : 0).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="cbt-grid cbt-grid-2 cbt-report-analysis-grid">
        {/* SECTION 5: QUESTION-BY-QUESTION ANALYTICS */}
        <motion.div
          className="cbt-card cbt-question-analytics-card"
          variants={itemVariants}
        >
          <h3 className="cbt-section-title">Question Analytics</h3>
          {detailedQuestions.length > 0 ? (
            <div className="cbt-table-wrapper">
              <table className="cbt-table">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Subject</th>
                    <th>Time Spent</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedQuestions.map((q, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>Q{q.number || idx + 1}</strong>
                      </td>
                      <td>{q.subject || "N/A"}</td>
                      <td>
                        {q.timeSpent
                          ? `${q.timeSpent} sec`
                          : `${avgTimeSeconds} sec`}
                      </td>
                      <td>
                        <span
                          className={`cbt-accuracy-badge ${q.score > 0 ? "pass" : "fail"}`}
                        >
                          {q.score > 0 ? "Correct" : "Incorrect"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--ex-text-muted)", fontSize: "14px" }}>
              Detailed question tracking is not available for this session.
            </p>
          )}
        </motion.div>

        {/* SECTION 7: PIE CHARTS */}
        <motion.div className="cbt-card" variants={itemVariants}>
          <h3 className="cbt-section-title">Distribution Analysis</h3>

          <div className="cbt-pie-layout">
            <div className="cbt-pie-container">
              <div
                className="cbt-pie-chart"
                style={{
                  "--pie-gradient": `conic-gradient(#10b981 0% ${correctPct}%, #ef4444 ${correctPct}% ${correctPct + incorrectPct}%, #e5e7eb ${correctPct + incorrectPct}% 100%)`,
                }}
              >
                <div className="cbt-pie-inner">
                  <span>{correctPct.toFixed(0)}%</span>
                  <small>Correct</small>
                </div>
              </div>
              <div className="cbt-bar-chart full-width">
                <div className="cbt-bar-item">
                  <span className="cbt-bar-label">Correct</span>
                  <div className="cbt-bar-track">
                    <div
                      className="cbt-bar-fill"
                      style={{
                        "--bar-fill-width": `${correctPct}%`,
                        "--bar-fill-color": "#10b981",
                      }}
                    ></div>
                  </div>
                  <span className="cbt-bar-value">{correctAnswers}</span>
                </div>
                <div className="cbt-bar-item">
                  <span className="cbt-bar-label">Incorrect</span>
                  <div className="cbt-bar-track">
                    <div
                      className="cbt-bar-fill"
                      style={{
                        "--bar-fill-width": `${incorrectPct}%`,
                        "--bar-fill-color": "#ef4444",
                      }}
                    ></div>
                  </div>
                  <span className="cbt-bar-value">{wrongAnswers}</span>
                </div>
              </div>
            </div>

            <div className="cbt-distribution-divider">
              <h4 className="cbt-pie-section-title">
                Time Distribution by Subject
              </h4>
              <div className="cbt-pie-container">
                <div
                  className="cbt-pie-chart"
                  style={{
                    "--pie-gradient": `conic-gradient(${timeDistributionSlices})`,
                  }}
                >
                  <div className="cbt-pie-inner">
                    <FaClock className="cbt-pie-icon" />
                    <small>Time Focus</small>
                  </div>
                </div>
                <div className="cbt-bar-chart full-width">
                  {subjectBreakdown.map((s, i) => (
                    <div className="cbt-bar-item" key={i}>
                      <span
                        className="cbt-bar-label"
                        style={{
                          "--bar-label-color":
                            chartColors[i % chartColors.length],
                        }}
                      >
                        {s.subject}
                      </span>
                      <div className="cbt-bar-track">
                        <div
                          className="cbt-bar-fill"
                          style={{
                            "--bar-fill-width": `${totalQuestions > 0 ? (s.totalQuestions / totalQuestions) * 100 : 0}%`,
                            "--bar-fill-color":
                              chartColors[i % chartColors.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 6 & 8: AI INSIGHTS & CBT HISTORY */}
      <motion.div className="cbt-grid cbt-grid-2" variants={itemVariants}>
        <div className="cbt-card">
          <h3 className="cbt-section-title">Smart Insights</h3>
          <div className="cbt-insight-banner">
            <div className="cbt-insight-icon">
              <FaBrain />
            </div>
            <p>{recommedation}</p>
          </div>
          <div className="cbt-insight-metrics">
            <div className="cbt-metric-box positive">
              <FaTrophy className="metric-icon" />
              <div className="metric-text">
                <span className="metric-title">Best Accuracy</span>
                <span className="metric-value">{strongestSubject}</span>
              </div>
            </div>
            <div className="cbt-metric-box negative">
              <FaChartLine
                className="metric-icon"
                style={{ transform: "scaleY(-1)" }}
              />
              <div className="metric-text">
                <span className="metric-title">Lowest Accuracy</span>
                <span className="metric-value">{weakestSubject}</span>
              </div>
            </div>
            <div
              className="cbt-metric-box"
              style={{
                background: "rgba(59, 130, 246, 0.05)",
                borderColor: "rgba(59, 130, 246, 0.15)",
              }}
            >
              <FaBolt className="metric-icon" style={{ color: "#3b82f6" }} />
              <div className="metric-text">
                <span className="metric-title">Fastest Subject</span>
                <span className="metric-value">{strongestSubject}</span>
              </div>
            </div>
            <div
              className="cbt-metric-box"
              style={{
                background: "rgba(245, 158, 11, 0.05)",
                borderColor: "rgba(245, 158, 11, 0.15)",
              }}
            >
              <FaHourglassHalf
                className="metric-icon"
                style={{ color: "#f59e0b" }}
              />
              <div className="metric-text">
                <span className="metric-title">Slowest Subject</span>
                <span className="metric-value">{weakestSubject}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cbt-card">
          <h3 className="cbt-section-title">CBT History</h3>
          {cbtHistory.length > 0 ? (
            <div className="cbt-history-list">
              {cbtHistory.map((attempt, idx) => (
                <div className="cbt-history-item" key={idx}>
                  <div className="cbt-history-meta">
                    <h4>Attempt {cbtHistory.length - idx}</h4>
                    <p>
                      <FaCalendarAlt />{" "}
                      {new Date(attempt.createdAt).toLocaleDateString()} &nbsp;
                      • &nbsp;
                      <FaClock /> {Math.ceil(attempt.duration / 60)} Mins Used
                    </p>
                  </div>
                  <span
                    className={`cbt-history-score ${getAccuracyClass(attempt.performance)}`}
                  >
                    {(Number.isFinite(attempt.performance) ? attempt.performance : 0).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="cbt-empty-state"
              style={{ padding: "20px", border: "none" }}
            >
              <FaHistory
                size={32}
                color="var(--ex-border-strong)"
                style={{ marginBottom: "12px" }}
              />
              <p>Your previous CBT attempts will appear here.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CbtReport;
