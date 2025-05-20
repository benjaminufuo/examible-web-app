import React, { useState } from "react";
import "../../styles/dashboardCss/subscription.css";
import MonthlyPayment from "../jacob/MonthlyPayment";
import YearlyPayment from "../jacob/YearlyPayment";
// import { useDispatch, useSelector } from "react-redux";
// import { setToggle } from "../../global/slice";
const Subscription = () => {
  // const toggle = useSelector((state) => state.toggle);

  // const dispatch = useDispatch();

  // const handleToggle = (isYearly) => {
  //   if (toggle !== isYearly) {
  //     dispatch(setToggle(isYearly));
  //   }
  // };
  return (
    <main className="subscriptionmain">
      <div className="sebcontainer">
        <div className="subdivheader">
          <h1>Payment Plan</h1>
          <span>
            Your Path to <em>300+</em> Starts Here: <br /> Select a Plan
          </span>
        </div>
        {/* <div className="togglebutton">
          <button
            className={`toggle-btn ${toggle ? "inactive" : "active"}`}
            onClick={() => handleToggle(false)}
            style={{ marginRight: "auto" }}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${toggle ? "active" : "inactive"}`}
            onClick={() => handleToggle(true)}
            style={{ marginLeft: "auto" }}
          >
            Yearly
          </button>
        </div> */}
        <YearlyPayment />
        {/* <MonthlyPayment /> */}

        <div className="subfootercontainer">
          <div className="subfooter">
            <span>
              Try our Basic Plan at no cost, or upgrade to our Exam Ready Plan
              for the ultimate JAMB prep experience. Get full access to past
              questions, mock exams, and smart study tools – all at the best
              value for your money.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Subscription;
