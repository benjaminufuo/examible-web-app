import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "../global/slice";

const Callback = () => {
  const { token, userId } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();

  const createUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/v1/studentInfo/${userId}`
      );
      if (res?.status === 200) {
        dispatch(setUser(res?.data?.data));
        dispatch(setUserToken(token));
        setTimeout(() => {
          nav("/dashboard/overview");
        }, 3000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setTimeout(() => {
        nav('/login')
      }, 3000);
    }
  };

  useEffect(() => {
    createUser();
  }, []);

  return <Loading />;
};

export default Callback;
