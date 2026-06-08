import { motion } from "framer-motion";

const directions = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Lightweight scroll-reveal wrapper used across landing sections.
 */
const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  as = "div",
  amount = 0.25,
  className,
  style,
}) => {
  const offset = directions[direction] || directions.up;
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
