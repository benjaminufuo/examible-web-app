import { useState } from "react";
import "../../styles/dashboardCss/mockResult.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { cancelExam } from "../../global/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { getAiResponse } from "../../config/Api";
import { useExamibleContext } from "../../context/ExamibleContext";

const MockResult = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const mockYear = useSelector((state) => state.mockYear);
  const [intialCount, setIntialCount] = useState(0);
  const [finalCount, setFinalCount] = useState(5);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(null);
  const location = useLocation();

  const { setShowAiResponseModal, setAIResponse } = useExamibleContext();

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

  const performance =
    (exam?.reduce((acc, item, index) => {
      if (!item?.score) {
        acc = acc + 0;
      } else {
        acc = acc + item?.score;
      }
      return acc;
    }, 0) /
      2 /
      mockExamQuestions?.length) *
    100;

  const retryExam = () => {
    dispatch(cancelExam());
    nav("/dashboard/mock-exam");
  };

  const handleViewExplanation = async (
    questionNum,
    question,
    passage,
    options,
    year,
    subject,
    id
  ) => {
    setLoading(id);
    try {
      const res = await getAiResponse(
        year,
        subject,
        questionNum,
        question,
        passage,
        options
      );
      if (res) {
        setLoading(null);
        setAIResponse(res.data.aiResponse);
        setShowAiResponseModal(true);
      }
    } catch (error) {
      setLoading(null);
      toast.error(error?.response?.data?.message);
    }
  };

  console.log(loading);

  return (
    <div className="mockResult">
      <h2>
        <span style={{ color: "#804bf2" }}>Mock Exam</span> (Jamb CBT Practice)
      </h2>
      <h2>Questions & Answers </h2>
      <h5>You Scored {performance.toFixed(2)} out of 100</h5>
      <div className="mockResult-holder">
        {mockExamQuestions
          ?.slice(intialCount, finalCount)
          .map((item, index) => (
            <main key={index}>
              {item?.subheadingA && <h2>{item?.subheadingA}</h2>}
              {item?.diagramUrlA && (
                <img src={item?.diagramUrlA} alt="Diagram loading..." />
              )}
              {item?.subheadingB && <h3>{item?.subheadingB}</h3>}
              {item?.diagramUrlB && (
                <img src={item?.diagramUrlB} alt="Diagram loading..." />
              )}
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
                    }}
                  >
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
                    }}
                  >
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
                    }}
                  >
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
                    }}
                  >
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
                  <button
                    onClick={() => {
                      handleViewExplanation(
                        item.number,
                        item.question,
                        item.passage,
                        item.options,
                        mockYear,
                        location.state.subject,
                        index
                      );
                    }}
                    disabled={loading}
                  >
                    {loading === index ? (
                      <ClipLoader color="black" size={16} />
                    ) : (
                      "view explanation"
                    )}
                  </button>
                </div>
              </>
            </main>
          ))}
      </div>
      <div className="mockResult-button">
        <button
          style={{ display: intialCount > 0 ? "flex" : "none" }}
          className="mockResult-more"
          onClick={() => previousSeries()}
        >
          <IoIosArrowBack color="#88DDFF" fontSize={25} /> Previous
        </button>
        <button
          className="mockResult-retry"
          style={{
            display:
              intialCount === 0 || finalCount === mockExamQuestions?.length
                ? "flex"
                : "none",
          }}
          onClick={() => retryExam()}
        >
          Retry Quiz
        </button>
        <button
          className="mockResult-more"
          style={{
            display: finalCount < mockExamQuestions?.length ? "flex" : "none",
          }}
          onClick={() => nextSeries()}
        >
          See More
          <IoIosArrowForward color="#88DDFF" fontSize={25} />
        </button>
      </div>
    </div>
  );
};

export default MockResult;
