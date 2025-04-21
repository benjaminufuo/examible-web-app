import React, { useEffect, useState } from "react";
import "../styles/authCss/auth.css";
import { FaFacebook } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/public/legacy_builder_logo.png";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    email: "",
    password: "",
  });
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) {
        errorr = "Email is required";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
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

  const dispatch = useDispatch();
  console.log(inputValue);
  const handleSubmit = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    if (!disabled) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/v1/student/login`,
          data
        );
        dispatch(setUserToken(res?.data?.token));
        dispatch(setUser(res?.data?.data));
        if (res?.status === 200) {
          toast.success("Login successful!");
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard/overview");
          }, 3000);
        }
      } catch (error) {
        if (
          error?.response?.data?.message ===
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ) {
          setErrorMessage({
            ...errorMessage,
            password:
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
          });
        }
        setLoading(false);
        toast.error(error?.response?.data?.message);
      }
    }
  };
  useEffect(() => {
    const { email, password } = inputValue;
    if (email && password.trim() !== "") {
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

  const loginGoogleIcon = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}googleAuthenticate`;
  };

  const loginFacebookIcon = async () => {
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
        <div className="signheader">
          <h1>MEMBER LOGIN</h1>
        </div>
        <form className="form" onSubmit={(e) => handleSubmit(e, inputValue)}>
          <div className="signinput">
            <label className="signuplabel">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={inputValue.email}
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
                type={show ? "text" : "password"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Enter Your Password"
                required
                className="signinputmain1"
              />
              <div className="eyeIcon2" onClick={handleShow}>
                {show ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            {errorMessage.password && (
              <p className="error">{errorMessage.password}</p>
            )}
          </div>
          <div className="rememberme">
            <div className="checkbox">
              <input type="checkbox" className="checkboxtic" />
            </div>
            <label className="rememberlabel">Remember Me</label>
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
            {loading ? "loading..." : "Login"}
          </button>
        </form>
        <span className="or-container">
          <div className="line"></div>
          <span className="or">Other login options</span>
          <div className="line"></div>
        </span>
        <article className="socials">
          <FaFacebook
            className="facebookIcon"
            onClick={() => loginFacebookIcon()}
          />
          <FcGoogle className="googleIcon" onClick={() => loginGoogleIcon()} />
        </article>
        <article className="forgotpassworddiv">
          <p
            className="forgotpassword"
            onClick={() => navigate("/forgetpassword")}
          >
            Forgot Password?
          </p>
          <p className="signuptext">
            Don't have an account?
            <span className="signupLink" onClick={() => navigate("/signup")}>
              click here to create one now
            </span>
          </p>
        </article>
      </div>
    </div>
  );
};

export default Login;
