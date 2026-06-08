import { useEffect, useState } from "react";
import "../../styles/dashboardCss/profile-premium.css";
import { TbEdit } from "react-icons/tb";
import { LuUserRound } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setUser } from "../../global/slice";
import { useLocation } from "react-router-dom";
import { LiaSave } from "react-icons/lia";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCrown,
  FaCheckCircle,
  FaBullseye,
  FaBookOpen,
  FaChartLine,
  FaBrain,
  FaMedal,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

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
        { fullName },
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
        `https://examible-technologies-backend.onrender.com/api/v1/upload-profileImage/${
          user?._id || user?.id
        }`,
        formDatas,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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
          user?._id || user?.id
        }`,
        edittedPassword,
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

  const ratings = user?.myRating || [];
  let strongest = null;
  let weakest = null;
  if (ratings.length > 0) {
    strongest = ratings.reduce((max, r) =>
      r.performance > max.performance ? r : max,
    );
    weakest = ratings.reduce((min, r) =>
      r.performance < min.performance ? r : min,
    );
  }
  const examsTaken = ratings.length;
  const averageScore = user?.totalRating || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <motion.div
        className="prof-premium-main"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="prof-hero-section" variants={itemVariants}>
          <div className="prof-hero-content">
            <div className="prof-hero-badges">
              <span className="prof-badge plan-badge">
                {user?.plan === "Premium" ? <FaCrown /> : <FaCheckCircle />}
                {user?.plan || "Freemium"} Plan
              </span>
              <span className="prof-badge target-badge">
                <FaBullseye /> Target: 300+
              </span>
            </div>
            <h1 className="prof-hero-name">{user?.fullName}</h1>
            <p className="prof-hero-email">{user?.email}</p>
          </div>

          <div className="prof-hero-graphics">
            <div className="prof-avatar-container">
              {imageUrl ? (
                <img src={imageUrl} alt="Profile" className="prof-avatar" />
              ) : (
                <div className="prof-avatar-placeholder">
                  <LuUserRound />
                </div>
              )}
              {image ? (
                <button
                  className="prof-avatar-save"
                  onClick={setProfilePic}
                  disabled={loading}
                >
                  <LiaSave size={20} />
                </button>
              ) : (
                <>
                  <label htmlFor="prof-pic-upload" className="prof-avatar-edit">
                    <TbEdit size={18} />
                  </label>
                  <input
                    type="file"
                    id="prof-pic-upload"
                    hidden
                    onChange={onchangeFile}
                    accept="image/*"
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="prof-content-grid">
          <div className="prof-left-column">
            <motion.div className="prof-card" variants={itemVariants}>
              <div className="prof-card-header">
                <h3>Personal Information</h3>
                {notEditing ? (
                  <button
                    className="prof-edit-btn"
                    onClick={() => setNotEditing(false)}
                  >
                    <TbEdit /> Edit
                  </button>
                ) : (
                  <button
                    className="prof-save-btn"
                    onClick={() => changeFullname(fullName)}
                    disabled={!fullName || loading}
                  >
                    Update
                  </button>
                )}
              </div>
              <div className="prof-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  disabled={notEditing}
                  placeholder="Enter Fullname"
                  className={`prof-input ${!notEditing ? "editable" : ""}`}
                />
              </div>
              <div className="prof-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="prof-input"
                />
              </div>
            </motion.div>

            <motion.div className="prof-card" variants={itemVariants}>
              <div className="prof-card-header">
                <h3>Security & Password</h3>
              </div>
              <form
                onSubmit={changePassword}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div className="prof-form-group">
                  <label>Current Password</label>
                  <div className="prof-password-input">
                    <input
                      type={
                        passwordsVisiblity.currentPassword ? "text" : "password"
                      }
                      value={edittedPassword.currentPassword}
                      name="currentPassword"
                      onChange={(e) =>
                        setEdittedPassword({
                          ...edittedPassword,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      disabled={notPassword}
                      required={!notPassword}
                      className={`prof-input ${!notPassword ? "editable" : ""}`}
                    />
                    <button
                      type="button"
                      className="prof-eye-btn"
                      onClick={() => handleVisilibityChange("currentPassword")}
                    >
                      {passwordsVisiblity.currentPassword ? (
                        <FaRegEye />
                      ) : (
                        <FaRegEyeSlash />
                      )}
                    </button>
                  </div>
                </div>
                {!notPassword && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <div className="prof-form-group">
                        <label>New Password</label>
                        <div className="prof-password-input">
                          <input
                            type={
                              passwordsVisiblity.newPassword
                                ? "text"
                                : "password"
                            }
                            value={edittedPassword.newPassword}
                            name="newPassword"
                            onChange={handleChange}
                            onBlur={(e) =>
                              validateField(e.target.name, e.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="prof-input editable"
                          />
                          <button
                            type="button"
                            className="prof-eye-btn"
                            onClick={() =>
                              handleVisilibityChange("newPassword")
                            }
                          >
                            {passwordsVisiblity.newPassword ? (
                              <FaRegEye />
                            ) : (
                              <FaRegEyeSlash />
                            )}
                          </button>
                        </div>
                        {errorMessages.newPassword && (
                          <span className="prof-error-msg">
                            {errorMessages.newPassword}
                          </span>
                        )}
                      </div>
                      <div className="prof-form-group">
                        <label>Confirm Password</label>
                        <div className="prof-password-input">
                          <input
                            type={
                              passwordsVisiblity.confirmPassword
                                ? "text"
                                : "password"
                            }
                            value={edittedPassword.confirmPassword}
                            name="confirmPassword"
                            onChange={handleChange}
                            onBlur={(e) =>
                              validateField(e.target.name, e.target.value)
                            }
                            placeholder="••••••••"
                            required
                            className="prof-input editable"
                          />
                          <button
                            type="button"
                            className="prof-eye-btn"
                            onClick={() =>
                              handleVisilibityChange("confirmPassword")
                            }
                          >
                            {passwordsVisiblity.confirmPassword ? (
                              <FaRegEye />
                            ) : (
                              <FaRegEyeSlash />
                            )}
                          </button>
                        </div>
                        {errorMessages.confirmPassword && (
                          <span className="prof-error-msg">
                            {errorMessages.confirmPassword}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
                <div className="prof-form-actions">
                  {notPassword ? (
                    <button
                      type="button"
                      className="prof-action-btn secondary"
                      onClick={() => setNotPassword(false)}
                    >
                      Change Password
                    </button>
                  ) : (
                    <div className="prof-action-group">
                      <button
                        type="button"
                        className="prof-action-btn ghost"
                        onClick={() => {
                          setNotPassword(true);
                          setEdittedPassword({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setErrorMessages({
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="prof-action-btn primary"
                        disabled={loading || isDisabled()}
                      >
                        Update Password
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          <div className="prof-right-column">
            <motion.div
              className="prof-stats-grid"
              variants={containerVariants}
            >
              <motion.div className="prof-stat-card" variants={itemVariants}>
                <div className="prof-stat-icon">
                  <FaBookOpen />
                </div>
                <div className="prof-stat-info">
                  <h4>Subjects</h4>
                  <p>{user?.enrolledSubjects?.length || 0}/4</p>
                </div>
              </motion.div>
              <motion.div className="prof-stat-card" variants={itemVariants}>
                <div className="prof-stat-icon">
                  <FaChartLine />
                </div>
                <div className="prof-stat-info">
                  <h4>Exams Taken</h4>
                  <p>{examsTaken}</p>
                </div>
              </motion.div>
              <motion.div className="prof-stat-card" variants={itemVariants}>
                <div className="prof-stat-icon">
                  <FaBrain />
                </div>
                <div className="prof-stat-info">
                  <h4>Avg. Score</h4>
                  <p>{averageScore?.toFixed(1) || 0}%</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div className="prof-card" variants={itemVariants}>
              <div className="prof-card-header">
                <h3>Performance Snapshot</h3>
              </div>
              <div className="prof-performance-list">
                <div className="prof-perf-item positive">
                  <div className="prof-perf-icon">
                    <FaMedal />
                  </div>
                  <div className="prof-perf-details">
                    <span className="prof-perf-label">Strongest Subject</span>
                    <span className="prof-perf-value">
                      {strongest ? strongest.subject : "N/A"}
                    </span>
                  </div>
                  {strongest && (
                    <span className="prof-perf-score">
                      {strongest.performance.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="prof-perf-item negative">
                  <div className="prof-perf-icon">
                    <FaChartLine style={{ transform: "rotate(180deg)" }} />
                  </div>
                  <div className="prof-perf-details">
                    <span className="prof-perf-label">Needs Attention</span>
                    <span className="prof-perf-value">
                      {weakest ? weakest.subject : "N/A"}
                    </span>
                  </div>
                  {weakest && (
                    <span className="prof-perf-score">
                      {weakest.performance.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="prof-card prof-activity-card"
              variants={itemVariants}
            >
              <div className="prof-card-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="prof-activity-timeline">
                {ratings.length > 0 ? (
                  [...ratings]
                    .reverse()
                    .slice(0, 4)
                    .map((item, index) => (
                      <div className="prof-activity-item" key={index}>
                        <div className="prof-activity-dot"></div>
                        <div className="prof-activity-content">
                          <h4>
                            {item.subject}{" "}
                            {item.type || item.examType || "Practice"}
                          </h4>
                          <div className="prof-activity-meta">
                            <span>
                              <FaClock /> {item.duration}s
                            </span>
                            <span>Score: {item.performance.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="prof-empty-state">
                    <FaCalendarAlt className="prof-empty-icon" />
                    <p>
                      No recent activity found. Take a mock exam to get started!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Profile;
