import React, { useEffect, useState } from "react";
import "../../styles/dashboardCss/viewpastquestion.css";
import {
  IoIosArrowRoundBack,
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  setPastQuestionsOption,
  clearPastQuestionsOption,
  setFeedbackModal,
  setAiResponseModal,
  setAIResponse,
} from "../../global/slice";
import { useNavigate } from "react-router-dom";
import { getAiResponse } from "../../config/Api";
import { ClipLoader } from "react-spinners";

const ViewPastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateScore = () => {
    const correctCount = Object.values(pastQuestionsOption).filter(
      (entry) => entry?.isCorrect
    ).length;

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 50;
    return { correctCount, total, percentage, passed };
  };

  const year = useSelector((state) => state.year);
  const subject = useSelector((state) => state.exam);
  const questions = useSelector((state) => state.pastQuestions) || [];
  const pastQuestionsOption = useSelector((state) => state.pastQuestionsOption);
  const aiResponseModal = useSelector((state) => state.aiResponseModal);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const getAnswerText = (answerLetter, options) => {
    if (
      !options ||
      !Array.isArray(options) ||
      typeof answerLetter !== "string" ||
      answerLetter.length === 0
    ) {
      return "";
    }

    const cleanedLetter = answerLetter.trim().toUpperCase().charAt(0); // <- sanitize input
    const index = cleanedLetter.charCodeAt(0) - 65;

    if (index < 0 || index >= options.length) return "";

    const mappedAnswer = options[index];
    return mappedAnswer;
  };

  const handleOptionClick = (
    questionIndex,
    selectedOption,
    correctAnswerLetter,
    options
  ) => {
    const correctAnswer = getAnswerText(correctAnswerLetter, options);

    dispatch(
      setPastQuestionsOption({
        questionIndex,
        selectedOption,
        isCorrect: String(selectedOption) === String(correctAnswer),
        correctAnswerText: correctAnswer,
      })
    );
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(questions.length / questionsPerPage)) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
      setCount((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      dispatch(clearPastQuestionsOption());
    }
  }, [dispatch, questions]);

  useEffect(() => {
    if (count === 1) {
      setTimeout(() => {
        dispatch(setFeedbackModal());
      }, 20000);
    }
  }, [count]);

  const handleViewExplanation = async (
    questionNum,
    question,
    passage,
    options,
    id
  ) => {
    setLoading(id);
    try {
      const res = await getAiResponse(
        year,
        subject,
        questionNum,
        question,
        passage,
        options
      );
      if (res) {
        setLoading(null);
        dispatch(setAIResponse(res.data.aiResponse));
        dispatch(setAiResponseModal());
      }
    } catch (error) {
      setLoading(null);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <main className="viewpastquestionmain">
      <div className="viewpastquestionheader">
        <IoIosArrowRoundBack
          size={40}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <span>Jamb UTME Question</span>
      </div>
      <div className="viewpastquestionmainheader">
        <h1>
          {subject} <em>Past Question</em>({year})
        </h1>
      </div>
      {currentQuestions?.length > 0 ? (
        currentQuestions?.map((item, index) => (
          <div className="answerquestiondiv" key={index}>
            <h1>
              <span>{indexOfFirstQuestion + index + 1}</span>.{" "}
              <span>{item.question}</span>
            </h1>
            {<h1 className="subheading">{item?.subheadingA}</h1>}
            {item?.diagramUrlA && (
              <img
                src={item?.diagramUrlA}
                className="question-diagram"
                style={{ paddingLeft: "20px" }}
              />
            )}
            {<h1 className="subheading">{item?.subheadingB}</h1>}
            {item?.diagramUrlB && (
              <img
                src={item?.diagramUrlB}
                className="question-diagram"
                style={{ paddingLeft: "20px" }}
              />
            )}

            <ul className="answeroption">
              {item.options.map((option, optionindex) => {
                const userAnswer =
                  pastQuestionsOption[indexOfFirstQuestion + index];
                const correctAnswer = getAnswerText(item.answer, item.options);

                let optionClass = "";
                if (userAnswer) {
                  if (option === userAnswer.selectedOption) {
                    optionClass = userAnswer.isCorrect
                      ? "correct-option"
                      : "wrong-option";
                  } else if (
                    !userAnswer.isCorrect &&
                    option === correctAnswer
                  ) {
                    optionClass = "correct-answer";
                  }
                }
                return (
                  <li
                    key={optionindex}
                    className={optionClass}
                    onClick={() =>
                      handleOptionClick(
                        indexOfFirstQuestion + index,
                        option,
                        item.answer,
                        item.options || []
                      )
                    }
                    style={{
                      pointerEvents: userAnswer ? "none" : "auto",
                      cursor: userAnswer ? "not-allowed" : "pointer",
                    }}
                  >
                    <span className="letterdoption">
                      {String.fromCharCode(65 + optionindex)}.
                    </span>
                    {option}
                  </li>
                );
              })}
              <div className="aswer-airesponse">
                <p
                  className="pastanswer"
                  style={{
                    color: pastQuestionsOption[indexOfFirstQuestion + index]
                      ?.isCorrect
                      ? "green"
                      : "red",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {pastQuestionsOption[indexOfFirstQuestion + index]
                    ? pastQuestionsOption[indexOfFirstQuestion + index]
                        .isCorrect
                      ? "✅ Correct!"
                      : "❌ Wrong! "
                    : ""}
                </p>
                {pastQuestionsOption[indexOfFirstQuestion + index] && (
                  <button
                    className="viewmore-btn"
                    disabled={loading}
                    onClick={() =>
                      handleViewExplanation(
                        item.number,
                        item.question,
                        item.passage,
                        item.options,
                        index
                      )
                    }
                  >
                    {loading === index ? (
                      <ClipLoader color="black" size={16} />
                    ) : (
                      "view explanation"
                    )}
                  </button>
                )}
              </div>
            </ul>
          </div>
        ))
      ) : (
        <p className="pastquestionanswer">
          No questions available. please try again
        </p>
      )}

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          <IoIosArrowBack size={25} />
          Previous
        </button>
        <span className="pagination-info">
          page {currentPage} of {Math.ceil(questions.length / questionsPerPage)}
        </span>
        {currentPage === Math.ceil(questions.length / questionsPerPage) ? (
          <button
            onClick={() => {
              const result = calculateScore();
              navigate("/dashboard/resultpage", { state: result });
            }}
            className="pagination-button1"
          >
            Finish
          </button>
        ) : (
          <button onClick={handleNextPage} className="pagination-button1">
            Next
            <IoIosArrowForward size={25} />
          </button>
        )}
      </div>
    </main>
  );
};

export default ViewPastQuestion;
