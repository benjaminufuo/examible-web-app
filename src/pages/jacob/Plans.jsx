import "../../styles/plans.css";
import { FaCircleCheck } from "react-icons/fa6";
import wallet from "../../assets/public/wallet.png";
import { useNavigate } from "react-router";

const plans = [
  {
    title: "FREEMIUM",
    price: "",
    description:
      "Start for free: explore Examible core features without PAYING A DIME. Upgrade anytime for full access.",
    link: "FREEMIUM PLAN HERE",
    benefits: [
      "Limited access to past Jamb Questions (e.g. 2022 - 2023 past questions)",
      "25 minutes free mock exam",
      "Can't remove chosen subject",
    ],
    button: "Get Started →",
  },
  {
    title: "YEARLY",
    price: "₦5,000",
    sub: "/ Year / Student",
    description:
      "Subscribe to the YEARLY PLAN and enjoy unlimited access to all Examible features for FULL 12 MONTHS.",
    benefits: [
      "Full access to Jamb Past Questions",
      "Full access to Mock Exam",
      "Access to choose and remove subject",
      "Access to Examible Bot",
      "Study Recommendations",
    ],
    button: "Get Started →",
  },
  {
    title: "MONTHLY",
    price: "₦500",
    sub: "/ Monthly / Student",
    description:
      "Subscribe to the MONTHLY PLAN and enjoy Unlimited access to all Examible features for 30 days.",
    benefits: [
      "Full access to all Jamb Past questions",
      "Full access to Mock Exam",
      "Access to choose and remove subject",
      "Study recommendation",
    ],
    button: "Get Started →",
  },
];

const Plans = () => {
  const nav = useNavigate();
  return (
    <div className="plans-main">
      <div className="plans-header-bg">
        <div className="plans-header-content">
          <div className="plans-header-text">
            <h2>
              Choose the <span className="highlight">Perfect Plan</span>
              <br /> to Elevate Your Performance <br />
              and Achieve Your Goals.
            </h2>
          </div>
          <div className="wallet-container">
            <img src={wallet} alt="wallet" className="plans-wallet-img" />
          </div>
        </div>
      </div>
      <div className="plans-cards">
        {plans.map((plan) => (
          <div className={`plan-card ${plan.title.toLowerCase()}-card`}>
            <div
              className="plan-title"
              style={{
                backgroundColor:
                  plan.title === "FREEMIUM"
                    ? "#804BF2"
                    : plan.title === "YEARLY"
                    ? "#fff"
                    : plan.title === "MONTHLY"
                    ? "#804BF2"
                    : "",
                color:
                  plan.title === "FREEMIUM"
                    ? "#fff"
                    : plan.title === "YEARLY"
                    ? "#804BF2"
                    : plan.title === "MONTHLY"
                    ? "#fff"
                    : "",
              }}
            >
              {plan.title}
            </div>
            <div
              className="plan-desc"
              style={{
                color:
                  plan.title === "FREEMIUM"
                    ? "#1E1E1E"
                    : plan.title === "YEARLY"
                    ? "#FFF"
                    : plan.title === "MONTHLY"
                    ? "#1E1E1E"
                    : "",
              }}
            >
              {plan.description}
            </div>
            {plan.link && <span className="plan-link">{plan.link}</span>}
            <div className="plan-price">
              <span
                className="price"
                style={{
                  color:
                    plan.title === "FREEMIUM"
                      ? "#fff"
                      : plan.title === "YEARLY"
                      ? "#fff"
                      : plan.title === "MONTHLY"
                      ? "#804BF2"
                      : "",
                }}
              >
                {plan.price}
              </span>
              {plan.sub && (
                <span
                  className="sub"
                  style={{
                    color:
                      plan.title === "FREEMIUM"
                        ? "#1E1E1E"
                        : plan.title === "YEARLY"
                        ? "#FFF"
                        : plan.title === "MONTHLY"
                        ? "#1E1E1E"
                        : "",
                  }}
                >
                  {plan.sub}
                </span>
              )}
            </div>
            <div className="benefit">
              <span
                style={{
                  color:
                    plan.title === "FREEMIUM"
                      ? "#1E1E1E"
                      : plan.title === "YEARLY"
                      ? "#FFF"
                      : plan.title === "MONTHLY"
                      ? "#1E1E1E"
                      : "",
                }}
              >
                Benefits
              </span>
            </div>
            <ul className="plan-benefits">
              {plan.benefits.map((benefit, i) => (
                <li key={i}>
                  <FaCircleCheck
                    size={15}
                    className="checkmark"
                    style={{
                      color:
                        plan.title === "FREEMIUM"
                          ? "#804BF2"
                          : plan.title === "YEARLY"
                          ? "#FFF"
                          : plan.title === "MONTHLY"
                          ? "#804BF2"
                          : "",
                    }}
                  />
                  <span
                    className="benefit-text"
                    style={{
                      color:
                        plan.title === "FREEMIUM"
                          ? "#1E1E1E"
                          : plan.title === "YEARLY"
                          ? "#FFF"
                          : plan.title === "MONTHLY"
                          ? "#1E1E1E"
                          : "",
                    }}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
            <button
              className={`plan-btn ${plan.title.toLowerCase()}-btn`}
              onClick={() => nav("/signup")}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
