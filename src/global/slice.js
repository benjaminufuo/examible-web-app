import { createSlice } from "@reduxjs/toolkit";
import { OPTION_KEYS } from "../utils/questionUtils";

const initialState = {
  userToken: "",
  user: {},
  // Set when a paid plan has ended; PlanEndedModal shows once and clears it
  planEndedNotice: false,
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
  // The running CBT's server session (v2): submitted with the answers
  cbtSessionId: null,
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
      state.mockSelectedSubject = "";
      state.cbtSessionId = null;
    },
    setCbtSessionId: (state, { payload }) => {
      state.cbtSessionId = payload;
    },
    // CBT v2 questions come without answers: after submitting, put the correct
    // letters back for the result page and score each recorded answer.
    // Review rows for unanswered questions have no exam entry and are skipped.
    applyCbtReview: (state, { payload: review }) => {
      if (!Array.isArray(review)) return;
      // Look-ups built once, so a full CBT (180 questions) stays linear
      const blocks = new Map(
        state.mockExamQuestions.map((b) => [b.subject, b]),
      );
      const entries = new Map(
        state.exam.map((e) => [`${e.subject}:${e.number}`, e]),
      );
      for (const row of review) {
        const question = blocks.get(row.subject)?.questions?.[row.index - 1];
        if (question) question.answer = row.answer ?? null;

        const entry = entries.get(`${row.subject}:${row.index}`);
        if (entry) entry.score = row.isCorrect ? 2 : 0;
      }
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
    // payload.seconds (a CBT: the length the server sets) or payload.duration
    // in minutes (mock exams). Stored as whole minutes and seconds, starting
    // one second in, as before (120 min → 119:59)
    setExamTimer: (state, { payload }) => {
      const total = Math.max(
        1,
        Math.round(payload.seconds ?? payload.duration * 60),
      );
      state.examTimerMins = Math.floor((total - 1) / 60);
      state.examTimerSecs = (total - 1) % 60;
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
    setPlanEndedNotice: (state, { payload }) => {
      state.planEndedNotice = payload;
    },
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
  setPlanEndedNotice,
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
  setCbtSessionId,
  applyCbtReview,
} = slice.actions;

export default slice.reducer;
