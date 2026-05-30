import { FiUser, FiCpu, FiMonitor, FiTrendingUp, FiHeart, FiGlobe } from "react-icons/fi";
import Reveal from "./Reveal";

const reasons = [
  { Icon: FiUser, title: "Personalized learning", desc: "Every study plan adapts to your strengths, gaps, and goals." },
  { Icon: FiCpu, title: "AI-driven support", desc: "Instant explanations and guidance whenever you get stuck." },
  { Icon: FiMonitor, title: "Real exam simulation", desc: "Practice exactly like the real CBT, so exam day feels familiar." },
  { Icon: FiTrendingUp, title: "Performance tracking", desc: "Watch your predicted score climb with measurable progress." },
  { Icon: FiHeart, title: "Student engagement", desc: "Streaks, badges, and rewards keep motivation high." },
  { Icon: FiGlobe, title: "Built for Africa", desc: "Designed around JAMB, WAEC, and NECO curricula and realities." },
];

const WhyExamible = () => {
  return (
    <section className="ex-section ex-why">
      <div className="ex-container ex-why__inner">
        <Reveal className="ex-why__intro" direction="right">
          <span className="ex-eyebrow">Why Examible</span>
          <h2 className="ex-h2">
            Built to make you <span className="ex-gradient-text">genuinely exam-ready</span>
          </h2>
          <p className="ex-lead">
            We combine adaptive AI, realistic practice, and motivating progress
            tracking into one platform focused entirely on African students&apos;
            success.
          </p>
          <div className="ex-why__highlight ex-card">
            <strong className="ex-gradient-text">85%</strong>
            <p>of consistent users report feeling more confident and prepared.</p>
          </div>
        </Reveal>

        <div className="ex-why__grid">
          {reasons.map((r, i) => (
            <Reveal key={r.title} className="ex-why__item" delay={(i % 2) * 0.08}>
              <span className="ex-why__icon">
                <r.Icon size={20} />
              </span>
              <div>
                <h3 className="ex-h3">{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyExamible;
