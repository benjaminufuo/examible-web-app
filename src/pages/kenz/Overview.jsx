import { useState, useMemo } from "react";
import "../../styles/dashboardCss/overview.css";
import "../../styles/dashboardCss/dashboard-components.css";
import image1 from "../../assets/public/home-firstlayer.webp";
import { FaBook } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import SubjectSelected from "./SubjectSelected";
import { useDispatch, useSelector } from "react-redux";
import { setNotEnrolledSubjects, setUser } from "../../global/slice";
import { TbTrashX } from "react-icons/tb";
import { toast } from "react-toastify";
import { studentApi } from "../../config/studentApi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaPlayCircle,
  FaBookOpen,
  FaBolt,
  FaChartLine,
  FaArrowRight,
  FaBrain,
  FaTrophy,
  FaPlus,
} from "react-icons/fa";

const Overview = () => {
  const user = useSelector((state) => state.user);
  const [showBin, setShowBin] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const subjectMap = useMemo(
    () => Object.fromEntries(allSubjectsData.map((s) => [s.subject, s.img])),
    [],
  );

  const { setShowSubjectSelected, showSubjectSelected } = useExamibleContext();
  const nav = useNavigate();

  const removeSubject = async (subject) => {
    const id = toast.loading("Removing Subject ...");
    setLoading(true);
    try {
      const res = await studentApi.removeSubject({ subject });
      setLoading(false);
      if (res?.data?.success) {
        toast.dismiss(id);
        setTimeout(() => {
          toast.success(res?.data?.message);
          dispatch(setUser(res?.data?.data));
        }, 500);
      }
    } catch {
      setLoading(false);
      toast.dismiss(id);
    }
  };

  const onMouseEnterToShowBin = (index) => {
    if (user?.plan !== "Freemium") {
      setShowBin(index);
      return;
    }
    setShowBin("");
  };

  const addMoreSubject = async () => {
    if (user?.plan === "Freemium" && user?.enrolledSubjects?.length === 4) {
      toast.error("Upgrade Plan to add more subject");
      return;
    } else {
      setLoading(true);
      const id = toast.loading("Please wait ...");
      try {
        const res = await studentApi.getNotEnrolledSubjects();
        setLoading(false);
        if (res?.status) {
          dispatch(setNotEnrolledSubjects(res?.data?.data));
          toast.dismiss(id);
          setShowSubjectSelected(true);
        }
      } catch {
        setLoading(false);
        toast.dismiss(id);
      }
    }
  };

  // Safely derive performance insights from existing user state
  const ratings = user?.myRating || [];
  let strongest = null;
  let weakest = null;
  if (ratings.length > 0) {
    strongest = ratings.reduce((max, r) =>
      r.performance > max.performance ? r : max,
    );
    weakest = ratings.reduce((min, r) =>
      r.performance < min.performance ? r : min,
    );
  }

  const recommendedAction = weakest
    ? `Spend 15 mins reviewing ${weakest.subject} to boost your accuracy.`
    : "Complete a CBT Mock Exam today to establish your baseline.";

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      {showSubjectSelected ? (
        <SubjectSelected />
      ) : (
        <motion.div
          className="ov-premium-dashboard"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* 1. Personalized Hero */}
          <motion.div className="ov-hero-section" variants={itemVariants}>
            <div className="ov-hero-content">
              <div className="ov-hero-badges">
                <span className="ov-badge plan-badge">
                  {user?.plan || "Freemium"} Plan
                </span>
                <span className="ov-badge target-badge">Target: 300+</span>
              </div>
              <h1>Welcome back, {user?.fullName?.split(" ")[0]} 👋</h1>
              <p>
                You're making steady progress toward your exam goals. Keep up
                the momentum!
              </p>
            </div>
            <div className="ov-hero-graphics">
              <img
                src={image1}
                alt="Student Progress"
                className="ov-hero-img"
              />
            </div>
          </motion.div>

          {/* 2. Quick Actions */}
          <motion.div className="ov-section" variants={itemVariants}>
            <h2 className="ov-section-title">Action Center</h2>
            <div className="ov-quick-actions">
              <div
                className="ov-action-card primary"
                onClick={() => nav("/cbt-mode")}
              >
                <div className="ov-action-icon">
                  <FaPlayCircle />
                </div>
                <div className="ov-action-info">
                  <h3>Start CBT Simulator</h3>
                  <p>Take a full 2-hour mock exam</p>
                </div>
                <FaArrowRight className="ov-action-arrow" />
              </div>
              <div
                className="ov-action-card secondary"
                onClick={() => nav("/past-questions")}
              >
                <div className="ov-action-icon">
                  <FaBookOpen />
                </div>
                <div className="ov-action-info">
                  <h3>Past Questions</h3>
                  <p>Browse by subject and year</p>
                </div>
                <FaArrowRight className="ov-action-arrow" />
              </div>
              <div
                className="ov-action-card tertiary"
                onClick={() => nav("/mock-exam")}
              >
                <div className="ov-action-icon">
                  <FaBolt />
                </div>
                <div className="ov-action-info">
                  <h3>Quick Practice</h3>
                  <p>
                    Short {user?.plan === "Freemium" ? "10" : "30"}-min subject
                    tests
                  </p>
                </div>
                <FaArrowRight className="ov-action-arrow" />
              </div>
            </div>
          </motion.div>

          {/* 3. Readiness & Insights */}
          <motion.div className="ov-readiness-grid" variants={itemVariants}>
            <div className="ov-card ov-readiness-card">
              <h3>Overall Readiness</h3>
              <div className="ov-readiness-content">
                <div className="ov-circular-chart">
                  <CircularProgressbar
                    value={user?.totalRating}
                    text={`${user?.totalRating?.toFixed(1) || 0}%`}
                    styles={{
                      path: { stroke: "#804bf2", strokeLinecap: "round" },
                      trail: { stroke: "rgba(128, 75, 242, 0.1)" },
                      text: {
                        fill: "#804bf2",
                        fontSize: "24px",
                        fontWeight: "700",
                        fontFamily: "'Sora', sans-serif",
                      },
                    }}
                  />
                </div>
                <div className="ov-readiness-stats">
                  <div className="ov-stat-item">
                    <span className="ov-stat-label">Exams Taken</span>
                    <span className="ov-stat-value">{ratings.length}</span>
                  </div>
                  <div className="ov-stat-item">
                    <span className="ov-stat-label">Subjects</span>
                    <span className="ov-stat-value">
                      {user?.enrolledSubjects?.length || 0}/4
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ov-card ov-insights-card">
              <h3>AI Insights & Recommendations</h3>
              <div className="ov-insight-banner">
                <div className="ov-insight-icon">
                  <FaBrain />
                </div>
                <p>{recommendedAction}</p>
              </div>
              <div className="ov-insight-metrics">
                <div className="ov-metric-box positive">
                  <FaTrophy className="metric-icon" />
                  <div className="metric-text">
                    <span className="metric-title">Strongest Subject</span>
                    <span className="metric-value">
                      {strongest ? strongest.subject : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="ov-metric-box negative">
                  <FaChartLine className="metric-icon" />
                  <div className="metric-text">
                    <span className="metric-title">Needs Attention</span>
                    <span className="metric-value">
                      {weakest ? weakest.subject : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Subject Selection & Performance Breakdown */}
          <motion.div className="ov-bottom-grid" variants={itemVariants}>
            <div className="ov-card">
              <div className="ov-card-header">
                <h3>Your Subjects</h3>
                <span className="ov-subtitle">
                  Manage your examination subjects
                </span>
              </div>
              <div className="ov-subjects-grid">
                {user?.enrolledSubjects?.map((item, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => onMouseEnterToShowBin(index)}
                    onMouseLeave={() => setShowBin("")}
                    className="ov-subject-pill"
                  >
                    <img
                      src={subjectMap[item]}
                      alt={item}
                      className="ov-subject-img"
                    />
                    <span className="ov-subject-name">{item}</span>
                    {showBin === index && (
                      <button
                        className="ov-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSubject(item);
                        }}
                        disabled={loading}
                      >
                        <TbTrashX />
                      </button>
                    )}
                  </div>
                ))}
                <div
                  className="ov-add-subject"
                  onClick={addMoreSubject}
                  style={{ pointerEvents: loading ? "none" : "auto" }}
                >
                  <FaPlus className="ov-add-icon" />
                  <span>Add Subject</span>
                </div>
              </div>
            </div>

            <div className="ov-card">
              <div className="ov-card-header">
                <h3>Performance Breakdown</h3>
                <span className="ov-subtitle">Accuracy by subject</span>
              </div>
              <div className="ov-performance-list">
                {ratings.length > 0 ? (
                  ratings.map((item, index) => (
                    <div key={index} className="ov-perf-row">
                      <div className="ov-perf-info">
                        <div className="ov-perf-name-group">
                          <span className="ov-perf-name">{item.subject}</span>
                          <span
                            className={`ov-perf-status ${item.completed === "yes" ? "completed" : "incomplete"}`}
                          >
                            {item.completed === "yes"
                              ? "Completed"
                              : "Incomplete"}
                          </span>
                        </div>
                        <span className="ov-perf-score">
                          {item.performance.toFixed(1)}%
                        </span>
                      </div>
                      <div className="ov-perf-bar-bg">
                        <div
                          className="ov-perf-bar-fill"
                          style={{
                            width: `${Math.min(100, Math.max(0, item.performance))}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="ov-empty-state">
                    <p>
                      Complete your first exam to unlock detailed performance
                      metrics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Overview;
