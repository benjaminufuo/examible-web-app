import { useEffect } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFinishedExam, setUser } from "../global/slice";
import { studentApi } from "../config/studentApi";
import { useExamibleContext } from "../context/ExamibleContext";

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

    let completed = "no";
    if (exam && mockExamQuestions && exam.length === mockExamQuestions.length) {
      completed = "yes";
      for (let element of exam) {
        if (!element || !element.option) {
          completed = "no";
          break;
        }
      }
    }

    const initialDuration =
      parseInt(sessionStorage.getItem("mockExamDuration")) ||
      (user?.plan === "Freemium" ? 10 : 30);

    const duration = Math.min(
      1800,
      Math.max(1, initialDuration * 60 - timeLeft),
    ); // Cap at 1800 to prevent backend max validation
    const validQuestionsLength = mockExamQuestions?.length || 1;

    const rawPerformance =
      (exam?.reduce((acc, item) => acc + (item?.score || 0), 0) /
        2 /
        validQuestionsLength) *
      100;

    const performance = Math.min(
      100,
      Math.max(0, Math.round(rawPerformance) || 0),
    ); // Ensure between 0 and 100

    const apiSubject =
      mockSelectedSubject === "CBT Examination"
        ? "English Language"
        : mockSelectedSubject || "Mock Exam";

    try {
      const res = await studentApi.updateRating({
        duration,
        completed,
        subject: apiSubject,
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
          dispatch(setFinishedExam());
        }, 550);
      }
    } catch {
      // baseApi handles error toast
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
