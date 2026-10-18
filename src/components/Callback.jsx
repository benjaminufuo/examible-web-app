import { useEffect, useRef } from "react";
import Loading from "./Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";

const Callback = () => {
  const [searchParams] = useSearchParams();
  // One-time code from the backend's Google callback. It works once, so the
  // exchange must not run twice (StrictMode runs effects twice in development).
  const code = searchParams.get("code");
  const exchanged = useRef(false);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const signIn = async () => {
    if (!code) {
      nav("/login");
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
        setTimeout(() => {
          nav("/overview", { replace: true });
        }, 3000);
      }
    } catch {
      setTimeout(() => {
        nav("/login");
      }, 3000);
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
