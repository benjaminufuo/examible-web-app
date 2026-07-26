import { useEffect, useState } from "react";
import PasswordResetPage from "./PasswordResetPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { studentApi } from "../../config/studentApi";

const ResetPassword = () => {
  const [isVerify, setIsVerify] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await studentApi.verifyResetToken(token);
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

  return <>{!isVerify ? <Loading /> : <PasswordResetPage />}</>;
};

export default ResetPassword;
