import { baseApi } from "./baseApi";

class QuestionApi {
  #http = baseApi.instance;

  fetchQuestions(year, subject) {
    return this.#http.get(
      `/fetch-questions/${year}/${encodeURIComponent(subject)}`,
    );
  }

  fetchMockQuestions(subject) {
    return this.#http.get(`/mock-questions/${encodeURIComponent(subject)}`);
  }
}

export const questionApi = new QuestionApi();
