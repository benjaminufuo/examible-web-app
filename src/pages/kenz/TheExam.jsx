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
import "katex/dist/katex.min.css";
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
import {
  getTotalNumbersOfQuestion,
  normalizeQuestion,
} from "../../utils/questionUtils";

const getFreeLimit = (subj) =>
  subj?.toLowerCase().includes("english") ? 20 : 10;

const TOTAL_CBT_QUESTIONS = 180;

const TheExam = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const subjectId = location.state?.subjectId || 1;
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockSelectedSubject =
    useSelector((state) => state.mockSelectedSubject) || "";
  const isCbtMode = mockSelectedSubject === "CBT Examination";
  const mockExamOptions = useSelector((state) => state.mockExamOptions) || {};
  const subjectBlocks = mockExamQuestions || [];
  const num = Number(subjectId);
  const userAnswers = useSelector((state) => state.exam) || [];
  const user = useSelector((state) => state.user);
  const timedOut = useSelector((state) => state.timedOut);
  const { setShowLeavingNow } = useExamibleContext();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const isNext = Object.values(mockExamOptions).some(Boolean);
  const totalQuestions = getTotalNumbersOfQuestion(subjectBlocks);
  const answeredQuestions = userAnswers.length;
  const examMeter = totalQuestions
    ? Math.round(
        (answeredQuestions /
          (isCbtMode ? TOTAL_CBT_QUESTIONS : totalQuestions)) *
          100,
      )
    : 0;

  useLayoutEffect(() => {
    if (!subjectBlocks || subjectBlocks.length <= 0) {
      nav("/overview");
    }
  }, [subjectBlocks, nav]);

  const examSubjects = useMemo(() => {
    if (!isCbtMode || !subjectBlocks || subjectBlocks.length <= 1) {
      return [];
    }
    const subjects = subjectBlocks.map((q) => q.subject).filter(Boolean);
    return [...new Set(subjects)];
  }, [isCbtMode, subjectBlocks]);

  const lastSubjectChaged = location.state?.lastSubjectChaged;
  const locationCurrentSubject = location.state?.currentSubject;

  // Derive currentSubject from location state — all navigation already writes it there
  const currentSubject =
    locationCurrentSubject || examSubjects[0] || subjectBlocks[0]?.subject;

  const getCurrentUserAnswer = (
    questionNumber,
    selectedSubject = currentSubject,
  ) =>
    userAnswers.find(
      (q) => q.subject === selectedSubject && q.number === questionNumber,
    );

  // O(1) lookup for the nav grid; avoids O(n²) .find on every timer render
  const answeredMap = useMemo(() => {
    const map = {};
    userAnswers.forEach((a) => {
      map[`${a.subject}:${a.number}`] = a;
    });
    return map;
  }, [userAnswers]);

  // Memoize the subject block and normalised question so they don't recompute every second
  const currentBlock = useMemo(
    () => subjectBlocks.find((q) => q.subject === currentSubject),
    [subjectBlocks, currentSubject],
  );

  const currentQuestion = useMemo(
    () => normalizeQuestion(currentBlock?.questions[num - 1]),
    [currentBlock, num],
  );

  const isFreemium = !user?.plan || user?.plan === "Freemium";
  const currentFreeLimit = getFreeLimit(currentSubject);

  let navLength = !isCbtMode
    ? totalQuestions
    : currentSubject === "English"
      ? 60
      : 40;

  const navArray = Array.from({ length: navLength }, (_, i) => i);

  let isLastAvailableQuestion = isCbtMode
    ? examSubjects[examSubjects.length - 1] === currentSubject &&
      num === subjectBlocks.at(-1)?.questions?.length
    : num === totalQuestions;

  if (isCbtMode && isFreemium && num === currentFreeLimit) {
    const hasMoreSubjects = subjectBlocks.some(
      (q) => q.questions.length === num && q.subject === currentSubject,
    );
    if (!hasMoreSubjects) {
      isLastAvailableQuestion = true;
    }
  }

  const timerClass =
    examTimerMins < 5 ? "critical" : examTimerMins < 15 ? "warning" : "normal";

  useEffect(() => {
    const timerId = setInterval(() => {
      dispatch(theExamTimer());
    }, 1000);
    return () => clearInterval(timerId);
  }, [dispatch]);

  // Save the active question's answer before the timeout modal takes over
  useEffect(() => {
    if (!timedOut) return;
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );
  }, [timedOut, currentQuestion?.answer, subjectId, currentSubject, dispatch]);

  const previousExam = () => {
    if (num <= 1) return;
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );
    const prevIndex = num - 1;
    dispatch(
      setMockExamOption({
        option: getCurrentUserAnswer(prevIndex)?.option,
        answer: getCurrentUserAnswer(prevIndex)?.option,
      }),
    );
    nav(location.pathname, {
      state: { ...location.state, subjectId: prevIndex },
    });
  };

  const nextExam = () => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );

    let nextIndex = num;

    const currentExamIndex = subjectBlocks.findIndex(
      (q) => q.subject === currentSubject,
    );
    if (currentExamIndex === -1) return;

    const currentExam = subjectBlocks[currentExamIndex].questions;
    const nextSubj = subjectBlocks[currentExamIndex + 1];

    if (isCbtMode && isFreemium && currentExam) {
      const nextQ = currentExam[nextIndex];
      if (nextQ && num >= currentFreeLimit) {
        const id = lastSubjectChaged?.[nextSubj?.subject] ?? 1;
        nextIndex = nextSubj ? id : nextIndex;
      }
    }

    if (
      nextIndex >= currentExam.length &&
      subjectBlocks[subjectBlocks.length - 1]?.subject !== currentSubject
    ) {
      const id = lastSubjectChaged?.[nextSubj?.subject] ?? 1;
      nav(location.pathname, {
        state: {
          ...location.state,
          subjectId: id,
          currentSubject: nextSubj?.subject,
          lastSubjectChaged: {
            ...lastSubjectChaged,
            [currentSubject]: nextIndex,
          },
        },
      });
      // Pass nextSubj.subject explicitly — the closure still holds the old currentSubject
      dispatch(
        setMockExamOption({
          option: getCurrentUserAnswer(id, nextSubj?.subject)?.option,
          answer: getCurrentUserAnswer(id, nextSubj?.subject)?.option,
        }),
      );
      return;
    }

    nav(location.pathname, {
      state: { ...location.state, subjectId: nextIndex + 1 },
    });
    dispatch(
      setMockExamOption({
        option: getCurrentUserAnswer(nextIndex + 1)?.option,
        answer: getCurrentUserAnswer(nextIndex + 1)?.option,
      }),
    );
  };

  const handleFinishedExam = () => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );
    dispatch(setFinishedExam(true));
  };

  const handleSubjectSwitch = (targetSubject) => {
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );

    const targetIndex = lastSubjectChaged?.[targetSubject];
    if (targetIndex) {
      dispatch(
        setMockExamOption({
          option: getCurrentUserAnswer(targetIndex, targetSubject)?.option,
          answer: getCurrentUserAnswer(targetIndex, targetSubject)?.option,
        }),
      );
      nav(location.pathname, {
        state: {
          ...location.state,
          subjectId: targetIndex,
          currentSubject: targetSubject,
          lastSubjectChaged: {
            ...lastSubjectChaged,
            [currentSubject]: num,
          },
        },
      });
      return;
    }

    nav(location.pathname, {
      state: {
        ...location.state,
        subjectId: 1,
        currentSubject: targetSubject,
        lastSubjectChaged: { ...lastSubjectChaged, [currentSubject]: num },
      },
    });

    dispatch(
      setMockExamOption({
        option: getCurrentUserAnswer(1, targetSubject)?.option,
        answer: getCurrentUserAnswer(1, targetSubject)?.option,
      }),
    );
  };

  const handleNavClick = (relativeIndex, isLocked) => {
    if (isLocked) return;
    dispatch(
      nextQuestion({
        answer: currentQuestion?.answer,
        subjectId,
        subject: currentSubject,
      }),
    );
    nav(location.pathname, {
      state: { ...location.state, subjectId: relativeIndex + 1 },
    });
    dispatch(
      setMockExamOption({
        option: getCurrentUserAnswer(relativeIndex + 1)?.option,
        answer: getCurrentUserAnswer(relativeIndex + 1)?.option,
      }),
    );
  };

  if (num > navLength || num < 1) {
    return <ErrorPgae />;
  }

  return (
    <div className="exam-premium-layout">
      {/* PREMIUM HEADER */}
      <header
        className={`exam-header ${isCbtMode && examSubjects.length > 1 ? "cbt-active" : ""}`}
      >
        <div className="exam-header-left">
          <h1>
            {mockSelectedSubject} {isCbtMode ? "" : "CBT"}
          </h1>
          <span className="exam-progress-text">
            Question {num} of {navLength}
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
            onClick={() => {
              dispatch(
                nextQuestion({
                  answer: currentQuestion?.answer,
                  subjectId,
                  subject: currentSubject,
                }),
              );
              setShowLeavingNow(true);
            }}
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
                className={`exam-subject-tab ${currentSubject === subject ? "active" : ""}`}
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
              <span className="exam-q-number">Question {num}</span>
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
              <span>
                {(isCbtMode ? TOTAL_CBT_QUESTIONS : totalQuestions) -
                  answeredQuestions}{" "}
                Remaining
              </span>
            </div>
          </div>

          <div className="exam-sidebar-card">
            <h3>Question Navigator</h3>
            <div className="exam-nav-grid">
              {navArray.map((relativeIndex) => {
                const displayNum = relativeIndex + 1;
                const isAnswered =
                  answeredMap[`${currentSubject}:${displayNum}`]?.option;
                const isCurrent = relativeIndex + 1 === Number(subjectId);
                const isLocked =
                  isCbtMode && isFreemium && displayNum > currentFreeLimit;

                let chipClass = "exam-nav-chip";
                if (isCurrent) chipClass += " current";
                else if (isAnswered) chipClass += " answered";
                if (isLocked) chipClass += " locked";

                return (
                  <button
                    key={relativeIndex}
                    className={chipClass}
                    onClick={() => handleNavClick(relativeIndex, isLocked)}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <FaLock className="exam-nav-lock-icon" />
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
