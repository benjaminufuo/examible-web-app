import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmailVerify from "../components/EmailVerify";
import { studentApi } from "../config/studentApi";
import useAfterMinimum from "../hooks/useAfterMinimum";

const Verify = () => {
  const [isVerify, setIsVerify] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate();
  const afterMinimum = useAfterMinimum();

  const handleVerify = async () => {
    if (!token) {
      nav("/login", { replace: true });
      return;
    }
    try {
      const res = await studentApi.verifyAccount(token);
      if (res?.data?.success) {
        setIsVerify(true);
      } else {
        afterMinimum(() => nav("/login", { replace: true }));
      }
    } catch {
      afterMinimum(() => nav("/login", { replace: true }));
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return <>{!isVerify ? <Loading /> : <EmailVerify />}</>;
};

export default Verify;
