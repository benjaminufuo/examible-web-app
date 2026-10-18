import axios from "axios";
import { toast } from "react-toastify";
import { store } from "../global/store";
import { setUser } from "../global/slice";
import { showPlanEndedNotice } from "../utils/planNotice";

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
      (response) => {
        this.#checkPlan(response);
        return response;
      },
      (error) => {
        if (error?.response) this.#checkPlan(error.response);
        return this.#handleError(error);
      },
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

  // The backend sends the student's current plan as X-Plan on authenticated
  // responses. When it differs from the stored user (plan expired, or an upgrade
  // confirmed by a payment webhook), refetch the profile once.
  #checkPlan(response) {
    if (response?.config?.skipPlanCheck) return; // the refetch's own response
    notePlanHeader(response?.headers?.["x-plan"], this.instance);
  }

  #handleError(error) {
    // No response (offline, connection dropped, cancelled), or the device says
    // it's offline: whatever came back (e.g. a 500 from a local backend that has
    // lost its database), the student needs the offline message
    if (!error?.response || !navigator.onLine) {
      // Respect silent requests (e.g. logout) and cancelled ones
      if (!error?.config?.silent && !axios.isCancel(error)) {
        toast.error(
          "You're offline or the connection dropped. Check your internet and try again.",
          { toastId: "network" }, // one toast when several requests fail together
        );
      }
      return Promise.reject(error);
    }

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

let refreshingPlan = false;

// Also used by requests made outside axios (the AI tutor fetch, F3): pass the
// response's X-Plan header value
export function notePlanHeader(plan, http = baseApi.instance) {
  if (!plan) return; // logged-out request
  const { user } = store.getState();
  if (!user?.id || plan === user.plan || refreshingPlan) return;

  refreshingPlan = true;
  const wasPaid = user.plan && user.plan !== "Freemium";
  // studentApi isn't imported here: it imports baseApi, so that would be circular
  http
    .get("/studentInfo", { skipPlanCheck: true, silent: true })
    .then((res) => {
      const fresh = res?.data?.data;
      if (!fresh) return;
      store.dispatch(setUser(fresh));
      // PlanEndedModal picks this up (and waits if an exam is in progress)
      if (wasPaid && fresh.plan === "Freemium") showPlanEndedNotice();
    })
    .catch(() => {}) // best effort: the next response will try again
    .finally(() => {
      refreshingPlan = false;
    });
}

export const baseApi = new BaseApi();
