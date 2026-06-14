import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { questionApi } from "../../config/questionApi";
import { toast } from "react-toastify";
import { allSubjectsData } from "../../constants/common";
import {
  setExamTimer,
  setMockExamQuestion,
  setMockSelectedSubject,
} from "../../global/slice";
import "../../styles/dashboardCss/cbtMode.css";
import { MdLockOutline, MdCheckCircle } from "react-icons/md";
import { motion } from "framer-motion";
import { FaLaptopCode } from "react-icons/fa";

const CbtMode = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);

  // Safely find the English subject standard naming from your constants
  const englishSubj =
    allSubjectsData.find((s) => s.subject.toLowerCase().includes("english"))
      ?.subject || "English Language";

  const [selected, setSelected] = useState([englishSubj]);

  const subjectMap = useMemo(
    () => Object.fromEntries(allSubjectsData.map((s) => [s.subject, s.img])),
    [],
  );

  // Only display subjects the user has enrolled in, ensuring English is always included
  const availableSubjects = useMemo(() => {
    const enrolled = user?.enrolledSubjects || [];
    return allSubjectsData.filter(
      (s) => enrolled.includes(s.subject) || s.subject === englishSubj,
    );
  }, [user?.enrolledSubjects, englishSubj]);

  const handleSelect = (subject) => {
    if (subject === englishSubj) {
      toast.info(`${englishSubj} is compulsory for the CBT Examination.`);
      return;
    }

    if (selected.includes(subject)) {
      setSelected(selected.filter((s) => s !== subject));
    } else {
      if (selected.length >= 4) {
        toast.warning("You can only select up to 4 subjects for the CBT Mode.");
        return;
      }
      setSelected([...selected, subject]);
    }
  };

  const startCbt = async () => {
    if (selected.length !== 4) {
      toast.error("Please select exactly 4 subjects to begin.");
      return;
    }

    setLoading(true);
    try {
      const response = await questionApi.getCbtQuestions(selected.join(","));

      dispatch(setMockExamQuestion(response?.data?.data ?? []));

      // Configure the global Exam Engine settings
      const examDuration = user?.plan === "Freemium" ? 30 : 120;
      dispatch(setExamTimer({ plan: user?.plan, duration: examDuration }));
      sessionStorage.setItem("mockExamDuration", examDuration);
      dispatch(setMockSelectedSubject("CBT Examination"));

      setTimeout(() => {
        nav(`/mock-exam/questions`);
      }, 500);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="cbt-mode-container">
      <motion.div
        className="cbt-hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cbt-hero-content">
          <span className="cbt-hero-badge">
            <FaLaptopCode /> JAMB CBT Simulation
          </span>
          <h1 className="cbt-hero-title">JAMB CBT Mode Simulator</h1>
          <p className="cbt-hero-desc">
            Take a full 2-hour premium JAMB simulation. Select 4 subjects to
            proceed. English Language is compulsory.
          </p>
        </div>
      </motion.div>

      <div className="cbt-wrapper">
        <div className="cbt-subjects-section">
          <h3 className="cbt-section-title">Available Subjects</h3>
          <p className="cbt-section-desc">
            Select 3 additional subjects to complete your examination
            combination.
          </p>

          {availableSubjects.length < 4 && (
            <div
              style={{
                color: "var(--ex-danger)",
                marginBottom: "16px",
                fontSize: "14px",
                fontWeight: "600",
                padding: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderRadius: "8px",
              }}
            >
              You need to enroll in at least {4 - availableSubjects.length} more
              subject(s) to take a CBT exam. Please add more subjects from your
              Learning Hub (Dashboard).
            </div>
          )}

          <div className="cbt-subjects-grid">
            {availableSubjects.map((item, idx) => {
              const isEnglish = item.subject === englishSubj;
              const isSelected = selected.includes(item.subject);

              return (
                <div
                  key={idx}
                  className={`cbt-subject-card ${isSelected ? "selected" : ""} ${isEnglish ? "locked" : ""}`}
                  onClick={() => handleSelect(item.subject)}
                >
                  <div className="cbt-card-icon">
                    <img src={subjectMap[item.subject]} alt={item.subject} />
                  </div>
                  <span className="cbt-card-name">{item.subject}</span>
                  <div className="cbt-card-status">
                    {isEnglish ? (
                      <MdLockOutline className="status-icon lock" />
                    ) : (
                      isSelected && (
                        <MdCheckCircle className="status-icon check" />
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cbt-summary-section">
          <div className="cbt-summary-card">
            <h3>Selection Summary</h3>
            <div className="cbt-summary-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(selected.length / 4) * 100}%` }}
                ></div>
              </div>
              <span>{selected.length} / 4 Subjects Selected</span>
            </div>

            <ul className="cbt-selected-list">
              {selected.map((sub, i) => (
                <li key={i}>
                  <span className="sub-name">{sub}</span>
                  <span className="sub-count">
                    {sub === englishSubj ? "60 Questions" : "40 Questions"}
                  </span>
                </li>
              ))}
              {Array.from({ length: 4 - selected.length }).map((_, i) => (
                <li key={`empty-${i}`} className="empty-slot">
                  <span className="sub-name">Select Subject...</span>
                  <span className="sub-count">-</span>
                </li>
              ))}
            </ul>

            <div className="cbt-total-info">
              <div className="info-row">
                <span>Total Questions:</span>
                <strong>180</strong>
              </div>
              <div className="info-row">
                <span>Exam Duration:</span>
                <strong>2 Hours</strong>
              </div>
            </div>

            <button
              className={`cbt-start-btn ${selected.length === 4 && !loading ? "active" : ""}`}
              onClick={startCbt}
              disabled={selected.length !== 4 || loading}
            >
              {loading ? "Preparing Exam..." : "Start Examination"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CbtMode;
