import { useState, useEffect, useCallback } from "react";
import "../../styles/dashboardCss/dashboard.css";
import { RiRobot2Line } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import Sidebar from "../../components/Sidebar";
import ResponsiveSidebar from "../../components/ResponsiveSidebar";
import { useExamibleContext } from "../../context/ExamibleContext";
import { toast } from "react-toastify";
import ThemeToggle from "../../components/ThemeToggle";
import { HiMenuAlt4 } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import BottomTabBar from "../../components/BottomTabBar";
import { BackButton, RefreshButton } from "../../components/AppHeaderActions";
import { useIsInstalledApp } from "../../hooks/useIsInstalledApp";
import { lazyPart } from "../../utils/lazyPart";

import Loading from "../../components/Loading";

// Not part of the dashboard's first download, and not precached by the service
// worker (vite.config.js): they need the internet anyway. The bot and the AI
// response pull in markdown and KaTeX, so they're fetched in the background
// once the page is idle; the feedback form (EmailJS) only when opened.
const LegacyBot = lazyPart(() => import("../../components/LegacyBot"));
const AiResponse = lazyPart(() => import("../../components/AiResponse"));
const FeedbackForm = lazyPart(() => import("../../components/FeedbackForm"));

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
  const installed = useIsInstalledApp();

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

  const {
    isLogout,
    showFeedbackModal,
    setShowFeedbackModal,
    showAiResponseModal,
    setShowAiResponseModal,
  } = useExamibleContext();

  const closeBot = useCallback(() => setShowBot(false), []);
  const closeAiResponse = useCallback(
    () => setShowAiResponseModal(false),
    [setShowAiResponseModal],
  );
  const closeFeedback = useCallback(
    () => setShowFeedbackModal(false),
    [setShowFeedbackModal],
  );

  // Download the bot and AI response once the page is idle, unless the student
  // has asked to save data. The bot only for plans that can open it.
  const canUseBot = user?.plan && user.plan !== "Freemium";
  useEffect(() => {
    if (navigator.connection?.saveData) return;
    const preload = () => {
      AiResponse.preload();
      if (canUseBot) LegacyBot.preload();
    };
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(preload, { timeout: 5000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 3000);
    return () => clearTimeout(id);
  }, [canUseBot]);

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
        <LegacyBot
          closeBot={closeBot}
          onLoadError={closeBot}
          fallback={
            // While it downloads: the icon stays, dimmed; tapping cancels
            // (the download carries on, so the next tap is instant)
            <RiRobot2Line
              className="ExamibleBot ExamibleBot--loading"
              onClick={closeBot}
              aria-label="Opening the chatbot. Tap to cancel."
            />
          }
        />
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
          <BackButton />
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
            <RefreshButton />
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
          {showFeedbackModal && (
            <FeedbackForm
              onLoadError={closeFeedback}
              fallback={<Loading text="Opening the feedback form..." />}
            />
          )}
          {showAiResponseModal && (
            <AiResponse
              onLoadError={closeAiResponse}
              fallback={<Loading text="Opening explanation..." />}
            />
          )}
        </div>
      </div>
      {installed && <BottomTabBar />}
    </div>
  );
};

export default Dashboard;
