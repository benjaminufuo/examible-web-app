import { useEffect } from "react";
import Loading from "./Loading";
import { useNavigate, useParams } from "react-router-dom";
import { studentApi } from "../config/studentApi";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";

const Callback = () => {
  const { token, userId } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const createUser = async () => {
    try {
      const res = await studentApi.getStudentById(userId);
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.data));
        dispatch(setUserToken(token));
        setTimeout(() => {
          nav("/overview", { replace: true });
        }, 3000);
      }
    } catch (error) {
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
