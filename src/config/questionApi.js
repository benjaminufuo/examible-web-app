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

  getCbtQuestions(subjects) {
    return this.#http.get(
      `/cbt-mode/questions?subjects=${encodeURIComponent(subjects)}`,
    );
  }
}

export const questionApi = new QuestionApi();
