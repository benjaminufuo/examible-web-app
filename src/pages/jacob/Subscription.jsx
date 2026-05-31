import "../../styles/dashboardCss/subscription.css";
import { FaCircleCheck } from "react-icons/fa6";
import wallet from "../../assets/public/wallet.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const plans = [
  {
    title: "Freemium",
    price: null,
    description:
      "Start for free: explore Examible core features without PAYING A DIME. Upgrade anytime for full access.",
    link: "FREEMIUM PLAN HERE",
    benefits: [
      "Limited access to past Jamb Questions (e.g. 2015 - 2017 past questions)",
      "10 minutes free mock exam",
      "Can't remove chosen subject",
    ],
  },
  {
    title: "Yearly",
    price: 5000,
    displayPrice: "₦5,000",
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
    button: "Monthly →",
  },
  {
    title: "Monthly",
    price: 500,
    displayPrice: "₦500",
    sub: "/ Monthly / Student",
    description:
      "Subscribe to the MONTHLY PLAN and enjoy Unlimited access to all Examible features for 30 days.",
    benefits: [
      "Full access to all Jamb Past questions",
      "Full access to Mock Exam",
      "Access to choose and remove subject",
      "Study recommendation",
    ],
    button: "Yearly →",
  },
];

const Plans = () => {
  const nav = useNavigate();
  const user = useSelector((state) => state.user);
  const currentPlan = user.plan;

  const handleChoosePlan = (amount, plan) => {
    nav("/subscription/make-payment", { state: { amount, plan } });
  };
  return (
    <div className="sub-plans-main">
      <div className="sub-plans-header-bg">
        <div className="sub-plans-header-content">
          <div className="sub-plans-header-text">
            <h2>
              Choose the <span className="sub-highlight">Perfect Plan</span>
              <br /> to Elevate Your Performance <br />
              and Achieve Your Goals.
            </h2>
          </div>
          <div className="sub-wallet-container">
            <img src={wallet} alt="wallet" className="sub-plans-wallet-img" />
          </div>
        </div>
      </div>
      <div className="sub-plans-cards">
        {plans.map((plan) => (
          <div className={`sub-plan-card sub-${plan.title.toLowerCase()}-card`}>
            <div
              className="sub-plan-title"
              style={{
                backgroundColor:
                  plan.title === "Freemium"
                    ? "#804BF2"
                    : plan.title === "Yearly"
                      ? "#fff"
                      : plan.title === "Monthly"
                        ? "#804BF2"
                        : "",
                color:
                  plan.title === "Freemium"
                    ? "#fff"
                    : plan.title === "Yearly"
                      ? "#804BF2"
                      : plan.title === "Monthly"
                        ? "#fff"
                        : "",
              }}
            >
              {plan.title.toUpperCase()}
            </div>
            <div
              className="sub-plan-desc"
              style={{
                color:
                  plan.title === "Freemium"
                    ? "#1E1E1E"
                    : plan.title === "Yearly"
                      ? "#FFF"
                      : plan.title === "Monthly"
                        ? "#1E1E1E"
                        : "",
              }}
            >
              {plan.description}
            </div>
            {plan.link && <span className="sub-plan-link">{plan.link}</span>}
            <div className="sub-plan-price">
              <span
                className="sub-price"
                style={{
                  color:
                    plan.title === "Freemium"
                      ? "#fff"
                      : plan.title === "Yearly"
                        ? "#fff"
                        : plan.title === "Monthly"
                          ? "#804BF2"
                          : "",
                }}
              >
                {plan.displayPrice || plan.price}
              </span>
              {plan.sub && (
                <span
                  className="sub-plan-sub"
                  style={{
                    color:
                      plan.title === "Freemium"
                        ? "#1E1E1E"
                        : plan.title === "Yearly"
                          ? "#FFF"
                          : plan.title === "Monthly"
                            ? "#1E1E1E"
                            : "",
                  }}
                >
                  {plan.sub}
                </span>
              )}
            </div>
            <div className="sub-benefit">
              <span
                style={{
                  color:
                    plan.title === "Freemium"
                      ? "#1E1E1E"
                      : plan.title === "Yearly"
                        ? "#FFF"
                        : plan.title === "Monthly"
                          ? "#1E1E1E"
                          : "",
                }}
              >
                Benefits
              </span>
            </div>
            <ul className="sub-plan-benefits">
              {plan.benefits.map((benefit, i) => (
                <li key={i}>
                  <FaCircleCheck
                    size={15}
                    className="sub-checkmark"
                    style={{
                      color:
                        plan.title === "Freemium"
                          ? "#804BF2"
                          : plan.title === "Yearly"
                            ? "#FFF"
                            : plan.title === "Monthly"
                              ? "#804BF2"
                              : "",
                    }}
                  />
                  <span
                    className="sub-benefit-text"
                    style={{
                      color:
                        plan.title === "Freemium"
                          ? "#1E1E1E"
                          : plan.title === "Yearly"
                            ? "#FFF"
                            : plan.title === "Monthly"
                              ? "#1E1E1E"
                              : "",
                    }}
                  >
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
            {plan.button && (
              <button
                className={`sub-plan-btn sub-${plan.title.toLowerCase()}-btn`}
                onClick={() => handleChoosePlan(plan.price, plan.title)}
                disabled={currentPlan === plan.title}
              >
                {plan.button}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;
