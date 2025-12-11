import { useEffect } from "react";
import "../styles/dashboardCss/airesponse.css";
import { useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import handwave from "../assets/public/fluent_hand-wave-16-filled.svg";
import FormattedResponse from "./FormattedResponse";
import { useExamibleContext } from "../context/ExamibleContext";

const AiResponse = () => {
  const { showAiResponseModal, setShowAiResponseModal, AIresponse } =
    useExamibleContext();

  useEffect(() => {
    document.body.style.overflow = showAiResponseModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAiResponseModal]);

  return (
    <main
      className="modal-overlay"
      onClick={() => setShowAiResponseModal(false)}
    >
      <section
        className="ai-response-main-container"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="response-header">
          Study Time
          <BiArrowBack
            className="close-respone-modal"
            style={{ zIndex: 3, cursor: "pointer" }}
            onClick={() => setShowAiResponseModal(false)}
          />
          <div className="second-header">
            <span className="second-header-text">
              Understand This Question Better
            </span>
            <img src={handwave} />
          </div>
        </header>

        <div className="response-window">
          <div className="empty-space"></div>
          <div className="response-text">
            <FormattedResponse response={AIresponse} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AiResponse;
