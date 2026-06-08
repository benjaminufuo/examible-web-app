import { useEffect, useState } from "react";
import "../../styles/dashboardCss/leavingNow.css";
import { setUser } from "../../global/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

const LeavingNow = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const { handleShowUserFeedback, showLeavingNow, setShowLeavingNow } =
    useExamibleContext();

  const quitExam = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    let duration = 0;
    const completed = "no";
    const initialDuration =
      parseInt(sessionStorage.getItem("mockExamDuration")) ||
      (user?.plan === "Freemium" ? 10 : 30);

    duration = Math.min(7200, Math.max(1, initialDuration * 60 - timeLeft)); // Increased cap to 7200 (2 hours) for CBT Mode
    const validQuestionsLength = mockExamQuestions?.length || 1; // Prevent division by zero

    const rawPerformance =
      (exam.reduce((acc, item) => acc + (item?.score || 0), 0) /
        2 /
        validQuestionsLength) *
      100;

    const performance = Math.min(
      100,
      Math.max(0, Math.round(rawPerformance) || 0),
    ); // Ensure between 0 and 100

    // Safely find the standard English subject name to avoid backend schema/validation errors
    const englishSubj =
      allSubjectsData.find((s) => s.subject.toLowerCase().includes("english"))
        ?.subject || "English Language";

    const apiSubject =
      mockSelectedSubject === "CBT Examination"
        ? englishSubj
        : mockSelectedSubject || "Mock Exam";

    setLoading(true);
    try {
      const res = await studentApi.updateRating({
        duration,
        completed,
        subject: apiSubject,
        performance,
      });
      if (res?.data?.success) {
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          setShowLeavingNow(false);
          setLoading(false);
          nav("/mock-exam/result", {
            state: { subject: mockSelectedSubject },
          });
          setTimeout(() => {
            handleShowUserFeedback();
          }, 20000);
        }, 500);
      }
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showLeavingNow ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLeavingNow]);

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) {
        setShowLeavingNow(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowLeavingNow, loading]);

  return (
    <motion.div
      className="leaving-overlay-premium"
      onClick={() => {
        if (!loading) setShowLeavingNow(false);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="leaving-modal-premium"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header Section */}
        <div className="leaving-header">
          <div className="leaving-icon-wrapper">
            <FiAlertTriangle size={24} />
          </div>
          <h3 className="leaving-title">Leaving Now?</h3>
        </div>

        {/* Confirmation Message */}
        <p className="leaving-message">
          Quitting this mock exam early means missing important questions — and
          your final score could be much lower.
        </p>

        {/* Action Buttons */}
        <div className="leaving-actions">
          <button
            className="leaving-btn-primary"
            onClick={() => setShowLeavingNow(false)}
            disabled={loading}
          >
            Stay in Exam
          </button>

          <button
            className="leaving-btn-danger"
            onClick={() => quitExam()}
            disabled={loading}
          >
            {loading ? "Quitting..." : "Quit Anyway"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LeavingNow;
