import React from 'react'
import '../styles/dashboardCss/examTimeout.css'
import { useDispatch } from 'react-redux'
import { setExamTimeout, setFinishedExam } from '../global/slice'

const ExamTimeout = () => {
    const dispatch = useDispatch()

    const checkResult = ()=>{
        dispatch(setFinishedExam())
        dispatch(setExamTimeout())
    }
  return (
    <div className='examTimeout'>
      <div className="examTimeout-holder">
        <div className="examTimeout-holderImg"></div>
        <div className="examTimeout-holderText">
            <h2>Time Up</h2>
            <h5>You have run out of time!</h5>
            <p>click here to check your result</p>
        </div>
        <button onClick={()=>checkResult()}>Check Result</button>
      </div>
    </div>
  )
}

export default ExamTimeout
