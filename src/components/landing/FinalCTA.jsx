import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Reveal from "./Reveal";

const FinalCTA = () => {
  const nav = useNavigate();

  return (
    <section className="ex-section ex-cta">
      <div className="ex-container">
        <Reveal className="ex-cta__card">
          <div className="ex-cta__glow" aria-hidden="true" />
          <div className="ex-cta__content">
            <span className="ex-eyebrow ex-eyebrow--light">Start today</span>
            <h2 className="ex-cta__title">
              Your highest score is one decision away.
            </h2>
            <p className="ex-cta__sub">
              Join thousands of Nigerian students preparing smarter for JAMB,
              WAEC, and NECO with AI-powered practice and real-time analytics.
            </p>
            <div className="ex-cta__actions">
              <button
                className="ex-btn ex-btn-white ex-btn-lg"
                onClick={() => nav("/signup")}
              >
                Create free account <FiArrowRight size={18} />
              </button>
              <button
                className="ex-btn ex-btn-ghost-light ex-btn-lg"
                onClick={() => {
                  const el = document.getElementById("pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View plans
              </button>
            </div>
            <p className="ex-cta__note">
              No card required · Free practice questions
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCTA;
