import React, { useEffect, useState } from 'react'
import '../../styles/dashboardCss/overview.css'
import image1 from '../../assets/public/home-firstlayer.png'
import { FaBook } from 'react-icons/fa6'
import { PiExamFill } from 'react-icons/pi'
import image2 from '../../assets/public/1st rating (1).svg'
import SubjectSelected from './SubjectSelected'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOverview, setNotEnrolledSubjects, setUser } from '../../global/slice'
import { TbTrashX } from 'react-icons/tb'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

const Overview = () => {
  const isOverview = useSelector((state)=>state.isOverview)
  const user = useSelector((state)=>state.user)
  const userToken = useSelector((state)=>state.userToken)
  const [showBin,setShowBin] = useState('')
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()

  const removeSubject = async(subject)=>{
    const id = toast.loading('Removing Subject ...')
    setLoading(true)
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}api/v1/removeSubject/${user?._id}`,{subject})
      setLoading(false)
      if(res?.status === 200){
        toast.dismiss(id)
        setTimeout(() => {
          toast.success(res?.data?.message)
          dispatch(setUser(res?.data?.data))
        }, 500);
      }
    } catch (error) {
      setLoading(false)
      toast.dismiss(id)
      setTimeout(() => {
        toast.error(error?.response?.data?.message)
      }, 500);
    }
  }

  const onMouseEnterToShowBin = (index)=>{
    if (user?.plan !== 'Freemium') {
      setShowBin(index)
      return
    }
    setShowBin('')
  }

  const allSubjectsData = [
    {
      subject:'Mathematics',
      cardColor:'#804BF266',
      divColor:'#FFFFFF',
      iconColor:'#804BF2',
      textColor:'#1E1E1E'
    },
    {
      subject:'English',
      cardColor:'#1E1E1E',
      divColor:'#804BF2',
      iconColor:'#FFFFFF',
      textColor:'#FFFFFF'
    },
    {
      subject:'Physics',
      cardColor:'#F2AE30',
      divColor:'#FFFFFF',
      iconColor:'#F2AE30',
      textColor:'#1E1E1E'
    },
    {
      subject:'Chemistry',
      cardColor:'#88DDFF',
      divColor:'#1E1E1E',
      iconColor:'#FFFFFF',
      textColor:'#1E1E1E'
    },
    {
      subject:'Biology',
      cardColor:'#F2AE3099',
      divColor:'#1E1E1E',
      iconColor:'#FFFFFF',
      textColor:'#1E1E1E'
    },
    {
      subject:'Literature in English',
      cardColor:'#F2AE30',
      divColor:'#804BF2CC',
      iconColor:'#FFFFFF',
      textColor:'#1E1E1E'
    },
    {
      subject:'Economics',
      cardColor:'#00000040',
      divColor:'#1E1E1E',
      iconColor:'#FFFFFF',
      textColor:'#1E1E1E'
    },
    {
      subject:'Geography',
      cardColor:'#FFFFFF',
      divColor:'#804BF266',
      iconColor:'#1E1E1E',
      textColor:'#1E1E1E'
    },
    {
      subject:'Government',
      cardColor:'#88DDFF',
      divColor:'#FFFFFF',
      iconColor:'#1E1E1E',
      textColor:'#1E1E1E'
    },
    {
      subject:'History',
      cardColor:'#17004D',
      divColor:'#88DDFF',
      iconColor:'#1E1E1E',
      textColor:'#FFFFFF'
    },
  ]

  const addMoreSubject = async()=>{
    if (user?.plan === 'Freemium' && user?.enrolledSubjects?.length === 4) {
      toast.error('Upgrade Plan to add more subject')
    } else {
      setLoading(true)
      const id = toast.loading('Please wait ...')
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}api/v1/studentNotSubjects/${user?._id}`)
        setLoading(false)
        if (res?.status) {
          dispatch(setNotEnrolledSubjects(res?.data?.data))
          toast.dismiss(id)
          dispatch(setIsOverview())
        }
      } catch (error) {
        setLoading(false)
        toast.error(error?.response?.data?.message)
        toast.dismiss(id)
      }
    }
  }

  return (
    <>
      {
        isOverview ?  
          <SubjectSelected/>
        : 
        <div className='overview'>
      <div className="overview-firstLayer">
        <div className="overview-firstLayerLeft">
          <div className="overview-firstLayerLeftUP">
            <main>
              <nav>
                <h5><span style={{color:'#F2AE30'}}>Hello,</span> {user?.fullName}</h5>
                <p>Welcome to Legacy Builder — your ultimate companion for JAMB success. Let’s help you score 300+ and unlock your dream university!</p>
              </nav>
              <article></article>
              <section></section>
            </main>
            <img src={image1} alt="" />
          </div>
          <div className="overview-firstLayerMiddle">
          <h5>My Performance Level</h5>
          <main>
            <div><FaBook color='#804BF2' fontSize={35}/></div>
            <nav>
              <h6>{user?.enrolledSubjects?.length}</h6>
              <p>Subject
              Selected</p>
            </nav>
          </main>
          <main style={{backgroundColor:'#F2AE30'}}>
            <div style={{backgroundColor:'black'}}><PiExamFill color='white' fontSize={35}/></div>
            <nav>
              <h6>
                {
                  user?.plan === 'Freemium' ? '10' : '30'
                }
              </h6>
              <p>Minutes Mock Exam</p>
            </nav>
          </main>
          <main style={{backgroundColor:'#804BF2'}}>
            <div style={{backgroundColor:'white'}}><FaBook color='#F2AE30' fontSize={35}/></div>
            <nav style={{color:'white'}}>
              <h6>
              {
                  user?.plan === 'Freemium' ? '2' : 'All'
                }
              </h6>
              <p>Years Pass Questions</p>
            </nav>
          </main>
        </div>
          <div className="overview-firstLayerLeftDown">
            <h4>Subject Selected</h4>
            <main>
              {
                user?.enrolledSubjects?.map((item,index)=>(
                  <nav onMouseEnter={()=>onMouseEnterToShowBin(index)} onMouseLeave={()=>setShowBin('')} key={index} style={{background:allSubjectsData.find((items)=>items.subject === item)?.cardColor}}>
                    <aside>
                      <section style={{background:allSubjectsData.find((items)=>items.subject === item)?.divColor}}><FaBook fontSize={35} color={allSubjectsData.find((items)=>items.subject === item)?.iconColor}/></section>
                      <p style={{color:allSubjectsData.find((items)=>items.subject === item)?.textColor}}>{item}</p>
                    </aside>
                    <TbTrashX style={{pointerEvents:loading?'none':'auto',display:showBin === index? 'flex' : 'none'}} className='overview-trashIcon' onClick={(e)=>{e.stopPropagation(),removeSubject(item)}}/>
                  </nav>
                ))
              }
              <nav style={{pointerEvents:loading?'none':'auto',backgroundColor:'white',cursor:'pointer'}} onClick={()=>addMoreSubject()}>
                <aside>
                  <div>+</div>
                <h6>Add Subject</h6>
                </aside>
              </nav>
            </main>
          </div>
        </div>
        <div className="overview-firstLayerRight">
          <h5>My Performance Level</h5>
          <main>
            <div><FaBook color='#804BF2' fontSize={35}/></div>
            <nav>
              <h6>{user?.enrolledSubjects?.length}</h6>
              <p>Subject
              Selected</p>
            </nav>
          </main>
          <main style={{backgroundColor:'#F2AE30'}}>
            <div style={{backgroundColor:'black'}}><PiExamFill color='white' fontSize={35}/></div>
            <nav>
              <h6>
                {
                  user?.plan === 'Freemium' ? '10' : '30'
                }
              </h6>
              <p>Minutes Mock Exam</p>
            </nav>
          </main>
          <main style={{backgroundColor:'#804BF2'}}>
            <div style={{backgroundColor:'white'}}><FaBook color='#F2AE30' fontSize={35}/></div>
            <nav style={{color:'white'}}>
              <h6>
              {
                  user?.plan === 'Freemium' ? '2' : 'All'
                }
              </h6>
              <p>Years Pass Questions</p>
            </nav>
          </main>
        </div>
      </div>
      <h1>My Rating</h1>
      <div className="overview-secondLayer">
        <div className="overview-secondLayerLeft">
          <img src={image2} alt="" />
          <p>{user?.totalRating}%</p>
        </div>
        <div className="overview-secondLayerRight">
          <div className="overview-secondLayerRightHolder">
            <ul>
              <li>Subject</li>
              <li>Performance</li>
              <li>Duration</li>
              <li>Completed?</li>
            </ul>
            {
              user?.myRating.length <= 0 ? <p>No Performance yet !!!</p> : 
              <>
                {
                  user?.myRating.map((item,index)=>(
                    <ol key={index}>
              
              <li>{item?.subject}</li>
              <li>{item?.performance}{' '}%</li>
              <li>{item?.duration}{' '}secs</li>
              <li>{item?.completed}</li>
            </ol>
                  ))
                }
              </>
            }
          </div>
        </div>
      </div>
      <div className="overview-thirdLayer">
        <div className="overview-thirdLayerHolder">
          <h6>How to Improve on your academic performance.</h6>
          <ol>
            <li>Set Clear Goals – Know what grades you’re aiming for and create a plan to reach them.</li>
            <li>Manage Your Time – Use a study schedule to balance school, revision, and rest.</li>
            <li>Stay Consistent – Study regularly, not just before exams.</li>
            <li>Practice with Past Questions – Especially for JAMB, this helps you understand the pattern.</li>
            <li>Take Mock Tests – Simulate real exam conditions to build confidence.</li>
            <li>Ask for Help – Don’t hesitate to ask teachers or peers if you’re stuck.</li>
            <li>Stay Healthy – Eat well, sleep enough, and take short breaks to stay sharp.</li>
            <li>Avoid Distractions – Stay focused during study time—put your phone away if needed.</li>
        </ol>
        </div>
      </div>
    </div>
      }
    </>
  )
}

export default Overview
