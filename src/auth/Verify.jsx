import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import EmailVerify from "../components/EmailVerify";
import { toast } from "react-toastify";

const Verify = () => {
  const [isVerify, setIsVerify] = useState(false);
  const { token } = useParams();
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}api/v1/verify/student/${token}`
      );
      if (res?.status === 200) {
        setIsVerify(true);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setTimeout(() => {
        nav("/login");
      }, 3000);
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <>{!isVerify ? <Loading /> : <EmailVerify />}</>;
};

export default Verify;
