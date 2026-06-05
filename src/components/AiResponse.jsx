import { useEffect } from "react";
import "../styles/dashboardCss/airesponse.css";
import { BiX } from "react-icons/bi";
import handwave from "../assets/public/fluent_hand-wave-16-filled.svg";
import FormattedResponse from "./FormattedResponse";
import { useExamibleContext } from "../context/ExamibleContext";
import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";

const AiResponse = () => {
  const { showAiResponseModal, setShowAiResponseModal, AIresponse } =
    useExamibleContext();

  useEffect(() => {
    document.body.style.overflow = showAiResponseModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAiResponseModal]);

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowAiResponseModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowAiResponseModal]);

  return (
    <motion.div
      className="ai-overlay-premium"
      onClick={() => setShowAiResponseModal(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="ai-modal-premium"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="ai-modal-header">
          <div className="ai-header-left">
            <div className="ai-icon-wrapper">
              <FaBrain size={24} />
            </div>
            <div>
              <h3 className="ai-title">AI Explanation</h3>
              <p className="ai-subtitle">
                Understand This Question Better{" "}
                <img
                  src={handwave}
                  alt="Wave"
                  style={{ width: 16, height: 16, marginLeft: 4 }}
                />
              </p>
            </div>
          </div>
          <button
            className="ai-close-btn"
            onClick={() => setShowAiResponseModal(false)}
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="ai-modal-body">
          <FormattedResponse response={AIresponse} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AiResponse;
