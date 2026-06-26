import { createSlice } from "@reduxjs/toolkit";
import { OPTION_KEYS } from "../utils/questionUtils";

const initialState = {
  userToken: "",
  user: {},
  pastQuestions: [],
  pastQuestionsOption: {},
  mockExamQuestions: [],
  mockExamOptions: {
    optionA: false,
    optionB: false,
    optionC: false,
    optionD: false,
    optionE: false,
  },
  examTimerMins: 0,
  examTimerSecs: 0,
  exam: [],
  notEnrolledSubjects: [],
  finishedExam: false,
  timedOut: false,
  chatbotMessages: [
    {
      message:
        "Hello, I am Examible bot, Feel free to ask me question based on O'level Subjects",
      sender: "bot",
      direction: "incoming",
    },
  ],
  mockSelectedSubject: "",
  pastQuestionsPage: 1,
  mockResultPage: 1,
};

const slice = createSlice({
  name: "Examible",
  initialState,
  reducers: {
    setUserToken: (state, { payload }) => {
      state.userToken = payload;
    },
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setPastQuestions: (state, { payload }) => {
      state.pastQuestions = payload;
      state.pastQuestionsPage = 1;
    },
    setPastQuestionsPage: (state, { payload }) => {
      state.pastQuestionsPage = payload;
    },
    setPastQuestionsOption: (state, { payload }) => {
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
    setMockExamQuestion: (state, { payload }) => {
      state.mockExamQuestions = payload;
    },
    setMockExamOption: (state, { payload }) => {
      // Only touch the two keys that change instead of all five
      const prevKey = OPTION_KEYS.find((k) => state.mockExamOptions[k]);
      if (prevKey) state.mockExamOptions[prevKey] = false;
      const key = `option${payload.option}`;
      if (key in state.mockExamOptions) {
        state.mockExamOptions[key] = payload.answer;
      }
    },
    cancelExam: (state) => {
      state.mockExamQuestions = [];
      state.exam = [];
      state.mockExamOptions = { ...initialState.mockExamOptions };
      state.finishedExam = false;
      state.timedOut = false;
      state.mockResultPage = 1;
    },
    setMockResultPage: (state, { payload }) => {
      state.mockResultPage = payload;
    },
    nextQuestion: (state, { payload }) => {
      const selectedKey = OPTION_KEYS.find((k) => state.mockExamOptions[k]);
      if (!selectedKey) return;

      const option = selectedKey.replace("option", "");
      const answer = state.mockExamOptions[selectedKey];
      const obj = {
        number: Number(payload.subjectId),
        subject: payload.subject,
        option,
        answer,
        score: answer === payload.answer ? 2 : 0,
      };

      const currentIndex = state.exam.findIndex(
        (q) =>
          q.subject === payload.subject &&
          q.number === Number(payload.subjectId),
      );
      if (currentIndex !== -1) {
        state.exam[currentIndex] = obj;
      } else {
        state.exam.push(obj);
      }
    },
    setExamTimer: (state, { payload }) => {
      state.examTimerMins = payload.duration - 1;
      state.examTimerSecs = 59;
      state.exam = [];
      state.mockExamOptions = { ...initialState.mockExamOptions };
      state.finishedExam = false;
      state.timedOut = false;
      state.mockResultPage = 1;
    },
    theExamTimer: (state) => {
      if (state.finishedExam) return;
      if (state.examTimerMins <= 0 && state.examTimerSecs <= 0) {
        state.timedOut = true;
        return;
      }
      if (state.examTimerSecs === 0) {
        state.examTimerMins--;
        state.examTimerSecs = 59;
      } else {
        state.examTimerSecs--;
      }
    },
    logoutTheUser: () => initialState,
    setNotEnrolledSubjects: (state, { payload }) => {
      state.notEnrolledSubjects = payload;
    },
    setFinishedExam: (state, { payload }) => {
      state.finishedExam = payload;
    },
    setTimedOut: (state, { payload }) => {
      state.timedOut = payload;
    },
    setChatbotMessages: (state, { payload }) => {
      state.chatbotMessages = payload;
    },
    setMockSelectedSubject: (state, { payload }) => {
      state.mockSelectedSubject = payload;
    },
  },
});

export const {
  setUserToken,
  setPastQuestions,
  setPastQuestionsPage,
  setMockResultPage,
  setPastQuestionsOption,
  clearPastQuestionsOption,
  logoutTheUser,
  theExamTimer,
  setUser,
  setMockExamQuestion,
  setMockExamOption,
  cancelExam,
  nextQuestion,
  setExamTimer,
  setNotEnrolledSubjects,
  setFinishedExam,
  setTimedOut,
  setChatbotMessages,
  setMockSelectedSubject,
} = slice.actions;

export default slice.reducer;
