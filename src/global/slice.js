import { createSlice } from "@reduxjs/toolkit";
import PastQuestion from "../pages/jacob/PastQuestion";
import FinishedExam from "../components/FinishedExam";

const initialState = {
  userToken: "",
  user: {},
  exam: "",
  year: "",
  pastQuestions: [],
  pastQuestionsOption: {
    optionA: false,
    optionB: false,
    optionC: false,
    optionD: false,
  },
  toggle: false,
  mockSubject: "",
  isOverview: false,
  mockExamQuestions: [],
  mockExamOptions: {
    optionA: false,
    optionB: false,
    optionC: false,
    optionD: false,
  },
  examMeter: 0,
  examTimerMins: 0,
  examTimerSecs: 0,
  navState: {
    overview: true,
    mockExam: false,
    pastQuestion: false,
    profile: false,
    subscription: false,
  },
  logout: false,
  leavingNow: false,
  exam: [],
  notEnrolledSubjects: [],
  reference: '',
  FinishedExam: false,
  timeOut: false
};

const slice = createSlice({
  name: "Legacy Builders",
  initialState,
  reducers: {
    setUserToken: (state, { payload }) => {
      state.userToken = payload;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },

    setMockSubject: (state, { payload }) => {
      state.mockSubject = payload;
    },
    setExam: (state, { payload }) => {
      state.exam = payload;
    },
    setToggle: (state, { payload }) => {
      state.toggle = payload;
    },
    setYear: (state, { payload }) => {
      state.year = payload;
    },
    setPastQuestions: (state, { payload }) => {
      state.pastQuestions = payload;
    },
    setPastQuestionsOption: (state, { payload }) => {
      switch (payload) {
        case "A":
          state.pastQuestionsOption.optionA = true;
          state.pastQuestionsOption.optionB = false;
          state.pastQuestionsOption.optionC = false;
          state.pastQuestionsOption.optionD = false;
          break;
        case "B":
          state.pastQuestionsOption.optionA = false;
          state.pastQuestionsOption.optionB = true;
          state.pastQuestionsOption.optionC = false;
          state.pastQuestionsOption.optionD = false;

          break;
        case "C":
          state.pastQuestionsOption.optionA = false;
          state.pastQuestionsOption.optionB = false;
          state.pastQuestionsOption.optionC = true;
          state.pastQuestionsOption.optionD = false;

          break;
        case "D":
          state.pastQuestionsOption.optionA = false;
          state.pastQuestionsOption.optionB = false;
          state.pastQuestionsOption.optionC = false;
          state.pastQuestionsOption.optionD = true;
          break;

        default:
          state.pastQuestionsOption.optionA = false;
          state.pastQuestionsOption.optionB = false;
          state.pastQuestionsOption.optionC = false;
          state.pastQuestionsOption.optionD = false;
          break;
      }
    },

    setMockSubject: (state, { payload }) => {
      if (state.mockSubject === payload) {
        state.mockSubject = "";
      } else {
        state.mockSubject = payload;
      }
    },
    setIsOverview: (state, { payload }) => {
      state.isOverview = !state.isOverview;
    },
    setMockExamQuestion: (state, { payload }) => {
      state.mockExamQuestions = payload;
    },
    setMockExamOption: (state, { payload }) => {
      switch (payload.option) {
        case "A":
          state.mockExamOptions.optionA = payload.answer;
          state.mockExamOptions.optionB = false;
          state.mockExamOptions.optionC = false;
          state.mockExamOptions.optionD = false;
          break;
        case "B":
          state.mockExamOptions.optionA = false;
          state.mockExamOptions.optionB = payload.answer;
          state.mockExamOptions.optionC = false;
          state.mockExamOptions.optionD = false;
          break;
        case "C":
          state.mockExamOptions.optionA = false;
          state.mockExamOptions.optionB = false;
          state.mockExamOptions.optionC = payload.answer;
          state.mockExamOptions.optionD = false;
          break;
        case "D":
          state.mockExamOptions.optionA = false;
          state.mockExamOptions.optionB = false;
          state.mockExamOptions.optionC = false;
          state.mockExamOptions.optionD = payload.answer;
          break;

        default:
          state.mockExamOptions.optionA = false;
          state.mockExamOptions.optionB = false;
          state.mockExamOptions.optionC = false;
          state.mockExamOptions.optionD = false;
          break;
      }
    },
    cancelExam: (state, { payload }) => {
      state.mockSubject = "";
      state.mockExamOptions.optionA = false;
      state.mockExamOptions.optionB = false;
      state.mockExamOptions.optionC = false;
      state.mockExamOptions.optionD = false;
      state.exam = [];
    },
    previousQuestion: (state, { payload }) => {
      state.examMeter = state.examMeter - 2;
    },
    nextQuestion: (state, { payload }) => {
      state.examMeter = state.examMeter + 2;
      if (state.mockExamOptions.optionA) {
        const obj = {
          option: "A",
          answer: state.mockExamOptions.optionA,
          score: state.mockExamOptions.optionA === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
        console.log(obj);
      } else if (state.mockExamOptions.optionB) {
        const obj = {
          option: "B",
          answer: state.mockExamOptions.optionB,
          score: state.mockExamOptions.optionB === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
        console.log(obj);
      } else if (state.mockExamOptions.optionC) {
        const obj = {
          option: "C",
          answer: state.mockExamOptions.optionC,
          score: state.mockExamOptions.optionC === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
        console.log(obj);
      } else if (state.mockExamOptions.optionD) {
        const obj = {
          option: 'D',
          answer: state.mockExamOptions.optionD,
          score: state.mockExamOptions.optionD === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
        console.log(obj);
      } else {
        const obj = {
          option: "none",
          answer: "none",
          score: state.mockExamOptions.optionD === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
        console.log(obj);
      }
    },
    setExamTimer: (state, { payload }) => {
      state.examMeter = 0;
      if (payload === "Freemium") {
        state.examTimerMins = 9;
        state.examTimerSecs = 59;
      } else {
        state.examTimerMins = 29;
        state.examTimerSecs = 59;
      }
      state.exam = []
      state.FinishedExam = false
      state.leavingNow = false
      state.timeOut = false
    },
    theExamTimer: (state, { payload }) => {
      if (state.examTimerSecs === 0) {
        state.examTimerMins--;
        state.examTimerSecs = 59;
      } else {
        state.examTimerSecs--;
      }
    },
    setNavState: (state, { payload }) => {
      switch (payload) {
        case "OVERVIEW":
          state.navState.overview = true;
          state.navState.mockExam = false;
          state.navState.pastQuestion = false;
          state.navState.profile = false;
          state.navState.subscription = false;
          break;
        case "MOCKEXAM":
          state.navState.overview = false;
          state.navState.mockExam = true;
          state.navState.pastQuestion = false;
          state.navState.profile = false;
          state.navState.subscription = false;
          break;
        case "PASTQUESTION":
          state.navState.overview = false;
          state.navState.mockExam = false;
          state.navState.pastQuestion = true;
          state.navState.profile = false;
          state.navState.subscription = false;
          break;
        case "PROFILE":
          state.navState.overview = false;
          state.navState.mockExam = false;
          state.navState.pastQuestion = false;
          state.navState.profile = true;
          state.navState.subscription = false;
          break;
        case "SUBSCRIPTION":
          state.navState.overview = false;
          state.navState.mockExam = false;
          state.navState.pastQuestion = false;
          state.navState.profile = false;
          state.navState.subscription = true;
          break;

        default:
          state.navState.overview = true;
          state.navState.mockExam = false;
          state.navState.pastQuestion = false;
          state.navState.profile = false;
          state.navState.subscription = false;
          break;
      }
    },
    setLogout: (state, { payload }) => {
      state.logout = !state.logout;
    },
    logoutTheUser: (state, { payload }) => {
      state.logout = !state.logout;
      state.user = {};
      state.userToken = "";
      state.navState.overview = true;
      state.navState.mockExam = false;
      state.navState.pastQuestion = false;
      state.navState.profile = false;
      state.navState.subscription = false;
      state.mockSubject = "";
    },
    setLeavingNow: (state, { payload }) => {
      state.leavingNow = !state.leavingNow;
    },
    setNotEnrolledSubjects: (state,{payload})=> {
      state.notEnrolledSubjects = payload
    },
    setReference: (state,{payload})=>{
      state.reference = payload
    },
    setFinishedExam: (state,{payload})=>{
      state.FinishedExam = !state.FinishedExam
    },
    setExamTimeout: (state, {payload})=>{
      state.timeOut = !state.timeOut
    }
  },
});

export const {
  setUserToken,
  setPastQuestions,
  setPastQuestionsOption,
  setExam,
  logoutTheUser,
  setYear,
  setLogout,
  setLeavingNow,
  setNavState,
  theExamTimer,
  setUser,
  setMockSubject,
  setIsOverview,
  setMockExamQuestion,
  setMockExamOption,
  cancelExam,
  previousQuestion,
  nextQuestion,
  setExamTimer,
  setToggle,
  setNotEnrolledSubjects,
  setReference,
  setFinishedExam,
  setExamTimeout,
} = slice.actions;

export default slice.reducer;
