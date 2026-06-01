import { useEffect, useState } from "react";
import PasswordResetPage from "./PasswordResetPage";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { studentApi } from "../../config/studentApi";

const ResetPassword = () => {
  const [isVerify, setIsVerify] = useState(false);
  const { token } = useParams();
  const nav = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await studentApi.verifyResetToken(token);
      if (res?.data?.success) {
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

  return <>{!isVerify ? <Loading /> : <PasswordResetPage />}</>;
};

export default ResetPassword;
