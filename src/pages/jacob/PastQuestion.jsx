import React, { use, useEffect, useState } from "react";
import "../../styles/dashboardCss/pastquestion.css";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setExam, setYear, setPastQuestions } from "../../global/slice";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const PastQuestion = () => {
  // Using useNavigate to programmatically navigate between routes
  // Using useDispatch to dispatch actions to the Redux store
  // Using useSelector to access the Redux store state
  // Using useState to manage local component state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [years, setYears] = useState([]); // State to hold the years fetched from the API
  const [subjectYearsMap, setSubjectYearsMap] = useState({}); // State to hold the mapping of subjects to years

  // Function to toggle the dropdown
  // This function checks if the dropdown is already active. If it is, it sets the activeDropdown to null, effectively closing it. If it is not active, it sets the activeDropdown to the dropdown that was clicked, opening it.
  // This allows for only one dropdown to be open at a time.
  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // Base URL for fetching subjects and years
  const baseUrl = "https://questionapp-t8bu.onrender.com/subjects";
  const getYears = async () => {
    try {
      const response = await axios.get(baseUrl);
      setSubjectYearsMap(response.data.data); // Save the mapping
    } catch (error) {
      console.error("Error fetching years:", error);
    }
  };

  useEffect(() => {
    getYears();
  }, []);
  // function to get past question for year and subject
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
        }api/v1/fetch-questions/${year}/${subject}/${user?._id}`
      );
      toast.dismiss(toastId);
      dispatch(setPastQuestions(response.data.data));
      navigate("/dashboard/past-questions/view");
      setLoading(false);
      setDisabled(true);
    } catch (error) {
      toast.dismiss(toastId);
      setTimeout(() => {
        toast.error(error?.response?.data?.message);
      }, 500);
      setDisabled(false);
      setLoading(false);
    }
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    dispatch(setExam(subject));
    if (subjectYearsMap[subject]) {
      setYears(subjectYearsMap[subject].sort((a, b) => b - a)); // Sort years in descending order
    } else {
      setYears([]); // If no years are available for the subject, set years to an empty array
    }
    setSelectedYear("All"); // Reset selected year when subject changes
  };

  const handleYearClick = (year) => {
    setSelectedYear(year);
    dispatch(setYear(year));
  };

  // Effect to enable or disable the button based on loading state and selected values
  // This effect checks if the loading state is false and both selectedYear and selectedSubject are not "All". If these conditions are met, it enables the button by setting disabled to false. Otherwise, it disables the button.
  // This ensures that the button is only enabled when both a year and a subject are selected
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

            <div
              onClick={() => toggleDropdown("subject")}
              style={{ cursor: "pointer" }}
            >
              {selectedSubject}
              {activeDropdown === "subject" ? (
                <FaChevronUp
                  className="pastdropdown"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <FaChevronDown
                  className="pastdropdown"
                  style={{ cursor: "pointer" }}
                />
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
            <div
              onClick={() => {
                if (selectedSubject !== "All") toggleDropdown("year");
              }}
              style={{
                cursor: "pointer",
                opacity: selectedSubject === "All" ? 0.5 : 1,
              }}
            >
              {selectedYear}
              {activeDropdown === "year" ? (
                <FaChevronUp
                  className="pastdropdown"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <FaChevronDown
                  className="pastdropdown"
                  style={{ cursor: "pointer" }}
                />
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
              opacity: disabled || loading ? 0.3 : 1,
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
