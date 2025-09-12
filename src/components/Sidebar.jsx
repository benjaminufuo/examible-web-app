import { Link, useLocation, useNavigate } from "react-router-dom";
import dashboardNavBar from "../assets/dashboardNavBar.json";
import dashboardIcon from "../assets/public/logo.png";
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

const Sidebar = () => {
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

  const location = useLocation();

  const dispatch = useDispatch();
  const nav = useNavigate();

  const user = useSelector((state) => state.user);

  return (
    <div className="dashboard-left">
      <div className="dashboard-leftNavbarHolder">
        <div className="dashboard-leftImg">
          <img
            src={dashboardIcon}
            alt=""
            onClick={() => nav("/dashboard/overview")}
            style={{ cursor: "pointer" }}
          />
        </div>
        {dashboardNavBar.map((item, index) => (
          <Link
            to={item.link}
            style={{
              backgroundColor: location.pathname.startsWith(item.link)
                ? "#804bf233"
                : "white",
            }}
            className="dashboard-navBar"
            key={item.id}
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
                  className="dashboard-navBar"
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
                <div className="dashboard-subscription">
                  <div className="dashboard-markIcon">
                    <GrStatusGood />
                  </div>
                  <h5>Unlimited Access</h5>
                  <p>Explore more with a lifetime members</p>
                  <button
                    onClick={() => {
                      nav("/dashboard/subscription");
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
              className="dashboard-navBar"
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
        className="dashboard-navBar"
        style={{ backgroundColor: "white" }}
        onClick={() => dispatch(setLogout())}
      >
        <AiOutlineLogout fontSize={35} color="red" />
        Logout
      </div>
    </div>
  );
};

export default Sidebar;
