import { baseApi } from "./baseApi.JS";

class QuestionApi {
  #http = baseApi.instance;

  fetchQuestions(year, subject) {
    return this.#http.get(`/fetch-questions/${year}/${encodeURIComponent(subject)}`);
  }

  fetchMockQuestions(subject, questions) {
    return this.#http.get(`/mock-questions/${encodeURIComponent(subject)}`, {
      params: questions ? { questions } : undefined,
    });
  }
}

export const questionApi = new QuestionApi();
