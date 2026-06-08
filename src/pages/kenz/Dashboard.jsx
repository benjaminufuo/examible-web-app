import { useState } from "react";
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
import { FiMenu } from "react-icons/fi";
import { HiMenuAlt4 } from "react-icons/hi";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showBot, setShowBot] = useState(false);

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
            <h3 className="dashboard-welcome-text">Welcome home</h3>
          )}
          <div className="header-actions-container">
            <ThemeToggle />
            <nav
              style={{
                backgroundColor: user?.image ? "transparent" : "#804bf2",
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
