import { useState, useEffect } from "react";
import "../../styles/authCss/resetpassword.css";
import logo from "../../assets/public/logo.png";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import { FiArrowLeft } from "react-icons/fi";

const PasswordResetPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [inputValue, setInputValue] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  function validatePassword(inputValue) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#;:_^'()<>=+/"|,{}[\]¬`£~-])[A-Za-z\d@$!%*?&.#;:_^'()<>=+/"|,{}[\]¬`£~-]{8,}$/;
    return passwordRegex.test(inputValue);
  }
  const validateField = (name, value) => {
    let error = "";
    if (name === "newPassword") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6 || value.length > 60) {
        error = "Password should be between 6 and 60 characters";
      } else if (!validatePassword(value)) {
        error =
          "Your password must contain an upper case, a lowercase, a special character and a number";
      } else if (value === inputValue.confirmPassword) {
        setErrorMessage({ ...errorMessage, confirmPassword: "" });
      }
    }

    if (name === "confirmPassword") {
      if (value !== inputValue.newPassword) {
        error = "Passwords do not match";
      }
    }
    setErrorMessage((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
    setErrorMessage((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    if (!disabled) {
      try {
        const res = await studentApi.resetPassword(token, data);
        setLoading(false);
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const { newPassword, confirmPassword } = inputValue;
    if (
      validatePassword(newPassword) &&
      newPassword.trim() !== "" &&
      newPassword.length >= 6 &&
      newPassword.length <= 60 &&
      confirmPassword.trim() !== "" &&
      newPassword === confirmPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputValue]);

  return (
    <div className="ex-scope reset-wrapper">
      {/* LEFT SIDE: Brand Experience */}
      <div className="reset-side">
        <div className="reset-side-content">
          <div className="reset-side-title">Secure Your Account</div>
          <p className="reset-side-text">
            You're one step away from getting back to your learning journey.
            Create a strong password to continue preparing for success.
          </p>
          <div className="reset-side-feature">
            <div className="reset-side-feature-icon">✓</div>
            <div>Use at least 8 characters</div>
          </div>
          <div className="reset-side-feature">
            <div className="reset-side-feature-icon">✓</div>
            <div>Include uppercase & lowercase letters</div>
          </div>
          <div className="reset-side-feature">
            <div className="reset-side-feature-icon">✓</div>
            <div>Add numbers and special characters</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Reset Form */}
      <div className="reset-container">
        <div className="reset-card">
          <button
            className="reset-back-btn"
            onClick={() => navigate("/")}
            aria-label="Go to homepage"
          >
            <FiArrowLeft />
          </button>

          <div className="reset-header">
            <div className="reset-logo">
              <img src={logo} alt="Examible" />
            </div>
            <h1 className="reset-title">Create a new password</h1>
            <p className="reset-subtitle">
              Your new password must be different from your previously used
              passwords.
            </p>
          </div>

          <form
            className="reset-form"
            onSubmit={(e) => handleSubmit(e, inputValue)}
          >
            <div className="reset-form-group">
              <Input
                name="newPassword"
                label="New Password"
                onChange={handleChange}
                value={inputValue.newPassword}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Enter new password"
                required
                isPassword
                error={errorMessage.newPassword}
              />
            </div>

            <div className="reset-form-group">
              <Input
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleChange}
                value={inputValue.confirmPassword}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Confirm your password"
                required
                isPassword
                error={errorMessage.confirmPassword}
              />
            </div>

            <Button
              type="submit"
              disabled={disabled}
              loading={loading}
              fullWidth
              className="reset-submit"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
