import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal";

const plans = [
  {
    title: "Freemium",
    price: "Free",
    sub: "Forever",
    description: "Explore core Examible features without paying a dime.",
    benefits: [
      "Limited past JAMB questions (2015–2018)",
      "10-minute free mock exam",
      "Core dashboard access",
    ],
    featured: false,
    plan: "Freemium",
    amount: null,
  },
  {
    title: "Yearly",
    price: "₦5,000",
    sub: "/ year / student",
    description:
      "Unlimited access to everything Examible offers for 12 months.",
    benefits: [
      "Full access to JAMB past questions",
      "Unlimited CBT mock exams",
      "Choose and remove subjects",
      "Examible AI tutor",
      "Smart study recommendations",
    ],
    featured: true,
    plan: "Yearly",
    amount: 5000,
  },
  {
    title: "Monthly",
    price: "₦500",
    sub: "/ month / student",
    description: "Unlimited access to all Examible features for 30 days.",
    benefits: [
      "Full access to JAMB past questions",
      "Unlimited CBT mock exams",
      "Choose and remove subjects",
      "Smart study recommendations",
    ],
    featured: false,
    plan: "Monthly",
    amount: 500,
  },
];

const Pricing = () => {
  const nav = useNavigate();

  return (
    <section className="ex-section ex-pricing" id="pricing">
      <div className="ex-container">
        <div className="ex-section-head">
          <span className="ex-eyebrow">Simple pricing</span>
          <h2 className="ex-h2">
            Affordable plans for{" "}
            <span className="ex-gradient-text">every student</span>
          </h2>
          <p className="ex-lead">
            Start free and upgrade whenever you&apos;re ready. No hidden fees —
            just the tools you need to score higher.
          </p>
        </div>

        <div className="ex-pricing__grid">
          {plans.map((p, i) => (
            <Reveal
              key={p.title}
              className={`ex-pricing__card ex-card ${p.featured ? "is-featured" : ""}`}
              delay={i * 0.1}
            >
              {p.featured && (
                <span className="ex-pricing__tag">Most popular</span>
              )}
              <h3 className="ex-pricing__name">{p.title}</h3>
              <div className="ex-pricing__price">
                <strong>{p.price}</strong>
                <small>{p.sub}</small>
              </div>
              <p className="ex-pricing__desc">{p.description}</p>
              <ul className="ex-pricing__benefits">
                {p.benefits.map((b) => (
                  <li key={b}>
                    <FiCheck size={16} />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                className={`ex-btn ex-btn-lg ${p.featured ? "ex-btn-primary" : "ex-btn-outline"}`}
                onClick={() =>
                  nav("/signup", {
                    state: { selectedPlan: p.plan, amount: p.amount },
                  })
                }
              >
                Get started
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
