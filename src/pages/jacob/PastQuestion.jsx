import React, { useEffect, useState } from "react";
import "../../styles/dashboardCss/pastquestion.css";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setExam, setYear, setPastQuestions } from "../../global/slice";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const PastQuestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [dropDownSubject, setDropDownSubject] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const years = [
    // "2023",
    // "2022",
    // "2021",
    // "2020",
    // "2019",
    // "2018",
    // "2017",
    // "2016",
    // "2015",
    // "2014",
    // "2013",
    // "2012",
    // "2011",
    // "2010",
    // "2009",
    // "2008",
    // "2007",
    // "2006",
    "2005",
    "2004",
    "2003",
    "2002",
    "2001",
    "2000",
  ];

  const getPastQuestionForYearSubject = async (year, subject) => {
    if (year === "All" || subject === "All") {
      toast.error("please select both subject and year.");
      return;
    }
    setLoading(true);

    const toastId = toast.loading("fecthing questions....");
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }api/v1/fetch-questions/${year}/${subject}`
      );
      toast.update(toastId, {
        render: "Question fetched succesfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      dispatch(setPastQuestions(response.data.data));
      navigate("/dashboard/view-pastquestion");
      setLoading(false);
      setDisabled(true);
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to fetch questions.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      setDisabled(false);
      setLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    dispatch(setExam(subject));
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    dispatch(setYear(year));
  };

  useEffect(() => {
    if (!loading && selectedYear !== "All" && selectedSubject !== "All") {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [loading, selectedYear, selectedSubject]);

  return (
    <div className="pastquestionmain">
      <div className="pastcontainer">
        <span>Jamb UTME Question</span>

        <h1 className="pastquestionheader">Select any subject & Answer</h1>

        <div className="selectpastquestion">
          <div className="pastleftdiv">
            <span>Exam</span>
            <div>Jamb</div>
          </div>
          <div className="pastrightdiv">
            <span>Select Subject</span>

            <div onClick={() => toggleDropdown("subject")}>
              {selectedSubject}
              {activeDropdown === "subject" ? (
                <FaChevronUp className="pastdropdown" />
              ) : (
                <FaChevronDown className="pastdropdown" />
              )}
              {activeDropdown === "subject" && (
                <ul className="dropdownmenu">
                  {user?.enrolledSubjects.map((subject, index) => (
                    <li
                      key={index}
                      className="dropdownitem"
                      onClick={() => handleSubjectClick(subject)}
                    >
                      {subject}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="pastrightdiv">
            <span>Select Year</span>
            <div onClick={() => toggleDropdown("year")}>
              {selectedYear}
              {activeDropdown === "year" ? (
                <FaChevronUp className="pastdropdown" />
              ) : (
                <FaChevronDown className="pastdropdown" />
              )}
              {activeDropdown === "year" && (
                <ul className="dropdownmenu">
                  {years.map((year, index) => (
                    <li
                      key={index}
                      className="dropdownitem"
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="viewpastquestiondiv">
          <button
            className="viewpastbutton"
            onClick={() =>
              getPastQuestionForYearSubject(selectedYear, selectedSubject)
            }
            disabled={disabled || loading}
            style={{
              backgroundColor: disabled || loading ? "#dbd2f0d2" : "#804bf2",
              cursor: disabled || loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading" : "View Past question"}
          </button>
        </div>
        <div className="pastinstruction1">
          <h1>How to Select a JAMB Past Question</h1>
          <span>
            Choosing the right past question is key to studying smarter and
            scoring higher. Here’s how to do it:
          </span>
        </div>
        <div className="pastinstruction2">
          <h1>Know Your Subjects</h1>
          <span>
            Before selecting any past question, confirm the four JAMB subjects
            you're sitting for. For example:
          </span>

          <ul>
            <li>
              Science Student → English, Physics, Chemistry, Biology/Mathematics
            </li>
            <li>Art Student → English, Literature, Government, CRS/History</li>
            <li>
              Commercial Student → English, Economics, Commerce, Accounting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PastQuestion;
