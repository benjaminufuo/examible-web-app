import { useState, useEffect } from "react";
import "../../styles/dashboardCss/dashboard.css";
import { RiRobot2Line } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import LegacyBot from "../../components/LegacyBot";
import FeedbackForm from "../../components/FeedbackForm";
import AiResponse from "../../components/AiResponse";
import Sidebar from "../../components/Sidebar";
import ResponsiveSidebar from "../../components/ResponsiveSidebar";
import { useExamibleContext } from "../../context/ExamibleContext";
import { toast } from "react-toastify";
import ThemeToggle from "../../components/ThemeToggle";
import { HiMenuAlt4 } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const motivationalMessages = [
  "Every practice session brings you closer to success.",
  "Your exam is approaching, make every day count.",
  "Consistency today leads to outstanding results tomorrow.",
  "Challenge yourself with another mock exam today.",
  "Small daily improvements create big exam victories.",
  "Your future starts with the effort you put in today.",
];

const sliderVariants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showBot, setShowBot] = useState(false);

  const [messageIndex, setMessageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const intervalId = setInterval(() => {
      setMessageIndex(
        (prevIndex) => (prevIndex + 1) % motivationalMessages.length,
      );
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(intervalId);
  }, [isHovered]);

  const { isLogout, showFeedbackModal, showAiResponseModal } =
    useExamibleContext();

  const showMyBot = () => {
    if (user?.plan === "Freemium") {
      toast.error("Please Subscribe before you can access this feature");
    } else {
      setShowBot(true);
    }
  };

  return (
    <div className="dashboard">
      {showBot ? (
        <LegacyBot closeBot={() => setShowBot(false)} />
      ) : (
        <RiRobot2Line onClick={() => showMyBot()} className="ExamibleBot" />
      )}

      <Sidebar />
      <ResponsiveSidebar
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />
      <div className="dashboard-right">
        <div className="dashboard-header">
          {showDropdown ? (
            ""
          ) : (
            <div
              className="motivational-slider"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.h3
                  key={messageIndex}
                  className="dashboard-welcome-text"
                  variants={sliderVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {motivationalMessages[messageIndex]}
                </motion.h3>
              </AnimatePresence>
            </div>
          )}
          <div className="header-actions-container">
            <ThemeToggle />
            <nav
              style={{
                background: user?.image ? "transparent" : "#804bf2",
              }}
            >
              {user?.image ? (
                <img src={user?.image?.imageUrl} alt="user" />
              ) : (
                <h1>
                  {user?.fullName
                    ?.split(" ")
                    .map((item) => item.charAt(0))
                    .join(" ")
                    .split(" ")
                    .filter((_, index) => index <= 1)
                    .join("")}
                </h1>
              )}
            </nav>
            <button
              className="menu-button"
              aria-label="Open Menu"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <HiMenuAlt4 size={24} />
            </button>
          </div>
        </div>
        <div className="dashboard-rightHolder">
          <Outlet />
          {isLogout && <Logout />}
          {showFeedbackModal && <FeedbackForm />}
          {showAiResponseModal && <AiResponse />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
