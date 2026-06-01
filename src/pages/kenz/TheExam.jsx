import { useEffect, useLayoutEffect } from "react";
import "../../styles/dashboardCss/examBody.css";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuClock2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  nextQuestion,
  setExamTimeout,
  setFinishedExam,
  setMockExamOption,
  theExamTimer,
} from "../../global/slice";
import { useExamibleContext } from "../../context/ExamibleContext";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import Calculator from "../../components/Calculator";
import ErrorPgae from "../jacob/ErrorPgae";
import QuestionMeta from "../../components/QuestionMeta";
import { normalizeQuestion, LETTERS, OPTION_KEYS } from "../../utils/questionUtils";

const OptionItem = ({ option, letter, isChecked, onSelect }) => {
  if (!option) return null;
  const prefix = `${letter}.`;
  const text = option.startsWith(prefix) ? option.slice(prefix.length) : option;
  return (
    <nav style={{ cursor: "pointer" }} onClick={onSelect}>
      <h4>{letter}.</h4>
      <p>
        <Latex>{text}</Latex>
      </p>
      <input type="radio" checked={isChecked} readOnly />
    </nav>
  );
};

const QuestionDisplay = ({ question, subjectId, mockExamOptions, dispatch }) => (
  <main>
    <h6>Question {subjectId}</h6>
    {question && <QuestionMeta item={question} />}
    {question?.question && (
      <h5>
        <Latex>{question.question}</Latex>
      </h5>
    )}
    {LETTERS.map((letter, i) => (
      <OptionItem
        key={letter}
        option={question?.options?.[i]}
        letter={letter}
        isChecked={mockExamOptions[OPTION_KEYS[i]]}
        onSelect={() =>
          dispatch(setMockExamOption({ option: letter, answer: letter }))
        }
      />
    ))}
  </main>
);

const TheExam = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const mockExamOptions = useSelector((state) => state.mockExamOptions);
  const examMeter = useSelector((state) => state.examMeter);
  const examTimerMins = useSelector((state) => state.examTimerMins);
  const examTimerSecs = useSelector((state) => state.examTimerSecs);
  const exam = useSelector((state) => state.exam);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);

  const location = useLocation();
  const nav = useNavigate();
  const { setShowLeavingNow } = useExamibleContext();
  const dispatch = useDispatch();

  const subjectId = location.state?.subjectId || 1;
  const num = Number(subjectId);
  const currentQuestion = normalizeQuestion(mockExamQuestions?.[num - 1]);

  const isNext = OPTION_KEYS.some((k) => !!mockExamOptions[k]);

  const arrayOfNumbers = Array.from(
    { length: mockExamQuestions?.length },
    (_, i) => i + 1,
  );

  useLayoutEffect(() => {
    if (!mockExamQuestions || mockExamQuestions.length <= 0) {
      nav("/overview");
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
      }),
    );
    nav(location.pathname, {
      replace: true,
      state: { subjectId: num - 1 },
    });
  };

  const nextExam = () => {
    dispatch(nextQuestion({ answer: currentQuestion?.answer, subjectId }));
    nav(location.pathname, {
      replace: true,
      state: { subjectId: num + 1 },
    });
    if (exam?.length > subjectId) {
      dispatch(
        setMockExamOption({
          option: exam[num]?.option,
          answer: exam[num]?.answer,
        }),
      );
    } else {
      dispatch(setMockExamOption("F"));
    }
  };

  const handleFinishedExam = () => {
    dispatch(nextQuestion({ answer: currentQuestion?.answer, subjectId }));
    dispatch(setFinishedExam());
  };

  if (num > mockExamQuestions?.length || num < 1) {
    return <ErrorPgae />;
  }

  const timer = `${String(examTimerMins).padStart(2, "0")}:${String(examTimerSecs).padStart(2, "0")}`;

  return (
    <div className="examBody">
      <div className="examBody-mobile">
        <button onClick={() => setShowLeavingNow(true)}>x</button>
        <h5>Jamb Mock Exam</h5>
        <article>
          <aside>
            <meter min={0} max={100} value={examMeter}></meter>
            <p>{examMeter.toFixed(0)}%</p>
          </aside>
          <section>
            <LuClock2 fontSize={30} />
            {timer}
          </section>
        </article>
      </div>
      <div className="examBody-firstLayer">
        <h3>Jamb Mock Exam</h3>
        <aside>
          <meter min={0} max={100} value={examMeter}></meter>
          <p>{examMeter.toFixed(0)}%</p>
        </aside>
        <section>
          <LuClock2 fontSize={30} />
          {timer}
        </section>
        <button onClick={() => setShowLeavingNow(true)}>x</button>
      </div>
      <h1>{mockSelectedSubject} QUESTIONS</h1>
      <div className="examBody-secondLayer">
        <div className="examBody-secondLayerHolder">
          <QuestionDisplay
            question={currentQuestion}
            subjectId={subjectId}
            mockExamOptions={mockExamOptions}
            dispatch={dispatch}
          />
        </div>
        <div className="examBody-secondLayerButton">
          <button
            style={{ display: num === 1 ? "none" : "flex" }}
            onClick={previousExam}
          >
            <article>
              <FaArrowLeftLong />
            </article>
            <h2>Previous</h2>
          </button>
          <button
            style={{
              display: mockExamQuestions?.length === num ? "none" : "flex",
            }}
            onClick={nextExam}
          >
            <h2>{isNext ? "Next" : "Skip"}</h2>
            <article>
              <FaArrowRightLong />
            </article>
          </button>
          <button
            style={{
              display: mockExamQuestions?.length === num ? "flex" : "none",
              background: "#804BF2",
              color: "white",
              borderColor: "#804BF2",
            }}
            onClick={handleFinishedExam}
          >
            <h2>Finish</h2>
          </button>
        </div>
        <div className="examBody-panel">
          <div className="examBody-panelHolder">
            {arrayOfNumbers.map((item, index) => (
              <main
                key={index}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    item === num || exam[index]?.option ? "#804BF2" : "white",
                  color:
                    item === num || exam[index]?.option ? "white" : "#804BF2",
                }}
                onClick={() => {
                  dispatch(
                    nextQuestion({ answer: currentQuestion?.answer, subjectId }),
                  );
                  nav(location.pathname, {
                    replace: true,
                    state: { subjectId: item },
                  });
                  dispatch(
                    setMockExamOption({
                      option: exam[index]?.option,
                      answer: exam[index]?.answer,
                    }),
                  );
                }}
              >
                {item}
              </main>
            ))}
          </div>
        </div>
      </div>
      <Calculator />
    </div>
  );
};

export default TheExam;
