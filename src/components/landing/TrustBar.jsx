import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const stats = [
  { value: 2653, suffix: "+", label: "Students registered" },
  { value: 1530, suffix: "+", label: "Scored 300 and above" },
  { value: 1200000, suffix: "+", label: "Questions practiced", compact: true },
  { value: 92, suffix: "%", label: "Report better readiness" },
];

const partners = ["UNILAG", "UI", "OAU", "Covenant", "ABU", "UNIBEN"];

function useCountUp(target, active, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

const fmt = (n, compact) =>
  compact && n >= 1000 ? `${(n / 1000000).toFixed(1)}M` : n.toLocaleString();

const StatItem = ({ stat, active }) => {
  const v = useCountUp(stat.value, active);
  return (
    <div className="ex-trust__stat">
      <strong className="ex-gradient-text">
        {fmt(v, stat.compact)}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </div>
  );
};

const TrustBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="ex-trust" ref={ref}>
      <div className="ex-container">
        <Reveal className="ex-trust__statGrid" as="div">
          {stats.map((s) => (
            <StatItem key={s.label} stat={s} active={inView} />
          ))}
        </Reveal>

        <div className="ex-trust__partners">
          <span>Trusted by students heading to top institutions</span>
          <div className="ex-trust__logos">
            {partners.map((p, i) => (
              <motion.span
                key={p}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {p}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
