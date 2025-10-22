import { useState } from "react";
import "../../styles/dashboardCss/overview.css";
import image1 from "../../assets/public/home-firstlayer.png";
import { FaBook } from "react-icons/fa6";
import { PiExamFill } from "react-icons/pi";
import SubjectSelected from "./SubjectSelected";
import { useDispatch, useSelector } from "react-redux";
import { setNotEnrolledSubjects, setUser } from "../../global/slice";
import { TbTrashX } from "react-icons/tb";
import { toast } from "react-toastify";
import axios from "axios";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";

const Overview = () => {
  const user = useSelector((state) => state.user);
  const [showBin, setShowBin] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { setShowSubjectSelected, showSubjectSelected } = useExamibleContext();

  const removeSubject = async (subject) => {
    const id = toast.loading("Removing Subject ...");
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}api/v1/removeSubject/${user?._id}`,
        { subject }
      );
      setLoading(false);
      if (res?.status === 200) {
        toast.dismiss(id);
        setTimeout(() => {
          toast.success(res?.data?.message);
          dispatch(setUser(res?.data?.data));
        }, 500);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss(id);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
    }
  };

  const onMouseEnterToShowBin = (index) => {
    // if (user?.plan !== "Freemium") {
    //   setShowBin(index);
    //   return;
    // }
    // setShowBin("");
    setShowBin(index);
  };

  const addMoreSubject = async () => {
    // if (user?.plan === "Freemium" && user?.enrolledSubjects?.length === 4) {
    //   toast.error("Upgrade Plan to add more subject");
    // } else {
    //   setLoading(true);
    //   const id = toast.loading("Please wait ...");
    //   try {
    //     const res = await axios.get(
    //       `${import.meta.env.VITE_BASE_URL}api/v1/studentNotSubjects/${
    //         user?._id
    //       }`
    //     );
    //     setLoading(false);
    //     if (res?.status) {
    //       dispatch(setNotEnrolledSubjects(res?.data?.data));
    //       toast.dismiss(id);
    //       setShowSubjectSelected(true);
    //     }
    //   } catch (error) {
    //     setLoading(false);
    //     toast.error(error?.response?.data?.message);
    //     toast.dismiss(id);
    //   }
    // }
    setLoading(true);
    const id = toast.loading("Please wait ...");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/v1/studentNotSubjects/${user?._id}`
      );
      setLoading(false);
      if (res?.status) {
        dispatch(setNotEnrolledSubjects(res?.data?.data));
        toast.dismiss(id);
        setShowSubjectSelected(true);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
      toast.dismiss(id);
    }
  };

  return (
    <>
      {showSubjectSelected ? (
        <SubjectSelected />
      ) : (
        <div className="overview">
          <div className="overview-firstLayer">
            <div className="overview-firstLayerLeft">
              <div className="overview-firstLayerLeftUP">
                <main>
                  <nav>
                    <h5>
                      <span style={{ color: "#F2AE30" }}>Hello,</span>{" "}
                      {user?.fullName
                        .split(" ")
                        .filter((_, index) => index <= 1)
                        .join(" ")}
                    </h5>
                    <p>
                      Welcome to Examible — your ultimate companion for JAMB
                      success. Let’s help you score 300+ and unlock your dream
                      university!
                    </p>
                  </nav>
                  <article></article>
                  <section></section>
                </main>
                <img src={image1} alt="" />
              </div>
              <div className="overview-firstLayerMiddle">
                <h5>My Performance Level</h5>
                <main>
                  <div>
                    <FaBook color="#804BF2" fontSize={35} />
                  </div>
                  <nav>
                    <h6>{user?.enrolledSubjects?.length}</h6>
                    <p>Subject Selected</p>
                  </nav>
                </main>
                <main style={{ backgroundColor: "#F2AE30" }}>
                  <div style={{ backgroundColor: "black" }}>
                    <PiExamFill color="white" fontSize={35} />
                  </div>
                  <nav>
                    <h6>
                      {/* {user?.plan === "Freemium" ? "10" : "30"} */}
                      30
                    </h6>
                    <p>Minutes Mock Exam</p>
                  </nav>
                </main>
                <main style={{ backgroundColor: "#804BF2" }}>
                  <div style={{ backgroundColor: "white" }}>
                    <FaBook color="#F2AE30" fontSize={35} />
                  </div>
                  <nav style={{ color: "white" }}>
                    <h6>
                      {/* {user?.plan === "Freemium" ? "2" : "All"} */}
                      All
                    </h6>
                    <p>Years Pass Questions</p>
                  </nav>
                </main>
              </div>
              <div className="overview-firstLayerLeftDown">
                <h4>Subject Selected</h4>
                <main>
                  {user?.enrolledSubjects?.map((item, index) => (
                    <nav
                      onMouseEnter={() => onMouseEnterToShowBin(index)}
                      onMouseLeave={() => setShowBin("")}
                      key={index}
                    >
                      <img
                        src={
                          allSubjectsData.find(
                            (items) => items.subject === item
                          )?.img
                        }
                        alt={
                          allSubjectsData.find(
                            (items) => items.subject === item
                          )?.subject
                        }
                      />
                      <TbTrashX
                        style={{
                          pointerEvents: loading ? "none" : "auto",
                          display: showBin === index ? "flex" : "none",
                        }}
                        className="overview-trashIcon"
                        onClick={(e) => {
                          e.stopPropagation(), removeSubject(item);
                        }}
                      />
                    </nav>
                  ))}
                  <nav
                    style={{
                      pointerEvents: loading ? "none" : "auto",
                      backgroundColor: "white",
                      cursor: "pointer",
                    }}
                    onClick={() => addMoreSubject()}
                  >
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
                <div>
                  <FaBook color="#804BF2" fontSize={35} />
                </div>
                <nav>
                  <h6>{user?.enrolledSubjects?.length}</h6>
                  <p>Subject Selected</p>
                </nav>
              </main>
              <main style={{ backgroundColor: "#F2AE30" }}>
                <div style={{ backgroundColor: "black" }}>
                  <PiExamFill color="white" fontSize={35} />
                </div>
                <nav>
                  <h6>
                    {/* {user?.plan === "Freemium" ? "10" : "30"} */}
                    30
                  </h6>
                  <p>Minutes Mock Exam</p>
                </nav>
              </main>
              <main style={{ backgroundColor: "#804BF2" }}>
                <div style={{ backgroundColor: "white" }}>
                  <FaBook color="#F2AE30" fontSize={35} />
                </div>
                <nav style={{ color: "white" }}>
                  <h6>
                    {/* {user?.plan === "Freemium" ? "2" : "All"} */}
                    All
                  </h6>
                  <p>Years Pass Questions</p>
                </nav>
              </main>
            </div>
          </div>
          <h1>My Rating</h1>
          <div className="overview-secondLayer">
            <div className="overview-secondLayerLeft">
              <header>
                <p>Current Rating</p>
                <aside>
                  <h5>100</h5>
                  <h6>Percent</h6>
                </aside>
              </header>
              <footer>
                <nav></nav>
                <CircularProgressbar
                  value={user?.totalRating}
                  text={`${user?.totalRating.toFixed(1)}%`}
                  styles={{
                    path: {
                      stroke: "#804bf2",
                    },
                    trail: {
                      stroke: "#804BF233",
                    },
                    text: {
                      fontWeight: 800,
                      fontSize: 17,
                      fill: "#000000",
                      fontFamily: '"Montserrat", sans-serif',
                    },
                  }}
                />
              </footer>
            </div>
            <div className="overview-secondLayerRight">
              <div className="overview-secondLayerRightHolder">
                <ul>
                  <li style={{ justifyContent: "left" }}>Subject</li>
                  <li>Performance</li>
                  <li>Duration</li>
                  <li>Completed</li>
                </ul>
                {user?.myRating.length <= 0 ? (
                  <p className="overview-noPerformance">No Performance yet</p>
                ) : (
                  <>
                    {user?.myRating.map((item, index) => (
                      <ol key={index}>
                        <li style={{ justifyContent: "left" }}>
                          {item?.subject}
                        </li>
                        <li>{item?.performance?.toFixed(2)} %</li>
                        <li>
                          {`${Math.floor(item?.duration / 60)} `}{" "}
                          <em style={{ marginInline: "5px" }}> mins </em>
                          {` ${item?.duration % 60} `}{" "}
                          <em style={{ marginLeft: "5px" }}> secs</em>
                        </li>
                        <li>{item?.completed}</li>
                      </ol>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="overview-thirdLayer">
            <div className="overview-thirdLayerHolder">
              <h6>How to Improve on your academic performance.</h6>
              <ol>
                <li>
                  Set Clear Goals – Know what grades you’re aiming for and
                  create a plan to reach them.
                </li>
                <li>
                  Manage Your Time – Use a study schedule to balance school,
                  revision, and rest.
                </li>
                <li>
                  Stay Consistent – Study regularly, not just before exams.
                </li>
                <li>
                  Practice with Past Questions – Especially for JAMB, this helps
                  you understand the pattern.
                </li>
                <li>
                  Take Mock Tests – Simulate real exam conditions to build
                  confidence.
                </li>
                <li>
                  Ask for Help – Don’t hesitate to ask teachers or peers if
                  you’re stuck.
                </li>
                <li>
                  Stay Healthy – Eat well, sleep enough, and take short breaks
                  to stay sharp.
                </li>
                <li>
                  Avoid Distractions – Stay focused during study time—put your
                  phone away if needed.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Overview;
