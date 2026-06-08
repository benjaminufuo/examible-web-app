import { useEffect, useState } from "react";
import "../../styles/dashboardCss/pastquestion.css";
import {
  FaBook,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setExam,
  setPastQuestions,
  setYear,
  clearPastQuestionsOption,
} from "../../global/slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { questionApi } from "../../config/questionApi";
import { motion, AnimatePresence } from "framer-motion";

const PastQuestion = () => {
  // Using useNavigate to programmatically navigate between routes
  const [years, setYears] = useState([]); // State to hold the years fetched from the API
  const [subjectYearsMap, setSubjectYearsMap] = useState({}); // State to hold the mapping of subjects to years
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("Year");

  const isFreemium = !user?.plan || user?.plan === "Freemium";
  const FREE_YEARS_LIMIT = 3; // Allow free users to access the 4 oldest years

  const freeYears = years.slice(Math.max(0, years.length - FREE_YEARS_LIMIT));
  const freeYearsText =
    freeYears.length > 1
      ? `${freeYears[freeYears.length - 1]} - ${freeYears[0]}`
      : freeYears[0];

  const baseUrl = import.meta.env.VITE_QUESTION_URL;
  const getYears = async () => {
    try {
      const response = await axios.get(baseUrl);
      setSubjectYearsMap(response.data.data); // Save the mapping
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  useEffect(() => {
    getYears();
  }, []);
  // function to get past question for year and subject
  const getPastQuestionForYearSubject = async (year, subject) => {
    if (year === "All" || subject === "All") {
      toast.error("please select both subject and year.");
      return;
    }
    setLoading(true);

    const toastId = toast.loading("Please wait....");
    try {
      const response = await questionApi.fetchQuestions(year, subject);
      toast.dismiss(toastId);
      dispatch(setPastQuestions(response.data.data));
      dispatch(clearPastQuestionsOption());
      nav("/past-questions/view");
      setLoading(false);
      setDisabled(true);
    } catch {
      toast.dismiss(toastId);
      setDisabled(false);
      setLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    dispatch(setExam(subject));
    if (subjectYearsMap[subject]) {
      setYears(subjectYearsMap[subject].sort((a, b) => b - a)); // Sort years in descending order
    } else {
      setYears([]); // If no years are available for the subject, set years to an empty array
    }
    setSelectedYear("All"); // Reset selected year when subject changes
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    dispatch(setYear(year));
  };

  useEffect(() => {
    if (selectedSubject !== "All" && selectedYear !== "Year") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [loading, selectedYear, selectedSubject]);

  return (
    <div className="pq-premium-main">
      <motion.div
        className="pq-hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pq-hero-content">
          <span className="pq-hero-badge">JAMB UTME Questions</span>
          <h1 className="pq-hero-title">Master Past Questions</h1>
          <p className="pq-hero-desc">
            Practice real exam questions and improve your readiness with guided
            learning and analytics.
          </p>
        </div>
      </motion.div>

      <div className="pq-content-layout">
        <div className="pq-selection-panel">
          <motion.div
            className="pq-selection-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="pq-card-header">
              <FaBook className="pq-card-icon" />
              <h3>1. Select Subject</h3>
            </div>
            <div className="pq-chip-grid">
              {user?.enrolledSubjects?.map((subject, index) => (
                <button
                  key={index}
                  className={`pq-chip ${selectedSubject === subject ? "active" : ""}`}
                  onClick={() => handleSubjectClick(subject)}
                >
                  {selectedSubject === subject && (
                    <FaCheckCircle className="pq-chip-icon" />
                  )}
                  {subject}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {selectedSubject !== "All" && (
              <motion.div
                className="pq-selection-card"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pq-card-header">
                  <FaCalendarAlt className="pq-card-icon" />
                  <h3>2. Select Year</h3>
                </div>
                <div className="pq-chip-grid">
                  {years.length > 0 ? (
                    years.map((year, index) => {
                      const isLocked =
                        isFreemium && index < years.length - FREE_YEARS_LIMIT;
                      return (
                        <button
                          key={index}
                          className={`pq-chip year-chip ${selectedYear === year ? "active" : ""} ${isLocked ? "locked" : ""}`}
                          onClick={() => !isLocked && handleYearClick(year)}
                          disabled={isLocked}
                        >
                          {isLocked && (
                            <span className="pq-chip-icon pq-locked-icon">
                              🔒
                            </span>
                          )}
                          {year}
                        </button>
                      );
                    })
                  ) : (
                    <p className="pq-empty-state">
                      No years available for this subject.
                    </p>
                  )}
                </div>
                {isFreemium && years.length > FREE_YEARS_LIMIT && (
                  <div className="pq-premium-warning">
                    <FaLock className="pq-premium-warning-icon" />
                    Freemium users are limited to the years {
                      freeYearsText
                    }.{" "}
                    <span
                      onClick={() => nav("/subscription")}
                      className="pq-premium-upgrade-link"
                    >
                      Upgrade to Premium
                    </span>{" "}
                    to unlock all past questions.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pq-action-container">
            <button
              className={`pq-action-btn ${disabled || loading ? "disabled" : ""}`}
              onClick={() =>
                getPastQuestionForYearSubject(selectedYear, selectedSubject)
              }
              disabled={disabled || loading}
            >
              {loading ? "Preparing Questions..." : "Start Practice Session"}
            </button>
          </div>
        </div>

        <motion.div
          className="pq-info-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="pq-info-card">
            <div className="pq-info-header">
              <FaInfoCircle className="pq-info-icon" />
              <h3>Smart Practice Guide</h3>
            </div>
            <div className="pq-info-body">
              <h4>How to prepare effectively</h4>
              <p>
                Choosing the right past question is key to studying smarter and
                scoring higher.
              </p>

              <h4>Know Your Subjects</h4>
              <p>
                Confirm the four JAMB subjects you're sitting for. For example:
              </p>
              <ul className="pq-info-list">
                <li>
                  <strong>Science:</strong> English, Physics, Chemistry,
                  Biology/Math
                </li>
                <li>
                  <strong>Arts:</strong> English, Literature, Government,
                  CRS/History
                </li>
                <li>
                  <strong>Commercial:</strong> English, Economics, Commerce,
                  Accounting
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PastQuestion;
