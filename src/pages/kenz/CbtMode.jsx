import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { allSubjectsData } from "../../constants/common";
import {
  setExamTimer,
  setMockExamQuestion,
  setMockSelectedSubject,
  setMockYear,
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
    () =>
      Object.fromEntries(
        allSubjectsData.map((s) => [s.subject, s.svg || s.img]),
      ),
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
    const id = toast.loading("Compiling your 180-Question CBT Examination...");

    try {
      let results = [];

      // Fetch questions sequentially to prevent overwhelming the backend or hitting rate limits
      for (const subject of selected) {
        const limit = subject === englishSubj ? 60 : 40;
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}api/v1/mock-questions/${encodeURIComponent(subject)}/${
              user?._id || user?.id
            }?questions=${limit}`,
          );
          results.push({
            subject,
            data: res.data.data,
            year: res.data.year,
          });
        } catch (err) {
          results.push({
            subject,
            data: [],
            error: true,
            errMsg: err?.response?.data?.message || err.message,
          });
        }
      }

      // Validation step for incomplete data
      const failedSubjects = results.filter((r) => r.error);
      if (failedSubjects.length > 0) {
        toast.dismiss(id);
        const errNames = failedSubjects.map((e) => e.subject).join(", ");
        toast.error(`Failed to load ${errNames}: ${failedSubjects[0].errMsg}`);
        setLoading(false);
        return;
      }

      // Combine the exact requested limits
      let combinedQuestions = [];
      results.forEach((result) => {
        const limit = result.subject === englishSubj ? 60 : 40;
        let questions = result.data.slice(0, limit).map((q) => ({
          ...q,
          subject: result.subject, // Inject the subject into each question
        }));

        // Shuffle questions within this subject block
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        combinedQuestions = [...combinedQuestions, ...questions];
      });

      if (combinedQuestions.length === 0) {
        toast.dismiss(id);
        toast.error("No questions available for the selected subjects.");
        setLoading(false);
        return;
      }

      // Dispatch exactly 180 combined questions to the standard Redux store
      dispatch(setMockExamQuestion(combinedQuestions));
      dispatch(setMockYear(results[0].year || new Date().getFullYear()));

      // Configure the global Exam Engine settings
      dispatch(setExamTimer({ plan: user?.plan, duration: 120 })); // 2 hours
      sessionStorage.setItem("mockExamDuration", 120);
      dispatch(setMockSelectedSubject("CBT Examination"));

      toast.dismiss(id);
      setTimeout(() => {
        nav(`/mock-exam/1`);
      }, 500);
    } catch (error) {
      setLoading(false);
      toast.dismiss(id);
      toast.error(
        error?.response?.data?.message || "Failed to initiate CBT Mode.",
      );
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
                    {typeof subjectMap[item.subject] === "function" ? (
                      React.createElement(subjectMap[item.subject])
                    ) : (
                      <img src={subjectMap[item.subject]} alt={item.subject} />
                    )}
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
              className={`cbt-start-btn ${selected.length === 4 ? "active" : ""}`}
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
