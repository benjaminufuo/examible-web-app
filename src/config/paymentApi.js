import { baseApi } from "./baseApi";

class PaymentApi {
  #http = baseApi.instance;

  initializePayment(data) {
    return this.#http.post("/initializeKoraPay", data);
  }

  verifyPayment(reference) {
    return this.#http.get(`/verifyKoraPay?reference=${reference}`);
  }

  getTransactionHistory() {
    return this.#http.get("/payments/my");
  }
}

export const paymentApi = new PaymentApi();
