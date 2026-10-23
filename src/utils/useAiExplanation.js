import { useState } from "react";
import { useExamibleContext } from "../context/ExamibleContext";
import { aiApi } from "../config/aiApi";

const useAiExplanation = (year, subject) => {
  const { setShowAiResponseModal, setAIResponse, setAiResponseTitle } =
    useExamibleContext();
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
    // Shown in the pop-up, e.g. "Mathematics · Question 4" or "Question 4"
    title = null,
  ) => {
    setLoading(id);
    try {
      const res = await aiApi.getAiResponse({
        year,
        subject,
        number: questionNum,
        question,
        passage,
        options,
        subheadingA,
        subheadingB,
        diagramUrlA,
        diagramUrlB,
      });
      if (res) {
        setAIResponse(res.data.aiResponse);
        setAiResponseTitle(title);
        setShowAiResponseModal(true);
      }
    } finally {
      setLoading(null);
    }
  };

  return { loading, handleViewExplanation };
};

export default useAiExplanation;
