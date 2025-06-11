import React, { useEffect, useState } from "react";
import "../../styles/dashboardCss/leavingNow.css";
import img1 from "../../assets/public/Quit Game.svg";
import {
  cancelExam,
  setFeedbackModal,
  setLeavingNow,
  setUser,
} from "../../global/slice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LeavingNow = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { subject } = useParams();
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const quitExam = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    let duration = 0;
    const completed = "no";
    if (user?.plan === "Freemium") {
      duration = 600 - timeLeft;
    } else {
      duration = 1800 - timeLeft;
    }
    const performance = exam.reduce((acc, item, index) => {
      acc = acc + item.score;
      return acc;
    }, 0);
    try {
      setLoading(true);
      const id = toast.loading("Please wait ...");
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/myRating/${user._id}`,
        { duration, completed, subject, performance }
      );
      if (res?.status === 200) {
        toast.dismiss(id);
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          dispatch(setLeavingNow());
          setLoading(false);
          nav("/dashboard/mock-exam/result");
          setTimeout(() => {
            dispatch(setFeedbackModal());
          }, 20000);
        }, 500);
      }
    } catch (error) {
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
        setLoading(false);
      }, 500);
    }
  };

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
              onClick={() => quitExam()}>
              Quit Anyway
            </button>
            <button
              disabled={loading}
              style={{ background: "white", color: "#804BF2" }}
              onClick={() => dispatch(setLeavingNow())}>
              Stay in Exam
            </button>
          </nav>
        </main>
      </div>
    </div>
  );
};

export default LeavingNow;
