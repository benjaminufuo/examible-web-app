import { useEffect } from "react";
import "../styles/dashboardCss/examTimeout.css";
import { useDispatch } from "react-redux";
import { setExamTimeout, setFinishedExam } from "../global/slice";
import { motion } from "framer-motion";
import { LuAlarmClock } from "react-icons/lu";

const ExamTimeout = () => {
  const dispatch = useDispatch();

  const checkResult = () => {
    dispatch(setFinishedExam());
    dispatch(setExamTimeout());
  };

  // Lock body scrolling while the timeout modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="examTimeout-overlay-premium"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="examTimeout-modal-premium"
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="examTimeout-icon-wrapper">
          <LuAlarmClock size={40} />
        </div>
        <h2 className="examTimeout-title">Time's Up!</h2>
        <p className="examTimeout-message">
          You have run out of time! Please proceed to check your final results
          and performance.
        </p>
        <button className="examTimeout-action-btn" onClick={checkResult}>
          Check Result
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ExamTimeout;
