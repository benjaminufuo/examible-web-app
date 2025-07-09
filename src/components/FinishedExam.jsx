import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFeedbackModal, setFinishedExam, setUser } from "../global/slice";
import { toast } from "react-toastify";
import axios from "axios";

const FinishedExam = () => {
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
    let completed = "";
    for (let element of exam) {
      if (!element?.option) {
        completed = "no";
      } else {
        completed = "yes";
      }
    }
    if (user?.plan === "Freemium") {
      duration = 600 - timeLeft;
    } else {
      duration = 1800 - timeLeft;
    }
    const performance = exam?.reduce((acc, item, index) => {
      if (item?.score) {
        acc = acc + item.score;
        return acc;
      } else {
        return acc;
      }
    }, 0);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/myRating/${user._id}`,
        { duration, completed, subject, performance }
      );
      if (res?.status === 200) {
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          dispatch(setFinishedExam());
          nav("/dashboard/mock-exam/result", { state: { subject } });
          setTimeout(() => {
            dispatch(setFeedbackModal());
          }, 20000);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
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
        background: "aqua",
        height: "100vh",
        width: "100%",
      }}>
      <Loading />
    </div>
  );
};

export default FinishedExam;
