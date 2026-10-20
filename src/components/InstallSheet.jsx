import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuSmartphone,
  LuShare,
  LuSquarePlus,
  LuEllipsis,
  LuCompass,
  LuMonitorDown,
} from "react-icons/lu";
import { useIsPhone } from "../hooks/useIsPhone";
import "../styles/planEndedModal.css"; // same shell as the plan pop-up
import "../styles/installPrompt.css";

// Where there's no install dialog, the steps to install by hand
const STEPS = {
  ios: {
    title: "Add Examible to your home screen",
    steps: [
      {
        icon: LuShare,
        text: "Tap the Share button (on newer iPhones, tap ⋯ first)",
      },
      { icon: LuSquarePlus, text: "Scroll down and choose Add to Home Screen" },
      { text: "Tap Add. Examible opens from your home screen like an app." },
    ],
  },
  "mac-safari": {
    title: "Add Examible to your Dock",
    icon: LuMonitorDown,
    steps: [
      { text: "In the menu bar at the top of the screen, click File" },
      { icon: LuMonitorDown, text: "Choose Add to Dock" },
      { text: "Click Add. Examible opens from your Dock like an app." },
    ],
  },
  "in-app": {
    title: "Open Examible in your browser",
    steps: [
      { icon: LuEllipsis, text: "Tap the menu in the top corner of this page" },
      { icon: LuCompass, text: "Choose Open in browser" },
      { text: "Install Examible from there." },
    ],
  },
};

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
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 500;

const InstallSheet = ({ open, mode, onClose }) => {
  const isPhone = useIsPhone();
  const content = STEPS[mode];
  const HeaderIcon = content?.icon ?? LuSmartphone;
  const visible = Boolean(open && content);

  useEffect(() => {
    if (!visible) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    // Restore what was there: another modal may also have locked scrolling
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, onClose]);

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          className="planEnded-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="planEnded-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="installSheet-title"
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
                  onClose();
                }
              },
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="planEnded-handle" aria-hidden="true" />
            <div className="planEnded-icon">
              <HeaderIcon size={34} />
            </div>
            <h2 id="installSheet-title" className="planEnded-title">
              {content.title}
            </h2>
            <ol className="installSheet-steps">
              {content.steps.map(({ icon: Icon, text }, i) => (
                <li key={text}>
                  <span className="installSheet-number">{i + 1}</span>
                  <span className="installSheet-text">{text}</span>
                  {Icon && (
                    <span className="installSheet-icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <div className="planEnded-actions">
              <button
                type="button"
                className="planEnded-primary"
                onClick={onClose}
                autoFocus
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default InstallSheet;
