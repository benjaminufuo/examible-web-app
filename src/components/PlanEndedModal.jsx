import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuCrown, LuSparkles, LuBookOpen, LuTimer } from "react-icons/lu";
import { setPlanEndedNotice } from "../global/slice";
import "../styles/planEndedModal.css";

// Never interrupt a running exam: the notice waits until the student leaves it
const EXAM_PATHS = ["/mock-exam/questions"];

const FREE_LIMITS = [
  { icon: LuSparkles, text: "10 AI explanations a day" },
  { icon: LuTimer, text: "1 shorter CBT a day (30 minutes)" },
  { icon: LuBookOpen, text: "Subjects reset to Mathematics and English" },
];

const PlanEndedModal = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const notice = useSelector((state) => state.planEndedNotice);
  const user = useSelector((state) => state.user);

  const open = Boolean(notice && user?.id && !EXAM_PATHS.includes(pathname));

  const close = () => dispatch(setPlanEndedNotice(false));
  const renew = () => {
    close();
    nav("/subscription");
  };

  // Lock page scroll and allow Escape to close while open
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") dispatch(setPlanEndedNotice(false));
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, dispatch]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="planEnded-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="planEnded-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="planEnded-title"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="planEnded-icon">
              <LuCrown size={36} />
            </div>
            <h2 id="planEnded-title" className="planEnded-title">
              Your Premium plan has ended
            </h2>
            <p className="planEnded-message">
              You're on the free plan now. Your progress is saved. Here's what
              changes:
            </p>
            <ul className="planEnded-limits">
              {FREE_LIMITS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="planEnded-limit-icon">
                    <Icon size={18} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <div className="planEnded-actions">
              <button
                type="button"
                className="planEnded-primary"
                onClick={renew}
                autoFocus
              >
                Renew Premium
              </button>
              <button
                type="button"
                className="planEnded-secondary"
                onClick={close}
              >
                Continue on Free
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanEndedModal;
