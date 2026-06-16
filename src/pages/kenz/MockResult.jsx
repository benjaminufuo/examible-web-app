import { useState, useEffect, useMemo, useCallback } from "react";
import "../../styles/dashboardCss/mockResult.css";
import { useDispatch, useSelector } from "react-redux";
import { cancelExam } from "../../global/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Calculator from "../../components/Calculator";
import Pagination from "../../shared/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaChartPie,
  FaArrowRight,
  FaArrowLeft,
  FaBrain,
  FaRedo,
  FaLock,
} from "react-icons/fa";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import QuestionMeta from "../../components/QuestionMeta";
import { LETTERS, deduplicateQuestionMeta } from "../../utils/questionUtils";
import useAiExplanation from "../../utils/useAiExplanation";

const getFreeLimit = (subj) =>
  subj?.toLowerCase().includes("english") ? 20 : 10;

const MockResult = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();

  // Determine data source: Redux for mock exams, location.state for past questions
  const isPastQuestionResult = location.state?.isPastQuestion;

  const mockExamQuestionsFromRedux = useSelector(
    (state) => state.mockExamQuestions,
  );
  const examFromRedux = useSelector((state) => state.exam);
  const mockYearFromRedux = mockExamQuestionsFromRedux[0]?.year;
  const userToken = useSelector((state) => state.userToken);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const user = useSelector((state) => state.user);

  const isCbtMode =
    mockSelectedSubject === "CBT Examination" && !isPastQuestionResult;
  const lastCbt = isCbtMode
    ? (location.state?.details ?? user?.lastCbtDetails ?? null)
    : null;

  const mockExamQuestions = isPastQuestionResult
    ? location.state?.questions
    : isCbtMode
      ? mockExamQuestionsFromRedux.flatMap((block) =>
          block.questions.map((q, i) => ({
            ...q,
            subject: q.subject ?? block.subject,
            _position: i + 1,
          })),
        )
      : (mockExamQuestionsFromRedux[0]?.questions ?? []);
  const exam = isPastQuestionResult ? location.state?.exam : examFromRedux;
  const mockYear = isPastQuestionResult
    ? location.state?.year
    : mockYearFromRedux;

  const [viewStep, setViewStep] = useState("loading"); // "loading" | "summary" | "details"
  const [loadingText, setLoadingText] = useState("Calculating your results...");

  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [reviewSubject, setReviewSubject] = useState("");

  const page = currentPage;
  const questionsPerPage = 5;
  const indexOfLastQuestion = page * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const intialCount = indexOfFirstQuestion;
  const finalCount = indexOfLastQuestion;

  const { loading, handleViewExplanation } = useAiExplanation(
    mockYear,
    location.state?.subject,
    userToken,
  );

  const validQuestionsLength = mockExamQuestions?.length || 1;

  const performance =
    (exam?.reduce((acc, item) => acc + (item?.score || 0), 0) /
      2 /
      validQuestionsLength) *
      100 || 0;

  const totalScore =
    exam?.reduce((acc, item) => acc + (item?.score || 0), 0) / 2 || 0;

  const retryExam = () => {
    dispatch(cancelExam());
    if (isPastQuestionResult) {
      nav("/past-questions");
    } else {
      nav("/mock-exam");
    }
  };

  // Premium Loading Sequence
  useEffect(() => {
    if (viewStep === "loading") {
      const texts = [
        "Calculating your results...",
        "Analyzing your performance...",
        "Preparing your result breakdown...",
      ];
      let i = 0;
      const textInterval = setInterval(() => {
        i = (i + 1) % texts.length;
        setLoadingText(texts[i]);
      }, 1200);

      const finishTimeout = setTimeout(() => {
        setViewStep("summary");
      }, 3600);

      return () => {
        clearInterval(textInterval);
        clearTimeout(finishTimeout);
      };
    }
  }, [viewStep]);

  // Summary Math Computation
  const totalCorrect = Math.round(totalScore);
  const totalIncorrect = validQuestionsLength - totalCorrect;

  // For mock exams, exam items are keyed by subject+number (not position).
  // For past-question results, location.state.exam is positional — keep that path unchanged.
  const getExamEntry = useCallback(
    (questionIndex) => {
      if (isPastQuestionResult) return exam?.[questionIndex];
      if (isCbtMode) {
        const q = mockExamQuestions?.[questionIndex];
        return exam?.find(
          (e) => e.number === q?._position && e.subject === q?.subject,
        );
      }
      return exam?.find((e) => e.number === questionIndex + 1);
    },
    [isPastQuestionResult, isCbtMode, exam, mockExamQuestions],
  );

  const subjectBreakdown = useMemo(() => {
    const breakdown = {};
    mockExamQuestions?.forEach((q, index) => {
      const subj = q.subject || location.state?.subject || "Mock Exam";
      if (!breakdown[subj]) {
        breakdown[subj] = { total: 0, correct: 0, incorrect: 0 };
      }
      breakdown[subj].total += 1;
      const qScore = getExamEntry(index)?.score || 0;
      if (qScore > 0) {
        breakdown[subj].correct += 1;
      } else {
        breakdown[subj].incorrect += 1;
      }
    });
    return Object.entries(breakdown).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }, [mockExamQuestions, getExamEntry]);

  const examSubjectsForReview = isCbtMode
    ? mockExamQuestionsFromRedux.map((b) => b.subject).filter(Boolean)
    : [];
  const activeReviewSubject = isCbtMode
    ? reviewSubject || examSubjectsForReview[0] || ""
    : null;
  const reviewQuestions = useMemo(
    () =>
      isCbtMode && activeReviewSubject
        ? mockExamQuestions.filter((q) => q.subject === activeReviewSubject)
        : mockExamQuestions,
    [isCbtMode, activeReviewSubject, mockExamQuestions],
  );
  const reviewSubjectTotal = isCbtMode
    ? activeReviewSubject?.toLowerCase().includes("english")
      ? 60
      : 40
    : reviewQuestions.length;

  const processedQuestions = useMemo(
    () =>
      deduplicateQuestionMeta(reviewQuestions?.slice(intialCount, finalCount)),
    [reviewQuestions, intialCount, finalCount],
  );

  if (viewStep === "loading") {
    return (
      <div className="mr-loading-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mr-loading-content"
        >
          <ClipLoader color="#804bf2" size={60} speedMultiplier={0.8} />
          <AnimatePresence mode="wait">
            <motion.h3
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {loadingText}
            </motion.h3>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (viewStep === "summary") {
    return (
      <motion.div
        className="mr-summary-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mr-summary-header">
          <div>
            <h1>Examination Result Summary</h1>
            <p>
              A complete breakdown of your{" "}
              {isPastQuestionResult
                ? "Past Question"
                : isCbtMode
                  ? "CBT"
                  : "Mock Exam"}{" "}
              performance.
            </p>
          </div>
          <button
            className="mr-review-btn"
            onClick={() => setViewStep("details")}
          >
            Review Answers <FaArrowRight />
          </button>
        </div>
        <div className="mr-stats-grid">
          <div className="mr-stat-card">
            <div className="mr-stat-icon total">
              <FaQuestionCircle />
            </div>
            <div className="mr-stat-info">
              <h4>Total Questions</h4>
              <p>
                {isCbtMode
                  ? (lastCbt?.totalQuestions ?? validQuestionsLength)
                  : validQuestionsLength}
              </p>
            </div>
          </div>
          <div className="mr-stat-card">
            <div className="mr-stat-icon correct">
              <FaCheckCircle />
            </div>
            <div className="mr-stat-info">
              <h4>Correct Answers</h4>
              <p>
                {isCbtMode
                  ? (lastCbt?.correctAnswers ?? totalCorrect)
                  : totalCorrect}
              </p>
            </div>
          </div>
          <div className="mr-stat-card">
            <div className="mr-stat-icon incorrect">
              <FaTimesCircle />
            </div>
            <div className="mr-stat-info">
              <h4>Incorrect / Missed</h4>
              <p>
                {isCbtMode
                  ? (lastCbt?.wrongAnswers ?? totalIncorrect)
                  : totalIncorrect}
              </p>
            </div>
          </div>
          <div className="mr-stat-card">
            <div className="mr-stat-icon score">
              <FaChartPie />
            </div>
            <div className="mr-stat-info">
              <h4>Overall Score</h4>
              <p>
                {isCbtMode
                  ? `${(lastCbt?.average ?? performance).toFixed(1)}%`
                  : `${performance.toFixed(1)}%`}
              </p>
            </div>
          </div>
        </div>
        {isCbtMode && (
          <div className="mr-breakdown-section">
            <h3>Subject Breakdown</h3>
            <div className="mr-table-container">
              <table className="mr-breakdown-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Total Questions</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {(lastCbt?.subjectBreakdown ?? subjectBreakdown).map(
                    (item, idx) => {
                      const name = item.subject ?? item.name;
                      const total = item.totalQuestions ?? item.total;
                      const correct = item.correctAnswers ?? item.correct;
                      const incorrect = item.wrongAnswers ?? item.incorrect;
                      const accuracy =
                        item.average ??
                        (total > 0 ? (correct / total) * 100 : 0);
                      return (
                        <tr key={item._id ?? idx}>
                          <td>
                            <strong>{name}</strong>
                          </td>
                          <td>{total}</td>
                          <td className="text-success">{correct}</td>
                          <td className="text-danger">{incorrect}</td>
                          <td>
                            <span
                              className={`mr-accuracy-badge ${accuracy >= 50 ? "pass" : "fail"}`}
                            >
                              {accuracy.toFixed(0)}%
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="mr-detailed-review-main">
      <div className="mr-review-header">
        <button className="mr-back-btn" onClick={() => setViewStep("summary")}>
          <FaArrowLeft /> Back to Summary
        </button>
        <h2>Detailed Question Review</h2>
        <div className="mr-review-score">
          Score: {totalScore.toFixed(0)} / {mockExamQuestions?.length} (
          {performance.toFixed(0)}%)
        </div>
      </div>

      {isCbtMode && examSubjectsForReview.length > 1 && (
        <div className="mr-subject-tabs">
          {examSubjectsForReview.map((subj) => (
            <button
              key={subj}
              className={`mr-subject-tab ${activeReviewSubject === subj ? "active" : ""}`}
              onClick={() => {
                setReviewSubject(subj);
                setCurrentPage(1);
                nav(
                  {
                    pathname: location.pathname,
                  },
                  {
                    state: {
                      ...location.state,
                      page: 1,
                    },
                  },
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {subj}
            </button>
          ))}
        </div>
      )}

      <div className="mr-question-list">
        {Array.from({
          length: isCbtMode
            ? Math.min(
                questionsPerPage,
                Math.max(0, reviewSubjectTotal - intialCount),
              )
            : processedQuestions.length,
        }).map((_, index) => {
          const slotIndex = intialCount + index;
          const isLocked = isCbtMode && slotIndex >= reviewQuestions.length;
          const { item, newItem } = isLocked
            ? {}
            : (processedQuestions[index] ?? {});
          const currentExamItem =
            !isLocked && item
              ? isCbtMode
                ? exam?.find(
                    (e) =>
                      e.number === item._position && e.subject === item.subject,
                  )
                : getExamEntry(slotIndex)
              : null;
          const isCorrect = currentExamItem?.score > 0;
          const selectedOptionLetter = currentExamItem?.option;
          const correctOptionLetter = item?.answer;

          if (isLocked) {
            return (
              <motion.div
                key={slotIndex}
                className="mr-question-card mr-question-locked"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <div className="mr-locked-content">
                  <FaLock className="mr-lock-icon" />
                  <h4>Question {slotIndex + 1}</h4>
                  <p>Upgrade to Premium to review this question.</p>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={slotIndex}
              className="mr-question-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <div className="mr-q-header">
                <span className="mr-q-number">Question {slotIndex + 1}</span>
                {currentExamItem?.option ? (
                  isCorrect ? (
                    <span className="mr-q-badge correct">
                      <FaCheckCircle /> Correct
                    </span>
                  ) : (
                    <span className="mr-q-badge wrong">
                      <FaTimesCircle /> Incorrect
                    </span>
                  )
                ) : (
                  <span className="mr-q-badge skipped">Skipped</span>
                )}
              </div>

              <div className="mr-q-body">
                <QuestionMeta
                  item={item}
                  newItem={newItem}
                  subheadingClassName="mr-subheading"
                  imageClassName="mr-diagram"
                />

                <h3 className="mr-question-text">
                  <Latex>{item?.question}</Latex>
                </h3>
              </div>

              <div className="mr-options-grid">
                {item?.options.map((opt, oIdx) => {
                  if (!opt) return null;
                  const letter = String.fromCharCode(65 + oIdx);
                  const isSelected = selectedOptionLetter === letter;
                  const isActualAnswer = correctOptionLetter === letter;

                  let optClass = "mr-opt-default";
                  if (isSelected && isCorrect)
                    optClass = "mr-opt-correct-selected";
                  else if (isSelected && !isCorrect)
                    optClass = "mr-opt-wrong-selected";
                  else if (!isSelected && isActualAnswer)
                    optClass = "mr-opt-correct-revealed";

                  const displayOpt = opt?.startsWith(letter + ".")
                    ? opt.slice(2).trim()
                    : opt;

                  return (
                    <div key={oIdx} className={`mr-opt-card ${optClass}`}>
                      <div className="mr-opt-letter">{letter}</div>
                      <div className="mr-opt-content">
                        <Latex>{displayOpt}</Latex>
                      </div>
                      {optClass === "mr-opt-correct-selected" && (
                        <FaCheckCircle className="mr-opt-icon success" />
                      )}
                      {optClass === "mr-opt-wrong-selected" && (
                        <FaTimesCircle className="mr-opt-icon danger" />
                      )}
                      {optClass === "mr-opt-correct-revealed" && (
                        <FaCheckCircle className="mr-opt-icon revealed" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mr-explanation-section">
                <div
                  className={`mr-feedback-banner ${isCorrect ? "success" : "error"}`}
                >
                  {isCorrect
                    ? "You got the answer right!"
                    : `The correct answer is ${correctOptionLetter}`}
                </div>
                <button
                  className="mr-ai-btn"
                  onClick={() => {
                    handleViewExplanation(
                      item.number,
                      item.question,
                      item.passage,
                      item.options,
                      item.subheadingA,
                      item.subheadingB,
                      item.diagramUrlA,
                      item.diagramUrlB,
                      index,
                    );
                  }}
                  disabled={typeof loading === "number"}
                >
                  {loading === index ? (
                    <ClipLoader color="white" size={16} />
                  ) : (
                    <>
                      <FaBrain /> View AI Explanation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mr-footer-controls">
        <button className="mr-retry-btn" onClick={() => retryExam()}>
          <FaRedo /> Retake Exam
        </button>
        <div className="mr-pagination-wrapper">
          <Pagination
            page={page}
            setPage={setCurrentPage}
            totalPages={Math.ceil(reviewSubjectTotal / questionsPerPage)}
          />
        </div>
      </div>
      <Calculator />
    </div>
  );
};

export default MockResult;
