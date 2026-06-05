import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboardNavBar from "../assets/dashboardNavBar.json";
import dashboardIcon from "../assets/public/logo.png";
import { MdDashboard, MdKeyboardArrowDown } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import img2 from "../assets/public/pastquestion.svg";
import img1 from "../assets/public/profile.svg";
import { useSelector } from "react-redux";
import { AiOutlineLogout } from "react-icons/ai";
import { SiMoneygram } from "react-icons/si";
import { GrStatusGood } from "react-icons/gr";
import "../styles/dashboardCss/dashboard.css";
import { useEffect, useState } from "react";
import { useExamibleContext } from "../context/ExamibleContext";
import { motion, AnimatePresence } from "framer-motion";

const ResponsiveSidebar = ({ showDropdown, setShowDropdown }) => {
  const location = useLocation();
  const { setIsLogout } = useExamibleContext();
  const dashboardIcons = [
    <MdDashboard color="#804BF266" fontSize={35} />,
    <PiExamFill color="#804BF266" fontSize={35} />,
    <nav>
      <img src={img2} alt="" />
    </nav>,
    <nav>
      <img src={img1} alt="" />
    </nav>,
  ];

  const nav = useNavigate();

  const user = useSelector((state) => state.user);

  const [isMockOpen, setIsMockOpen] = useState(
    location.pathname.startsWith("/mock-exam") ||
      location.pathname.startsWith("/cbt-mode"),
  );

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
          className="dashboard-leftDropdown"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div
            className="dashboard-leftDropdownHolder"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-leftDropdown-navbarHolder">
              <div className="dashboard-leftDropdown-leftImg">
                <img
                  src={dashboardIcon}
                  alt=""
                  onClick={() => nav("/overview")}
                  style={{ cursor: "pointer" }}
                />
              </div>
              {dashboardNavBar.map((item, index) => {
                if (item.link === "/mock-exam") {
                  return (
                    <div key={index} className="sidenav-subroute-container">
                      <div
                        className={`dashboard-leftDropdown-navBar sidenav-subroute-trigger ${
                          location.pathname.startsWith("/mock-exam") ||
                          location.pathname.startsWith("/cbt-mode")
                            ? "navbar-active"
                            : ""
                        }`}
                        onClick={() => setIsMockOpen(!isMockOpen)}
                      >
                        <span className="sidenav-subroute-label">
                          {dashboardIcons[index]}
                          {item.name}
                        </span>
                        <motion.span
                          animate={{ rotate: isMockOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="sidenav-subroute-icon"
                        >
                          <MdKeyboardArrowDown size={24} />
                        </motion.span>
                      </div>
                      <AnimatePresence>
                        {isMockOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="sidenav-subroute-dropdown"
                          >
                            <Link
                              to="/mock-exam"
                              className={`dashboard-leftDropdown-navBar sidenav-subroute-item ${
                                location.pathname.startsWith("/mock-exam")
                                  ? "navbar-active"
                                  : ""
                              }`}
                              onClick={() => setShowDropdown(false)}
                            >
                              <span className="sidenav-subroute-bullet">•</span>{" "}
                              Mock Test
                            </Link>
                            <Link
                              to="/cbt-mode"
                              className={`dashboard-leftDropdown-navBar sidenav-subroute-item ${
                                location.pathname.startsWith("/cbt-mode")
                                  ? "navbar-active"
                                  : ""
                              }`}
                              onClick={() => setShowDropdown(false)}
                            >
                              <span className="sidenav-subroute-bullet">•</span>{" "}
                              CBT Mode
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={index}
                    to={item.link}
                    className={`dashboard-leftDropdown-navBar ${
                      location.pathname.startsWith(item.link)
                        ? "navbar-active"
                        : ""
                    }`}
                    onClick={() => setShowDropdown(false)}
                  >
                    {dashboardIcons[index]}
                    {item.name}
                  </Link>
                );
              })}
              <>
                {user?.plan === "Freemium" ? (
                  <>
                    {location.pathname.startsWith("/subscription") ? (
                      <Link
                        to="/subscription"
                        onClick={() => {
                          setShowDropdown(!showDropdown);
                        }}
                        className={`dashboard-leftDropdown-navBar ${
                          location.pathname.startsWith("/subscription")
                            ? "navbar-active"
                            : ""
                        }`}
                      >
                        <SiMoneygram color="#804BF266" fontSize={35} />
                        Subscription
                      </Link>
                    ) : (
                      <div className="dashboard-leftDropdown-subscription">
                        <div className="dashboard-leftDropdown-markIcon">
                          <GrStatusGood />
                        </div>
                        <h5>Unlimited Access</h5>
                        <p>Explore more with a lifetime members</p>
                        <button
                          onClick={() => {
                            nav("/subscription");
                            setShowDropdown(!showDropdown);
                          }}
                        >
                          Subscribe Now
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to="/subscription"
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                    className={`dashboard-leftDropdown-navBar ${
                      location.pathname.startsWith("/subscription")
                        ? "navbar-active"
                        : ""
                    }`}
                  >
                    <SiMoneygram color="#804BF266" fontSize={35} />
                    Subscription
                  </Link>
                )}
              </>
            </div>
            <div
              className="dashboard-leftDropdown-navBar"
              onClick={() => {
                setShowDropdown(!showDropdown);
                setIsLogout(true);
              }}
            >
              <AiOutlineLogout fontSize={35} color="red" />
              Logout
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResponsiveSidebar;
