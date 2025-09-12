import { useState } from "react";
import "../../styles/dashboardCss/logout.css";
import img1 from "../../assets/public/Log out.svg";
import { useDispatch, useSelector } from "react-redux";
import { logoutTheUser, setLogout } from "../../global/slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const userToken = useSelector((state) => state.userToken);
  const [loading, setLoading] = useState(false);
  const logoutUser = async () => {
    const id = toast.loading("logging out ...");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/v1/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.dismiss(id);
      if (res?.status === 200) {
        setTimeout(() => {
          toast.success(res?.data?.message, { autoClose: 4000 });
          nav("/");
          dispatch(setLogout());
        }, 500);
        setLoading(false);
        setTimeout(() => {
          dispatch(logoutTheUser());
        }, 550);
      }
      return;
    } catch (error) {
      toast.dismiss(id);
      setLoading(false);
      if (
        error?.response?.data?.message ===
        "Session timed-out: Please login to continue"
      ) {
        setTimeout(() => {
          nav("/");
        }, 500);
        setTimeout(() => {
          dispatch(logoutTheUser());
        }, 1000);
      } else {
        setTimeout(() => {
          toast.error(error?.response?.data?.message);
        }, 500);
      }
    }
  };
  return (
    <div className="logout" onClick={() => dispatch(setLogout())}>
      <div className="logoutHolder" onClick={(e) => e.stopPropagation()}>
        <img src={img1} alt="" />
        <main>
          <h3>Ready to log out? </h3>
          <p>Keep the momentum going — we’ll be here when you’re back!</p>
          <nav>
            <button
              className="logout-btn"
              onClick={logoutUser}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#804bf233" : "#804BF2",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Log out
            </button>
            <button
              className="continue-btn"
              style={{ cursor: loading ? "not-allowed" : "pointer" }}
              disabled={loading}
              onClick={() => dispatch(setLogout())}
            >
              Continuing learning{" "}
            </button>
          </nav>
        </main>
      </div>
    </div>
  );
};

export default Logout;
