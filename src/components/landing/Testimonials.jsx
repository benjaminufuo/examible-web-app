import { FiStar } from "react-icons/fi";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "Examible's mock exams felt exactly like the real JAMB CBT. By exam day I wasn't nervous at all — I knew the interface and the pacing.",
    name: "Tolu A.",
    role: "Scored 298 in JAMB",
    color: "#804bf2",
  },
  {
    quote:
      "The AI tutor is incredible. Whenever I got a question wrong it explained the reasoning until it actually clicked. My accuracy jumped fast.",
    name: "Amara O.",
    role: "Aspiring medical student",
    color: "#06b6d4",
  },
  {
    quote:
      "The leaderboard kept me coming back every single day. Turning revision into a friendly competition completely changed my study habits.",
    name: "David K.",
    role: "WAEC & JAMB candidate",
    color: "#f2ae30",
  },
];

const Testimonials = () => {
  return (
    <section className="ex-section ex-testi">
      <div className="ex-container">
        <div className="ex-section-head">
          <span className="ex-eyebrow">Loved by students</span>
          <h2 className="ex-h2">
            Real results from <span className="ex-gradient-text">real candidates</span>
          </h2>
        </div>

        <div className="ex-testi__grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} className="ex-testi__card ex-card" delay={i * 0.1}>
              <div className="ex-testi__stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, s) => (
                  <FiStar key={s} size={16} fill="var(--ex-accent-2)" stroke="var(--ex-accent-2)" />
                ))}
              </div>
              <p className="ex-testi__quote">{t.quote}</p>
              <div className="ex-testi__person">
                <span className="ex-testi__avatar" style={{ background: t.color }}>
                  {t.name.charAt(0)}
                </span>
                <div>
                  <strong>{t.name}</strong>
                  <small>{t.role}</small>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
