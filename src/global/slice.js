import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userToken: "",
  user: {},
  exam: "",
  year: "",
  pastQuestions: [],
  pastQuestionsOption: {},
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
  logout: false,
  leavingNow: false,
  exam: [],
  notEnrolledSubjects: [],
  reference: "",
  FinishedExam: false,
  timeOut: false,
  feedbackModal: false,
  aiResponseModal: false,
  AIresponse: "",
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
      if (payload.reset) {
        state.pastQuestionsOption = {};
        return;
      }
      const { questionIndex, selectedOption, isCorrect, correctAnswerText } =
        payload;
      state.pastQuestionsOption[questionIndex] = {
        selectedOption,
        isCorrect,
        correctAnswerText,
      };
    },
    clearPastQuestionsOption: (state) => {
      state.pastQuestionsOption = {};
    },

    setMockSubject: (state, { payload }) => {
      if (state.mockSubject === payload) {
        state.mockSubject = "";
      } else {
        state.mockSubject = payload;
      }
    },
    setIsOverview: (state) => {
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
    cancelExam: (state) => {
      state.mockSubject = "";
      state.mockExamOptions.optionA = false;
      state.mockExamOptions.optionB = false;
      state.mockExamOptions.optionC = false;
      state.mockExamOptions.optionD = false;
      state.exam = [];
    },
    previousQuestion: (state) => {
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
      } else if (state.mockExamOptions.optionB) {
        const obj = {
          option: "B",
          answer: state.mockExamOptions.optionB,
          score: state.mockExamOptions.optionB === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
      } else if (state.mockExamOptions.optionC) {
        const obj = {
          option: "C",
          answer: state.mockExamOptions.optionC,
          score: state.mockExamOptions.optionC === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
      } else if (state.mockExamOptions.optionD) {
        const obj = {
          option: "D",
          answer: state.mockExamOptions.optionD,
          score: state.mockExamOptions.optionD === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
      } else {
        const obj = {
          option: "",
          answer: "none",
          score: state.mockExamOptions.optionD === payload.answer ? 2 : 0,
        };
        const num = Number(payload.subjectId) - 1;
        state.exam[num] = obj;
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
      state.exam = [];
      state.FinishedExam = false;
      state.leavingNow = false;
      state.timeOut = false;
    },
    theExamTimer: (state) => {
      if (state.examTimerSecs === 0) {
        state.examTimerMins--;
        state.examTimerSecs = 59;
      } else {
        state.examTimerSecs--;
      }
    },
    setLogout: (state) => {
      state.logout = !state.logout;
    },
    logoutTheUser: (state) => {
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
    setLeavingNow: (state) => {
      state.leavingNow = !state.leavingNow;
    },
    setNotEnrolledSubjects: (state, { payload }) => {
      state.notEnrolledSubjects = payload;
    },
    setReference: (state, { payload }) => {
      state.reference = payload;
    },
    setFinishedExam: (state) => {
      state.FinishedExam = !state.FinishedExam;
    },
    setExamTimeout: (state) => {
      state.timeOut = !state.timeOut;
    },
    setFeedbackModal: (state) => {
      if (!state?.user.feedback) {
        state.feedbackModal = !state.feedbackModal;
      }
    },
    setAiResponseModal: (state) => {
      state.aiResponseModal = !state.aiResponseModal;
    },
    setAIResponse: (state, { payload }) => {
      state.AIresponse = payload;
    },
  },
});

export const {
  setUserToken,
  setPastQuestions,
  setPastQuestionsOption,
  clearPastQuestionsOption,
  setExam,
  logoutTheUser,
  setYear,
  setLogout,
  setLeavingNow,
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
  setFeedbackModal,
  setAiResponseModal,
  setAIResponse,
} = slice.actions;

export default slice.reducer;
