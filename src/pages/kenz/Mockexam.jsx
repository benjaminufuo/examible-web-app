import React, { useState } from "react";
import "../../styles/dashboardCss/mockExam.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setExamTimer,
  setMockExamQuestion,
  setMockSubject,
} from "../../global/slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Mockexam = () => {
    const mySubject = useSelector((state)=>state.mockSubject)
    const user = useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const nav = useNavigate()
    const [loading,setLoading] = useState(false)

    const getExamQuestionPerSubject = async (subject) => {
      setLoading(true)
      const id = toast.loading('Please wait ...')
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/v1/mock-questions/${subject}`)
        if(res?.status === 200){
          dispatch(setMockExamQuestion(res?.data?.data))
          dispatch(setExamTimer(user?.plan))
          setTimeout(() => {
            nav(`/mock-exam/${subject}/1`)
          }, 500);
        }
        toast.dismiss(id)
        setLoading(false)
    } catch (error) {
      setLoading(false);
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
      console.log(error);
    }
  };

  return (
    <div className="mockExam">
      <h2>
        <span style={{ color: "#804BF2" }}>Mock Exam</span> (Jamb CBT Practice)
      </h2>
      <h2>Select CBT Subject below to begin!</h2>
      <div className="mockExam-holder">
        <>
        {
            user?.enrolledSubjects?.map((item,index)=>(
                <div className="mockExam-holderSubject" key={index} onClick={()=>dispatch(setMockSubject(item))}>
            <article>
            <p>{item}</p>
            <h6>{item === mySubject ? '-' : '+'}</h6>
            </article>
            <section style={{display:item === mySubject? 'flex' : 'none'}}>
                <button style={{cursor:loading? 'not-allowed' : 'pointer',background:loading? '#804BF2CC' : '#804BF2'}} disabled={loading} onClick={()=>getExamQuestionPerSubject(item)}>Start Jamb CBT</button>
            </section>
        </div>
            ))
        }
        </>
      </div>
      <h5>The platform is cbt simulation using real jamb past questions.</h5>
    </div>
  );
};

export default Mockexam;
