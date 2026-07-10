import { baseApi } from "./baseApi";

const gateway = import.meta.env.VITE_PAYMENT_GATEWAY;

class PaymentApi {
  #http = baseApi.instance;

  initializePayment(data) {
    return this.#http.post(
      "/payment/initialize" + (gateway ? `?gateway=${gateway}` : ""),
      data,
    );
  }

  verifyPayment(reference) {
    return this.#http.get(`/payment/verify?reference=${reference}`);
  }

  getTransactionHistory() {
    return this.#http.get("/payment/history");
  }
}

export const paymentApi = new PaymentApi();
