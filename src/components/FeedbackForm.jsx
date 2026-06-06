import { Rate } from "antd";
import "../styles/dashboardCss/feedbackForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../global/slice";
import emailjs from "@emailjs/browser";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useExamibleContext } from "../context/ExamibleContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiStar } from "react-icons/fi";

const FeedbackForm = () => {
  const [showRatings, setShowRatings] = useState(true);
  const [starRatings, setStarRatings] = useState(0);
  const [ratings, setRatings] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const url = `${import.meta.env.VITE_BASE_URL}api/v1/students/${
    user._id || user.id
  }/feedback`;

  const { setShowFeedbackModal } = useExamibleContext();

  const handleRateUs = () => {
    setRatings(`${(starRatings / 5) * 100}%`);
    setShowRatings(false);
  };

  const handleSend = () => {
    const formFilled = {
      fullName: user?.fullName,
      email: user?.email,
      ratings,
      message,
    };
    setLoading(true);
    emailjs
      .send("service_5ou2b5r", "template_q90lk1j", formFilled, {
        publicKey: "wnutFCM-U192Bh14E",
      })
      .then(
        async () => {
          try {
            const res = await axios.put(url, {});
            if (res.status === 200) {
              toast.success("Thanks for the feedback", {
                autoClose: 2000,
              });
              setTimeout(() => {
                setShowFeedbackModal(false);
                setTimeout(() => {
                  dispatch(setUser(res?.data?.data));
                }, 500);
                setLoading(false);
              }, 1000);
            }
          } catch (error) {}
        },
        (error) => {
          setLoading(false);
          toast.error(error.text, {
            autoClose: 2000,
          });
        },
      );
  };

  return (
    <motion.div
      className="feedback-overlay-premium"
      onClick={() => {
        if (!loading) setShowFeedbackModal(false);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="feedback-modal-premium"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="feedback-header-premium">
          <div className="feedback-header-left">
            <div className="feedback-icon-wrapper">
              {showRatings ? (
                <FiStar size={24} />
              ) : (
                <FiMessageSquare size={24} />
              )}
            </div>
            <div>
              <h2 className="feedback-title">
                {showRatings ? "How was your experience?" : "Help Us Improve"}
              </h2>
              <p className="feedback-subtitle">
                {showRatings
                  ? "Let us know how Examible is working for you."
                  : "We'd love to hear your thoughts or suggestions."}
              </p>
            </div>
          </div>
          <button
            className="feedback-close-btn"
            onClick={() => setShowFeedbackModal(false)}
            disabled={loading}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="feedback-body-premium">
          <AnimatePresence mode="wait">
            {showRatings ? (
              <motion.div
                key="ratings-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="feedback-step-container"
              >
                <div className="feedback-rate-wrapper">
                  <Rate
                    allowHalf
                    style={{ color: "#F2AE30", fontSize: 44 }}
                    onChange={(value) => setStarRatings(value)}
                    value={starRatings}
                  />
                </div>
                <button
                  className="feedback-btn-primary"
                  onClick={handleRateUs}
                  disabled={starRatings <= 0}
                >
                  Continue
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="message-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="feedback-step-container"
              >
                <textarea
                  className="feedback-textarea-premium"
                  value={message}
                  placeholder="Tell us what you liked, what could be improved, or any issue you encountered..."
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                />
                <button
                  className="feedback-btn-primary"
                  disabled={!message.trim() || loading}
                  onClick={handleSend}
                >
                  {loading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Send Feedback"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackForm;
