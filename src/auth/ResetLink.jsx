import "../../src/styles/authCss/resetlink.css";
import { CiMail } from "react-icons/ci";
const ResetLink = () => {
  return (
    <main className="resetMain">
      <div className="resetcircle">
        <div className="resetinnercircle"></div>
      </div>
      <div className="resetcircle1">
        <div className="resetinnercircle1"></div>
      </div>
      <div className="resetgoldsmallcircle"></div>
      <div className="resetgoldsmallcircle1"></div>
      <div className="resetcirclepurple">
        <div className="resetgoldsmallcircle2"></div>
      </div>
      <section className="resetcontainer">
        <div className="resetheader">
          <h1>Check your email</h1>
          <p>
            We sent you an email with instructions for resetting your password
          </p>
        </div>
        <div className="reseticon">
          <CiMail className="mailIcon" />
        </div>
        <div className="btndiv">
          <button className="restlinkbtn">OK</button>
        </div>
      </section>
    </main>
  );
};

export default ResetLink;
