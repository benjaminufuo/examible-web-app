import { useEffect, useState } from "react";
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
      if (userToken) {
        nav("/overview", { replace: true });
      }
    }, 1000);
    setTimeout(() => {
      setLoading(false);
    }, 1100);
  }, [userToken]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="ex-scope">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainHolder;
