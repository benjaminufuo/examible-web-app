import React, { useState, useMemo } from "react";
import "../../styles/dashboardCss/subjectSelected.css";
import image1 from "../../assets/public/home-firstlayer.webp";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../global/slice";
import { studentApi } from "../../config/studentApi";
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
      const res = await studentApi.addSubject({ subject });
      setLoading(false);
      if (res?.data?.success) {
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
    }
  };

  // build a fast lookup for subject -> img once
  const subjectMap = useMemo(
    () =>
      Object.fromEntries(
        allSubjectsData.map((s) => [s.subject, s.svg || s.img]),
      ),
    [],
  );

  return (
    <div className="subjectSelected">
      <div className="subjectSelected-firstLayer">
        <aside>
          <FaArrowLeftLong onClick={() => setShowSubjectSelected(false)} />
        </aside>
        <div className="subjectSelected-firstLayerHolder">
          <img src={image1} alt="Illustration" loading="eager" />
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
              {typeof subjectMap[item] === "function" ? (
                React.createElement(subjectMap[item])
              ) : (
                <img
                  src={subjectMap[item]}
                  alt={item}
                  loading="eager"
                  width={48}
                  height={48}
                />
              )}
            </nav>
          ))}
        </main>
        <div className="not-selected">
          Not Selected yet. <br /> Pick your subjects.
        </div>
        <article>
          {notEnrolledSubjects.map((item, index) => (
            <nav
              key={index}
              onClick={() => addSubject(item)}
              style={{
                pointerEvents: loading ? "none" : "auto",
              }}
            >
              {typeof subjectMap[item] === "function" ? (
                React.createElement(subjectMap[item])
              ) : (
                <img
                  src={subjectMap[item]}
                  alt={item}
                  loading="eager"
                  width={48}
                  height={48}
                />
              )}
            </nav>
          ))}
        </article>
      </div>
    </div>
  );
};

export default SubjectSelected;
