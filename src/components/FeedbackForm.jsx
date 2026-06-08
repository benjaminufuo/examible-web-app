import "../styles/dashboardCss/feedbackForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUser } from "../global/slice";
import emailjs from "@emailjs/browser";
import { ClipLoader } from "react-spinners";
import { useExamibleContext } from "../context/ExamibleContext";
import { studentApi } from "../config/studentApi";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiStar } from "react-icons/fi";

const StarIcon = ({ fill }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="44"
    height="44"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`half-${fill}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stopColor="#F2AE30" />
        <stop offset="50%" stopColor="var(--star-empty-color)" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={
        fill === "full"
          ? "#F2AE30"
          : fill === "half"
            ? `url(#half-${fill})`
            : "var(--star-empty-color)"
      }
      stroke="#F2AE30"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarRating = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(null);

  const effective = hovered ?? value;

  const getFill = (i) => {
    if (effective >= i) return "full";
    if (effective >= i - 0.5) return "half";
    return "empty";
  };

  const getValueFromEvent = (e, i) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left < rect.width / 2 ? i - 0.5 : i;
  };

  return (
    <div className="star-rating" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`star-btn star-${getFill(i)}`}
          aria-label={`${i} star${i > 1 ? "s" : ""}`}
          onMouseMove={(e) => setHovered(getValueFromEvent(e, i))}
          onMouseLeave={() => setHovered(null)}
          onClick={(e) => onChange(getValueFromEvent(e, i))}
        >
          <StarIcon fill={getFill(i)} />
        </button>
      ))}
    </div>
  );
};

const FeedbackForm = () => {
  const [showRatings, setShowRatings] = useState(true);
  const [starRatings, setStarRatings] = useState(0);
  const [ratings, setRatings] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
        publicKey: "_oCvAF9TWmBZ6RXt-",
      })
      .then(
        async () => {
          const res = await studentApi.submitFeedback();
          if (res.data.success) {
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
                  {/* Native star rating — antd Rate commented out above */}
                  <StarRating
                    value={starRatings}
                    onChange={(value) => setStarRatings(value)}
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
