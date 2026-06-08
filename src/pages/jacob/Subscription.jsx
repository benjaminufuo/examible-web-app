import "../../styles/dashboardCss/subscription.css";
import "../../styles/dashboardCss/dashboard-components.css";
import { FiCheck } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import wallet from "../../assets/public/wallet.png";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { setUser } from "../../global/slice";

const plans = [
  {
    title: "Freemium",
    price: null,
    displayPrice: "Free",
    sub: "Forever",
    description:
      "Start for free: explore Examible core features without PAYING A DIME. Upgrade anytime for full access.",
    benefits: [
      "Limited access to past Jamb Questions (e.g. 2015 - 2017 past questions)",
      "10 minutes free mock exam",
      "Can't remove chosen subject",
    ],
    featured: false,
  },
  {
    title: "Yearly",
    price: 5000,
    displayPrice: "₦5,000",
    sub: "/ year / student",
    description:
      "Subscribe to the YEARLY PLAN and enjoy unlimited access to all Examible features for FULL 12 MONTHS.",
    benefits: [
      "Full access to Jamb Past Questions",
      "Full access to Mock Exam",
      "Access to choose and remove subject",
      "Access to Examible Bot",
      "Study Recommendations",
    ],
    featured: true,
  },
  {
    title: "Monthly",
    price: 500,
    displayPrice: "₦500",
    sub: "/ month / student",
    description:
      "Subscribe to the MONTHLY PLAN and enjoy Unlimited access to all Examible features for 30 days.",
    benefits: [
      "Full access to all Jamb Past questions",
      "Full access to Mock Exam",
      "Access to choose and remove subject",
      "Study recommendation",
    ],
    featured: false,
  },
];

const Plans = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const currentPlan = user?.plan || "Freemium"; // Default fallback with optional chaining
  const [loading, setLoading] = useState(false);

  const handleChoosePlan = (e, amount, plan) => {
    e.preventDefault();
    nav("/subscription/make-payment", { state: { amount, plan } });
  };

  const handleDowngrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Canceling subscription...");
    try {
      // Adjust this endpoint string to match your actual backend route!
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/cancelSubscription/${user?._id || user?.id}`,
      );
      if (res?.data?.success) {
        toast.success(
          res?.data?.message || "Successfully downgraded to Freemium.",
        );
        dispatch(setUser(res?.data?.data)); // Updates the active plan in the UI instantly
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to cancel subscription.",
      );
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div
      className="sub-premium-main"
      style={{ width: "100%", padding: "32px", boxSizing: "border-box" }}
    >
      <motion.div
        className="dashboard-hero-section fade-in"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="hero-content">
          <h1 className="hero-greeting">
            Choose the <span>Perfect Plan</span>
          </h1>
          <p className="hero-subtext">
            Elevate your performance and achieve your goals with full access to
            all Examible premium features.
          </p>
        </div>
        <div className="hero-image">
          <img src={wallet} alt="Wallet" style={{ maxHeight: "250px" }} />
        </div>
      </motion.div>

      <motion.div
        className="sub-pricing-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {plans.map((plan) => {
          const isActive = currentPlan === plan.title;

          return (
            <motion.div
              key={plan.title}
              className={`sub-pricing-card ${plan.featured ? "is-featured" : ""}`}
              variants={itemVariants}
            >
              {isActive ? (
                <span className="sub-pricing-tag active-plan">
                  <FaCheckCircle style={{ marginRight: "6px" }} /> Active Plan
                </span>
              ) : plan.featured ? (
                <span className="sub-pricing-tag">Most popular</span>
              ) : null}

              <h3 className="sub-pricing-name">{plan.title}</h3>
              <div className="sub-pricing-price">
                <strong>{plan.displayPrice}</strong>
                {plan.sub && <small>{plan.sub}</small>}
              </div>
              <p className="sub-pricing-desc">{plan.description}</p>

              <ul className="sub-pricing-benefits">
                {plan.benefits.map((benefit, i) => (
                  <li key={i}>
                    <FiCheck size={18} />
                    {benefit}
                  </li>
                ))}
              </ul>

              {
                // Render the "Downgrade" button for Freemium
                plan.title !== "Freemium" && (
                  <button
                    className={`sub-pricing-btn ${
                      plan.featured ? "primary" : "outline"
                    }`}
                    onClick={(e) => {
                      handleChoosePlan(e, plan.price, plan.title);
                    }}
                  >
                    {`Upgrade to ${plan.title}`}
                  </button>
                )
              }
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Plans;
