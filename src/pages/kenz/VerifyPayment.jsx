import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../global/slice'
import PaymentSuccessfull from '../../components/PaymentSuccessfull'

const VerifyPayment = () => {
    const [isVerifying,setIsVerifying] = useState(true)
    const reference = useSelector((state)=>state.reference)
    const [plan,setPlan] = useState('')
    const dispatch = useDispatch()
    const nav = useNavigate()

    const verifyPayment = async()=>{
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/v1/verifyKoraPay?reference=${reference}`)
        console.log(res?.data?.data?.student)
        if(res?.status === 200){
          dispatch(setUser(res?.data?.data?.student))
          setPlan(res?.data?.data?.student?.plan)
          setIsVerifying(false)
        }
        console.log(res)
      } catch (error) {
        toast.error(error?.response?.data?.message)
        setTimeout(() => {
          nav('/dashboard/overview')
        }, 3000);
      }
    }

    useEffect(()=>{
      verifyPayment()
    },[])
  return (
    <>
      {
        isVerifying ? <Loading/> : <PaymentSuccessfull plan={plan}/>
      }
    </>
  )
}

export default VerifyPayment
