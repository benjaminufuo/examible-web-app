import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiZap, FiPlay, FiArrowRight } from "react-icons/fi";
import { FaBrain, FaTrophy, FaChartLine } from "react-icons/fa";
import avatarOne from "../../assets/public/avatars/avatar1.png";
import avatarTwo from "../../assets/public/avatars/avatar2.png";
import avatarThree from "../../assets/public/avatars/avatar3.png";
import avatarFour from "../../assets/public/avatars/avatar4.png";

const float = (delay) => ({
  animate: { y: [0, -12, 0] },
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
});

const Hero = () => {
  const nav = useNavigate();

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
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
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
                <small>Subject taken</small>
                <strong>4</strong>
              </div>
              <div className="ex-hero__stat">
                <small>Total question</small>
                <strong>160</strong>
              </div>
              <div className="ex-hero__stat">
                <small>Top Subject</small>
                <strong>86%</strong>
              </div>
            </div>

            <div className="ex-hero__pieChart">
              <div
                className="ex-hero__doughnut"
                style={{
                  background: `conic-gradient(var(--ex-brand) 0% 78%, var(--ex-surface-2) 78% 100%)`,
                }}
              >
                <div className="ex-hero__doughnut-inner">
                  <strong>78%</strong>
                  <small>Avg. Score</small>
                </div>
              </div>
            </div>

            <div className="ex-hero__subjects">
              {[
                { s: "English", v: 78 },
                { s: "Physics", v: 64 },
                { s: "Chemistry", v: 71 },
                { s: "Mathematics", v: 81 },
              ].map((row) => (
                <div className="ex-hero__subjectRow" key={row.s}>
                  <span>{row.s}</span>
                  <div className="ex-hero__track">
                    <motion.div
                      className="ex-hero__fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${row.v}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                  <em>{row.v}%</em>
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
