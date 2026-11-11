import { useEffect, useRef } from "react";
import Loading from "./Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";
import useAfterMinimum from "../hooks/useAfterMinimum";
import { toast } from "react-toastify";

const Callback = () => {
  const [searchParams] = useSearchParams();
  // One-time code from the backend's Google callback. It works once, so the
  // exchange must not run twice (StrictMode runs effects twice in development).
  const code = searchParams.get("code");
  const exchanged = useRef(false);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const afterMinimum = useAfterMinimum();

  // Replace, not push: Back mustn't return to /callback, which would only
  // send the student to /login again
  const backToLogin = () =>
    afterMinimum(() => nav("/login", { replace: true }));

  const signIn = async () => {
    if (!code) {
      nav("/login", { replace: true });
      return;
    }
    // Keep the code out of the browser history
    window.history.replaceState(null, "", "/callback");
    try {
      const res = await studentApi.exchangeGoogleCode(code);
      const token = res?.data?.token;
      if (res?.data?.success && token) {
        localStorage.setItem("userToken", token);
        dispatch(setUser(res?.data?.data));
        dispatch(setUserToken(token));
        afterMinimum(() => nav("/overview", { replace: true }));
      } else {
        toast.error("Google sign-in failed. Please try again.", {
          toastId: "google-sign-in",
        });
        backToLogin();
      }
    } catch {
      // The request's own error message has been shown (baseApi)
      backToLogin();
    }
  };

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;
    signIn();
  }, []);

  return <Loading />;
};

export default Callback;
