import { useTheme } from "../context/ThemeContext";
import { FiMoon, FiSun } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/themeToggle.css";

const ThemeToggle = ({ className = "", floating = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Styles to make the toggle float persistently on the screen
  const floatingStyles = floating
    ? {
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 9999,
        background: "var(--ex-surface)",
        border: "1px solid var(--ex-border)",
        boxShadow: "var(--ex-shadow-lg)",
      }
    : {};

  return (
    <button
      type="button"
      className={`ex-theme-toggle ${className}`}
      style={floatingStyles}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 8, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -8, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="ex-theme-toggle__icon"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
