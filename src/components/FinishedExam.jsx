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
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const user = useSelector((state) => state.user);

  const quitExam = async () => {
    const timeLeft = examTimerMins * 60 + examTimerSecs;
    let duration = 0;
    let completed = "";
    for (let element of exam) {
      if (!element?.option || exam.length < mockExamQuestions.length) {
        completed = "no";
        break;
      } else {
        completed = "yes";
      }
    }
    if (user?.plan === "Freemium") {
      duration = 600 - timeLeft;
    } else {
      duration = 1800 - timeLeft;
    }
    const performance =
      (exam?.reduce((acc, item, index) => {
        if (item?.score) {
          acc = acc + item.score;
          return acc;
        } else {
          return acc;
        }
      }, 0) /
        2 /
        mockExamQuestions.length) *
      100;
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/myRating/${user._id}`,
        { duration, completed, subject, performance }
      );
      if (res?.status === 200) {
        setTimeout(() => {
          dispatch(setUser(res?.data?.data));
          nav("/dashboard/mock-exam/result", { state: { subject } });
          setTimeout(() => {
            dispatch(setFeedbackModal());
          }, 20000);
        }, 500);
        setTimeout(() => {
          dispatch(setFinishedExam());
        }, 550);
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
