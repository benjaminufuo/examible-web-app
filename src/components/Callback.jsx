import { useEffect } from "react";
import Loading from "./Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("user_id");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const createUser = async () => {
    if (!token || !userId) {
      nav("/login");
      return;
    }
    try {
      const res = await studentApi.getStudentById(userId);
      if (res?.data?.success) {
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
    createUser();
  }, []);

  return <Loading />;
};

export default Callback;
