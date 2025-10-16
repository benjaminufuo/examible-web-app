import { useState } from "react";
import "../../styles/dashboardCss/subjectSelected.css";
import image1 from "../../assets/public/home-firstlayer.png";
import { FaArrowLeftLong, FaBook } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../global/slice";
import axios from "axios";
import { toast } from "react-toastify";
import { useExamibleContext } from "../../context/ExamibleContext";
import { allSubjectsData } from "../../constants/common";

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
            <nav key={index}>
              <img
                src={
                  allSubjectsData.find((items) => items.subject === item)?.img
                }
                alt={
                  allSubjectsData.find((items) => items.subject === item)
                    ?.subject
                }
              />
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
              }}
            >
              <img
                src={
                  allSubjectsData.find((items) => items.subject === item)?.img
                }
                alt={
                  allSubjectsData.find((items) => items.subject === item)
                    ?.subject
                }
              />
            </nav>
          ))}
        </article>
      </div>
    </div>
  );
};

export default SubjectSelected;
