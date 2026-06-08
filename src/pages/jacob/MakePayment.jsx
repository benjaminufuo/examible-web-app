import { useEffect, useState } from "react";
import "../../styles/dashboardCss/dashboard-components.css";
import "../../styles/dashboardCss/makepayment.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLock, FiCheckCircle, FiShield, FiCreditCard } from "react-icons/fi";
import { paymentApi } from "../../config/paymentApi";

const MakePayment = () => {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const { amount, plan } = location.state || {};

  const koraPayPaymentIntegration = async (e, amount, email, name) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await paymentApi.initializePayment({
        amount: amount,
        plan,
      });
      if (response?.data?.success) {
        setTimeout(() => {
          window.location.href = response?.data?.data?.checkout_url;
        }, 500);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisabled(loading);
  }, [loading]);

  // Map dynamic benefits based on the selected plan
  const planBenefits = {
    Yearly: [
      "Full access to JAMB past questions",
      "Unlimited CBT mock exams",
      "Choose and remove subjects",
      "Examible AI tutor",
      "Smart study recommendations",
    ],
    Monthly: [
      "Full access to JAMB past questions",
      "Unlimited CBT mock exams",
      "Choose and remove subjects",
      "Smart study recommendations",
    ],
  };

  const benefitsList = planBenefits[plan] || planBenefits.Monthly;

  return (
    <main className="checkout-premium-main fade-in">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)} className="checkout-back-btn">
          <IoIosArrowRoundBack size={24} /> Back
        </button>
        <h2>Secure Checkout</h2>
      </div>

      <div className="checkout-grid">
        {/* Left Column: Subscription Summary */}
        <motion.div
          className="checkout-summary-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="checkout-summary-card">
            <span className="checkout-eyebrow">Order Summary</span>
            <h3>{plan} Plan</h3>
            <div className="checkout-price">
              <strong>₦{amount?.toLocaleString() || "0"}</strong>
              <small>{plan === "Yearly" ? "/ year" : "/ month"}</small>
            </div>

            <div className="checkout-benefits">
              <h4>What's included:</h4>
              <ul>
                {benefitsList.map((benefit, index) => (
                  <li key={index}>
                    <FiCheckCircle /> {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Payment Experience */}
        <motion.div
          className="checkout-payment-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="checkout-payment-card">
            <div className="checkout-payment-header">
              <h3>Payment Details</h3>
              <div className="trust-badges">
                <FiShield /> <span>Secure 256-bit SSL</span>
              </div>
            </div>

            <div className="checkout-user-details">
              <div className="detail-row">
                <span>Name</span>
                <strong>{user?.fullName}</strong>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <strong>{user?.email}</strong>
              </div>
            </div>

            <div className="checkout-total-row">
              <span>Total to pay</span>
              <strong>₦{amount?.toLocaleString() || "0"}</strong>
            </div>

            <button
              className={`checkout-pay-btn ${loading ? "loading" : ""}`}
              onClick={(e) =>
                koraPayPaymentIntegration(
                  e,
                  amount,
                  user?.email,
                  user?.fullName,
                  plan,
                )
              }
              disabled={disabled}
            >
              {loading ? (
                "Processing Payment..."
              ) : (
                <>
                  <FiLock /> Pay ₦{amount?.toLocaleString()} Securely
                </>
              )}
            </button>

            <p className="checkout-guarantee">
              <FiCreditCard /> Instant activation. Cancel anytime.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default MakePayment;
