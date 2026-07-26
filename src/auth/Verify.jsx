import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailVerify from "../components/EmailVerify";
import { studentApi } from "../config/studentApi";

const Verify = () => {
  const [isVerify, setIsVerify] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await studentApi.verifyAccount(token);
      if (res?.data?.success) {
        setIsVerify(true);
      }
    } catch {
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
