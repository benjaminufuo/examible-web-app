import mail from "../assets/public/mail.png";
import "../styles/authCss/emailverify.css";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  return (
    <main className="emailverifymain">
      <div className="emailverifycomponent">
        <div className="mailimagediv">
          <img src={mail} />
        </div>
        <div className="emailverifytextdiv">
          <h1 className="emailverifytext">
            Email verified!
            <br /> Let’s hit that 300+ goal
          </h1>
        </div>
        <div className="emailverifybtn">
          <button onClick={() => navigate("/login")}>Login Now</button>
        </div>
      </div>
    </main>
  );
};

export default EmailVerify;
