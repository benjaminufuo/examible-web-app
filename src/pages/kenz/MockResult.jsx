import React, { useState } from "react";
import "../../styles/dashboardCss/mockResult.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { cancelExam } from "../../global/slice";
import { useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";

const MockResult = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const [intialCount, setIntialCount] = useState(0);
  const [finalCount, setFinalCount] = useState(5);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const nextSeries = () => {
    setIntialCount(intialCount + 5);
    setFinalCount(finalCount + 5);
    window.scrollTo(0, 0);
  };

  const previousSeries = () => {
    setIntialCount(intialCount - 5);
    setFinalCount(finalCount - 5);
    window.scrollTo(0, 0);
  };

  const performance = exam.reduce((acc, item, index) => {
    acc = acc + item.score;
    return acc;
  }, 0);

  const retryExam = () => {
    dispatch(cancelExam());
    nav("/dashboard/mock-exam");
  };
  return (
    <div className="mockResult">
      <h2>
        <span style={{ color: "#804bf2" }}>Mock Exam</span> (Jamb CBT Practice)
      </h2>
      <h2>Questions & Answers </h2>
      <h5>You Scored {performance} out of 100</h5>
      <div className="mockResult-holder">
        {mockExamQuestions
          ?.slice(intialCount, finalCount)
          .map((item, index) => (
            <main key={index}>
              <header>{item?.question}</header>
              <ul>
                <li>
                  {item?.options[0]?.startsWith("A.")
                    ? item?.options[0]
                    : "A. " + item?.options[0]}
                  <nav
                    style={{
                      display:
                        exam.slice(intialCount, finalCount)?.[index]?.option ===
                        "A"
                          ? "flex"
                          : "none",
                    }}>
                    {exam.slice(intialCount, finalCount)?.[index]?.score ===
                    0 ? (
                      <GiCancel fontSize={25} color="red" />
                    ) : (
                      <GrStatusGood fontSize={25} color="green" />
                    )}
                  </nav>
                </li>
                <li>
                  {item?.options[1]?.startsWith("B.")
                    ? item?.options[1]
                    : "B. " + item?.options[1]}
                  <nav
                    style={{
                      display:
                        exam.slice(intialCount, finalCount)?.[index]?.option ===
                        "B"
                          ? "flex"
                          : "none",
                    }}>
                    {exam.slice(intialCount, finalCount)?.[index]?.score ===
                    0 ? (
                      <GiCancel fontSize={25} color="red" />
                    ) : (
                      <GrStatusGood fontSize={25} color="green" />
                    )}
                  </nav>
                </li>
                <li>
                  {item?.options[2]?.startsWith("C.")
                    ? item?.options[2]
                    : "C. " + item?.options[2]}
                  <nav
                    style={{
                      display:
                        exam.slice(intialCount, finalCount)?.[index]?.option ===
                        "C"
                          ? "flex"
                          : "none",
                    }}>
                    {exam.slice(intialCount, finalCount)?.[index]?.score ===
                    0 ? (
                      <GiCancel fontSize={25} color="red" />
                    ) : (
                      <GrStatusGood fontSize={25} color="green" />
                    )}
                  </nav>
                </li>
                <li>
                  {item?.options[3]?.startsWith("D.")
                    ? item?.options[3]
                    : "D. " + item?.options[3]}
                  <nav
                    style={{
                      display:
                        exam.slice(intialCount, finalCount)?.[index]?.option ===
                        "D"
                          ? "flex"
                          : "none",
                    }}>
                    {exam.slice(intialCount, finalCount)?.[index]?.score ===
                    0 ? (
                      <GiCancel fontSize={25} color="red" />
                    ) : (
                      <GrStatusGood fontSize={25} color="green" />
                    )}
                  </nav>
                </li>
              </ul>
              <>
                <div className="mockResult-scores">
                  {item?.answer ===
                  exam.slice(intialCount, finalCount)?.[index]?.answer ? (
                    <footer>You got the answer</footer>
                  ) : (
                    <footer>The answer is {item?.answer}</footer>
                  )}
                  <button>View Explanation</button>
                </div>
              </>
            </main>
          ))}
      </div>
      <div className="mockResult-button">
        <button
          style={{ display: intialCount > 0 ? "flex" : "none" }}
          className="mockResult-more"
          onClick={() => previousSeries()}>
          <IoIosArrowBack color="#88DDFF" fontSize={25} /> Previous
        </button>
        <button
          className="mockResult-retry"
          style={{
            display: intialCount === 0 || finalCount === 50 ? "flex" : "none",
          }}
          onClick={() => retryExam()}>
          Retry Quiz
        </button>
        <button
          className="mockResult-more"
          style={{ display: finalCount < 50 ? "flex" : "none" }}
          onClick={() => nextSeries()}>
          See More
          <IoIosArrowForward color="#88DDFF" fontSize={25} />
        </button>
      </div>
    </div>
  );
};

export default MockResult;
