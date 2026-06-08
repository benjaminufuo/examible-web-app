import { useEffect, useLayoutEffect, useMemo } from "react";
import "../../styles/dashboardCss/examBody.css";
import { LuClock2 } from "react-icons/lu";
import {
  FiLogOut,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Latex from "react-latex-next";
import "katex/dist/katex.min.css"; // Required for math symbols to format correctly
import Calculator from "../../components/Calculator";
import ErrorPgae from "../jacob/ErrorPgae";
import { motion, AnimatePresence } from "framer-motion";
import {
  setMockExamOption,
  nextQuestion,
  setFinishedExam,
  theExamTimer,
} from "../../global/slice";
import { useExamibleContext } from "../../context/ExamibleContext";
import { normalizeQuestion } from "../../utils/questionUtils";

const TheExam = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const subjectId = location.state?.subjectId || 1;
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockSelectedSubject =
    useSelector((state) => state.mockSelectedSubject) || "";
  const mockExamOptions = useSelector((state) => state.mockExamOptions) || {};
  const exam = mockExamQuestions || [];
  const num = Number(subjectId);
  const currentQuestion = normalizeQuestion(exam[num - 1] || {});
  const userAnswers = useSelector((state) => state.exam) || [];
  const user = useSelector((state) => state.user);
  const { setShowLeavingNow } = useExamibleContext();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const isNext =
    mockExamOptions?.optionA ||
    mockExamOptions?.optionB ||
    mockExamOptions?.optionC ||
    mockExamOptions?.optionD ||
    mockExamOptions?.optionE;
  const totalQuestions = mockExamQuestions?.length || 0;
  const answeredQuestions = userAnswers.filter((item) => item?.option).length;
  const examMeter = totalQuestions
    ? Math.round((answeredQuestions / totalQuestions) * 100)
    : 0;

  // Premium Logic
  const isFreemium = !user?.plan || user?.plan === "Freemium";
  const getFreeLimit = (subj) => {
    return subj?.toLowerCase().includes("english") ? 20 : 10;
  };
  const currentFreeLimit = getFreeLimit(currentQuestion?.subject);

  useLayoutEffect(() => {
    if (!mockExamQuestions || mockExamQuestions.length <= 0) {
      nav("/overview");
    }
  }, [mockExamQuestions]);

  const isCbtMode = mockSelectedSubject === "CBT Examination";

  const examSubjects = useMemo(() => {
    if (!isCbtMode || !exam || exam.length === 0) {
      return [];
    }
    const subjects = exam.map((q) => q.subject).filter(Boolean);
    return [...new Set(subjects)];
  }, [isCbtMode, exam]);

  let displayQuestionNum = subjectId;
  let displayTotalNum = totalQuestions;
  let navStart = 0;
  let navLength = totalQuestions;

  if (isCbtMode && currentQuestion?.subject) {
    const firstIndexOfSubject = exam.findIndex(
      (q) => q.subject === currentQuestion.subject,
    );
    const totalInSubject = exam.filter(
      (q) => q.subject === currentQuestion.subject,
    ).length;
    displayQuestionNum = Number(subjectId) - firstIndexOfSubject;
    displayTotalNum = totalInSubject;
    navStart = firstIndexOfSubject;
    navLength = totalInSubject;
  }

  const navArray = Array.from({ length: navLength }, (_, i) => i);

  let isLastAvailableQuestion = Number(subjectId) === totalQuestions;
  if (isCbtMode && isFreemium && displayQuestionNum === currentFreeLimit) {
    const hasMoreSubjects = exam.some(
      (q, i) =>
        i > Number(subjectId) - 1 && q.subject !== currentQuestion.subject,
    );
    if (!hasMoreSubjects) {
      isLastAvailableQuestion = true;
    }
  }

  // Dynamic Timer States
  const timerClass =
    examTimerMins < 5 ? "critical" : examTimerMins < 15 ? "warning" : "normal";

  // 1. Setup the countdown interval
  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch(theExamTimer());
    }, 1000);

    return () => clearInterval(timerId); // Cleanup interval on unmount
  }, [dispatch]);

  // 2. Auto-submit when time is up
  useEffect(() => {
    if (examTimerMins === 0 && examTimerSecs === 0) {
      handleFinishedExam();
    }
  }, [examTimerMins, examTimerSecs]);

  const previousExam = () => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
      }),
    );
    if (num > 1) {
      let prevIndex = num - 2;

      // If skipping back to a previous subject on Freemium, jump straight to the last *unlocked* question
      if (isCbtMode && isFreemium) {
        const prevQ = exam[prevIndex];
        if (prevQ && prevQ.subject !== currentQuestion.subject) {
          const prevSubjStart = exam.findIndex(
            (q) => q.subject === prevQ.subject,
          );
          const prevSubjTotal = exam.filter(
            (q) => q.subject === prevQ.subject,
          ).length;
          const availableInPrev = Math.min(
            prevSubjTotal,
            getFreeLimit(prevQ.subject),
          );
          prevIndex = prevSubjStart + availableInPrev - 1;
        }
      }
      nav(location.pathname, { state: { subjectId: prevIndex + 1 } });
      dispatch(
        setMockExamOption({
          option: userAnswers[prevIndex]?.option,
          answer: userAnswers[prevIndex]?.option,
        }),
      );
    }
  };

  const nextExam = () => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
      }),
    );

    let nextIndex = num;

    // If reaching the limit of a subject on Freemium, skip straight to the next subject block
    if (isCbtMode && isFreemium) {
      const nextQ = exam[nextIndex];
      if (
        nextQ &&
        nextQ.subject === currentQuestion.subject &&
        displayQuestionNum >= currentFreeLimit
      ) {
        const nextSubjIndex = exam.findIndex(
          (q, i) =>
            i > Number(subjectId) - 1 && q.subject !== currentQuestion.subject,
        );
        nextIndex = nextSubjIndex !== -1 ? nextSubjIndex : totalQuestions;
      }
    }

    if (nextIndex < totalQuestions) {
      nav(location.pathname, { state: { subjectId: nextIndex + 1 } });
      dispatch(
        setMockExamOption({
          option: userAnswers[nextIndex]?.option,
          answer: userAnswers[nextIndex]?.option,
        }),
      );
    } else {
      handleFinishedExam();
    }
  };

  const handleFinishedExam = () => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
      }),
    );
    // Open the Finished Exam modal
    dispatch(setFinishedExam());
  };

  const handleSubjectSwitch = (targetSubject) => {
    // 1. Save current question progress before switching
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
      }),
    );

    // 2. Find the first question of the target subject
    const targetIndex = exam.findIndex((q) => q.subject === targetSubject);

    if (targetIndex !== -1) {
      // 3. Navigate to that question
      nav(location.pathname, { state: { subjectId: targetIndex + 1 } });

      // 4. Load the state for the new question
      dispatch(
        setMockExamOption({
          option: userAnswers[targetIndex]?.option,
          answer: userAnswers[targetIndex]?.option,
        }),
      );
    }
  };

  if (num > mockExamQuestions?.length || num < 1) {
    return <ErrorPgae />;
  }

  return (
    <div className="exam-premium-layout">
      {/* PREMIUM HEADER */}
      <header
        className={`exam-header ${isCbtMode && examSubjects.length > 1 ? "cbt-active" : ""}`}
      >
        <div className="exam-header-left">
          <h1>{mockSelectedSubject} CBT</h1>
          <span className="exam-progress-text">
            Question {displayQuestionNum} of {displayTotalNum}
          </span>
        </div>
        <div className="exam-header-right">
          <div className={`exam-timer ${timerClass}`}>
            <LuClock2 fontSize={30} />
            <span>
              {String(examTimerMins).padStart(2, "0")}:
              {String(examTimerSecs).padStart(2, "0")}
            </span>
          </div>
          <button
            className="exam-exit-btn"
            onClick={() => setShowLeavingNow(true)}
          >
            <FiLogOut /> Exit Exam
          </button>
        </div>
      </header>

      {/* DYNAMIC SUBJECT SWITCHER FOR CBT MODE */}
      <AnimatePresence>
        {isCbtMode && examSubjects.length > 1 && (
          <motion.div
            className="exam-subject-switcher"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {examSubjects.map((subject) => (
              <button
                key={subject}
                className={`exam-subject-tab ${currentQuestion?.subject === subject ? "active" : ""}`}
                onClick={() => handleSubjectSwitch(subject)}
              >
                {subject}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="exam-workspace">
        {/* MAIN QUESTION AREA */}
        <main className="exam-main-content">
          <motion.div
            key={subjectId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="exam-question-card"
          >
            <div className="exam-q-meta">
              <span className="exam-q-number">
                Question {displayQuestionNum}
              </span>
            </div>

            {currentQuestion?.subheadingA && (
              <h4>
                <Latex>{currentQuestion?.subheadingA}</Latex>
              </h4>
            )}
            {currentQuestion?.diagramUrlA && (
              <img
                src={currentQuestion?.diagramUrlA}
                alt="Diagram"
                className="exam-diagram"
              />
            )}
            {currentQuestion?.subheadingB && (
              <h4>
                <Latex>{currentQuestion?.subheadingB}</Latex>
              </h4>
            )}
            {currentQuestion?.diagramUrlB && (
              <img
                src={currentQuestion?.diagramUrlB}
                alt="Diagram"
                className="exam-diagram"
              />
            )}
            {currentQuestion?.question && (
              <h3 className="exam-q-text">
                <Latex>{currentQuestion?.question}</Latex>
              </h3>
            )}

            {/* DYNAMIC ANSWER CARDS */}
            <div className="exam-options-grid">
              {["A", "B", "C", "D", "E"].map((optLetter, idx) => {
                const optText = currentQuestion?.options[idx];
                if (!optText) return null;

                const isSelected = mockExamOptions[`option${optLetter}`];

                return (
                  <div
                    key={optLetter}
                    className={`exam-opt-card ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      dispatch(
                        setMockExamOption({
                          option: optLetter,
                          answer: optLetter,
                        }),
                      )
                    }
                  >
                    <div className="exam-opt-letter">{optLetter}</div>
                    <div className="exam-opt-text">
                      <Latex>
                        {optText.startsWith(`${optLetter}.`)
                          ? optText.slice(2).trim()
                          : optText}
                      </Latex>
                    </div>
                    {isSelected && <FiCheck className="exam-opt-check" />}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* QUICK ACTIONS BAR */}
          <div className="exam-actions-bar">
            <button
              className="exam-action-btn secondary"
              disabled={parseInt(subjectId) === 1}
              onClick={previousExam}
            >
              <FiChevronLeft /> Previous
            </button>

            {isLastAvailableQuestion ? (
              <button
                className="exam-action-btn submit"
                onClick={handleFinishedExam}
              >
                Submit Exam <FiCheck />
              </button>
            ) : (
              <button className="exam-action-btn primary" onClick={nextExam}>
                {isNext ? "Next" : "Skip"} <FiChevronRight />
              </button>
            )}
          </div>
        </main>

        {/* SIDEBAR: PROGRESS & NAVIGATOR */}
        <aside className="exam-sidebar">
          <div className="exam-sidebar-card">
            <h3>Exam Progress</h3>
            <div className="exam-progress-bar">
              <div
                className="exam-progress-fill"
                style={{ width: `${examMeter}%` }}
              ></div>
            </div>
            <div className="exam-progress-stats">
              <span>{answeredQuestions} Answered</span>
              <span>{totalQuestions - answeredQuestions} Remaining</span>
            </div>
          </div>

          <div className="exam-sidebar-card">
            <h3>Question Navigator</h3>
            <div className="exam-nav-grid">
              {navArray.map((relativeIndex) => {
                const globalIndex = navStart + relativeIndex;
                const displayNum = relativeIndex + 1;
                const isAnswered = userAnswers[globalIndex]?.option;
                const isCurrent = globalIndex + 1 === Number(subjectId);
                const isLocked =
                  isCbtMode && isFreemium && displayNum > currentFreeLimit;

                let chipClass = "exam-nav-chip";
                if (isCurrent) chipClass += " current";
                else if (isAnswered) chipClass += " answered";
                if (isLocked) chipClass += " locked";

                return (
                  <button
                    key={globalIndex}
                    className={chipClass}
                    onClick={() => {
                      if (isLocked) return;
                      dispatch(
                        nextQuestion({
                          answer: currentQuestion?.answer,
                          subjectId,
                        }),
                      );
                      nav(location.pathname, {
                        state: { subjectId: globalIndex + 1 },
                      });
                      dispatch(
                        setMockExamOption({
                          option: userAnswers[globalIndex]?.option,
                          answer: userAnswers[globalIndex]?.option,
                        }),
                      );
                    }}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <FaLock style={{ fontSize: "12px" }} />
                    ) : (
                      displayNum
                    )}
                  </button>
                );
              })}
            </div>

            {isCbtMode && isFreemium && navLength > currentFreeLimit && (
              <div className="exam-premium-warning">
                <FaLock className="exam-premium-warning-icon" />
                Freemium users are limited to {currentFreeLimit} questions for
                this subject.
              </div>
            )}
          </div>
        </aside>
      </div>
      <Calculator />
    </div>
  );
};
export default TheExam;
