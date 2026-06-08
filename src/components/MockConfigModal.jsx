import React, { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { questionApi } from "../config/questionApi";
import {
  setExamTimer,
  setMockExamQuestion,
  setMockSelectedSubject,
  setMockYear,
} from "../global/slice";
import "../styles/dashboardCss/MockConfigModal.css";
import Button from "../shared/Button";

const MockConfigModal = ({ subject, onClose }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    questions: 15,
    duration: 10,
  });

  const questionOptions =
    subject === "English" ? [15, 30, 45, 60] : [10, 20, 30, 40];
  const durationOptions = [10, 20, 30, 40];

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const res = await questionApi.fetchMockQuestions(subject);

      if (res?.data?.success) {
        // Enforce the exact number of questions selected in the modal
        const selectedQuestions =
          res?.data?.data?.slice(0, config.questions) || [];
        dispatch(setMockExamQuestion(selectedQuestions));
        dispatch(setMockYear(res?.data?.year));
        dispatch(setExamTimer({ plan: user?.plan, duration: config.duration }));
        sessionStorage.setItem("mockExamDuration", config.duration);
        dispatch(setMockSelectedSubject(subject));
        setTimeout(() => {
          nav(`/mock-exam/questions`, { state: { subjectId: 1 } });
        }, 500);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const isPremium = user?.plan !== "Freemium";

  return (
    <div
      className="mock-config-overlay"
      onClick={!loading ? onClose : undefined}
    >
      <div className="mock-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mock-config-header">
          <h3>Configure Mock Test</h3>
          <button onClick={onClose} className="close-btn" disabled={loading}>
            <RiCloseLine size={24} />
          </button>
        </div>
        <div className="mock-config-body">
          <div className="config-group">
            <h4>Number of Questions</h4>
            <div className="options-grid">
              {questionOptions.map((q) => (
                <button
                  key={q}
                  className={`option-btn ${config.questions === q ? "active" : ""}`}
                  onClick={() => setConfig({ ...config, questions: q })}
                  disabled={loading}
                >
                  {q} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="config-group">
            <h4>Duration (Minutes)</h4>
            <div className="options-grid">
              {durationOptions.map((d) => (
                <button
                  key={d}
                  className={`option-btn ${config.duration === d ? "active" : ""}`}
                  onClick={() => setConfig({ ...config, duration: d })}
                  disabled={loading || (!isPremium && d > 10)}
                  title={
                    !isPremium && d > 10
                      ? "Upgrade to Premium for longer durations"
                      : ""
                  }
                >
                  {d} Minutes
                  {!isPremium && d > 10 && (
                    <span className="premium-lock">🔒</span>
                  )}
                </button>
              ))}
            </div>
            {!isPremium && (
              <p className="premium-note">
                Freemium users are limited to 10 minutes.{" "}
                <a onClick={() => nav("/subscription")}>Upgrade to Premium</a>{" "}
                for more time.
              </p>
            )}
          </div>
        </div>
        <div className="mock-config-footer">
          <Button
            onClick={handleStartExam}
            loading={loading}
            disabled={loading}
            fullWidth
          >
            {loading ? "Starting..." : "Start Exam"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MockConfigModal;
