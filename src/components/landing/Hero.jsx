import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiZap, FiPlay, FiArrowRight } from "react-icons/fi";
import { FaBrain, FaTrophy, FaChartLine } from "react-icons/fa";
import avatarOne from "../../assets/public/avatars/avatar1.webp";
import avatarTwo from "../../assets/public/avatars/avatar2.webp";
import avatarThree from "../../assets/public/avatars/avatar3.webp";
import avatarFour from "../../assets/public/avatars/avatar4.webp";

const float = (delay) => ({
  animate: { y: [0, -12, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
});

const Hero = () => {
  const nav = useNavigate();

  const chartSubjects = [
    { name: "English", score: 78, color: "var(--ex-brand)" },
    { name: "Physics", score: 64, color: "#10b981" },
    { name: "Chemistry", score: 71, color: "#f59e0b" },
  ];

  const totalScore = chartSubjects.reduce((sum, s) => sum + s.score, 0) || 1;
  let currentAngle = 0;
  const conicGradientSlices = chartSubjects
    .map((s) => {
      const percentage = (s.score / totalScore) * 100;
      const slice = `${s.color} ${currentAngle}% ${currentAngle + percentage}%`;
      currentAngle += percentage;
      return slice;
    })
    .join(", ");

  return (
    <section className="ex-hero">
      <div className="ex-hero__bg" aria-hidden="true">
        <div className="ex-hero__grid" />
        <div className="ex-hero__glow ex-hero__glow--1" />
        <div className="ex-hero__glow ex-hero__glow--2" />
      </div>

      <div className="ex-container ex-hero__inner">
        <motion.div
          className="ex-hero__copy"
          initial={{ y: 24 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="ex-eyebrow">
            <FiZap size={14} /> AI-powered CBT exam prep
          </span>
          <h1 className="ex-h1 ex-hero__title">
            The future of exam preparation{" "}
            <span className="ex-gradient-text">starts here.</span>
          </h1>
          <p className="ex-lead ex-hero__lead">
            Examible helps students across Africa master JAMB, WAEC, and NECO
            with realistic CBT simulations, a personal AI tutor, and analytics
            that turn practice into measurable score gains.
          </p>

          <div className="ex-hero__actions">
            <button
              className="ex-btn ex-btn-primary ex-btn-lg"
              onClick={() => nav("/signup")}
            >
              Start practicing <FiArrowRight size={18} />
            </button>
            <button
              className="ex-btn ex-btn-ghost ex-btn-lg"
              onClick={() => nav("/signup")}
            >
              <FiPlay size={16} /> Take a mock exam
            </button>
          </div>

          <div className="ex-hero__proof">
            <div className="ex-hero__avatars" aria-hidden="true">
              {AVATARS.map((avatar, i) => (
                <span key={i} style={{ background: avatar.color }}>
                  <img src={avatar.img} alt="student" />
                </span>
              ))}
            </div>
            <p>
              <strong>2,600+ students</strong> preparing smarter every day
            </p>
          </div>
        </motion.div>

        <motion.div
          className="ex-hero__visual"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        >
          <div className="ex-hero__dash ex-glass">
            <div className="ex-hero__dashHead">
              <div className="ex-hero__dashUser">
                <span className="ex-hero__dashAvatar">TA</span>
                <div>
                  <strong>Welcome back, Tolu</strong>
                  <small>Your JAMB readiness is improving</small>
                </div>
              </div>
              {/* <span className="ex-hero__badge">
                <FiTrendingUp size={13} /> +18%
              </span> */}
            </div>

            <div className="ex-hero__dashStats">
              <div className="ex-hero__stat">
                <small>Exams Taken</small>
                <strong>12</strong>
              </div>
              <div className="ex-hero__stat">
                <small>Focus Area</small>
                <strong className="ex-hero__stat--text">Physics</strong>
              </div>
              <div className="ex-hero__stat">
                <small>Top Subject</small>
                <strong className="ex-hero__stat--text">English</strong>
              </div>
            </div>

            <div className="ex-hero__pieChart">
              <div
                className="ex-hero__doughnut"
                style={{
                  background: `conic-gradient(${conicGradientSlices})`,
                }}
              >
                <div className="ex-hero__doughnut-inner">
                  <strong>78%</strong>
                  <small>Avg. Score</small>
                </div>
              </div>
            </div>

            <div className="ex-hero__subjects">
              {chartSubjects.map((subject) => (
                <div className="ex-hero__subjectRow" key={subject.name}>
                  <span>{subject.name}</span>
                  <div className="ex-hero__track">
                    <motion.div
                      className="ex-hero__fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.score}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                      style={{
                        background: subject.color,
                      }}
                    />
                  </div>
                  <em>{subject.score}%</em>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            className="ex-hero__floatCard ex-hero__floatCard--ai ex-glass"
            {...float(0.4)}
          >
            <span
              className="ex-hero__floatIcon"
              style={{
                background: "var(--ex-brand-soft)",
                color: "var(--ex-brand)",
              }}
            >
              <FaBrain size={16} />
            </span>
            <div>
              <strong>Most Practiced</strong>
              <small>English Language</small>
            </div>
          </motion.div>

          <motion.div
            className="ex-hero__floatCard ex-hero__floatCard--rank ex-glass"
            {...float(1.1)}
          >
            <span
              className="ex-hero__floatIcon"
              style={{
                background: "rgba(242,174,48,0.16)",
                color: "var(--ex-accent-2)",
              }}
            >
              <FaTrophy size={16} />
            </span>
            <div>
              <strong>Strongest Subject</strong>
              <small>Mathematics</small>
            </div>
          </motion.div>

          <motion.div
            className="ex-hero__floatCard ex-hero__floatCard--pass ex-glass"
            {...float(0.8)}
          >
            <span
              className="ex-hero__floatIcon"
              style={{
                background: "rgba(239,68,68,0.16)",
                color: "var(--ex-danger)",
              }}
            >
              <FaChartLine size={16} style={{ transform: "rotate(180deg)" }} />
            </span>
            <div>
              <strong>Needs Improvement</strong>
              <small>Physics</small>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

const AVATARS = [
  {
    color: "#804bf2",
    img: avatarOne,
  },
  {
    color: "#06b6d4",
    img: avatarTwo,
  },
  {
    color: "#f2ae30",
    img: avatarThree,
  },
  {
    color: "#16b364",
    img: avatarFour,
  },
];
