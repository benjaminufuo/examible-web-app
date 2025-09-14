import { useEffect, useState } from "react";
import "../../styles/dashboardCss/examBody.css";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  nextQuestion,
  setExamTimeout,
  setFinishedExam,
  setLeavingNow,
  setMockExamOption,
  theExamTimer,
} from "../../global/slice";

const TheExam = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockExamOptions = useSelector((state) => state.mockExamOptions);
  const examMeter = useSelector((state) => state.examMeter);
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const exam = useSelector((state) => state.exam);
  const [isNext, setIsNext] = useState(false);
  const arrayOfNumbers = Array.from(
    { length: mockExamQuestions.length },
    (_, i) => i + 1
  );
  // console.log(mockExamOptions,exam)

  const dispatch = useDispatch();
  const nav = useNavigate();
  const { subject, subjectId } = useParams();
  const num = Number(subjectId);
  const currentQuestion = mockExamQuestions?.find(
    (item, index) => index === num - 1
  );
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
    nav(`/mock-exam/${subject}/${num - 1}`);
    // dispatch(previousQuestion())
  };

  const nextExam = () => {
    dispatch(nextQuestion({ answer: currentQuestion?.answer, subjectId }));
    nav(`/mock-exam/${subject}/${num + 1}`);
    if (exam.length > subjectId) {
      dispatch(
        setMockExamOption({
          option: exam[num]?.option,
          answer: exam[num]?.answer,
        })
      );
    } else {
      dispatch(setMockExamOption("E"));
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
        <button onClick={() => dispatch(setLeavingNow())}>x</button>
        <h5>Jamb Mock Exam</h5>
        <article>
          <aside>
            <meter min={0} max={100} value={examMeter}></meter>
            <p>{examMeter}%</p>
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
          <p>{examMeter}%</p>
        </aside>
        <section>
          <LuClock2 fontSize={30} />
          {examTimerMins}:{examTimerSecs}
        </section>
        <button onClick={() => dispatch(setLeavingNow())}>x</button>
      </div>
      <h1>{subject} QUESTIONS</h1>
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
            <h5>{currentQuestion?.question}</h5>
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
              <input type="radio" checked={mockExamOptions.optionA} readOnly />
            </nav>
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
                  nav(`/mock-exam/${subject}/${index + 1}`);
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
