import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import "./custom-select.css";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const CustomSelect = ({ options, value, onChange, icon, renderLabel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, () => setIsOpen(false));

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <button
        className="custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {icon}
        <span>{renderLabel(value)}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FiChevronDown />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-select-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {options.map((opt) => (
              <motion.button
                key={opt}
                className={`custom-select-option ${value === opt ? "selected" : ""}`}
                onClick={() => handleSelect(opt)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
              >
                {renderLabel(opt)}
                {value === opt && (
                  <motion.div
                    className="check-icon"
                    layoutId="check"
                    initial={false}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <FiCheck />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
