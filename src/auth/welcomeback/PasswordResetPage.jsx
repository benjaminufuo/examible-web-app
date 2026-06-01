import { useState, useEffect } from "react";
import "../../styles/authCss/resetpassword.css";
import lock from "../../assets/public/uim_padlock.svg";
import logo from "../../assets/public/logo.png";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import Input from "../../shared/Input";
import Button from "../../shared/Button";

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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#;:_^'\(\)<>=+/"|,{}[\]¬`£~-])[A-Za-z\d@$!%*?&.#;:_^'\(\)<>=+/"|,{}[\]¬`£~-]{8,}$/;
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
      } catch (error) {
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
    <main className="ResetPasswordmain">
      <div className="ResetPasswordcircle">
        <div className="ResetPasswordinnercircle"></div>
      </div>
      <div className="ResetPasswordcircle1">
        <div className="ResetPasswordinnercircle1"></div>
      </div>
      <div className="ResetPasswordgoldsmallcircle"></div>
      <div className="ResetPasswordgoldsmallcircle1"></div>
      <div className="closeicondiv">
        <img src={logo} onClick={() => navigate("/")} />
      </div>
      <section className="ResetPasswordcontainer">
        <div className="ResetPasswordlogocontainer">
          <img src={lock} alt="" className="ResetPasswordplogo" />
        </div>
        <div className="ResetPasswordheader">
          <h1>Create a new password</h1>
          <p>
            Your new password must be different from previously used password
          </p>
        </div>
        <form
          className="resetinputdiv"
          onSubmit={(e) => handleSubmit(e, inputValue)}
        >
          <Input
            name="newPassword"
            label="Password"
            onChange={handleChange}
            value={inputValue.newPassword}
            onBlur={(e) => validateField(e.target.name, e.target.value)}
            placeholder="Enter new password"
            required
            isPassword
            error={errorMessage.newPassword}
          />
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
          <Button type="submit" disabled={disabled} loading={loading} fullWidth>
            {loading ? "Reseting..." : "Reset Password"}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default PasswordResetPage;
