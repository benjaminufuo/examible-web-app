import mail from "../assets/public/mail.png";
import logo from "../assets/public/logo.png";
import "../styles/authCss/emailverify.css";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  return (
    <div className="ex-scope email-verify-wrapper">
      {/* LEFT SIDE: Brand Experience */}
      <div className="email-verify-side">
        <div className="email-verify-side-content">
          <div className="email-verify-side-title">Ready for 300+?</div>
          <p className="email-verify-side-text">
            Your account is verified and ready to go. Join thousands of students
            acing their exams with Examible.
          </p>
          <div className="email-verify-side-feature">
            <div className="email-verify-side-feature-icon">✓</div>
            <div>Access to premium mock exams</div>
          </div>
          <div className="email-verify-side-feature">
            <div className="email-verify-side-feature-icon">✓</div>
            <div>AI-powered performance insights</div>
          </div>
          <div className="email-verify-side-feature">
            <div className="email-verify-side-feature-icon">✓</div>
            <div>Track your progress effortlessly</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Verification Success */}
      <div className="email-verify-container">
        <div className="email-verify-card" style={{ textAlign: "center" }}>
          <div className="email-verify-header">
            <div className="email-verify-logo">
              <img src={logo} alt="Examible" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src={mail}
              alt="Email Verified"
              style={{ width: "120px", height: "auto" }}
            />
          </div>

          <h1 className="email-verify-title">Email Verified!</h1>
          <p className="email-verify-subtitle" style={{ marginBottom: "32px" }}>
            Let’s hit that 300+ goal. Your email has been successfully verified.
          </p>

          <button
            className="email-verify-submit"
            onClick={() => navigate("/login")}
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
