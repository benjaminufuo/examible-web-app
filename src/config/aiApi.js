import { baseApi } from "./baseApi.JS";

class QuestionApi {
  #http = baseApi.instance;

  getAiResponse(data) {
    return this.#http.post("/generate", data);
  }
}

export const aiApi = new QuestionApi();
