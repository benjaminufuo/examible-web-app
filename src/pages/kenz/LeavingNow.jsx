import { useEffect, useRef, useState } from "react";
import "../../styles/dashboardCss/leavingNow.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import { useExamibleContext } from "../../context/ExamibleContext";
import { markEngaged } from "../../utils/installNudge";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { getTotalNumbersOfQuestion } from "../../utils/questionUtils";
import {
  EXAM_SUBMIT_MESSAGES,
  startNewCbt,
  submitCbtV2,
} from "../../utils/cbtSubmit";
import { useRetryOnReconnect } from "../../hooks/useRetryOnReconnect";
import { getMockTiming } from "../../utils/examTiming";

const LeavingNow = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const cbtSessionId = useSelector((state) => state.cbtSessionId);
  const [loading, setLoading] = useState(false);
  const [quitError, setQuitError] = useState(null);
  // "offline" | "ended" | null: why the last quit didn't go through
  const [failure, setFailure] = useState(null);
  const isSubmittingRef = useRef(false);
  // Offline when quitting: try again by itself once the connection is back
  const { attemptStarted, attemptFailedOffline } = useRetryOnReconnect(() =>
    quitExam(),
  );

  const { handleShowUserFeedback, showLeavingNow, setShowLeavingNow } =
    useExamibleContext();

  // Mock exams send their own result (duration, performance); a CBT is timed
  // and scored on the server, so it only sends the session and answers
  const submitMock = (timing) => {
    const duration = timing.secondsUsed;
    const validQuestionsLength = getTotalNumbersOfQuestion(mockExamQuestions);
    const rawPerformance =
      (exam.reduce((acc, item) => acc + (item?.score || 0), 0) /
        2 /
        (validQuestionsLength || 1)) *
      100;
    const performance = Math.min(
      100,
      Math.max(0, Math.round(rawPerformance) || 0),
    );
    return studentApi.updateRating(
      {
        duration,
        completed: "no",
        subject: mockSelectedSubject || "Mock Exam",
        performance,
      },
      { silent: true }, // the modal shows the message
    );
  };

  const fail = (reason) => {
    if (reason === "offline") attemptFailedOffline();
    setFailure(reason === "error" ? null : reason);
    setQuitError(EXAM_SUBMIT_MESSAGES[reason]);
  };

  const quitExam = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    attemptStarted();
    setQuitError(null);
    setFailure(null);
    const isCbt = mockSelectedSubject === "CBT Examination";

    setLoading(true);
    try {
      if (isCbt) {
        // The answers stay in the store if it fails
        const result = await submitCbtV2({
          dispatch,
          sessionId: cbtSessionId,
          exam,
        });
        if (!result.ok) {
          fail(result.reason);
          return;
        }
        setShowLeavingNow(false);
        nav("/cbt-mode/result", { state: { details: result.details } });
      } else {
        const timing = getMockTiming({
          examTimerMins,
          examTimerSecs,
          plan: user?.plan,
        });
        const res = await submitMock(timing);
        if (!res?.data?.success) {
          fail("error");
          return;
        }
        setShowLeavingNow(false);
        nav("/mock-exam/result", {
          state: { subject: mockSelectedSubject, timing },
        });
      }

      markEngaged(); // the Overview install card may show from now on
      setTimeout(handleShowUserFeedback, 20000);
    } catch (error) {
      fail(error?.response ? "error" : "offline");
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
          <p
            style={{
              color: "var(--ex-danger, #e53e3e)",
              fontSize: "0.8rem",
              textAlign: "center",
              marginTop: "0.75rem",
            }}
          >
            {quitError}
          </p>
        )}

        {failure === "ended" && (
          <button
            className="leaving-btn-primary"
            style={{ width: "100%", marginTop: "0.75rem" }}
            onClick={() => {
              setShowLeavingNow(false);
              startNewCbt(dispatch, nav);
            }}
          >
            Start a new CBT
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LeavingNow;
