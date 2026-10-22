import { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LuWifiOff, LuTimerOff } from "react-icons/lu";
import { setFinishedExam } from "../global/slice";
import { studentApi } from "../config/studentApi";
import { useExamibleContext } from "../context/ExamibleContext";
import { markEngaged } from "../utils/installNudge";
import { getTotalNumbersOfQuestion } from "../utils/questionUtils";
import {
  EXAM_SUBMIT_MESSAGES,
  startNewCbt,
  submitCbtV2,
} from "../utils/cbtSubmit";
import { useRetryOnReconnect } from "../hooks/useRetryOnReconnect";
import "../styles/offline.css";

// Submits the exam when it ends (time up or "Submit").
// If there's no connection, it stays up and keeps the answers: "You're offline.
// Your answers are saved. Reconnect to submit." with a Submit button, and it
// retries by itself when the connection comes back. (Unmounting would bring
// back the time-up modal.) Submitting is repeatable on the server, so a retry
// after a lost reply still reaches the result page.
// A CBT session that has ended (404/410) gets its own message and a way back.

// One submit at a time, across remounts (StrictMode, the overlay re-showing).
// In memory on purpose: a reload clears it, so the reloaded page submits
// again instead of waiting for a request that no longer exists.
let submitting = false;

const FinishedExam = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const cbtSessionId = useSelector((state) => state.cbtSessionId);
  // "submitting" | "offline" | "ended"
  const [status, setStatus] = useState("submitting");
  // Back online after failing offline: submit again by itself
  const { attemptStarted, attemptFailedOffline } = useRetryOnReconnect(() =>
    submit(),
  );

  const { handleShowUserFeedback } = useExamibleContext();

  const isCbt = mockSelectedSubject === "CBT Examination";

  const onSubmitted = (path, state) => {
    setTimeout(() => {
      submitting = false;
      nav(path, { state });
      markEngaged(); // the Overview install card may show from now on
      setTimeout(() => {
        handleShowUserFeedback();
      }, 20000);
    }, 500);
    setTimeout(() => {
      dispatch(setFinishedExam(false));
    }, 2000);
  };

  // A failed submit: offline keeps this screen (and the answers) for a retry;
  // an ended CBT session explains itself; any other server error goes back to
  // the exam as before
  const onFailed = (reason) => {
    submitting = false;
    if (reason === "offline") attemptFailedOffline();
    if (reason === "offline" || reason === "ended") {
      setStatus(reason);
      return;
    }
    dispatch(setFinishedExam(false));
  };

  const submitMock = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    const validQuestionsLength = getTotalNumbersOfQuestion(mockExamQuestions);
    const initialDuration =
      parseInt(sessionStorage.getItem("mockExamDuration")) ||
      (user?.plan === "Freemium" ? 10 : 30);
    const duration = Math.min(
      7200,
      Math.max(1, initialDuration * 60 - timeLeft),
    );

    let completed = "no";
    if (
      exam &&
      validQuestionsLength > 0 &&
      exam.length === validQuestionsLength
    ) {
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
      const res = await studentApi.updateRating(
        {
          duration,
          completed,
          subject: mockSelectedSubject || "Mock Exam",
          performance,
        },
        { silent: true }, // this screen shows the message
      );
      if (res?.data?.success) {
        onSubmitted("/mock-exam/result", { subject: mockSelectedSubject });
      } else {
        onFailed("error");
      }
    } catch (error) {
      onFailed(error?.response ? "error" : "offline");
    }
  };

  const submit = async () => {
    // One guard for every trigger (first try, the button, reconnecting)
    if (submitting) return;
    submitting = true;
    attemptStarted();
    setStatus("submitting");

    if (!isCbt) {
      await submitMock();
      return;
    }
    const result = await submitCbtV2({
      dispatch,
      sessionId: cbtSessionId,
      exam,
    });
    if (result.ok) {
      onSubmitted("/cbt-mode/result", { details: result.details });
    } else {
      onFailed(result.reason);
    }
  };

  useEffect(() => {
    submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 10,
        top: 0,
        background: "var(--ex-bg)",
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status === "submitting" && <Loading />}

      {status === "offline" && (
        <div className="offline-screen" role="alert">
          <div className="offline-screen__icon">
            <LuWifiOff size={34} />
          </div>
          <h2 className="offline-screen__title">Your answers are saved</h2>
          <p className="offline-screen__text">{EXAM_SUBMIT_MESSAGES.offline}</p>
          <div className="offline-screen__actions">
            <button
              type="button"
              className="offline-screen__primary"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {status === "ended" && (
        <div className="offline-screen" role="alert">
          <div className="offline-screen__icon">
            <LuTimerOff size={34} />
          </div>
          <h2 className="offline-screen__title">Session ended</h2>
          <p className="offline-screen__text">{EXAM_SUBMIT_MESSAGES.ended}</p>
          <div className="offline-screen__actions">
            <button
              type="button"
              className="offline-screen__primary"
              onClick={() => startNewCbt(dispatch, nav)}
            >
              Start a new CBT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishedExam;
