import axios from "axios";
import { toast } from "react-toastify";

const baseURL = `${import.meta.env.VITE_BASE_URL}api/v1`;

export class BaseApi {
  instance = this.#createInstance();

  #createInstance() {
    const instance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    instance.interceptors.request.use(
      (config) => this.#attachToken(config),
      (error) => Promise.reject(error),
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => this.#handleError(error),
    );

    return instance;
  }

  #attachToken(config) {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  #handleError(error) {
    const message = error?.response?.data?.message ?? "Something went wrong";
    const status = error?.response?.status;

    if (status === 401) {
      toast.error(message);
      localStorage.removeItem("userToken");
      localStorage.removeItem("persist:root");

      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } else if (!error?.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
}

export const baseApi = new BaseApi();
