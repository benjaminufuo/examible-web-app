import React from "react";
import "../../styles/authCss/welcome.css";
import Group from "../../assets/public/Group.svg";

const Welcome = () => {
  return (
    <main className="welcomeMain">
      <div className="ResetPasswordcircle">
        <div className="ResetPasswordinnercircle"></div>
      </div>
      <div className="ResetPasswordcircle1">
        <div className="ResetPasswordinnercircle1"></div>
      </div>
      <div className="welcomegoldsmallcircle"></div>
      <div className="welcomegoldsmallcircle1"></div>
      <div className="welcomecontainer">
        <div className="wlcomeback">
          <img src={Group} alt="Welcome Group" />
          <h1>Welcome Back</h1>
        </div>
        <div className="hello">
          <span>Hello Eric</span>
          <p>
            We're glad to see you again. Ready to continue your journey to exam
            success?"
          </p>
        </div>
        <div className="btncontainer">
          <button className="welcomebtn">Continue Learning</button>
        </div>
      </div>
    </main>
  );
};

export default Welcome;
