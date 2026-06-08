import { useEffect, useMemo, useState } from "react";
import "../../styles/dashboardCss/viewpastquestion.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoSparklesOutline,
} from "react-icons/io5";
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
import {
  getAnswerText,
  deduplicateQuestionMeta,
  getSafeText,
} from "../../utils/questionUtils";
import useAiExplanation from "../../utils/useAiExplanation";
import { motion, AnimatePresence } from "framer-motion";

const QuestionCard = ({
  item,
  newItem,
  questionIndex,
  userAnswer,
  loading,
  onOptionClick,
  onViewExplanation,
}) => {
  const correctAnswer = getAnswerText(item.answer, item.options);

  return (
    <motion.div
      id={`question-${item.number}`}
      className="vpq-question-card"
      key={item.number}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: questionIndex * 0.1 }}
    >
      <div className="vpq-question-header">
        <span className="vpq-q-number">Q{item.number}</span>
      </div>
      <div className="vpq-question-body">
        <QuestionMeta
          item={item}
          newItem={newItem}
          subheadingClassName="vpq-subheading"
          imageClassName="vpq-diagram"
        />
        <h3 className="vpq-question-text">
          <Latex>{getSafeText(item?.question)}</Latex>
        </h3>
      </div>
      <div className="vpq-options-grid">
        {item.options.map((option, optionindex) => {
          const correctAnswer = getAnswerText(item.answer, item.options);
          let optionStateClass = "vpq-option-default";

          if (userAnswer) {
            if (option === userAnswer.selectedOption) {
              optionStateClass = userAnswer.isCorrect
                ? "vpq-option-correct"
                : "vpq-option-wrong";
            } else if (!userAnswer.isCorrect && option === correctAnswer) {
              optionStateClass = "vpq-option-revealed";
            } else {
              optionStateClass = "vpq-option-disabled";
            }
          }

          return (
            <div
              key={optionindex}
              className={`vpq-option-card ${optionStateClass}`}
              onClick={() => {
                if (!userAnswer) {
                  onOptionClick(
                    item.number - 1,
                    option,
                    item.answer,
                    item.options || [],
                  );
                }
              }}
            >
              <div className="vpq-option-letter">
                {String.fromCharCode(65 + optionindex)}
              </div>
              <div className="vpq-option-content">
                <Latex>{getSafeText(option)}</Latex>
              </div>
              {optionStateClass === "vpq-option-correct" && (
                <IoCheckmarkCircle className="vpq-status-icon correct" />
              )}
              {optionStateClass === "vpq-option-wrong" && (
                <IoCloseCircle className="vpq-status-icon wrong" />
              )}
              {optionStateClass === "vpq-option-revealed" && (
                <IoCheckmarkCircle className="vpq-status-icon revealed" />
              )}
            </div>
          );
        })}
      </div>
      <AnimatePresence>
        {userAnswer && (
          <motion.div
            className="vpq-ai-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`vpq-feedback-banner ${userAnswer.isCorrect ? "success" : "error"}`}
            >
              {userAnswer.isCorrect
                ? "Excellent! You got it right."
                : "Incorrect. Let's learn from this."}
            </div>
            <button
              className="vpq-ai-btn"
              disabled={loading}
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
                  questionIndex,
                )
              }
            >
              {loading === questionIndex ? (
                <ClipLoader color="white" size={16} />
              ) : (
                <>
                  <IoSparklesOutline /> View AI Explanation
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ViewPastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleCompleteSession = () => {
    // Transform the pastQuestionsOption object into an array that mimics the 'exam' state.
    const transformedExam = questions.map((question, index) => {
      const userAnswer = pastQuestionsOption[index];
      if (userAnswer) {
        // Find the letter for the selected option
        const optionIndex = question.options.findIndex(
          (opt) => opt === userAnswer.selectedOption,
        );
        const optionLetter =
          optionIndex !== -1 ? String.fromCharCode(65 + optionIndex) : null;
        return {
          score: userAnswer.isCorrect ? 2 : 0,
          option: optionLetter,
        };
      }
      // Return a default object for unanswered questions
      return { score: 0, option: null };
    });

    // Prepare state to pass to MockResult
    const resultState = {
      questions,
      exam: transformedExam,
      subject,
      year,
      isPastQuestion: true, // A flag to indicate the source
    };

    // Navigate safely using your existing verified route path
    navigate("/past-questions/result", { state: resultState });
  };

  const year = useSelector((state) => state.year);
  const subject = useSelector((state) => state.exam);
  const questions = useSelector((state) => state.pastQuestions) || [];
  const pastQuestionsOption = useSelector((state) => state.pastQuestionsOption);
  const [count, setCount] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const page = location.state?.page || currentPage || 1;
  const questionsPerPage = 5;

  const indexOfLastQuestion = page * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const { handleShowUserFeedback } = useExamibleContext();
  const { loading: aiLoading, handleViewExplanation } = useAiExplanation(
    year,
    subject,
  );

  const handleOptionClick = (
    questionIndex,
    selectedOption,
    correctAnswerLetter,
    options,
  ) => {
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
    () =>
      deduplicateQuestionMeta(
        questions.slice(indexOfFirstQuestion, indexOfLastQuestion),
      ),
    [questions, indexOfFirstQuestion, indexOfLastQuestion],
  );

  return (
    <main className="vpq-premium-main">
      <div className="vpq-sticky-header">
        <div className="vpq-header-content">
          <button
            onClick={() => setShowExitModal(true)}
            className="vpq-back-btn"
          >
            <IoArrowBack size={20} /> Back to Selection
          </button>
          <div className="vpq-title-group">
            <h1>{subject}</h1>
            <span>JAMB UTME {year}</span>
          </div>
          <div className="vpq-progress-badge">
            Page {page} of {Math.ceil(questions.length / questionsPerPage)}
          </div>
        </div>
      </div>

      <div className="vpq-content-wrapper">
        {processedQuestions?.length > 0 ? (
          processedQuestions?.map(({ item, newItem }, index) => {
            const userAnswer =
              pastQuestionsOption[indexOfFirstQuestion + index];

            return (
              <QuestionCard
                item={item}
                newItem={newItem}
                loading={aiLoading}
                onOptionClick={handleOptionClick}
                onViewExplanation={handleViewExplanation}
                questionIndex={index}
                userAnswer={userAnswer}
              />
            );
          })
        ) : (
          <div className="vpq-empty-state">
            <p>
              No questions available. Please try selecting a different subject
              or year.
            </p>
          </div>
        )}

        <div className="vpq-footer-controls">
          <Pagination
            totalPages={Math.ceil(questions.length / questionsPerPage)}
            page={page}
            setPage={(page) => {
              setCount(count + 1);
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {page == Math.ceil(questions.length / questionsPerPage) && (
            <button onClick={handleCompleteSession} className="vpq-finish-btn">
              Complete Practice Session
            </button>
          )}
        </div>
        <Calculator />
      </div>

      <AnimatePresence>
        {showExitModal && (
          <motion.div
            className="vpq-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="vpq-exit-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <h3>End Past Question Session?</h3>
              <p>
                Are you sure you want to leave this session? Your current
                progress may not be saved.
              </p>
              <div className="vpq-modal-actions">
                <button
                  className="vpq-modal-btn secondary"
                  onClick={() => {
                    setShowExitModal(false);
                    navigate("/past-questions");
                  }}
                >
                  End Session
                </button>
                <button
                  className="vpq-modal-btn primary"
                  onClick={() => setShowExitModal(false)}
                >
                  Continue Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default ViewPastQuestion;
