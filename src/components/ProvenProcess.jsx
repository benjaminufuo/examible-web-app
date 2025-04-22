import React from "react";
import "../styles/provenprocess.css";
import { MdDashboard, MdOutlineManageAccounts } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import { FaSuitcase } from "react-icons/fa6";

const ProvenProcess = () => {
  return (
    <>
      <div className="provenmainprocess">
        <div className="createaccount">
          <MdOutlineManageAccounts className="learnicon" />
          <div className="circlezero1container">
            <div className="innerzero1container">
              <h1 className="provennumber">01</h1>
            </div>
          </div>
          <h1 className="provenheader">Account Creation</h1>
          <span className="span">
            New users create an account Returning users log in to access their
            dashboard
          </span>
        </div>
        <div className="linecontainer">
          <div className="line1"></div>
        </div>
        <div className="createaccount">
          <MdDashboard className="learnicon" />
          <div className="circlezero2container">
            <div className="innerzero2container">
              <h1 className="provennumber">02</h1>
            </div>
          </div>
          <h1 className="provenheader">Access Dashboard</h1>
          <span className="span">
            Upcoming study tasks or mock exams. performance insights.
          </span>
        </div>
        <div className="linecontainer">
          <div className="line1"></div>
        </div>
        <div className="createaccount">
          <PiExamFill className="learnicon" />
          <div className="circlezero3container">
            <div className="innerzero3container">
              <h1 className="provennumber">03</h1>
            </div>
          </div>
          <h1 className="provenheader">Take a CBT Mock Exam</h1>
          <span className="span">
            Start the test with a real JAMB-like interface. View instant results
            with detailed explanations after completion.
          </span>
        </div>
        <div className="linecontainer">
          <div className="line1"></div>
        </div>
        <div className="createaccount">
          <FaSuitcase className="learnicon" />
          <div className="circlezero4container">
            <div className="innerzero4container">
              <h1 className="provennumber">04</h1>
            </div>
          </div>
          <h1 className="provenheader">Practice with Past Questions</h1>
          <span className="span">
            Navigate to the Past Questions section. Choose a subject, answer
            questions and check detailed explanations immediately.
          </span>
        </div>
      </div>
    </>
  );
};

export default ProvenProcess;
