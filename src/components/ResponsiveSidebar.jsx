import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboardNavBar from "../assets/dashboardNavBar.json";
import dashboardIcon from "../assets/public/logo.png";
import { MdDashboard, MdTrendingUp } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import { FiBook, FiTarget, FiUser } from "react-icons/fi";
import { BiLightbulb } from "react-icons/bi";
import { useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { SiMoneygram } from "react-icons/si";
import { GrStatusGood } from "react-icons/gr";
import "../styles/dashboardCss/dashboard.css";
import { useEffect } from "react";
import { useExamibleContext } from "../context/ExamibleContext";

const ResponsiveSidebar = ({ showDropdown, setShowDropdown }) => {
  const location = useLocation();
  const { setIsLogout } = useExamibleContext();
  const nav = useNavigate();
  const user = useSelector((state) => state.user);

  const getIconForItem = (iconName) => {
    const iconProps = { size: 24, className: "sidebar-icon" };
    const iconMap = {
      dashboard: <MdDashboard {...iconProps} />,
      study: <FiBook {...iconProps} />,
      ai: <BiLightbulb {...iconProps} />,
      exam: <PiExamFill size={24} className="sidebar-icon" />,
      questions: <FiBook {...iconProps} />,
      analytics: <MdTrendingUp {...iconProps} />,
      readiness: <FiTarget {...iconProps} />,
      profile: <FiUser {...iconProps} />,
    };
    return iconMap[iconName] || <MdDashboard {...iconProps} />;
  };

  const groupedNavItems = {
    main: [],
    learning: [],
    practice: [],
    insights: [],
    account: [],
  };

  dashboardNavBar.forEach((item) => {
    if (groupedNavItems[item.category]) {
      groupedNavItems[item.category].push(item);
    }
  });

  useEffect(() => {
    if (showDropdown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showDropdown]);

  return (
    <>
      {showDropdown && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className="sidebar-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-mobile-header">
              <img src={dashboardIcon} alt="Examible" className="logo-img" />
              <button
                className="close-btn"
                onClick={() => setShowDropdown(false)}
              >
                ✕
              </button>
            </div>

            <nav className="sidebar-mobile-nav">
              {groupedNavItems.main.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`sidebar-nav-item ${
                    location.pathname.startsWith(item.link) ? "active" : ""
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="nav-icon">{getIconForItem(item.icon)}</span>
                  <span className="nav-label">{item.name}</span>
                </Link>
              ))}

              {groupedNavItems.learning.length > 0 && (
                <div className="sidebar-section">
                  <h4 className="section-title">Learning</h4>
                  {groupedNavItems.learning.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`sidebar-nav-item ${
                        location.pathname.startsWith(item.link) ? "active" : ""
                      }`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="nav-icon">
                        {getIconForItem(item.icon)}
                      </span>
                      <span className="nav-label">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {groupedNavItems.practice.length > 0 && (
                <div className="sidebar-section">
                  <h4 className="section-title">Practice</h4>
                  {groupedNavItems.practice.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`sidebar-nav-item ${
                        location.pathname.startsWith(item.link) ? "active" : ""
                      }`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="nav-icon">
                        {getIconForItem(item.icon)}
                      </span>
                      <span className="nav-label">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {groupedNavItems.insights.length > 0 && (
                <div className="sidebar-section">
                  <h4 className="section-title">Insights</h4>
                  {groupedNavItems.insights.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`sidebar-nav-item ${
                        location.pathname.startsWith(item.link) ? "active" : ""
                      }`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="nav-icon">
                        {getIconForItem(item.icon)}
                      </span>
                      <span className="nav-label">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {groupedNavItems.account.length > 0 && (
                <div className="sidebar-section">
                  <h4 className="section-title">Account</h4>
                  {groupedNavItems.account.map((item) => (
                    <Link
                      key={item.id}
                      to={item.link}
                      className={`sidebar-nav-item ${
                        location.pathname.startsWith(item.link) ? "active" : ""
                      }`}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className="nav-icon">
                        {getIconForItem(item.icon)}
                      </span>
                      <span className="nav-label">{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </nav>

            {user?.plan === "Freemium" && !location.pathname.startsWith("/subscription") && (
              <div className="sidebar-mobile-premium">
                <div className="premium-icon">
                  <GrStatusGood />
                </div>
                <h5>Premium Access</h5>
                <p>Unlock all features</p>
                <button
                  onClick={() => {
                    nav("/subscription");
                    setShowDropdown(false);
                  }}
                >
                  Upgrade Now
                </button>
              </div>
            )}

            <div className="sidebar-mobile-footer">
              {user?.plan !== "Freemium" && (
                <Link
                  to="/subscription"
                  className={`sidebar-nav-item ${
                    location.pathname.startsWith("/subscription") ? "active" : ""
                  }`}
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <SiMoneygram size={24} className="sidebar-icon" />
                  <span className="nav-label">Subscription</span>
                </Link>
              )}
              <div
                className="sidebar-nav-item logout-btn"
                onClick={() => {
                  setShowDropdown(false);
                  setIsLogout(true);
                }}
              >
                <AiOutlineLogout size={24} className="sidebar-icon logout-icon" />
                <span className="nav-label">Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveSidebar;
