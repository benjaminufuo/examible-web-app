import React, { useState, useEffect } from "react";
import "../../styles/authCss/resetpassword.css";
import lock from "../../assets/uim_padlock.svg";
import logo from "../../assets/public/legacy_builder_logo.png";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const {token} = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

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
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.]).{6,20}$/;
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
      } else if(value === inputValue.confirmPassword){
        setErrorMessage({...errorMessage,confirmPassword:''})
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
    validateField(name, value);
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    if (!disabled) {
      try {
        const res = await axios.post(
          `${
            import.meta.env.VITE_BASE_URL
          }api/v1/reset_password/student/${token}`,
          data
        );
        setLoading(false);
        if (res?.status === 200) {
          toast.success(res?.data?.message);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
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
          <div className="resetinput">
            <label className="resetlabel">Password</label>
            <div className="inputwrapper">
              <input
                name="newPassword"
                onChange={handleChange}
                value={inputValue.newPassword}
                type={showPassword ? "text" : "password"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Enter Your Password"
                required
                className="resetinputmain"
              />
              <div className="reseteyeIcon" onClick={handleShowPassword}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            {errorMessage.newPassword && (
              <p className="error">{errorMessage.newPassword}</p>
            )}
          </div>
          <div className="resetinput">
            <label className="resetlabel">Confirm Password</label>
            <div className="inputwrapper">
              <input
                name="confirmPassword"
                onChange={handleChange}
                value={inputValue.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                placeholder="Confirm Password"
                required
                className="resetinputmain"
              />
              <div
                className="reseteyeIcon1"
                onClick={handleShowConfirmPassword}
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            {errorMessage.confirmPassword && (
              <p className="error">{errorMessage.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            className="resetbtn"
            disabled={disabled}
            style={{
              backgroundColor: disabled ? "#dbd2f0d2" : "#804bf2",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ResetPassword;
