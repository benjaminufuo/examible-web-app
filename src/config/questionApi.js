import { baseApi } from "./baseApi";

class QuestionApi {
  #http = baseApi.instance;

  fetchQuestions(year, subject) {
    return this.#http.get(
      `/fetch-questions?year=${encodeURIComponent(year)}&subject=${encodeURIComponent(subject)}`,
    );
  }

  fetchMockQuestions(subject, limit) {
    return this.#http.get(
      `/mock-questions?subject=${encodeURIComponent(subject)}${limit ? `&limit=${encodeURIComponent(limit)}` : ""}`,
    );
  }

  // CBT v2: the server keeps the answer key. Starting returns
  // { sessionId, totalDuration (seconds), data }, with no answers in the
  // questions; submitting scores the chosen letters and returns the review.
  getCbtQuestions(subjects) {
    return this.#http.get(
      `/cbt-mode/v2/questions?subjects=${encodeURIComponent(subjects)}`,
    );
  }

  // silent: the submit screens show their own messages (offline, ended)
  submitCbt({ sessionId, answers }) {
    return this.#http.post(
      `/cbt-mode/v2/submit`,
      { sessionId, answers },
      { silent: true },
    );
  }
}

export const questionApi = new QuestionApi();
