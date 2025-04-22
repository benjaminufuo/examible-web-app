import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import dashboardIcon from "../../assets/public/legacy_builder_logo.png";
import "../../styles/dashboardCss/dashboard.css";
import { GrStatusGood } from "react-icons/gr";
import { AiOutlineLogout } from "react-icons/ai";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { PiExamFill } from "react-icons/pi";
import { SiMoneygram } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setNavState } from "../../global/slice";
import img1 from "../../assets/public/profile.svg";
import img2 from "../../assets/public/pastquestion.svg";
import Logout from "./Logout";
import hambuger from "../../assets/public/hambuger.svg";

const Dashboard = () => {
  const navState = useSelector((state) => state.navState);
  const user = useSelector((state) => state.user);
  const logout = useSelector((state) => state.logout);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <div className="dashboard-leftNavbarHolder">
        <div className="dashboard-leftImg">
          <img src={dashboardIcon} alt="" />
        </div>
        <div
          onClick={() => {
            nav("/dashboard/overview"), dispatch(setNavState("OVERVIEW"));
          }}
          className="dashboard-navBar"
          style={{ backgroundColor: navState.overview ? "#804BF233" : "white" }}
        >
          <MdDashboard color="#804BF266" fontSize={35} />
          Overview
        </div>
        <div
          onClick={() => {
            nav("/dashboard/mock-exam"), dispatch(setNavState("MOCKEXAM"));
          }}
          className="dashboard-navBar"
          style={{ backgroundColor: navState.mockExam ? "#804BF233" : "white" }}
        >
          <PiExamFill color="#804BF266" fontSize={35} />
          Mock Exam
        </div>
        <div
          onClick={() => {
            nav("/dashboard/past-questions"),
              dispatch(setNavState("PASTQUESTION"));
          }}
          className="dashboard-navBar"
          style={{
            backgroundColor: navState.pastQuestion ? "#804BF233" : "white",
          }}
        >
          {" "}
          <nav>
            <img src={img2} alt="" />
          </nav>{" "}
          Past Question
        </div>
        <div
          onClick={() => {
            nav("/dashboard/profile"), dispatch(setNavState("PROFILE"));
          }}
          className="dashboard-navBar"
          style={{ backgroundColor: navState.profile ? "#804BF233" : "white" }}
        >
          <nav>
            <img src={img1} alt="" />
          </nav>
          Profile
        </div>
        <>
          {user?.plan === "Freemium" ? (
            <>
              {navState.subscription ? (
                <div
                  onClick={() => {
                    nav("/dashboard/subscription"),
                      dispatch(setNavState("SUBSCRIPTION"));
                  }}
                  className="dashboard-navBar"
                  style={{
                    backgroundColor: navState.subscription
                      ? "#804BF233"
                      : "white",
                  }}
                >
                  <SiMoneygram color="#804BF266" fontSize={35} />
                  Subscription
                </div>
              ) : (
                <div className="dashboard-subscription">
                  <div className="dashboard-markIcon">
                    <GrStatusGood />
                  </div>
                  <h5>Unlimited Access</h5>
                  <p>Explore more with a lifetime members</p>
                  <button
                    onClick={() => {
                      nav("/dashboard/subscription"),
                        dispatch(setNavState("SUBSCRIPTION"));
                    }}
                  >
                    Subscribe Now
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="dashboard-navBar"
              style={{
                backgroundColor: "white",
                cursor: 'default'
              }}
            >
              <SiMoneygram color="#804BF266" fontSize={35} />
              Subscribed
            </div>
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
      {showDropdown && (
        <div className="dashboard-leftDropdown" onClick={()=>setShowDropdown(!showDropdown)}>
          <div className="dashboard-leftDropdownHolder" onClick={(e)=>e.stopPropagation()}>
          <div className="dashboard-leftDropdown-navbarHolder">
          <div className="dashboard-leftDropdown-leftImg">
            <img src={dashboardIcon} alt="" />
          </div>
          <div
            onClick={() => {
              nav("/dashboard/overview"),
                dispatch(setNavState("OVERVIEW")),
                setShowDropdown(!showDropdown);
            }}
            className="dashboard-leftDropdown-navBar"
            style={{
              backgroundColor: navState.overview ? "#804BF233" : "white",
            }}
          >
            <MdDashboard color="#804BF266" fontSize={35} />
            Overview
          </div>
          <div
            onClick={() => {
              nav("/dashboard/mock-exam"),
                dispatch(setNavState("MOCKEXAM")),
                setShowDropdown(!showDropdown);
            }}
            className="dashboard-leftDropdown-navBar"
            style={{
              backgroundColor: navState.mockExam ? "#804BF233" : "white",
            }}
          >
            <PiExamFill color="#804BF266" fontSize={35} />
            Mock Exam
          </div>
          <div
            onClick={() => {
              nav("/dashboard/past-questions"),
                dispatch(setNavState("PASTQUESTION")),
                setShowDropdown(!showDropdown);
            }}
            className="dashboard-leftDropdown-navBar"
            style={{
              backgroundColor: navState.pastQuestion ? "#804BF233" : "white",
            }}
          >
            {" "}
            <nav>
              <img src={img2} alt="" />
            </nav>{" "}
            Past Question
          </div>
          <div
            onClick={() => {
              nav("/dashboard/profile"),
                dispatch(setNavState("PROFILE")),
                setShowDropdown(!showDropdown);
            }}
            className="dashboard-leftDropdown-navBar"
            style={{
              backgroundColor: navState.profile ? "#804BF233" : "white",
            }}
          >
            <nav>
              <img src={img1} alt="" />
            </nav>
            Profile
          </div>
          <>
            {user?.plan === "Freemium" ? (
              <>
                {navState.subscription ? (
                  <div
                    onClick={() => {
                      nav("/dashboard/subscription"),
                        dispatch(setNavState("SUBSCRIPTION")),
                        setShowDropdown(!showDropdown);
                    }}
                    className="dashboard-leftDropdown-navBar"
                    style={{
                      backgroundColor: navState.subscription
                        ? "#804BF233"
                        : "white",
                    }}
                  >
                      <SiMoneygram color="#804BF266" fontSize={35} />
                    Subscription
                  </div>
                ) : (
                  <div className="dashboard-leftDropdown-subscription">
                    <div className="dashboard-leftDropdown-markIcon">
                      <GrStatusGood />
                    </div>
                    <h5>Unlimited Access</h5>
                    <p>Explore more with a lifetime members</p>
                    <button
                      onClick={() => {
                        nav("/dashboard/subscription"),
                          dispatch(setNavState("SUBSCRIPTION")),
                          setShowDropdown(!showDropdown);
                      }}
                    >
                      Subscribe Now
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                className="dashboard-leftDropdown-navBar"
                style={{
                  backgroundColor: "white",
                  cursor: 'default'
                }}
              >
                <SiMoneygram color="#804BF266" fontSize={35} />
                Subscribed
              </div>
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
      <div className="dashboard-right">
        <div className="dashboard-header">
          {showDropdown ? "1" : <h3>Welcome, {user?.fullName}</h3>}
          <nav>
            {user?.image ? (
              <img src={user?.image?.imageUrl} alt="" />
            ) : (
              <h1>{user?.fullName?.charAt(0)}</h1>
            )}
          </nav>
          <div
            className="header-menuIcon"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src={hambuger} />
          </div>
        </div>
        <div className="dashboard-rightHolder">
          <Outlet />
          {logout && <Logout />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
