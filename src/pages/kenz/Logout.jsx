import { useState, useEffect } from "react";
import "../../styles/dashboardCss/logout.css";
import { useDispatch, useSelector } from "react-redux";
import { logoutTheUser } from "../../global/slice";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../../config/studentApi";
import { useExamibleContext } from "../../context/ExamibleContext";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";

const Logout = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { setIsLogout } = useExamibleContext();

  // Accessibility: Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsLogout(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsLogout]);

  const logoutUser = async () => {
    setLoading(true);
    try {
      const res = await studentApi.logout();
      if (res?.data?.success) {
        setTimeout(() => {
          nav("/");
          setIsLogout(false);
        }, 500);
        setTimeout(() => {
          localStorage.removeItem("userToken");
          dispatch(logoutTheUser());
          setIsLogout(false);
        }, 550);
      }
      setLoading(false);
      return;
    } catch {
      setLoading(false);

      setTimeout(() => {
        nav("/");
      }, 500);
      setTimeout(() => {
        dispatch(logoutTheUser());
        setIsLogout(false);
      }, 1000);
    }
  };

  return (
    <motion.div
      className="logout-overlay-premium"
      onClick={() => setIsLogout(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="logout-modal-premium"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header Section */}
        <div className="logout-header">
          <div className="logout-icon-wrapper">
            <FiLogOut size={24} />
          </div>
          <h3 className="logout-title">Sign Out of Examible?</h3>
        </div>

        {/* User Context Card */}
        <div className="logout-user-card">
          {user?.image?.imageUrl ? (
            <img
              src={user.image.imageUrl}
              alt="Profile"
              className="logout-avatar"
            />
          ) : (
            <div className="logout-avatar-fallback">
              <LuUserRound size={24} />
            </div>
          )}
          <div className="logout-user-details">
            <span className="logout-user-name">
              {user?.fullName || "Student"}
            </span>
            <span className="logout-user-plan">
              {user?.plan || "Freemium"} Plan
            </span>
          </div>
        </div>

        {/* Confirmation Message */}
        <p className="logout-message">
          Are you sure you want to sign out of your account? You can always sign
          back in to continue your learning journey.
        </p>

        {/* Action Buttons */}
        <div className="logout-actions">
          <button
            className="logout-btn-primary"
            onClick={() => setIsLogout(false)}
            disabled={loading}
          >
            Stay Logged In
          </button>

          <button
            className="logout-btn-danger"
            onClick={logoutUser}
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Logout;
