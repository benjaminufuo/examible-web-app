import { useSelector } from "react-redux";
import LeavingNow from "./LeavingNow";
import TheExam from "./TheExam";
import FinishedExam from "../../components/FinishedExam";
import ExamTimeout from "../../components/ExamTimeout";
import { useExamibleContext } from "../../context/ExamibleContext";

const ExamBody = () => {
  const { showLeavingNow } = useExamibleContext();
  const finish = useSelector((state) => state.FinishedExam);
  const timeOut = useSelector((state) => state.timeOut);
  return (
    <>
      {showLeavingNow && <LeavingNow />}

      <TheExam />

      {finish && <FinishedExam />}
      {timeOut && <ExamTimeout />}
    </>
  );
};

export default ExamBody;
