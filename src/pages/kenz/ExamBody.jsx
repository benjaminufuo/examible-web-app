import { useSelector } from 'react-redux'
import LeavingNow from './LeavingNow'
import TheExam from './TheExam'
import FinishedExam from '../../components/FinishedExam'
import ExamTimeout from '../../components/ExamTimeout'

const ExamBody = () => {
  const leavingNow = useSelector((state)=>state.leavingNow)
  const finish = useSelector((state)=>state.FinishedExam)
  const timeOut = useSelector((state)=>state.timeOut)
  return (
    <>
      {
        leavingNow && <LeavingNow/>  
      }

      <TheExam/>

      {
        finish && <FinishedExam/>
      }
      {
        timeOut && <ExamTimeout/>
      }
    </>
  )
}

export default ExamBody
