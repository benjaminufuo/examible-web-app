import Header from "../components/Header";
import Footer from "../components/Footer";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const MainHolder = () => {
  const userToken = useSelector((state) => state.userToken);
  if (userToken) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <div className="ex-scope">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainHolder;
