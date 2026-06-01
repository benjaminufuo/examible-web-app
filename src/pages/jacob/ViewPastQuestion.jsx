import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboardCss/viewpastquestion.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setPastQuestionsOption,
  clearPastQuestionsOption,
} from "../../global/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useExamibleContext } from "../../context/ExamibleContext";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import Calculator from "../../components/Calculator";
import Pagination from "../../shared/Pagination";
import QuestionMeta from "../../components/QuestionMeta";
import { getAnswerText, deduplicateQuestionMeta } from "../../utils/questionUtils";
import useAiExplanation from "../../utils/useAiExplanation";

const QuestionCard = ({
  item,
  newItem,
  questionNumber,
  questionIndex,
  itemIndex,
  userAnswer,
  loading,
  onOptionClick,
  onViewExplanation,
}) => {
  const correctAnswer = getAnswerText(item.answer, item.options);

  return (
    <div id={`question-${questionNumber}`} className="answerquestiondiv">
      <QuestionMeta
        item={item}
        newItem={newItem}
        subheadingClassName="subheading"
        imageClassName="question-diagram"
      />
      <h1 className="questiontext">
        <span>{questionNumber}</span>.{" "}
        <span>
          <Latex>{item.question}</Latex>
        </span>
      </h1>
      <ul className="answeroption">
        {item.options.map((option, optionIndex) => {
          let optionClass = "";
          if (userAnswer) {
            if (option === userAnswer.selectedOption) {
              optionClass = userAnswer.isCorrect ? "correct-option" : "wrong-option";
            } else if (!userAnswer.isCorrect && option === correctAnswer) {
              optionClass = "correct-answer";
            }
          }
          return (
            <li
              key={optionIndex}
              className={optionClass}
              onClick={() =>
                onOptionClick(questionIndex, option, item.answer, item.options)
              }
              style={{
                pointerEvents: userAnswer ? "none" : "auto",
                cursor: userAnswer ? "not-allowed" : "pointer",
              }}
            >
              <span className="letterdoption">
                {String.fromCharCode(65 + optionIndex)}.
              </span>
              <span>
                <Latex>{option}</Latex>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="aswer-airesponse">
        <p
          className="pastanswer"
          style={{
            color: userAnswer?.isCorrect ? "green" : "red",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {userAnswer
            ? userAnswer.isCorrect
              ? "✅ Correct!"
              : "❌ Wrong! "
            : ""}
        </p>
        {userAnswer && (
          <button
            className="viewmore-btn"
            disabled={loading !== null}
            onClick={() =>
              onViewExplanation(
                item.number,
                item.question,
                item.passage,
                item.options,
                item.subheadingA,
                item.subheadingB,
                item.diagramUrlA,
                item.diagramUrlB,
                itemIndex,
              )
            }
          >
            {loading === itemIndex ? (
              <ClipLoader color="black" size={16} />
            ) : (
              "view explanation"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const ViewPastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const year = useSelector((state) => state.year);
  const subject = useSelector((state) => state.exam);
  const questions = useSelector((state) => state.pastQuestions) || [];
  const pastQuestionsOption = useSelector((state) => state.pastQuestionsOption);
  const userToken = useSelector((state) => state.userToken);
  const [count, setCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const page = location.state?.page || currentPage || 1;
  const questionsPerPage = 5;

  const indexOfLastQuestion = page * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const { handleShowUserFeedback } = useExamibleContext();
  const { loading, handleViewExplanation } = useAiExplanation(year, subject, userToken);

  const calculateScore = () => {
    const correctCount = Object.values(pastQuestionsOption).filter(
      (entry) => entry?.isCorrect,
    ).length;
    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 50;
    return { correctCount, total, percentage, passed };
  };

  const handleOptionClick = (questionIndex, selectedOption, correctAnswerLetter, options) => {
    const correctAnswer = getAnswerText(correctAnswerLetter, options);
    dispatch(
      setPastQuestionsOption({
        questionIndex,
        selectedOption,
        isCorrect: String(selectedOption) === String(correctAnswer),
        correctAnswerText: correctAnswer,
      }),
    );
  };

  useEffect(() => {
    if (count === 1) {
      setTimeout(() => {
        handleShowUserFeedback();
      }, 20000);
    }
  }, [count]);

  const processedQuestions = useMemo(
    () => deduplicateQuestionMeta(questions.slice(indexOfFirstQuestion, indexOfLastQuestion)),
    [questions, indexOfFirstQuestion, indexOfLastQuestion],
  );

  return (
    <main className="viewpastquestionmain">
      <div className="viewpastquestionheader">
        <button
          onClick={() => navigate("/past-questions")}
          className="back-selection-btn"
        >
          Back to Selection
        </button>
        <span>Jamb UTME Question</span>
      </div>
      <div className="viewpastquestionmainheader">
        <h1>
          {subject} <em>Past Question</em>({year})
        </h1>
      </div>

      {processedQuestions.length > 0 ? (
        processedQuestions.map(({ item, newItem }, index) => {
          const questionIndex = indexOfFirstQuestion + index;
          return (
            <QuestionCard
              key={item.id ?? item.number ?? index}
              item={item}
              newItem={newItem}
              questionNumber={questionIndex + 1}
              questionIndex={questionIndex}
              itemIndex={index}
              userAnswer={pastQuestionsOption[questionIndex]}
              loading={loading}
              onOptionClick={handleOptionClick}
              onViewExplanation={handleViewExplanation}
            />
          );
        })
      ) : (
        <p className="pastquestionanswer">
          No questions available. please try again
        </p>
      )}

      <Pagination
        totalPages={Math.ceil(questions.length / questionsPerPage)}
        page={page}
        setPage={(page) => {
          setCount(count + 1);
          setCurrentPage(page);
        }}
      />

      <div className="finish-button-container">
        {page == Math.ceil(questions.length / questionsPerPage) ? (
          <button
            onClick={() => {
              const result = calculateScore();
              dispatch(clearPastQuestionsOption());
              navigate("/past-questions/result", { state: result });
            }}
            className="finish-btn"
          >
            Finish
          </button>
        ) : null}
      </div>

      <Calculator />
    </main>
  );
};

export default ViewPastQuestion;
