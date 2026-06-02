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
        <div className="overview" style={{ padding: "32px" }}>
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
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", fontFamily: '"Sora", sans-serif' }}>Learning Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
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
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", fontFamily: '"Sora", sans-serif' }}>Your Subjects</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" }}>
              {user?.enrolledSubjects?.map((item, index) => (
                <div
                  key={index}
                  onMouseEnter={() => onMouseEnterToShowBin(index)}
                  onMouseLeave={() => setShowBin("")}
                  style={{
                    position: "relative",
                    padding: "16px",
                    backgroundColor: "rgba(128, 75, 242, 0.08)",
                    border: "1px solid rgba(128, 75, 242, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnterStyle={{
                    backgroundColor: "rgba(128, 75, 242, 0.12)",
                    borderColor: "rgba(128, 75, 242, 0.25)",
                  }}
                >
                  {typeof subjectMap[item] === "function" ? (
                    React.createElement(subjectMap[item])
                  ) : (
                    <img
                      src={subjectMap[item]}
                      alt={item}
                      loading="eager"
                      width={40}
                      height={40}
                      style={{ borderRadius: "8px" }}
                    />
                  )}
                  <span style={{ fontSize: "11px", fontWeight: "500", color: "#4a4a4a", textAlign: "center" }}>{item}</span>
                  {showBin === index && (
                    <TbTrashX
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        pointerEvents: loading ? "none" : "auto",
                        cursor: "pointer",
                        color: "#ff4757",
                        transition: "all 0.2s ease",
                      }}
                      fontSize={16}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSubject(item);
                      }}
                    />
                  )}
                </div>
              ))}
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "rgba(128, 75, 242, 0.06)",
                  border: "2px dashed rgba(128, 75, 242, 0.25)",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => addMoreSubject()}
              >
                <PlusIcon />
                <span style={{ fontSize: "11px", fontWeight: "500", color: "#804bf2", textAlign: "center" }}>Add Subject</span>
              </div>
            </div>
          </div>

          {/* Performance Section */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", fontFamily: '"Sora", sans-serif' }}>Performance Analysis</h2>
            <div className="performance-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px", alignItems: "start" }}>
              <div style={{ position: "relative", minWidth: "0" }}>
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
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: "rgba(128, 75, 242, 0.05)", borderBottom: "1px solid rgba(128, 75, 242, 0.1)" }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#804bf2", textTransform: "uppercase" }}>Subject</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#804bf2", textTransform: "uppercase" }}>Performance</th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "600", color: "#804bf2", textTransform: "uppercase" }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user?.myRating?.map((item, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid rgba(128, 75, 242, 0.06)", transition: "all 0.2s ease" }}>
                          <td style={{ padding: "12px 16px", fontSize: "14px", color: "#4a4a4a", fontWeight: "500" }}>{item?.subject}</td>
                          <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px", color: "#804bf2", fontWeight: "600" }}>{item?.performance?.toFixed(2)}%</td>
                          <td style={{ padding: "12px 16px", textAlign: "center", fontSize: "14px", color: "#666" }}>
                            {Math.floor(item?.duration / 60)}m {item?.duration % 60}s
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", backgroundColor: "rgba(128, 75, 242, 0.04)", borderRadius: "12px", border: "1px dashed rgba(128, 75, 242, 0.15)" }}>
                  <p style={{ fontSize: "14px", color: "#999" }}>No performance data yet. Start a mock exam to see your progress!</p>
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", fontFamily: '"Sora", sans-serif' }}>Study Tips</h2>
            <div className="study-tips-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
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
