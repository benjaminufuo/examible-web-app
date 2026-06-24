import React, { useEffect } from "react";
import "../styles/dashboardCss/payment-success-premium.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaLaptopCode,
  FaBookOpen,
  FaChartLine,
  FaArrowRight,
  FaCrown,
  FaRocket,
} from "react-icons/fa";

const PaymentSuccessfull = ({ plan }) => {
  const nav = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="pay-success-main">
      {/* Ambient Background Glow */}
      <div className="pay-success-ambient"></div>

      <motion.div
        className="pay-success-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Hero Section */}
        <motion.div className="pay-success-hero" variants={itemVariants}>
          <div className="pay-success-icon-wrapper">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <FaCheckCircle className="pay-success-icon" />
            </motion.div>
            <div className="pay-success-icon-pulse"></div>
          </div>
          <h1 className="pay-success-title">Payment Successful 🎉</h1>
          <p className="pay-success-subtitle">
            Your subscription has been activated successfully. Welcome to the
            next level of exam preparation with Examible.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="pay-success-grid">
          {/* Summary Card */}
          <motion.div
            className="pay-success-card summary-card"
            variants={itemVariants}
          >
            <div className="card-header">
              <FaCrown className="header-icon brand" />
              <h3>Subscription Summary</h3>
            </div>
            <div className="summary-details">
              <div className="summary-row">
                <span>Plan</span>
                <strong className="plan-badge">{plan || "Premium"}</strong>
              </div>
              <div className="summary-row">
                <span>Status</span>
                <strong className="status-badge active">Active</strong>
              </div>
              <div className="summary-row">
                <span>Activation Date</span>
                <strong>
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
              </div>
            </div>
          </motion.div>

          {/* Unlocked Features */}
          <motion.div
            className="pay-success-card features-card"
            variants={itemVariants}
          >
            <div className="card-header">
              <FaRocket className="header-icon success" />
              <h3>What You've Unlocked</h3>
            </div>
            <ul className="features-list">
              <li>
                <FaCheckCircle className="feature-check" />
                <span>
                  <strong>Unlimited CBT Practice</strong> - Take as many mock
                  exams as you need.
                </span>
              </li>
              <li>
                <FaCheckCircle className="feature-check" />
                <span>
                  <strong>Premium Past Questions</strong> - Access over 10 years
                  of past questions.
                </span>
              </li>
              <li>
                <FaCheckCircle className="feature-check" />
                <span>
                  <strong>AI Study Assistance</strong> - Get instant, detailed
                  AI explanations.
                </span>
              </li>
              <li>
                <FaCheckCircle className="feature-check" />
                <span>
                  <strong>Performance Analytics</strong> - Track your growth
                  with smart insights.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div className="pay-success-next-steps" variants={itemVariants}>
          <h3>Where to next?</h3>
          <div className="next-steps-grid">
            <button
              className="next-step-btn primary"
              onClick={() => nav("/cbt-mode")}
            >
              <div className="btn-content">
                <FaLaptopCode className="btn-icon" />
                <div className="btn-text">
                  <h4>Start CBT Practice</h4>
                  <p>Take a full mock exam</p>
                </div>
              </div>
              <FaArrowRight className="btn-arrow" />
            </button>
            <button
              className="next-step-btn secondary"
              onClick={() => nav("/past-questions")}
            >
              <div className="btn-content">
                <FaBookOpen className="btn-icon" />
                <div className="btn-text">
                  <h4>Past Questions</h4>
                  <p>Study by topic and year</p>
                </div>
              </div>
              <FaArrowRight className="btn-arrow" />
            </button>
            <button
              className="next-step-btn tertiary"
              onClick={() => nav("/overview")}
            >
              <div className="btn-content">
                <FaChartLine className="btn-icon" />
                <div className="btn-text">
                  <h4>Go to Dashboard</h4>
                  <p>View your learning hub</p>
                </div>
              </div>
              <FaArrowRight className="btn-arrow" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessfull;
