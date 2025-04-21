import React, { useState, useEffect } from "react";
import "../styles/authCss/auth.css";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/legacy_builder_logo.png";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const validateField = (name, value) => {
    let error = "";
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

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      } else if (value.length < 6 || value.length > 60) {
        error = "Password should be between 6 and 60 characters";
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
    validateField(name, value);
    setErrorMessage({ ...errorMessage, password: "" });
  };
  console.log(inputValue);

  const handleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

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
      password.length >= 6 &&
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
    if (loading) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [loading, setDisabled]);

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    if (!disabled) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/student`,
          data
        );
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
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const googleIcon = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate`;
  };

  const facebookIcon = async () => {
    window.location.href = `${
      import.meta.env.VITE_BASE_URL
    }facebookAuthenticate`;
  };
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
        <img src={logo} onClick={() => navigate("/")} />
      </div>
      <div className="signupForm">
        <div className="header">
          <h1>Sign Up</h1>
          <p>Beat jamb with good grades at one sitting </p>
        </div>
        <form className="form" onSubmit={(e) => handleSubmit(e, inputValue)}>
          <div className="signinput">
            <label className="signuplabel">Full Name</label>
            <input
              name="fullName"
              onChange={handleChange}
              value={inputValue.fullName}
              type="text"
              onBlur={(e) => validateField(e.target.name, e.target.value)}
              placeholder="Enter Your Full Name"
              required
              className="signinputmain"
            />
            {errorMessage.fullName && (
              <p className="error">{errorMessage.fullName}</p>
            )}
          </div>
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
          <div className="signinput">
            <label className="signuplabel">Password</label>
            <div className="inputwrapper">
              <input
                name="password"
                onChange={handleChange}
                value={inputValue.password}
                type={showPassword ? "text" : "password"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Enter Your Password"
                required
                className="signinputmain1"
              />
              <div className="eyeIcon2" onClick={handleShowPassword}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            {errorMessage.password && (
              <p className="error">{errorMessage.password}</p>
            )}
          </div>
          <div className="signinput">
            <label className="signuplabel">Confirm Password</label>
            <div className="inputwrapper">
              <input
                name="confirmPassword"
                onChange={handleChange}
                value={inputValue.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Confirm Password"
                required
                className="signinputmain2"
              />
              <div className="eyeIcon1" onClick={handleShowConfirmPassword}>
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            {errorMessage.confirmPassword && (
              <p className="error">{errorMessage.confirmPassword}</p>
            )}
          </div>
          <div className="alreadyhaveaccount">
            <h1>
              Already have an account?{" "}
              <em onClick={() => navigate("/login")}>
                click here to login now
              </em>
            </h1>
          </div>
          <button
            type="submit"
            className="signupbtn"
            disabled={disabled}
            style={{
              backgroundColor: disabled ? "#dbd2f0d2" : "#804bf2",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "loading..." : "Join For Free"}
          </button>
        </form>
        <span className="or-container">
          <div className="line"></div>
          <span className="or">or</span>
          <div className="line"></div>
        </span>
        <article className="socials">
          <FaFacebook className="facebookIcon" onClick={facebookIcon} />
          <FcGoogle className="googleIcon" onClick={googleIcon} />
        </article>
      </div>
    </div>
  );
};

export default SignUp;
