import { useEffect } from "react";
import "../styles/dashboardCss/airesponse.css";
import { useDispatch, useSelector } from "react-redux";
import { setAiResponseModal } from "../global/slice";
import { BiArrowBack } from "react-icons/bi";
import handwave from "../assets/public/fluent_hand-wave-16-filled.svg";
import FormattedResponse from "./FormattedResponse";

const AiResponse = () => {
  const dispatch = useDispatch();
  const aiResponseModal = useSelector((state) => state.aiResponseModal);
  const AIresponse = useSelector((state) => state.AIresponse);

  useEffect(() => {
    document.body.style.overflow = aiResponseModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aiResponseModal]);

  return (
    <main
      className="modal-overlay"
      onClick={() => dispatch(setAiResponseModal())}
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
            onClick={() => dispatch(setAiResponseModal())}
          />
          <div className="second-header">
            <span className="second-header-text">
              Hi! Let help You with the explanation
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
