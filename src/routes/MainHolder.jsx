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
  }, [userToken]);

  if (loading) {
    return <Loading />;
  }

  if (userToken && !loading) {
    nav("/dashboard/overview", { replace: true });
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
