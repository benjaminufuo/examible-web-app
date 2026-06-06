import { useEffect, useState } from "react";
import "../styles/auth.css";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { FiArrowLeft } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();
  // Enable button when both email and password are filled
  const hasEmail = inputValue.email && inputValue.email.trim().length > 0;
  const hasPassword =
    inputValue.password && inputValue.password.trim().length > 0;
  const isFormValid = hasEmail && hasPassword;
  const isButtonDisabled = !isFormValid || loading || googleLoading;

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    setLoading(true);
    try {
      const res = await studentApi.login(data);
      localStorage.setItem("userToken", res?.data?.token);
      dispatch(setUserToken(res?.data?.token));
      dispatch(setUser(res?.data?.data));
      if (res?.data?.success) {
        toast.success("Login successful!");
        setLoading(false);
        setTimeout(() => {
          if (location.state?.selectedPlan) {
            navigate("/subscription/make-payment", {
              state: {
                selectedPlan: location.state?.selectedPlan,
                amount: location.state?.amount,
              },
              replace: true,
            });
          } else {
            navigate("/overview", { replace: true });
          }
        }, 3000);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const loginGoogleIcon = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate`;
      setGoogleLoading(false);
    }, 1000);
  };

  return (
    <div className="ex-scope auth-wrapper">
      <div className="auth-side">
        <div className="auth-side-content">
          <div className="auth-side-title">Welcome Back</div>
          <p className="auth-side-text">
            Ace your JAMB, WAEC, and NECO exams with AI-powered learning and
            real CBT practice.
          </p>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>AI Tutor that adapts to your learning style</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Real CBT Mock Exams with live proctoring</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Gamified learning with leaderboards & rewards</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Detailed performance analytics & insights</div>
          </div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <button
            className="auth-back-btn"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
          >
            <FiArrowLeft />
          </button>
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="Examible" />
            </div>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-subtitle">
              Continue your exam preparation journey
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={(e) => handleSubmit(e, inputValue)}
          >
            <div className="auth-form-group">
              <Input
                label="Email"
                type="email"
                name="email"
                onChange={handleChange}
                value={inputValue.email}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="auth-form-group">
              <Input
                label="Password"
                name="password"
                onChange={handleChange}
                value={inputValue.password}
                placeholder="Enter your password"
                required
                isPassword
              />
            </div>

            <div className="auth-checkbox-group">
              <div className="auth-checkbox">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className="auth-forgot-link">
                <a
                  onClick={() => navigate("/forgetpassword")}
                  style={{ cursor: "pointer" }}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={isButtonDisabled}
              fullWidth
              className="auth-submit"
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="auth-divider">Or continue with</div>

          <Button
            IconComponent={FcGoogle}
            iconProps={{ className: "googleIcon" }}
            variant="secondary"
            fullWidth
            onClick={() => loginGoogleIcon()}
            disabled={loading || googleLoading}
            loading={googleLoading}
          >
            {googleLoading ? "Connecting..." : "Google"}
          </Button>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => navigate("/signup")}
              style={{ cursor: "pointer" }}
            >
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
