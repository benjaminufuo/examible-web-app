import {
  FiCpu,
  FiMonitor,
  FiBarChart2,
  FiAward,
  FiTarget,
  FiClock,
  FiBookOpen,
  FiActivity,
  FiWifiOff,
  FiShield,
} from "react-icons/fi";
import Reveal from "./Reveal";

const features = [
  {
    Icon: FiCpu,
    title: "AI Learning Assistant",
    desc: "A personal tutor that explains any question in clear, step-by-step language.",
  },
  {
    Icon: FiMonitor,
    title: "Real CBT Mock Exams",
    desc: "Practice in an interface that mirrors the actual JAMB computer-based test.",
  },
  {
    Icon: FiBarChart2,
    title: "Performance Analytics",
    desc: "See exactly where you're strong, where you're weak, and what to study next.",
  },
  {
    Icon: FiAward,
    title: "Gamified Leaderboards",
    desc: "Earn XP, climb weekly rankings, and stay motivated with friendly competition.",
  },
  {
    Icon: FiTarget,
    title: "Smart Recommendations",
    desc: "Adaptive suggestions point you to the topics that move your score the most.",
  },
  {
    Icon: FiClock,
    title: "Timed Practice Sessions",
    desc: "Build exam-day stamina and pacing with realistic countdown timers.",
  },
  {
    Icon: FiBookOpen,
    title: "JAMB & WAEC Past Questions",
    desc: "Thousands of verified past questions organized by subject and topic.",
  },
  {
    Icon: FiActivity,
    title: "Progress Tracking",
    desc: "Track streaks, accuracy, and predicted scores over time on one dashboard.",
  },
  // { Icon: FiWifiOff, title: "Offline Learning Support", desc: "Keep practicing even when your connection drops, then sync when you're back." },
  {
    Icon: FiShield,
    title: "Secure Authentication",
    desc: "Your data and progress are protected with secure, modern account security.",
  },
];

const Features = () => {
  return (
    <section className="ex-section ex-features" id="features">
      <div className="ex-container">
        <div className="ex-section-head">
          <span className="ex-eyebrow">Everything you need</span>
          <h2 className="ex-h2">
            A complete toolkit to{" "}
            <span className="ex-gradient-text">ace your exams</span>
          </h2>
          <p className="ex-lead">
            From adaptive AI tutoring to realistic CBT simulations, every
            feature is built to turn study time into real score improvements.
          </p>
        </div>

        <div className="ex-features__grid">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              className="ex-feature ex-card"
              delay={(i % 3) * 0.08}
              amount={0.2}
            >
              <span className="ex-feature__icon">
                <f.Icon size={22} />
              </span>
              <h3 className="ex-h3">{f.title}</h3>
              <p>{f.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
