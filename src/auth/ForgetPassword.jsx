import React from "react";
import "../styles/authCss/auth.css";
import { IoMdArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState({
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
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/forgot_password/student`,
          data
        );
        if (res?.status === 200) {
          toast.info("Password reset link sent to your email!");
        }
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }
    }
  };
  React.useEffect(() => {
    const { email } = inputValue;
    if (email.trim() !== "" && validateEmail(email)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputValue]);

  return (
    <div className="signupMain">
      <div className="circle">
        <div className="innercircle"></div>
      </div>
      <div className="circle1">
        <div className="innercircle1"></div>
      </div>
      <div className="goldsmallcircle"></div>
      <div className="goldsmallcircle1"></div>
      <div className="closeicondiv">
        <IoMdArrowBack
          className="closeIcon"
          onClick={() => navigate("/login")}
        />
      </div>
      <div className="signupForm">
        <div className="signheader">
          <h1>FORGET PASSWORD</h1>
        </div>
        <form className="form" onSubmit={(e) => handleSubmit(e, inputValue)}>
          <div className="signinput">
            <label className="signuplabel">Email</label>
            <input
              name="email"
              onChange={handleChange}
              value={inputValue.email}
              type="email"
              onBlur={(e) => validateField(e.target.name, e.target.value)}
              placeholder="Enter Your Email"
              required
              className="signinputmain"
            />
            {errorMessage.email && (
              <p className="error">{errorMessage.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="forgetbtn"
            disabled={disabled}
            style={{
              backgroundColor: disabled ? "#dbd2f0d2" : "#804bf2",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Send password Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
