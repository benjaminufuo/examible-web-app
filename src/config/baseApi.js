import axios from "axios";
import { toast } from "react-toastify";
import { store, persistor } from "../global/store";
import { logoutTheUser } from "../global/slice";

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
      // One toast even when several requests fail together
      toast.error(message, { toastId: "session-ended" });
      localStorage.removeItem("userToken");
      // Reset and save the signed-out state at once. Removing persist:root
      // alone isn't enough: redux-persist's throttled write puts the old,
      // signed-in state back a few seconds later. PrivateRoute then sends the
      // student to /login straight away, so no page reload is needed (a delayed
      // reload would wipe a login they've already started).
      store.dispatch(logoutTheUser());
      persistor.flush();
    } else if (!error?.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
}

export const baseApi = new BaseApi();
