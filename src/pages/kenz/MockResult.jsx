import { useMemo, useState } from "react";
import "../../styles/dashboardCss/mockResult.css";
import { useDispatch, useSelector } from "react-redux";
import { cancelExam } from "../../global/slice";
import { useLocation, useNavigate } from "react-router-dom";
import { GrStatusGood } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";
import { ClipLoader } from "react-spinners";
import Calculator from "../../components/Calculator";
import Pagination from "../../shared/Pagination";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import QuestionMeta from "../../components/QuestionMeta";
import { LETTERS, deduplicateQuestionMeta } from "../../utils/questionUtils";
import useAiExplanation from "../../utils/useAiExplanation";

const ResultOptionItem = ({ option, letter, examEntry }) => {
  if (!option) return null;
  const prefix = `${letter}.`;
  const text = option.startsWith(prefix) ? option : `${letter}. ${option}`;
  const isSelected = examEntry?.option === letter;
  return (
    <li>
      <p>
        <Latex>{text}</Latex>
      </p>
      {isSelected && (
        <nav style={{ display: "flex" }}>
          {examEntry.score === 0 ? (
            <GiCancel fontSize={25} color="red" />
          ) : (
            <GrStatusGood fontSize={25} color="green" />
          )}
        </nav>
      )}
    </li>
  );
};

const ResultQuestionCard = ({
  item,
  newItem,
  questionNumber,
  examEntry,
  loading,
  itemIndex,
  onViewExplanation,
}) => (
  <main>
    <QuestionMeta item={item} newItem={newItem} />
    <header>
      <span>{questionNumber}</span>. <Latex>{item.question}</Latex>
    </header>
    <ul>
      {LETTERS.map((letter, i) => (
        <ResultOptionItem
          key={letter}
          option={item.options[i]}
          letter={letter}
          examEntry={examEntry}
        />
      ))}
    </ul>
    <div className="mockResult-scores">
      <footer>
        {item.answer === examEntry?.answer
          ? "You got the answer"
          : `The answer is ${item.answer}`}
      </footer>
      <button
        disabled={loading !== null}
        onClick={() =>
          onViewExplanation(
            item.number,
            item.question,
            item.passage,
            item.options,
            item.subheadingA,
            item.subheadingB,
            item.diagramUrlA,
            item.diagramUrlB,
            itemIndex,
          )
        }
      >
        {loading === itemIndex ? (
          <ClipLoader color="black" size={16} />
        ) : (
          "view explanation"
        )}
      </button>
    </div>
  </main>
);

const MockResult = () => {
  const mockExamQuestions = useSelector((state) => state.mockExamQuestions);
  const exam = useSelector((state) => state.exam);
  const mockYear = useSelector((state) => state.mockYear);
  const mockSelectedSubject = useSelector((state) => state.mockSelectedSubject);
  const userToken = useSelector((state) => state.userToken);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);

  const page = location.state?.page || currentPage || 1;
  const questionsPerPage = 5;
  const indexOfLastQuestion = page * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const { loading, handleViewExplanation } = useAiExplanation(
    mockYear,
    mockSelectedSubject,
    userToken,
  );

  const totalScore =
    exam?.reduce((acc, item) => acc + (item?.score || 0), 0) / 2;

  const performance =
    ((totalScore * 2) / (mockExamQuestions?.length || 1)) * 50;

  const pageQuestions = useMemo(
    () =>
      deduplicateQuestionMeta(
        mockExamQuestions?.slice(indexOfFirstQuestion, indexOfLastQuestion) || [],
      ),
    [mockExamQuestions, indexOfFirstQuestion, indexOfLastQuestion],
  );

  const pageExam = useMemo(
    () => exam?.slice(indexOfFirstQuestion, indexOfLastQuestion) || [],
    [exam, indexOfFirstQuestion, indexOfLastQuestion],
  );

  return (
    <>
      <div className="mockResult">
        <h2>
          <span style={{ color: "#804bf2" }}>Mock Exam</span> (Jamb CBT
          Practice)
        </h2>
        <h2>Questions & Answers</h2>
        <h5>
          You Scored {totalScore.toFixed(0)} out of {mockExamQuestions?.length}{" "}
          ({performance.toFixed(0)}%)
        </h5>
        <div className="mockResult-holder">
          {pageQuestions.map(({ item, newItem }, index) => (
            <ResultQuestionCard
              key={item.id ?? item.number ?? index}
              item={item}
              newItem={newItem}
              questionNumber={indexOfFirstQuestion + index + 1}
              examEntry={pageExam[index]}
              loading={loading}
              itemIndex={index}
              onViewExplanation={handleViewExplanation}
            />
          ))}
        </div>
        <div className="mock-result-navigator">
          <button
            className="mockResult-retry"
            onClick={() => {
              dispatch(cancelExam());
              nav("/mock-exam");
            }}
          >
            Retry Quiz
          </button>
          <Pagination
            page={page}
            setPage={setCurrentPage}
            totalPages={Math.ceil((mockExamQuestions?.length || 0) / questionsPerPage)}
          />
        </div>
      </div>
      <Calculator />
    </>
  );
};

export default MockResult;
