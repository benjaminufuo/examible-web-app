import React, { useState, useMemo } from "react";
import "../../styles/dashboardCss/overview.css";
import "../../styles/dashboardCss/dashboard-components.css";
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
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import ProgressChart from "../../components/dashboard/ProgressChart";
import AchievementBadge from "../../components/dashboard/AchievementBadge";
import { px } from "framer-motion";

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
        <div className="overview">
          <DashboardHeader
            userName={user?.fullName?.split(" ")[0]}
            subtitle="Welcome to Examible — your ultimate companion for JAMB success. Let's help you score 300+ and unlock your dream university!"
            image={image1}
            stats={[
              {
                value: user?.enrolledSubjects?.length,
                label: "Subjects Selected",
              },
              { value: user?.plan === "Freemium" ? "10" : "30", label: "Mock Time (mins)" },
            ]}
          />

          {/* Performance Stats Grid */}
          <div className="learning-overview">
            <h2 className="overview-heading">Learning Overview</h2>
            <div className="stats-grid">
              <StatCard
                icon="📚"
                label="Subject Selected"
                value={user?.enrolledSubjects?.length}
                footer={`Out of ${allSubjectsData.length} available`}
              />
              <StatCard
                icon="⏱️"
                label="Mock Exam Duration"
                value={user?.plan === "Freemium" ? "10" : "30"}
                footer="minutes per session"
                variant="gold"
              />
              <StatCard
                icon="📖"
                label="Past Questions Access"
                value={user?.plan === "Freemium" ? "4" : "All"}
                footer={`${user?.plan === "Freemium" ? "Limited" : "Unlimited"} years`}
                variant="accent"
              />
              <StatCard
                icon="⭐"
                label="Current Rating"
                value={`${user?.totalRating?.toFixed(1) || 0}%`}
                footer="Overall Performance"
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div className="learning-overview">
            <h2 className="overview-heading">Your Subjects</h2>
            <div className="subjects-grid">
              {user?.enrolledSubjects?.map((item, index) => (
                <div
                  key={index}
                  className="subject-card"
                  onMouseEnter={() => onMouseEnterToShowBin(index)}
                  onMouseLeave={() => setShowBin("")}
                >
                  {typeof subjectMap[item] === "function" ? (
                    React.createElement(subjectMap[item])
                  ) : (
                    <img
                      src={subjectMap[item]}
                      alt={item}
                      loading="eager"
                      className="subject-icon"
                    />
                  )}
                  {showBin === index && (
                    <TbTrashX
                      className="subject-trash-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSubject(item);
                      }}
                    />
                  )}
                </div>
              ))}
              <div
                className="add-subject-card"
                onClick={() => addMoreSubject()}
              >
                <PlusIcon style={{width: "10px", height: "10px"}}/>
                <span className="add-subject-text">Add</span>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div className="learning-overview">
            <h2 className="overview-heading">Performance Analysis</h2>
            <div className="performance-grid">
              <div className="progress-chart-wrapper">
                <ProgressChart title="Overall Rating">
                  <CircularProgressbar
                    value={user?.totalRating}
                    text={`${user?.totalRating?.toFixed(1) || 0}%`}
                    styles={{
                      path: {
                        stroke: "#804bf2",
                        strokeWidth: 4,
                      },
                      trail: {
                        stroke: "#804BF211",
                        strokeWidth: 4,
                      },
                      text: {
                        fontWeight: 800,
                        fontSize: 20,
                        fill: "#804bf2",
                        fontFamily: '"Sora", sans-serif',
                      },
                    }}
                  />
                </ProgressChart>
              </div>

              {user?.myRating?.length > 0 ? (
                <div className="performance-table-wrapper">
                  <table className="performance-table-container">
                    <thead className="performance-table-head">
                      <tr>
                        <th className="performance-table-header">Subject</th>
                        <th className="performance-table-header" style={{ textAlign: "center" }}>Performance</th>
                        <th className="performance-table-header" style={{ textAlign: "center" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user?.myRating?.map((item, index) => (
                        <tr key={index} className="performance-table-row">
                          <td className="performance-table-cell">{item?.subject}</td>
                          <td className="performance-table-cell performance-table-cell-center">{item?.performance?.toFixed(2)}%</td>
                          <td className="performance-table-cell performance-table-cell-duration">
                            {Math.floor(item?.duration / 60)}m {item?.duration % 60}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-performance-state">
                  <p className="empty-performance-text">No performance data yet. Start a mock exam to see your progress!</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="learning-overview">
            <h2 className="overview-heading">Study Tips</h2>
            <div className="study-tips-grid">
              {[
                { icon: "🎯", title: "Set Clear Goals", desc: "Know your target scores and create a realistic study plan." },
                { icon: "⏰", title: "Manage Time", desc: "Balance study sessions with breaks and other activities." },
                { icon: "📝", title: "Practice Regularly", desc: "Consistent practice with past questions is key to success." },
                { icon: "🧠", title: "Stay Focused", desc: "Minimize distractions and maintain concentration during study." },
                { icon: "💪", title: "Build Confidence", desc: "Take mock exams to simulate real test conditions." },
                { icon: "🤝", title: "Ask for Help", desc: "Don't hesitate to reach out when you need clarification." },
              ].map((tip, index) => (
                <AchievementBadge
                  key={index}
                  icon={tip.icon}
                  title={tip.title}
                  description={tip.desc}
                  isUnlocked={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Overview;
