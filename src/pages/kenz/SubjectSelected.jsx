import { useState, useMemo } from "react";
import "../../styles/dashboardCss/subjectSelected.css";
import "../../styles/dashboardCss/overview.css";
import image1 from "../../assets/public/home-firstlayer.webp";
import { FiArrowLeft, FiCheck, FiPlus, FiBookOpen } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../global/slice";
import { studentApi } from "../../config/studentApi";
import { toast } from "react-toastify";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";

const getSubjectDescription = (subject) => {
  const lower = subject?.toLowerCase() || "";
  if (lower.includes("english"))
    return "Master grammar, comprehension, vocabulary, and literary usage.";
  if (lower.includes("math"))
    return "Practice calculations, algebra, geometry, and statistics.";
  if (lower.includes("biology"))
    return "Study living organisms, ecosystems, and life sciences.";
  if (lower.includes("physics"))
    return "Understand matter, energy, mechanics, and physical laws.";
  if (lower.includes("chemistry"))
    return "Explore elements, chemical reactions, and compounds.";
  if (lower.includes("government"))
    return "Learn about political systems, civic rights, and governance.";
  if (lower.includes("economics"))
    return "Study wealth, resources, markets, and financial systems.";
  if (lower.includes("commerce"))
    return "Understand trade, business practices, and market dynamics.";
  if (lower.includes("literature"))
    return "Analyze poetry, drama, prose, and literary devices.";
  if (lower.includes("accounting"))
    return "Learn financial recording, balancing, and business accounts.";
  return "Enhance your knowledge and prepare effectively for your exams.";
};

const SubjectSelected = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(null);
  const notEnrolledFromStore = useSelector((state) => state.notEnrolledSubjects);
  const [notEnrolledSubjects, setNotEnrolledSubjects] = useState(notEnrolledFromStore);

  const { setShowSubjectSelected } = useExamibleContext();

  const addSubject = async (subject) => {
    setLoading(subject);
    try {
      const res = await studentApi.addSubject({ subject });
      setLoading(false);
      if (res?.data?.success) {
        setNotEnrolledSubjects((prev) => prev.filter((s) => s !== subject));
        setTimeout(() => {
          toast.success(res?.data?.message);
          dispatch(setUser(res?.data?.data));
        }, 500);
      }
    } catch {
      setLoading(false);
    }
  };

  // build a fast lookup for subject -> img once
  const subjectMap = useMemo(
    () => Object.fromEntries(allSubjectsData.map((s) => [s.subject, s.img])),
    [],
  );

  return (
    <motion.div
      className="ss-premium-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="ss-premium-layout">
        {/* HERO SECTION */}
        <div className="ss-hero-wrapper">
          <button
            className="ov-back-btn"
            onClick={() => setShowSubjectSelected(false)}
          >
            <FiArrowLeft /> Back to Dashboard
          </button>

          <motion.div
            className="ov-hero-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="ov-hero-content">
              <div className="ov-hero-badges">
                <span className="ov-badge plan-badge">
                  {user?.plan || "Freemium"} Plan
                </span>
                <span className="ov-badge target-badge">Learning Hub</span>
              </div>
              <h1>Your Learning Hub</h1>
              <p>
                Welcome back, {user?.fullName?.split(" ")[0]}. Build your
                personalized curriculum by selecting the subjects you want to
                master.
              </p>
            </div>
            <div className="ov-hero-graphics">
              <img
                src={image1}
                alt="Learning Illustration"
                className="ov-hero-img"
              />
            </div>
          </motion.div>
        </div>

        {/* MAIN WORKSPACE */}
        <div className="ss-workspace">
          {/* ENROLLED SUBJECTS */}
          <div className="ss-section">
            <div className="ss-section-header">
              <h2>My Enrolled Subjects</h2>
              <span className="ss-badge">
                {user?.enrolledSubjects?.length || 0} Enrolled
              </span>
            </div>

            {user?.enrolledSubjects?.length > 0 ? (
              <div className="ss-grid">
                {user.enrolledSubjects.map((item, index) => (
                  <motion.div
                    key={index}
                    className="ss-card enrolled-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="ss-card-header">
                      <div className="ss-card-icon">
                        <img src={subjectMap[item]} alt={item} />
                      </div>
                      <div className="ss-status-badge active">
                        <FiCheck /> Enrolled
                      </div>
                    </div>
                    <div className="ss-card-body">
                      <h3>{item}</h3>
                      <p>{getSubjectDescription(item)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="ss-empty-state">
                <FiBookOpen size={48} />
                <h4>No Subjects Selected Yet</h4>
                <p>
                  Explore the available subjects below and start building your
                  personalized curriculum.
                </p>
              </div>
            )}
          </div>

          {/* AVAILABLE SUBJECTS */}
          <div className="ss-section">
            <div className="ss-section-header">
              <h2>Explore Available Subjects</h2>
              <span className="ss-badge available">
                {notEnrolledSubjects?.length || 0} Available
              </span>
            </div>

            <div className="ss-grid">
              {notEnrolledSubjects.map((item, index) => (
                <motion.div
                  key={index}
                  className="ss-card available-card"
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="ss-card-header">
                    <div className="ss-card-icon">
                      <img
                        src={subjectMap[item]}
                        alt={item}
                        width={80}
                        height={80}
                      />
                    </div>
                  </div>
                  <div className="ss-card-body">
                    <h3>{item}</h3>
                    <p>{getSubjectDescription(item)}</p>
                  </div>
                  <div className="ss-card-footer">
                    <button
                      className="ss-add-btn"
                      onClick={() => addSubject(item)}
                      disabled={loading}
                    >
                      {loading === item ? (
                        <ClipLoader size={16} color="#ffffff" />
                      ) : (
                        <>
                          <FiPlus /> Add Subject
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SubjectSelected;
