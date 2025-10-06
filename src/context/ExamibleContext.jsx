import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

const examibleContext = createContext({
  isLogout: false,
  setIsLogout: () => {},
  showFeedbackModal: false,
  setShowFeedbackModal: () => {},
  handleShowUserFeedback: () => {},
  showAiResponseModal: false,
  setShowAiResponseModal: () => {},
  AIresponse: "",
  setAIResponse: () => {},
  showSubjectSelected: false,
  setShowSubjectSelected: () => {},
});

export const useExamibleContext = () => {
  return useContext(examibleContext);
};

const ExamibleContext = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [isLogout, setIsLogout] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAiResponseModal, setShowAiResponseModal] = useState(false);
  const [AIresponse, setAIResponse] = useState("");
  const [showSubjectSelected, setShowSubjectSelected] = useState(false);

  const handleShowUserFeedback = () => {
    if (!user?.feedback) {
      setShowFeedbackModal(true);
    }
  };

  const defaultValue = {
    isLogout,
    setIsLogout,
    showFeedbackModal,
    setShowFeedbackModal,
    handleShowUserFeedback,
    showAiResponseModal,
    setShowAiResponseModal,
    AIresponse,
    setAIResponse,
    showSubjectSelected,
    setShowSubjectSelected,
  };
  return (
    <examibleContext.Provider value={defaultValue}>
      {children}
    </examibleContext.Provider>
  );
};

export default ExamibleContext;
