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
} from "../../global/slice";
import { useLocation, useNavigate } from "react-router";

const ViewPastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [finishPastQuestion, setFinishPastQuestion] = useState(false);

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

    // Additional guard: prevent out-of-bounds error
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
  }, [dispatch]);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
            <h1>{item.question}</h1>
            <ul className="answeroption">
              {item.options.map((option, optionindex) => (
                <li
                  key={optionindex}
                  className={
                    pastQuestionsOption[indexOfFirstQuestion + index]
                      ?.selectedOption === option
                      ? pastQuestionsOption[indexOfFirstQuestion + index]
                          ?.isCorrect
                        ? "correct-option"
                        : "wrong-option"
                      : ""
                  }
                  onClick={() =>
                    handleOptionClick(
                      indexOfFirstQuestion + index,
                      option,
                      item.answer,
                      item.options
                    )
                  }
                  style={{
                    pointerEvents: pastQuestionsOption[
                      indexOfFirstQuestion + index
                    ]
                      ? "none"
                      : "auto",
                    cursor: pastQuestionsOption[indexOfFirstQuestion + index]
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  <span className="letterdoption">
                    {String.fromCharCode(65 + optionindex)}.
                  </span>
                  {option}
                </li>
              ))}
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
                  ? pastQuestionsOption[indexOfFirstQuestion + index].isCorrect
                    ? "✅ Correct!"
                    : "❌ Wrong! The correct answer is: " +
                      pastQuestionsOption[indexOfFirstQuestion + index]
                        .correctAnswerText
                  : ""}
              </p>
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
