import { useState } from "react";
import "../../styles/dashboardCss/mockExam.css";
import { useSelector } from "react-redux";
import MockConfigModal from "../../components/MockConfigModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLaptopCode,
  FaCheckCircle,
  FaBookOpen,
  FaBullseye,
  FaTasks,
  FaClock,
  FaChartBar,
  FaPlayCircle,
  FaHistory,
} from "react-icons/fa";

const Mockexam = () => {
  const user = useSelector((state) => state.user);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [clickedSubject, setClickedSubject] = useState(null);

  const handleSubjectClick = (subject) => {
    setClickedSubject((prevSubject) =>
      prevSubject === subject ? null : subject,
    );
  };

  const openConfigModal = (subject) => {
    setSelectedSubject(subject);
    setShowConfigModal(true);
  };

  const subjects = user?.enrolledSubjects || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="mock-premium-main">
      {/* 1. HERO HEADER */}
      <motion.div
        className="mock-hero-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mock-hero-content">
          <span className="mock-hero-badge">
            <FaLaptopCode /> JAMB CBT Simulation
          </span>
          <h1 className="mock-hero-title">Mock Examination Center</h1>
          <p className="mock-hero-desc">
            Prepare with realistic JAMB CBT simulations using authentic past
            questions under strict examination conditions.
          </p>
        </div>
      </motion.div>

      {/* 2. EXAM READINESS BANNER */}
      <motion.div
        className="mock-stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div className="mock-stat-card" variants={itemVariants}>
          <div className="mock-stat-icon">
            <FaBookOpen />
          </div>
          <div className="mock-stat-info">
            <h4>Enrolled Subjects</h4>
            <p>{subjects.length || 0}/4</p>
          </div>
        </motion.div>

        <motion.div className="mock-stat-card" variants={itemVariants}>
          <div className="mock-stat-icon">
            <FaCheckCircle />
          </div>
          <div className="mock-stat-info">
            <h4>Available Exams</h4>
            <p>Unlimited</p>
          </div>
        </motion.div>

        <motion.div className="mock-stat-card" variants={itemVariants}>
          <div className="mock-stat-icon">
            <FaBullseye />
          </div>
          <div className="mock-stat-info">
            <h4>Readiness Status</h4>
            <p>Active</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. SUBJECT SELECTION EXPERIENCE */}
      <div>
        <h2 className="mock-section-title">Select Subject for CBT</h2>
        <motion.div
          className="mock-subjects-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <motion.div
                key={index}
                className={`mock-subject-card ${clickedSubject === subject ? "active" : ""}`}
                onClick={() => handleSubjectClick(subject)}
                variants={itemVariants}
              >
                <div className="mock-card-header">
                  <div className="mock-subject-icon">
                    <FaTasks />
                  </div>
                  <span className="mock-subject-badge">CBT Ready</span>
                </div>

                <h3 className="mock-subject-name">{subject}</h3>
                <p className="mock-subject-desc">
                  Practice real JAMB {subject} questions under authentic CBT
                  examination conditions.
                </p>

                {/* 4. EXPANDED SUBJECT DETAILS & 5. START EXAM CTA */}
                <AnimatePresence>
                  {clickedSubject === subject && (
                    <motion.div
                      className="mock-expanded-panel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mock-details-grid">
                        <div className="mock-detail-item">
                          <FaClock /> Estimated: 45 Mins
                        </div>
                        <div className="mock-detail-item">
                          <FaChartBar /> Difficulty: Mixed
                        </div>
                      </div>

                      <button
                        className="mock-start-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfigModal(subject);
                        }}
                      >
                        Setup Mock Practice
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <p>
              No subjects enrolled yet. Please update your profile to access
              CBTs.
            </p>
          )}
        </motion.div>
      </div>

      {/* 6. EXAM BENEFITS & 7. HOW IT WORKS */}
      <motion.div
        className="mock-info-sections"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="mock-benefits-card">
          <h3>
            <FaBullseye /> Why Practice With Examible?
          </h3>
          <ul className="mock-benefits-list">
            <li>
              <FaCheckCircle />{" "}
              <span>
                <strong>Authentic Questions:</strong> Practice with real JAMB
                past questions spanning over 10 years.
              </span>
            </li>
            <li>
              <FaCheckCircle />{" "}
              <span>
                <strong>CBT Experience:</strong> Familiarize yourself with the
                exact interface used in the main exam.
              </span>
            </li>
            <li>
              <FaCheckCircle />{" "}
              <span>
                <strong>Instant Results:</strong> Get immediate scoring and
                comprehensive performance analysis.
              </span>
            </li>
            <li>
              <FaCheckCircle />{" "}
              <span>
                <strong>Detailed Explanations:</strong> Review AI-powered
                explanations for any questions you missed.
              </span>
            </li>
          </ul>
        </div>

        <div className="mock-process-card">
          <h3>
            <FaHistory /> How It Works
          </h3>
          <div className="mock-process-steps">
            <div className="mock-step">
              <div className="mock-step-num">1</div>
              <div className="mock-step-content">
                <h4>Choose a Subject</h4>
                <p>Select from your enrolled JAMB subjects above.</p>
              </div>
            </div>
            <div className="mock-step">
              <div className="mock-step-num">2</div>
              <div className="mock-step-content">
                <h4>Configure Your Exam</h4>
                <p>
                  Set up your preferred simulation environment via the
                  configuration prompt.
                </p>
              </div>
            </div>
            <div className="mock-step">
              <div className="mock-step-num">3</div>
              <div className="mock-step-content">
                <h4>Take the CBT Simulation</h4>
                <p>
                  Answer the questions within the allotted time limit just like
                  the real exam.
                </p>
              </div>
            </div>
            <div className="mock-step">
              <div className="mock-step-num">4</div>
              <div className="mock-step-content">
                <h4>View Detailed Results</h4>
                <p>
                  Check your scores and review your performance instantly after
                  submitting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {showConfigModal && (
        <MockConfigModal
          subject={selectedSubject}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </div>
  );
};

export default Mockexam;
