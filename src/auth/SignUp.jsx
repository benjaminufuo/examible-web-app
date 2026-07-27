import { useState, useEffect } from "react";
import "../styles/auth.css";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/logo.png";
import { toast } from "react-toastify";
import { studentApi } from "../config/studentApi";
import { useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import Input from "../shared/Input";
import { FiArrowLeft } from "react-icons/fi";
import { getGAClientId } from "../utils/analytics";

const SignUp = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [inputValue, setInputValue] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function validatePassword(inputValue) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#;:_^'()<>=+/"|,{}[\]¬`£~-])[A-Za-z\d@$!%*?&.#;:_^'()<>=+/"|,{}[\]¬`£~-]{8,}$/;
    return passwordRegex.test(inputValue);
  }

  const validateField = (name, value) => {
    let error = "";

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 8 || value.length > 60) {
        error = "Password should be between 8 and 60 characters";
      } else if (!validatePassword(value)) {
        error =
          "Your password must contain an upper case, a lowercase, a special character and a number";
      } else if (value === inputValue.confirmPassword) {
        setErrorMessage({ ...errorMessage, confirmPassword: "" });
      } else {
        error = "";
      }
    }

    if (name === "fullName") {
      if (!value.trim()) {
        error = "Full name is required";
      } else if (!value.trim().includes(" ")) {
        error =
          "Full name must include at least two names (e.g., Benjamin Jacob)";
      }
    }
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (value.length < 6 || value.length > 60) {
        error = "Email should be between 6 and 60 characters";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }
    }

    if (name === "confirmPassword") {
      if (value !== inputValue.password) {
        error = "Passwords do not match";
      }
    }

    setErrorMessage((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      setErrorMessage({ ...errorMessage, password: "" });
    }
  };

  const validateEmail = (inputValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputValue);
  };

  useEffect(() => {
    const { fullName, email, password, confirmPassword } = inputValue;
    if (
      fullName.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      password.length >= 8 &&
      password.length <= 60 &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputValue]);

  useEffect(() => {
    const { fullName, email, password, confirmPassword } = inputValue;
    const isFormValid =
      fullName.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      password.length >= 8 &&
      password.length <= 60 &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword;
    if (loading || googleLoading) {
      setDisabled(true);
    } else {
      setDisabled(!isFormValid);
    }
  }, [loading, googleLoading, inputValue]);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (!disabled && !googleLoading) {
      setLoading(true);
      try {
        const res = await studentApi.register({
          ...data,
          clientId: getGAClientId(),
        });
        if (res?.status === 201) {
          toast.success("Signup Successful, Please check your email to verify");
          setLoading(false);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        if (
          error?.response?.data?.message ===
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ) {
          setErrorMessage({ ...errorMessage, password: "" });
        }
        setLoading(false);
      }
    }
  };

  const googleIcon = async () => {
    setGoogleLoading(true);
    setTimeout(() => {
      const params = new URLSearchParams({ clientId: getGAClientId() });
      window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate?${params.toString()}`;
      setGoogleLoading(false);
    }, 1000);
  };

  return (
    <div className="ex-scope auth-wrapper">
      <div className="auth-side">
        <div className="auth-side-content">
          <div className="auth-side-title">
            Prepare Smarter. Perform Better.
          </div>
          <p className="auth-side-text">
            Join 2,600+ students who are acing their exams with AI-powered
            learning and real CBT simulations.
          </p>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Personalized AI tutor that understands you</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Real exam simulation with timed practice</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>No credit card required. Free forever plan</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>30% avg. score improvement in 4 weeks</div>
          </div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <button
            className="auth-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FiArrowLeft />
          </button>
          <div className="auth-header">
            <div
              className="auth-logo"
              aria-label="Examible logo"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="Examible" />
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">
              Get started with your exam prep today
            </p>
          </div>

          <Button
            IconComponent={FcGoogle}
            iconProps={{ className: "googleIcon" }}
            variant="secondary"
            fullWidth
            onClick={googleIcon}
            disabled={loading || googleLoading}
            loading={googleLoading}
          >
            {googleLoading ? "Connecting..." : "Sign up with Google"}
          </Button>

          <div className="auth-divider">Or sign up with email</div>

          <form
            className="auth-form"
            onSubmit={(e) => handleSubmit(e, inputValue)}
          >
            <div className="auth-form-group">
              <Input
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                required
                placeholder="John Doe"
                value={inputValue.fullName}
                error={errorMessage.fullName}
                type="text"
                onBlur={(e) => validateField(e.target.name, e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <Input
                label="Email"
                name="email"
                onChange={handleChange}
                required
                placeholder="your@email.com"
                value={inputValue.email}
                error={errorMessage.email}
                type="email"
                onBlur={(e) => validateField(e.target.name, e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <Input
                label="Password"
                name="password"
                onChange={handleChange}
                required
                placeholder="Enter password"
                value={inputValue.password}
                error={errorMessage.password}
                isPassword
                onBlur={(e) => validateField(e.target.name, e.target.value)}
              />
            </div>

            <div className="auth-form-group">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                value={inputValue.confirmPassword}
                error={errorMessage.confirmPassword}
                isPassword
                onBlur={(e) => validateField(e.target.name, e.target.value)}
              />
            </div>

            <p className="auth-terms">
              By creating an account, you agree to our{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policies
              </a>{" "}
              and{" "}
              <a
                href="/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </p>

            <Button
              loading={loading}
              type="submit"
              disabled={disabled || googleLoading}
              fullWidth
              className="auth-submit"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              Log in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
