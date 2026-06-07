import { baseApi } from "./baseApi";

class QuestionApi {
  #http = baseApi.instance;

  getAiResponse(data) {
    return this.#http.post("/generate", data);
  }
}

export const aiApi = new QuestionApi();
