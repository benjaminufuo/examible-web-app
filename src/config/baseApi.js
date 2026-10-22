import axios from "axios";
import { toast } from "react-toastify";
import { store, persistor } from "../global/store";
import { setUser, logoutTheUser } from "../global/slice";
import { showPlanEndedNotice } from "../utils/planNotice";
import {
  reportNetworkError,
  reportServerResponse,
} from "../utils/connectivity";

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
        reportServerResponse();
        this.#checkPlan(response);
        return response;
      },
      (error) => {
        if (error?.response) {
          reportServerResponse();
          this.#checkPlan(error.response);
        }
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
    const status = error?.response?.status;

    // No response (offline, connection dropped, cancelled): the offline
    // message. Also when the browser itself says offline and a server error
    // came back anyway (a local backend that has lost its database). Any other
    // response is the server's answer, so a 401 always signs the student out.
    if (!error?.response && !axios.isCancel(error)) reportNetworkError();
    if (!error?.response || (!navigator.onLine && status >= 500)) {
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

    if (status === 401) {
      endSession(message);
    } else if (!error?.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
}

// The login token was rejected (expired, or signed in elsewhere): sign out.
// Also used by requests made outside axios (the AI tutor fetch, F3).
export function endSession(message) {
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
}

let refreshingPlan = false;

// Also used by requests made outside axios (the AI tutor fetch, F3): pass the
// response's X-Plan header value
export function notePlanHeader(plan, http = baseApi.instance) {
  if (!plan) return; // logged-out request
  const { user } = store.getState();
  if (!user?.id || plan === user.plan || refreshingPlan) return;

  const studentId = user.id;
  refreshingPlan = true;
  const wasPaid = user.plan && user.plan !== "Freemium";
  // studentApi isn't imported here: it imports baseApi, so that would be circular
  http
    .get("/studentInfo", { skipPlanCheck: true, silent: true })
    .then((res) => {
      const fresh = res?.data?.data;
      if (!fresh) return;
      // The student may have signed out (or signed in as someone else) while
      // this was in flight: never write a profile into another session
      const { userToken, user: current } = store.getState();
      if (!userToken || current?.id !== studentId) return;
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
