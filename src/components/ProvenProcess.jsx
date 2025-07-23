import "../styles/provenprocess.css";
import one from "../assets/public/Frame 23214.svg";
import two from "../assets/public/Frame 23216.svg";
import three from "../assets/public/Frame 23220.svg";
import four from "../assets/public/Frame 23223.svg";

const ProvenProcess = () => {
  return (
    <>
      <div className="provenmainprocess">
        <div className="createaccount">
          <img src={one} />
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
          <img src={two} />
          <h1 className="provenheader">Access Dashboard</h1>
          <span className="span">
            Upcoming study tasks or mock exams. performance insights.
          </span>
        </div>
        <div className="linecontainer">
          <div className="line1"></div>
        </div>
        <div className="createaccount">
          <img src={three} />
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
          <img src={four} />
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
