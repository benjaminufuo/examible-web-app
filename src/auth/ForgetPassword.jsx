import React, { useEffect, useState } from "react";
import "../styles/auth.css";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import Input from "../shared/Input";
import Button from "../shared/Button";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: "",
  });
  const [inputValue, setInputValue] = React.useState({
    email: "",
  });
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (value.length < 6 || value.length > 60) {
        error = "Email should be between 6 and 60 characters";
      } else if (!validateEmail(value)) {
        error = "Please enter a valid email address";
      }
    }
    setErrorMessage((prev) => ({ ...prev, [name]: error }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (!disabled) {
      setLoading(true);
      try {
        const res = await studentApi.forgotPassword(data);
        if (res?.status === 200) {
          toast.info("Password reset link sent to your email!");
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const { email } = inputValue;
    if (email.trim() === "" && validateEmail(email)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [inputValue]);

  useEffect(() => {
    if (loading) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [loading, setDisabled]);

  return (
    <div className="ex-scope auth-wrapper">
      <div className="auth-side">
        <div className="auth-side-content">
          <div className="auth-side-title">Forgot Your Password?</div>
          <p className="auth-side-text">
            No worries! We&apos;ll get you back on track in minutes so you can continue your exam prep.
          </p>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Secure reset link sent to your email</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Military-grade encryption protection</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>Back to studying in under 2 minutes</div>
          </div>
          <div className="auth-side-feature">
            <div className="auth-side-feature-icon">✓</div>
            <div>24/7 support if you need help</div>
          </div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IoMdArrowBack
              onClick={() => navigate("/login")}
              style={{ cursor: 'pointer', fontSize: 24, color: 'var(--ex-text)' }}
            />
          </div>

          <div className="auth-header" style={{ marginBottom: 32 }}>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your email to receive a reset link</p>
          </div>

          <form className="auth-form" onSubmit={(e) => handleSubmit(e, inputValue)}>
            <div className="auth-form-group">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={inputValue.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                error={errorMessage.email}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={disabled}
              fullWidth
              className="auth-submit"
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="auth-footer">
            Back to{" "}
            <a onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>
              login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
