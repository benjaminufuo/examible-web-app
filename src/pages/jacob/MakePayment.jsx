import React, { useState } from "react";
import "../../styles/dashboardCss/makepayment.css";
import payment from "../../assets/public/payment.png";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import { setReference } from "../../global/slice";

const MakePayment = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log(user);
  const dispatch = useDispatch();

  const location = useLocation();
  const { amount, plan } = location.state || {};

  const koraPayPaymentIntegration = async (e, amount, email, name, plan) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/initializeKoraPay`,
        { amount, email, name, plan }
      );
      if (response?.status === 200) {
        dispatch(setReference(response?.data?.data?.reference));
        setTimeout(() => {
          window.location.href = response?.data?.data?.checkout_url;
        }, 500);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <main className="makepaymentmain">
      <section className="makepaymenttop">
        <div className="makeleftdiv">
          <div className="backtosubscription">
            <IoIosArrowRoundBack
              size={40}
              onClick={() => navigate("/dashboard/subscription")}
            />
          </div>
          <div className="makepaymenttext">
            <h1 className="makepaymentheader">Make Payment</h1>
          </div>
          <div className="odername">
            <span className="odername1">Name</span>
            <span className="odername1">{user?.fullName}</span>
          </div>
          <div className="odercode">
            <span className="code">Plan</span>
            <span className="code">{plan}</span>
          </div>
          <div className="oderemail">
            <span className="oderemail1">Email</span>
            <span className="oderemail1">{user?.email}</span>
          </div>
          <div className="oderamout">
            <span className="oderamout1">Amount</span>
            <span className="oderamout1">₦{amount}</span>
          </div>
        </div>
        <div className="makerightdiv">
          <img src={payment} />
        </div>
      </section>
      <div className="instantactivation">
        <h1 className="instanttext">Instant Activation</h1>
      </div>
      <div className="onlinepaymentdiv">
        <span className="onlinepayment">
          Pay online with your ATM card, for fast process of products & services
        </span>
      </div>
      <div className="makepaymentbtn">
        <button
          className="korapayment"
          onClick={(e) =>
            koraPayPaymentIntegration(
              e,
              amount,
              user?.email,
              user?.fullName,
              plan
            )
          }
        >
          Subscribe
        </button>
      </div>
    </main>
  );
};

export default MakePayment;
