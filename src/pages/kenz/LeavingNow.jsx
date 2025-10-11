import { useEffect, useState } from "react";
import "../../styles/dashboardCss/leavingNow.css";
import { setUser } from "../../global/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useExamibleContext } from "../../context/ExamibleContext";

const LeavingNow = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const { handleShowUserFeedback, showLeavingNow, setShowLeavingNow } =
    useExamibleContext();

  const quitExam = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    let duration = 0;
    const completed = "no";
    if (user?.plan === "Freemium") {
      duration = 600 - timeLeft;
    } else {
      duration = 1800 - timeLeft;
    }
    const performance =
      (exam.reduce((acc, item) => {
        acc = acc + item.score;
        return acc;
      }, 0) /
        2 /
        mockExamQuestions?.length) *
      100;
    try {
      setLoading(true);
      const id = toast.loading("Please wait ...");
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/myRating/${user._id}`,
        { duration, completed, subject: mockSelectedSubject, performance }
      );
      if (res?.status === 200) {
        toast.dismiss(id);
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          setShowLeavingNow(false);
          setLoading(false);
          nav("/dashboard/mock-exam/result", {
            state: { subject: mockSelectedSubject },
          });
          setTimeout(() => {
            handleShowUserFeedback();
          }, 20000);
        }, 500);
      }
    } catch (error) {
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }, 500);
    } finally {
      toast.dismiss(id);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showLeavingNow ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showLeavingNow]);

  return (
    <div className="leavingNow">
      <div className="leavingNowHolder">
        <main>
          <h3>Leaving Now? You Might Be Hurting Your Score</h3>
          <p>
            Quitting this mock exam early means missing important questions —
            and your final score could be much lower.
          </p>
          <nav>
            <button
              disabled={loading}
              style={{
                background: loading ? "#804bf233" : "#804BF2",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={() => quitExam()}
            >
              Quit Anyway
            </button>
            <button
              disabled={loading}
              style={{ background: "white", color: "#804BF2" }}
              onClick={() => setShowLeavingNow(false)}
            >
              Stay in Exam
            </button>
          </nav>
        </main>
      </div>
    </div>
  );
};

export default LeavingNow;
