import React, { useState, useMemo } from "react";
import "../../styles/dashboardCss/overview.css";
import image1 from "../../assets/public/home-firstlayer.webp";
import { FaBook } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import SubjectSelected from "./SubjectSelected";
import { useDispatch, useSelector } from "react-redux";
import { setNotEnrolledSubjects, setUser } from "../../global/slice";
import { TbTrashX } from "react-icons/tb";
import { toast } from "react-toastify";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";
import { PlusIcon } from "../../assets/public/svg/common";
import { FiTrendingUp, FiClock, FiAward } from "react-icons/fi";

const Overview = () => {
  const user = useSelector((state) => state.user);
  const [showBin, setShowBin] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // build a fast lookup for subject -> svg component OR img once
  const subjectMap = useMemo(
    () =>
      Object.fromEntries(
        allSubjectsData.map((s) => [s.subject, s.svg || s.img]),
      ),
    [],
  );

  const { setShowSubjectSelected, showSubjectSelected } = useExamibleContext();

  const removeSubject = async (subject) => {
    const id = toast.loading("Removing Subject ...");
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/removeSubject/${user?._id || user?.id}`,
        { subject },
      );
      setLoading(false);
      if (res?.status === 200) {
        toast.dismiss(id);
        setTimeout(() => {
          toast.success(res?.data?.message);
          dispatch(setUser(res?.data?.data));
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
    }
  };

  const onMouseEnterToShowBin = (index) => {
    if (user?.plan !== "Freemium") {
      setShowBin(index);
      return;
    }
    setShowBin("");
  };

  const addMoreSubject = async () => {
    if (user?.plan === "Freemium" && user?.enrolledSubjects?.length === 4) {
      toast.error("Upgrade Plan to add more subject");
      return;
    } else {
      setLoading(true);
      const id = toast.loading("Please wait ...");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}api/v1/studentNotSubjects/${
            user?._id
          }`,
        );
        setLoading(false);
        if (res?.status) {
          dispatch(setNotEnrolledSubjects(res?.data?.data));
          toast.dismiss(id);
          setShowSubjectSelected(true);
        }
      } catch (error) {
        setLoading(false);
        toast.error(error?.response?.data?.message);
        toast.dismiss(id);
      }
    }
  };

  return (
    <>
      {showSubjectSelected ? (
        <SubjectSelected />
      ) : (
        <div className="overview-premium">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <div className="welcome-text">
                <h1>Welcome back, {user?.fullName?.split(" ")[0]}</h1>
                <p>You&apos;re making great progress towards your goals</p>
              </div>
              <img src={image1} alt="Welcome illustration" className="welcome-image" />
            </div>
          </section>

          {/* Key Metrics Section */}
          <section className="metrics-section">
            <h2 className="section-title">Your Progress</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon subjects">
                  <FaBook />
                </div>
                <div className="metric-content">
                  <h3>{user?.enrolledSubjects?.length}</h3>
                  <p>Subjects</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon exams">
                  <PiExamFill />
                </div>
                <div className="metric-content">
                  <h3>{user?.plan === "Freemium" ? "10" : "Unlimited"}</h3>
                  <p>Mock Exams</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon questions">
                  <FiTrendingUp />
                </div>
                <div className="metric-content">
                  <h3>{user?.plan === "Freemium" ? "4" : "All"}</h3>
                  <p>Past Years</p>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon rating">
                  <FiAward />
                </div>
                <div className="metric-content">
                  <h3>{user?.totalRating?.toFixed(1) || "0"}%</h3>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </section>

          {/* Subjects Section */}
          <section className="subjects-section">
            <h2 className="section-title">Your Subjects</h2>
            <div className="subjects-grid">
              {user?.enrolledSubjects?.map((item, index) => (
                <div
                  key={index}
                  className="subject-card"
                  onMouseEnter={() => onMouseEnterToShowBin(index)}
                  onMouseLeave={() => setShowBin("")}
                >
                  <div className="subject-icon">
                    {typeof subjectMap[item] === "function" ? (
                      React.createElement(subjectMap[item])
                    ) : (
                      <img
                        src={subjectMap[item]}
                        alt={item}
                        loading="eager"
                        width={48}
                        height={48}
                      />
                    )}
                  </div>
                  <p>{item}</p>
                  {showBin === index && (
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSubject(item);
                      }}
                      disabled={loading}
                    >
                      <TbTrashX size={20} />
                    </button>
                  )}
                </div>
              ))}

              {user?.enrolledSubjects?.length < (user?.plan === "Freemium" ? 4 : 10) && (
                <button
                  className="subject-card add-subject-btn"
                  onClick={() => addMoreSubject()}
                  disabled={loading}
                >
                  <div className="add-icon">
                    <PlusIcon />
                  </div>
                  <p>Add Subject</p>
                </button>
              )}
            </div>
          </section>

          {/* Performance Rating Section */}
          <section className="rating-section">
            <h2 className="section-title">Performance Overview</h2>
            <div className="rating-container">
              <div className="rating-card current-rating">
                <h3>Current Rating</h3>
                <div className="rating-circle">
                  <CircularProgressbar
                    value={user?.totalRating || 0}
                    text={`${user?.totalRating?.toFixed(1) || 0}%`}
                    styles={{
                      path: {
                        stroke: "url(#gradient)",
                        strokeLinecap: "round",
                        transition: "stroke-dashoffset 0.5s ease 0s",
                        transformOrigin: "50% 50%",
                      },
                      trail: {
                        stroke: "rgba(128, 75, 242, 0.1)",
                        strokeLinecap: "round",
                      },
                      text: {
                        fontWeight: 700,
                        fontSize: 24,
                        fill: "#804bf2",
                        fontFamily: '"Montserrat", sans-serif',
                      },
                    }}
                  />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#804bf2" />
                        <stop offset="100%" stopColor="#f2ae30" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <div className="performance-table">
                <h3>Subject Performance</h3>
                {user?.myRating?.length <= 0 || !user?.myRating ? (
                  <p className="no-data">No performance data yet. Take your first mock exam!</p>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Score</th>
                          <th>Duration</th>
                          <th>Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user?.myRating?.slice(0, 5).map((item, index) => (
                          <tr key={index}>
                            <td>{item?.subject}</td>
                            <td className="score">{item?.performance?.toFixed(1)}%</td>
                            <td>
                              {Math.floor(item?.duration / 60)}m {item?.duration % 60}s
                            </td>
                            <td className="completed">{item?.completed}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Study Tips Section */}
          <section className="tips-section">
            <h2 className="section-title">Tips for Success</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-number">1</span>
                <h4>Set Clear Goals</h4>
                <p>Know what grades you&apos;re aiming for and create a plan to reach them</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">2</span>
                <h4>Practice Consistently</h4>
                <p>Use mock exams to practice and get comfortable with the exam format</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">3</span>
                <h4>Review Past Questions</h4>
                <p>Study previous years&apos; questions to understand patterns and common topics</p>
              </div>
              <div className="tip-card">
                <span className="tip-number">4</span>
                <h4>Manage Your Time</h4>
                <p>Create a study schedule and stick to it for consistent progress</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Overview;
