import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutTheUser } from "../global/slice";
import { getAiResponse } from "../config/Api";
import { useExamibleContext } from "../context/ExamibleContext";
import { toast } from "react-toastify";

const useAiExplanation = (year, subject, userToken) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { setShowAiResponseModal, setAIResponse } = useExamibleContext();
  const [loading, setLoading] = useState(null);

  const handleViewExplanation = async (
    questionNum,
    question,
    passage,
    options,
    subheadingA,
    subheadingB,
    diagramUrlA,
    diagramUrlB,
    id,
  ) => {
    setLoading(id);
    try {
      const res = await getAiResponse(
        year,
        subject,
        questionNum,
        question,
        passage,
        options,
        subheadingA,
        subheadingB,
        diagramUrlA,
        diagramUrlB,
        userToken,
      );
      if (res) {
        setAIResponse(res.data.aiResponse);
        setShowAiResponseModal(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      if (
        error?.response?.data?.message ===
        "Session timed-out: Please login to continue"
      ) {
        setTimeout(() => nav("/"), 500);
        setTimeout(() => dispatch(logoutTheUser()), 550);
      }
    } finally {
      setLoading(null);
    }
  };

  return { loading, handleViewExplanation };
};

export default useAiExplanation;
