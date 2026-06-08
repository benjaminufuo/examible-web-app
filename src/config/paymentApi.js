import { baseApi } from "./baseApi";

class PaymentApi {
  #http = baseApi.instance;

  initializePayment(data) {
    return this.#http.post("/initializeKoraPay", data);
  }

  verifyPayment(reference) {
    return this.#http.get(`/verifyKoraPay?reference=${reference}`);
  }
}

export const paymentApi = new PaymentApi();
