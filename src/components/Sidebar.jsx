import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboardNavBar from "../assets/dashboardNavBar.json";
import dashboardIcon from "../assets/public/logo.png";
import { MdDashboard, MdTrendingUp, MdLightbulb } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import { FiBook, FiTarget, FiUser } from "react-icons/fi";
import { SiMoneygram } from "react-icons/si";
import { GrStatusGood } from "react-icons/gr";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import "../styles/dashboardCss/dashboard.css";
import { useExamibleContext } from "../context/ExamibleContext";
import { setMockExamQuestion } from "../global/slice";

const Sidebar = () => {
  const location = useLocation();
  const { setIsLogout } = useExamibleContext();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const user = useSelector((state) => state.user);

  const getIconForItem = (iconName) => {
    const iconProps = { size: 24, className: "sidebar-icon" };
    const iconMap = {
      dashboard: <MdDashboard {...iconProps} />,
      study: <FiBook {...iconProps} />,
      ai: <MdLightbulb {...iconProps} />,
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

  return (
    <div className="sidebar-premium">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <img
            src={dashboardIcon}
            alt="Examible"
            onClick={() => nav("/overview")}
            className="logo-img"
          />
        </div>

        <nav className="sidebar-nav">
          {groupedNavItems.main.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`sidebar-nav-item ${
                location.pathname.startsWith(item.link) ? "active" : ""
              }`}
              onClick={() => dispatch(setMockExamQuestion([]))}
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
                  onClick={() => dispatch(setMockExamQuestion([]))}
                >
                  <span className="nav-icon">{getIconForItem(item.icon)}</span>
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
                  onClick={() => dispatch(setMockExamQuestion([]))}
                >
                  <span className="nav-icon">{getIconForItem(item.icon)}</span>
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
                  onClick={() => dispatch(setMockExamQuestion([]))}
                >
                  <span className="nav-icon">{getIconForItem(item.icon)}</span>
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
                  onClick={() => dispatch(setMockExamQuestion([]))}
                >
                  <span className="nav-icon">{getIconForItem(item.icon)}</span>
                  <span className="nav-label">{item.name}</span>
                </Link>
              ))}
            </div>
          )}
        </nav>

        {user?.plan === "Freemium" && !location.pathname.startsWith("/subscription") && (
          <div className="sidebar-premium-card">
            <div className="premium-icon">
              <GrStatusGood />
            </div>
            <h5>Premium Access</h5>
            <p>Unlock all features</p>
            <button onClick={() => nav("/subscription")}>
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        {user?.plan !== "Freemium" && (
          <Link
            to="/subscription"
            className={`sidebar-nav-item ${
              location.pathname.startsWith("/subscription") ? "active" : ""
            }`}
          >
            <SiMoneygram size={24} className="sidebar-icon" />
            <span className="nav-label">Subscription</span>
          </Link>
        )}
        <div
          className="sidebar-nav-item logout-btn"
          onClick={() => setIsLogout(true)}
        >
          <AiOutlineLogout size={24} className="sidebar-icon logout-icon" />
          <span className="nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
