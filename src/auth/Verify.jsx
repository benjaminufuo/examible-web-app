import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import EmailVerify from "../components/EmailVerify";
import { studentApi } from "../config/studentApi";

const Verify = () => {
  const [isVerify, setIsVerify] = useState(false);
  const { token } = useParams();
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await studentApi.verifyAccount(token);
      if (res?.status === 200) {
        setIsVerify(true);
      }
    } catch (error) {
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
