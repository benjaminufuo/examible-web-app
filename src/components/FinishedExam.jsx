import { useEffect } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFinishedExam, setUser } from "../global/slice";
import { studentApi } from "../config/studentApi";
import { questionApi } from "../config/questionApi";
import { useExamibleContext } from "../context/ExamibleContext";
import { getTotalNumbersOfQuestion } from "../utils/questionUtils";

const FinishedExam = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);

  const { handleShowUserFeedback } = useExamibleContext();

  const quitExam = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;

    const validQuestionsLength = getTotalNumbersOfQuestion(mockExamQuestions);

    const initialDuration =
      parseInt(sessionStorage.getItem("mockExamDuration")) ||
      (user?.plan === "Freemium" ? 10 : 30);

    const duration = Math.min(
      7200,
      Math.max(1, initialDuration * 60 - timeLeft),
    );

    const isCbt = mockSelectedSubject === "CBT Examination";

    if (isCbt) {
      const subjects = mockExamQuestions.map((q) => q.subject);
      const data = exam.map((q) => ({
        subject: q?.subject || "N/A",
        isCorrect: q?.score === 2,
      }));
      try {
        const res = await questionApi.submitCbt({ duration, subjects, data });
        if (res?.data?.success) {
          setTimeout(() => {
            dispatch(setUser(res?.data?.data));
            nav("/cbt-mode/result", {
              state: { details: res?.data?.data?.lastCbtDetails },
            });
            setTimeout(() => {
              handleShowUserFeedback();
            }, 20000);
          }, 500);
          setTimeout(() => {
            dispatch(setFinishedExam(false));
          }, 2000);
        } else {
          dispatch(setFinishedExam(false));
        }
      } catch {
        dispatch(setFinishedExam(false));
      }
      return;
    }

    let completed = "no";
    if (exam && validQuestionsLength > 0 && exam.length === validQuestionsLength) {
      completed = "yes";
    }

    const rawPerformance =
      (exam?.reduce((acc, item) => acc + (item?.score || 0), 0) /
        2 /
        (validQuestionsLength || 1)) *
      100;

    const performance = Math.min(
      100,
      Math.max(0, Math.round(rawPerformance) || 0),
    );

    try {
      const res = await studentApi.updateRating({
        duration,
        completed,
        subject: mockSelectedSubject || "Mock Exam",
        performance,
      });
      if (res?.data?.success) {
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          nav("/mock-exam/result", {
            state: { subject: mockSelectedSubject },
          });
          setTimeout(() => {
            handleShowUserFeedback();
          }, 20000);
        }, 500);
        setTimeout(() => {
          dispatch(setFinishedExam(false));
        }, 2000);
      } else {
        dispatch(setFinishedExam(false));
      }
    } catch {
      dispatch(setFinishedExam(false));
    }
  };

  useEffect(() => {
    quitExam();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10,
        top: 0,
        background: "white",
        height: "100vh",
        width: "100%",
      }}
    >
      <Loading />
    </div>
  );
};

export default FinishedExam;
