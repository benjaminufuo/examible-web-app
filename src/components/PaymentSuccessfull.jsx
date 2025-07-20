import React from "react";
import "../styles/dashboardCss/paymentSuccessful.css";
import { useNavigate } from "react-router-dom";

const PaymentSuccessfull = ({ plan }) => {
  const nav = useNavigate();
  return (
    <div className="paymentSuccessful">
      <div className="paymentSuccessful-holder">
        <article></article>
        <main>
          <section>
            <h3>Payment Successful</h3>
            <p>
              You have been upgraded to {plan}! <br />
              Explore more with Examible.
            </p>
            <button onClick={() => nav("/dashboard/overview")}>
              Return to Dashboard
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PaymentSuccessfull;
