import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const MainHolder = () => {
  const userToken = useSelector((state) => state.userToken);
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);

    if (userToken) {
      setTimeout(() => {
        nav("/dashboard/overview", { replace: true });
      }, 800);
    }
  }, [userToken]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainHolder;
