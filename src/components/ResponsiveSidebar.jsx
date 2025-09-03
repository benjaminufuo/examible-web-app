import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboardNavBar from "../assets/dashboardNavBar.json";
import dashboardIcon from "../../public/logo.png";
import { MdDashboard } from "react-icons/md";
import { PiExamFill } from "react-icons/pi";
import img2 from "../assets/public/pastquestion.svg";
import img1 from "../assets/public/profile.svg";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../global/slice";
import { AiOutlineLogout } from "react-icons/ai";
import { SiMoneygram } from "react-icons/si";
import { GrStatusGood } from "react-icons/gr";
import "../styles/dashboardCss/dashboard.css";
import { useEffect } from "react";

const ResponsiveSidebar = ({ showDropdown, setShowDropdown }) => {
  const location = useLocation();
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

  const dispatch = useDispatch();
  const nav = useNavigate();

  const user = useSelector((state) => state.user);

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
                <img src={dashboardIcon} alt="" />
              </div>
              {dashboardNavBar.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  style={{
                    backgroundColor: location.pathname.startsWith(item.link)
                      ? "#804bf233"
                      : "white",
                  }}
                  className="dashboard-leftDropdown-navBar"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {dashboardIcons[index]}
                  {item.name}
                </Link>
              ))}
              <>
                {user?.plan === "Freemium" ? (
                  <>
                    {location.pathname === "/dashboard/subscription" ? (
                      <Link
                        to="/dashboard/subscription"
                        onClick={() => {
                          setShowDropdown(!showDropdown);
                        }}
                        className="dashboard-leftDropdown-navBar"
                        style={{
                          backgroundColor:
                            location.pathname === "/dashboard/subscription"
                              ? "#804BF233"
                              : "white",
                        }}
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
                            nav("/dashboard/subscription");
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
                    to="/dashboard/subscription"
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                    className="dashboard-leftDropdown-navBar"
                    style={{
                      backgroundColor:
                        location.pathname === "/dashboard/subscription"
                          ? "#804BF233"
                          : "white",
                    }}
                  >
                    <SiMoneygram color="#804BF266" fontSize={35} />
                    Subscription
                  </Link>
                )}
              </>
            </div>
            <div
              className="dashboard-leftDropdown-navBar"
              style={{ backgroundColor: "white" }}
              onClick={() => dispatch(setLogout())}
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
