import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/testimonialCarousel.css";

const AUTO_DELAY_MS = 5000;

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? "55%" : "-55%",
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? "-55%" : "55%",
    opacity: 0,
    scale: 0.97,
  }),
};

const transition = {
  duration: 0.42,
  ease: [0.25, 0.46, 0.45, 0.94],
};

const TestimonialCarousel = ({ testimonials = [] }) => {
  const [[activeIndex, direction], setSlide] = useState([0, 0]);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);
  const count = testimonials.length;

  const goTo = useCallback(
    (idx, dir) => {
      setSlide([(idx + count) % count, dir]);
    },
    [count],
  );

  const next = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);

  // Auto-advance — resets whenever the slide or paused state changes
  useEffect(() => {
    if (paused || count < 2) return;
    intervalRef.current = setInterval(next, AUTO_DELAY_MS);
    return () => clearInterval(intervalRef.current);
  }, [paused, next, count]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const handleDragEnd = (_, { offset, velocity }) => {
    if (offset.x < -40 || velocity.x < -300) next();
    else if (offset.x > 40 || velocity.x > 300) prev();
  };

  if (!count) return null;

  const t = testimonials[activeIndex];

  return (
    <div
      className="tc-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Testimonials carousel"
    >
      {/* ── Sliding stage ── */}
      <div className="tc-stage">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            className="ex-card tc-card"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Accent stripe */}
            <div className="tc-accent" style={{ background: t.color }} />

            {/* Decorative large quote mark */}
            <span className="tc-deco-quote" aria-hidden="true">&ldquo;</span>

            {/* Stars */}
            <div className="tc-stars" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, s) => (
                <FiStar
                  key={s}
                  size={15}
                  fill="var(--ex-accent-2)"
                  stroke="var(--ex-accent-2)"
                />
              ))}
            </div>

            {/* Quote */}
            <p className="tc-quote">{t.quote}</p>

            {/* Person */}
            <div className="tc-person">
              <span className="tc-avatar" style={{ background: t.color }}>
                {t.name.charAt(0)}
              </span>
              <div>
                <strong className="tc-name">{t.name}</strong>
                <small className="tc-role">{t.role}</small>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Progress bar ── */}
      <div className="tc-progress-track" aria-hidden="true">
        <motion.div
          key={`progress-${activeIndex}`}
          className="tc-progress-fill"
          style={{ background: t.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: paused ? 0 : 1 }}
          transition={{
            duration: paused ? 0 : AUTO_DELAY_MS / 1000,
            ease: "linear",
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <div className="tc-nav">
        <button
          className="tc-arrow"
          onClick={prev}
          aria-label="Previous testimonial"
        >
          <FiChevronLeft size={18} />
        </button>

        <div className="tc-dots" role="tablist" aria-label="Slide indicators">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Testimonial ${i + 1}`}
              className={`tc-dot${i === activeIndex ? " tc-dot--active" : ""}`}
              style={i === activeIndex ? { background: t.color } : undefined}
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
            />
          ))}
        </div>

        <button
          className="tc-arrow"
          onClick={next}
          aria-label="Next testimonial"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
