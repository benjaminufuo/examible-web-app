import { FiUserPlus, FiSliders, FiEdit3, FiTrendingUp } from "react-icons/fi";
import Reveal from "./Reveal";

const steps = [
  { Icon: FiUserPlus, title: "Create your account", desc: "Sign up in seconds and tell us which exams you're preparing for." },
  { Icon: FiSliders, title: "Get your study plan", desc: "We build an adaptive plan based on your goals and current level." },
  { Icon: FiEdit3, title: "Practice realistically", desc: "Take CBT mocks and past questions with your AI tutor on standby." },
  { Icon: FiTrendingUp, title: "Track and improve", desc: "Watch analytics reveal progress and guide your next study session." },
];

const HowItWorks = () => {
  return (
    <section className="ex-section ex-how" id="how-it-works">
      <div className="ex-container">
        <div className="ex-section-head">
          <span className="ex-eyebrow">How it works</span>
          <h2 className="ex-h2">
            From sign-up to <span className="ex-gradient-text">exam-ready</span> in four steps
          </h2>
        </div>

        <div className="ex-how__grid">
          {steps.map((s, i) => (
            <Reveal key={s.title} className="ex-how__step" delay={i * 0.1}>
              <span className="ex-how__num">{`0${i + 1}`}</span>
              <span className="ex-how__icon">
                <s.Icon size={22} />
              </span>
              <h3 className="ex-h3">{s.title}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
