import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LuCrown, LuSparkles, LuBookOpen, LuTimer } from "react-icons/lu";
import { setPlanEndedNotice } from "../global/slice";
import { isExamRoute } from "../utils/examRoutes";
import "../styles/planEndedModal.css";

const FREE_LIMITS = [
  { icon: LuSparkles, text: "10 AI explanations a day" },
  { icon: LuTimer, text: "1 shorter CBT a day (30 minutes)" },
  { icon: LuBookOpen, text: "Subjects reset to Mathematics and English" },
];

const PHONE_QUERY = "(max-width: 600px)";

// True on phone-width screens, kept in sync when the window is resized
const useIsPhone = () => {
  const [isPhone, setIsPhone] = useState(
    () => window.matchMedia(PHONE_QUERY).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const onChange = (e) => setIsPhone(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return isPhone;
};

// Phones: a sheet that slides up from the bottom, slides back down when closed,
// and can be dragged down to dismiss. Desktop: the centered card.
const SHEET_MOTION = {
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "100%" },
  transition: { type: "spring", stiffness: 420, damping: 40 },
};
const CARD_MOTION = {
  initial: { scale: 0.95, opacity: 0, y: 15 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0.95, opacity: 0, y: 15 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
};
// A drag this far (px) or this fast (px/s) dismisses the sheet; less springs back
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 500;

const PlanEndedModal = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const notice = useSelector((state) => state.planEndedNotice);
  const user = useSelector((state) => state.user);
  const isPhone = useIsPhone();
  // Phones get a shorter sheet: the "what changes" box shows on larger screens only
  const showLimits = !isPhone;

  // Never interrupt a running exam: the notice waits until the student leaves it
  const open = Boolean(notice && user?.id && !isExamRoute(pathname));

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

  // Rendered on <body> so no parent stacking context can put it under the
  // header, hamburger menu or floating theme toggle
  return createPortal(
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
            {...(isPhone ? SHEET_MOTION : CARD_MOTION)}
            {...(isPhone && {
              drag: "y",
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: { top: 0, bottom: 0.7 },
              onDragEnd: (_, { offset, velocity }) => {
                if (
                  offset.y > DISMISS_DISTANCE ||
                  velocity.y > DISMISS_VELOCITY
                ) {
                  close();
                }
              },
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="planEnded-handle" aria-hidden="true" />
            <div className="planEnded-icon">
              <LuCrown size={36} />
            </div>
            <h2 id="planEnded-title" className="planEnded-title">
              Your Premium plan has ended
            </h2>
            <p className="planEnded-message">
              You're on the free plan now. Your progress is saved.
              {showLimits && " Here's what changes:"}
            </p>
            {showLimits && (
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
            )}
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
    </AnimatePresence>,
    document.body,
  );
};

export default PlanEndedModal;
