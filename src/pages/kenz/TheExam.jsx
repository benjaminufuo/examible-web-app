import { useEffect, useLayoutEffect, useState } from "react";
import "../../styles/dashboardCss/examBody.css";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  nextQuestion,
  setExamTimeout,
  setFinishedExam,
  setMockExamOption,
  theExamTimer,
} from "../../global/slice";
import { useExamibleContext } from "../../context/ExamibleContext";

const TheExam = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockExamOptions = useSelector((state) => state.mockExamOptions);
  const examMeter = useSelector((state) => state.examMeter);
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const exam = useSelector((state) => state.exam);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const [isNext, setIsNext] = useState(false);
  const arrayOfNumbers = Array.from(
    { length: mockExamQuestions.length },
    (_, i) => i + 1
  );

  const { setShowLeavingNow } = useExamibleContext();

  const dispatch = useDispatch();
  const nav = useNavigate();
  const { subjectId } = useParams();
  const num = Number(subjectId);
  const currentQuestion = mockExamQuestions?.find(
    (_, index) => index === num - 1
  );

  useLayoutEffect(() => {
    if (mockExamQuestions.length <= 0) {
      location.href = "/dashboard/overview";
    }
  }, [mockExamQuestions]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(theExamTimer());
    }, 1000);

    if (examTimerMins === 0 && examTimerSecs === 0) {
      dispatch(setExamTimeout());
    }
    return () => clearInterval(interval);
  }, [examTimerSecs]);

  const previousExam = () => {
    dispatch(
      setMockExamOption({
        option: exam[num - 2]?.option,
        answer: exam[num - 2]?.answer,
      })
    );
    nav(`/mock-exam/${num - 1}`);
    // dispatch(previousQuestion())
  };

  const nextExam = () => {
    dispatch(nextQuestion({ answer: currentQuestion?.answer, subjectId }));
    nav(`/mock-exam/${num + 1}`);
    if (exam.length > subjectId) {
      dispatch(
        setMockExamOption({
          option: exam[num]?.option,
          answer: exam[num]?.answer,
        })
      );
    } else {
      dispatch(setMockExamOption("F"));
    }
  };

  const handleFinishedExam = () => {
    dispatch(nextQuestion({ answer: currentQuestion?.answer, subjectId }));
    dispatch(setFinishedExam());
  };

  useEffect(() => {
    if (
      mockExamOptions.optionA ||
      mockExamOptions.optionB ||
      mockExamOptions.optionC ||
      mockExamOptions.optionD
    ) {
      setIsNext(true);
    } else {
      setIsNext(false);
    }
  }, [mockExamOptions]);
  return (
    <div className="examBody">
      <div className="examBody-mobile">
        <button onClick={() => setShowLeavingNow(true)}>x</button>
        <h5>Jamb Mock Exam</h5>
        <article>
          <aside>
            <meter min={0} max={100} value={examMeter}></meter>
            <p>{parseInt(examMeter).toFixed(2)}%</p>
          </aside>
          <section>
            <LuClock2 fontSize={30} />
            {examTimerMins}:{examTimerSecs}
          </section>
        </article>
      </div>
      <div className="examBody-firstLayer">
        <h3>Jamb Mock Exam</h3>
        <aside>
          <meter min={0} max={100} value={examMeter}></meter>
          <p>{parseInt(examMeter).toFixed(2)}%</p>
        </aside>
        <section>
          <LuClock2 fontSize={30} />
          {examTimerMins}:{examTimerSecs}
        </section>
        <button onClick={() => setShowLeavingNow(true)}>x</button>
      </div>
      <h1>{mockSelectedSubject} QUESTIONS</h1>
      <div className="examBody-secondLayer">
        <div className="examBody-secondLayerHolder">
          <main>
            <h6>Question {subjectId}</h6>
            {currentQuestion?.subheadingA && (
              <h2>{currentQuestion?.subheadingA}</h2>
            )}
            {currentQuestion?.diagramUrlA && (
              <img
                src={currentQuestion?.diagramUrlA}
                alt="Diagram loading..."
              />
            )}
            {currentQuestion?.subheadingB && (
              <h3>{currentQuestion?.subheadingB}</h3>
            )}
            {currentQuestion?.diagramUrlB && (
              <img
                src={currentQuestion?.diagramUrlB}
                alt="Diagram loading..."
              />
            )}
            <h5
              dangerouslySetInnerHTML={{ __html: currentQuestion?.question }}
            ></h5>
            {currentQuestion?.options[0] && (
              <nav
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(setMockExamOption({ option: "A", answer: "A" }))
                }
              >
                <h4>A.</h4>
                <p>
                  {currentQuestion?.options[0]?.startsWith("A.")
                    ? currentQuestion?.options[0]?.slice(2)
                    : currentQuestion?.options[0]}
                </p>
                <input
                  type="radio"
                  checked={mockExamOptions.optionA}
                  readOnly
                />
              </nav>
            )}
            {currentQuestion?.options[1] && (
              <nav
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(setMockExamOption({ option: "B", answer: "B" }))
                }
              >
                <h4>B.</h4>
                <p>
                  {currentQuestion?.options[1]?.startsWith("B.")
                    ? currentQuestion?.options[1]?.slice(2)
                    : currentQuestion?.options[1]}
                </p>
                <input type="radio" checked={mockExamOptions.optionB} />
              </nav>
            )}
            {currentQuestion?.options[2] && (
              <nav
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(setMockExamOption({ option: "C", answer: "C" }))
                }
              >
                <h4>C.</h4>
                <p>
                  {currentQuestion?.options[2]?.startsWith("C.")
                    ? currentQuestion?.options[2]?.slice(2)
                    : currentQuestion?.options[2]}{" "}
                </p>
                <input type="radio" checked={mockExamOptions.optionC} />
              </nav>
            )}
            {currentQuestion?.options[3] && (
              <nav
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(setMockExamOption({ option: "D", answer: "D" }))
                }
              >
                <h4>D.</h4>
                <p>
                  {currentQuestion?.options[3]?.startsWith("D.")
                    ? currentQuestion?.options[3]?.slice(2)
                    : currentQuestion?.options[3]}
                </p>
                <input type="radio" checked={mockExamOptions.optionD} />
              </nav>
            )}
            {currentQuestion?.options[4] && (
              <nav
                style={{ cursor: "pointer" }}
                onClick={() =>
                  dispatch(setMockExamOption({ option: "E", answer: "E" }))
                }
              >
                <h4>E.</h4>
                <p>
                  {currentQuestion?.options[4]?.startsWith("E.")
                    ? currentQuestion?.options[4]?.slice(2)
                    : currentQuestion?.options[4]}
                </p>
                <input type="radio" checked={mockExamOptions.optionE} />
              </nav>
            )}
          </main>
        </div>
        <div className="examBody-secondLayerButton">
          <button
            style={{ display: parseInt(subjectId) === 1 ? "none" : "flex" }}
            onClick={() => previousExam()}
          >
            <article>
              <FaArrowLeftLong />
            </article>
            <h2>Previous</h2>
          </button>
          <button
            style={{
              display:
                mockExamQuestions.length === parseInt(subjectId)
                  ? "none"
                  : "flex",
            }}
            onClick={() => nextExam()}
          >
            <h2>{isNext ? "Next" : "Skip"}</h2>
            <article>
              <FaArrowRightLong />
            </article>
          </button>
          <button
            style={{
              display:
                mockExamQuestions.length === parseInt(subjectId)
                  ? "flex"
                  : "none",
              background: "#804BF2",
              color: "white",
              borderColor: "#804BF2",
            }}
            onClick={() => handleFinishedExam()}
          >
            <h2>Finish</h2>
          </button>
        </div>
        <div className="examBody-panel">
          <div className="examBody-panelHolder">
            {arrayOfNumbers.map((item, index) => (
              <main
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    item === Number(subjectId) || exam[index]?.option
                      ? "#804BF2"
                      : "white",
                  color:
                    item === Number(subjectId) || exam[index]?.option
                      ? "white"
                      : "#804BF2",
                }}
                onClick={() => {
                  dispatch(
                    nextQuestion({ answer: currentQuestion?.answer, subjectId })
                  );
                  nav(`/mock-exam/${index + 1}`);
                  dispatch(
                    setMockExamOption({
                      option: exam[index]?.option,
                      answer: exam[index]?.answer,
                    })
                  );
                }}
                key={index}
              >
                {item}
              </main>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheExam;
