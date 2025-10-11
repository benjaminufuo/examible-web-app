import { useEffect, useState } from "react";
import "../../styles/dashboardCss/profile.css";
import { TbEdit } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setUser } from "../../global/slice";
import { useLocation } from "react-router-dom";
import { LiaSave } from "react-icons/lia";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [notEditing, setNotEditing] = useState(true);
  const [notPassword, setNotPassword] = useState(true);
  const [fullName, setFullname] = useState(user?.fullName);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(user?.image?.imageUrl);
  const dispatch = useDispatch();
  const [edittedPassword, setEdittedPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordsVisiblity, setPasswordsVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [errorMessages, setErrorMessages] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const { pathname } = useLocation();

  const onchangeFile = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith("image")) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
    } else {
      toast.error("File type not supported");
    }
  };

  const changeFullname = async (fullName) => {
    const id = toast.loading("Updating");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/studentUpdate/${user?._id}`,
        { fullName }
      );
      toast.dismiss(id);
      setTimeout(() => {
        toast.success(res?.data?.message);
        dispatch(setUser(res?.data?.data));
        setNotEditing(true);
      }, 500);
    } catch (error) {
      toast.dismiss(id);
      setNotEditing(true);
      toast.error(error?.response?.data?.message);
    }
  };

  const setProfilePic = async () => {
    const formDatas = new FormData();
    formDatas.append("image", image);
    const toastId = toast.loading("Please wait ...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/upload-profileImage/${
          user?._id
        }`,
        formDatas,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res?.status === 200) {
        toast.success("Upload Successfully");
        dispatch(setUser(res?.data?.data));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      toast.dismiss(toastId);
      setImage("");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading("Please wait ...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/change/password/student/${
          user?._id
        }`,
        edittedPassword
      );
      setLoading(false);
      toast.dismiss(id);
      setTimeout(() => {
        toast.success(res?.data?.message);
        setEdittedPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setNotPassword(true);
      }, 500);
    } catch (error) {
      setLoading(false);
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
      setEdittedPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setNotPassword(true);
    }
  };

  const handleVisilibityChange = (field) => {
    setPasswordsVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

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
      } else if (value.length < 8 || value.length > 60) {
        error = "Password should be between 8 and 60 characters";
      } else if (!validatePassword(value)) {
        error =
          "Your password must contain an upper case, a lowercase, a special character and a number";
      } else if (value === edittedPassword.confirmPassword) {
        setErrorMessages({ ...errorMessages, confirmPassword: "" });
      } else {
        error = "";
      }
    }

    if (name === "confirmPassword") {
      if (value !== edittedPassword.newPassword) {
        error = "Passwords do not match";
      }
    }

    setErrorMessages((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdittedPassword((prev) => ({ ...prev, [name]: value }));
    if (name === "newPassword") {
      setErrorMessages({ ...errorMessages, newPassword: "" });
    }
  };

  const isDisabled = () => {
    if (notPassword) {
      return;
    }
    const { newPassword, confirmPassword } = edittedPassword;
    if (
      newPassword.trim() !== "" &&
      newPassword.length >= 8 &&
      newPassword.length <= 60 &&
      confirmPassword.trim() !== "" &&
      newPassword === confirmPassword
    ) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="profile">
      <div className="profile-firstLayer">
        <h3>Profile Setting</h3>
        <>
          {notEditing ? (
            <nav onClick={() => setNotEditing(false)}>
              <TbEdit fontSize={25} />
              Edit
            </nav>
          ) : (
            <nav
              style={{
                fontSize: 18,
                pointerEvents: fullName ? "auto" : "none",
              }}
              onClick={() => changeFullname(fullName)}
            >
              Update
            </nav>
          )}
        </>
      </div>
      <div className="profile-secondLayer">
        {imageUrl ? (
          <img src={imageUrl} alt="" />
        ) : (
          <LuUserRound fontSize={50} />
        )}

        {image ? (
          <label onClick={() => setProfilePic()}>
            <LiaSave />
          </label>
        ) : (
          <label htmlFor="la"> + </label>
        )}
        <input type="file" id="la" hidden onChange={(e) => onchangeFile(e)} />
      </div>
      <form className="profile-thirdLayer" onSubmit={changePassword}>
        <main>
          <label>Full Name</label>
          <div className="profile-inputWrapper">
            <input
              disabled={notEditing}
              type="text"
              placeholder="Enter Fullname"
              value={fullName}
              onChange={(e) => setFullname(e.target.value)}
              style={{ cursor: notEditing ? "not-allowed" : "pointer" }}
            />
          </div>
        </main>
        <main>
          <label>Email</label>
          <div className="profile-inputWrapper">
            <input
              disabled={true}
              type="email"
              placeholder="Enter Email"
              value={user?.email}
              style={{ cursor: "not-allowed" }}
            />
          </div>
        </main>
        {!notPassword && (
          <>
            <main>
              <label>Old Password</label>
              <div className="profile-inputWrapper">
                <input
                  disabled={notPassword}
                  value={edittedPassword.currentPassword}
                  required
                  onChange={(e) =>
                    setEdittedPassword({
                      ...edittedPassword,
                      currentPassword: e.target.value,
                    })
                  }
                  type={
                    passwordsVisiblity.currentPassword ? "text" : "password"
                  }
                  placeholder="123*******"
                  style={{ cursor: notPassword ? "not-allowed" : "pointer" }}
                />
                <div
                  className="profile-eyeIcon"
                  onClick={handleVisilibityChange.bind(this, "currentPassword")}
                >
                  {passwordsVisiblity.currentPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )}
                </div>
              </div>
            </main>
            <main>
              <label>New Password</label>
              <div className="profile-inputWrapper">
                <input
                  disabled={notPassword}
                  value={edittedPassword.newPassword}
                  name="newPassword"
                  required
                  onChange={handleChange}
                  type={passwordsVisiblity.newPassword ? "text" : "password"}
                  placeholder="abc******"
                  style={{ cursor: notPassword ? "not-allowed" : "pointer" }}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                <div
                  className="profile-eyeIcon"
                  onClick={handleVisilibityChange.bind(this, "newPassword")}
                >
                  {passwordsVisiblity.newPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )}
                </div>
              </div>
              {errorMessages.newPassword && (
                <small className="profile-error">
                  {errorMessages.newPassword}
                </small>
              )}
            </main>
            <main>
              <label>Confirm Password</label>
              <div className="profile-inputWrapper">
                <input
                  disabled={notPassword}
                  required
                  value={edittedPassword.confirmPassword}
                  name="confirmPassword"
                  onChange={handleChange}
                  type={
                    passwordsVisiblity.confirmPassword ? "text" : "password"
                  }
                  placeholder="abc******"
                  style={{ cursor: notPassword ? "not-allowed" : "pointer" }}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                />
                <div
                  className="profile-eyeIcon"
                  onClick={handleVisilibityChange.bind(this, "confirmPassword")}
                >
                  {passwordsVisiblity.confirmPassword ? (
                    <FaRegEye />
                  ) : (
                    <FaRegEyeSlash />
                  )}
                </div>
              </div>
              {errorMessages.confirmPassword && (
                <small className="profile-error">
                  {errorMessages.confirmPassword}
                </small>
              )}
            </main>
          </>
        )}
        <>
          {notPassword ? (
            <button onClick={() => setNotPassword(false)}>
              Change Password
            </button>
          ) : (
            <button disabled={loading || isDisabled()}>Update Password</button>
          )}
        </>
      </form>
    </div>
  );
};

export default Profile;
