import React from "react";
import "../../styles/authCss/welcome.css";
import Group from "../../assets/public/Group.svg";

const Congratulation = () => {
  return (
    <main className="welcomeMain">
      <div className="circle">
        <div className="innercircle"></div>
      </div>
      <div className="circle1">
        <div className="innercircle1"></div>
      </div>
      <div className="goldsmallcircle"></div>
      <div className="goldsmallcircle1"></div>
      <div className="welcomecontainer">
        <div className="wlcomeback">
          <img src={Group} alt="Welcome Group" />
          <h1>Congratulation</h1>
        </div>
        <div className="hello">
          <span>Hello Eric</span>
          <p>
            We're glad that you are now one of us. Ready to continue your
            journey to exam success?"
          </p>
        </div>
        <div className="btncontainer">
          <button className="welcomebtn">Continue Learning</button>
        </div>
      </div>
    </main>
  );
};

export default Congratulation;
