import { useEffect, useRef, useState } from "react";
import "../../styles/dashboardCss/leavingNow.css";
import { setUser } from "../../global/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { getTotalNumbersOfQuestion } from "../../utils/questionUtils";
import { questionApi } from "../../config/questionApi";

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
  const [quitError, setQuitError] = useState(null);
  const isSubmittingRef = useRef(false);

  const { handleShowUserFeedback, showLeavingNow, setShowLeavingNow } =
    useExamibleContext();

  const quitExam = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setQuitError(null);
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    const initialDuration =
      parseInt(sessionStorage.getItem("mockExamDuration")) ||
      (user?.plan === "Freemium" ? 10 : 30);

    const duration = Math.min(7200, Math.max(1, initialDuration * 60 - timeLeft));
    const validQuestionsLength = getTotalNumbersOfQuestion(mockExamQuestions);

    const rawPerformance =
      (exam.reduce((acc, item) => acc + (item?.score || 0), 0) /
        2 /
        (validQuestionsLength || 1)) *
      100;

    const performance = Math.min(100, Math.max(0, Math.round(rawPerformance) || 0));

    const englishSubj =
      allSubjectsData.find((s) => s.subject.toLowerCase().includes("english"))
        ?.subject || "English Language";

    const isCbt = mockSelectedSubject === "CBT Examination";
    const apiSubject = isCbt ? englishSubj : mockSelectedSubject || "Mock Exam";

    setLoading(true);
    try {
      let res;
      if (isCbt) {
        const subjects = mockExamQuestions.map((q) => q.subject);
        const data = exam.map((q) => ({
          subject: q?.subject || "N/A",
          isCorrect: q?.score === 2,
        }));
        res = await questionApi.submitCbt({ duration, subjects, data });
      } else {
        res = await studentApi.updateRating({
          duration,
          completed: "no",
          subject: apiSubject,
          performance,
        });
      }

      if (!res?.data?.success) {
        setQuitError("Something went wrong. Please try again.");
        return;
      }

      dispatch(setUser(res.data.data));
      setShowLeavingNow(false);

      if (isCbt) {
        nav("/cbt-mode/result", { state: { details: res.data.data?.lastCbtDetails } });
      } else {
        nav("/mock-exam/result", { state: { subject: mockSelectedSubject } });
      }

      setTimeout(handleShowUserFeedback, 20000);
    } catch {
      setQuitError("Network error. Please check your connection.");
    } finally {
      isSubmittingRef.current = false;
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

        {quitError && (
          <p style={{ color: "var(--ex-danger, #e53e3e)", fontSize: "0.8rem", textAlign: "center", marginTop: "0.75rem" }}>
            {quitError}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LeavingNow;
