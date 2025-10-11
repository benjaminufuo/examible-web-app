import { useState } from "react";
import "../../styles/dashboardCss/subjectSelected.css";
import image1 from "../../assets/public/home-firstlayer.png";
import { FaArrowLeftLong, FaBook } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../global/slice";
import axios from "axios";
import { toast } from "react-toastify";
import { useExamibleContext } from "../../context/ExamibleContext";

const SubjectSelected = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const notEnrolledSubjects = useSelector((state) => state.notEnrolledSubjects);

  const { setShowSubjectSelected } = useExamibleContext();

  const addSubject = async (subject) => {
    setLoading(true);
    const id = toast.loading("Adding Subject ...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/addSubject/${user?._id}`,
        { subject }
      );
      setLoading(false);
      if (res?.status === 200) {
        toast.dismiss(id);
        setTimeout(() => {
          toast.success(res?.data?.message);
          dispatch(setUser(res?.data?.data));
          setShowSubjectSelected(false);
        }, 500);
      }
    } catch (error) {
      toast.dismiss(id);
      setLoading(false);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
    }
  };

  return (
    <div className="subjectSelected">
      <div className="subjectSelected-firstLayer">
        <aside>
          <FaArrowLeftLong onClick={() => setShowSubjectSelected(false)} />
        </aside>
        <div className="subjectSelected-firstLayerHolder">
          <img src={image1} alt="" />
          <main>
            <nav>
              <h5>
                <span style={{ color: "#F2AE30" }}>Hello,</span>{" "}
                {user?.fullName}
              </h5>
              <p>
                Welcome to Examible — your ultimate companion for JAMB success.
                Let’s help you score 300+ and unlock your dream university!
              </p>
            </nav>
            <article></article>
            <section></section>
          </main>
        </div>
      </div>
      <div className="subjectSelected-secondLayer">
        <h4>Subject Selected</h4>
        <main>
          {user?.enrolledSubjects.map((item, index) => (
            <nav
              key={index}
              style={{
                background: allSubjectsData.find(
                  (items) => items.subject === item
                )?.cardColor,
              }}
            >
              <aside>
                <section
                  style={{
                    background: allSubjectsData.find(
                      (items) => items.subject === item
                    )?.divColor,
                  }}
                >
                  <FaBook
                    fontSize={35}
                    color={
                      allSubjectsData.find((items) => items.subject === item)
                        ?.iconColor
                    }
                  />
                </section>
                <p
                  style={{
                    color: allSubjectsData.find(
                      (items) => items.subject === item
                    )?.textColor,
                  }}
                >
                  {item}
                </p>
              </aside>
            </nav>
          ))}
        </main>
        <div className="not-selected">Not Selected yet.</div>
        <article>
          {notEnrolledSubjects.map((item, index) => (
            <nav
              key={index}
              onClick={() => addSubject(item)}
              style={{
                pointerEvents: loading ? "none" : "auto",
                background: allSubjectsData.find(
                  (items) => items.subject === item
                )?.cardColor,
              }}
            >
              <aside>
                <section
                  style={{
                    background: allSubjectsData.find(
                      (items) => items.subject === item
                    )?.divColor,
                  }}
                >
                  <FaBook
                    fontSize={35}
                    color={
                      allSubjectsData.find((items) => items.subject === item)
                        ?.iconColor
                    }
                  />
                </section>
                <p
                  style={{
                    color: allSubjectsData.find(
                      (items) => items.subject === item
                    )?.textColor,
                  }}
                >
                  {item}
                </p>
              </aside>
            </nav>
          ))}
        </article>
      </div>
    </div>
  );
};

export default SubjectSelected;

const allSubjectsData = [
  {
    subject: "Mathematics",
    cardColor: "#804BF266",
    divColor: "#FFFFFF",
    iconColor: "#804BF2",
    textColor: "#1E1E1E",
  },
  {
    subject: "English",
    cardColor: "#1E1E1E",
    divColor: "#804BF2",
    iconColor: "#FFFFFF",
    textColor: "#FFFFFF",
  },
  {
    subject: "Physics",
    cardColor: "#F2AE30",
    divColor: "#FFFFFF",
    iconColor: "#F2AE30",
    textColor: "#1E1E1E",
  },
  {
    subject: "Chemistry",
    cardColor: "#88DDFF",
    divColor: "#1E1E1E",
    iconColor: "#FFFFFF",
    textColor: "#1E1E1E",
  },
  {
    subject: "Biology",
    cardColor: "#F2AE3099",
    divColor: "#1E1E1E",
    iconColor: "#FFFFFF",
    textColor: "#1E1E1E",
  },
  {
    subject: "Literature in English",
    cardColor: "#F2AE30",
    divColor: "#804BF2CC",
    iconColor: "#FFFFFF",
    textColor: "#1E1E1E",
  },
  {
    subject: "Economics",
    cardColor: "#00000040",
    divColor: "#1E1E1E",
    iconColor: "#FFFFFF",
    textColor: "#1E1E1E",
  },
  {
    subject: "Geography",
    cardColor: "#FFFFFF",
    divColor: "#804BF266",
    iconColor: "#1E1E1E",
    textColor: "#1E1E1E",
  },
  {
    subject: "Government",
    cardColor: "#88DDFF",
    divColor: "#FFFFFF",
    iconColor: "#1E1E1E",
    textColor: "#1E1E1E",
  },
  {
    subject: "History",
    cardColor: "#17004D",
    divColor: "#88DDFF",
    iconColor: "#1E1E1E",
    textColor: "#FFFFFF",
  },
  {
    subject: "Commerce",
    cardColor: "#FFFFFF",
    divColor: "#1E1E1E",
    iconColor: "#FFFFFF",
    textColor: "#1E1E1E",
  },
];
