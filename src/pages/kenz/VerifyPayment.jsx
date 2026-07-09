import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../global/slice";
import PaymentSuccessfull from "../../components/PaymentSuccessfull";
import { paymentApi } from "../../config/paymentApi";
import { toast } from "react-toastify";

const VerifyPayment = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [plan, setPlan] = useState("");
  const dispatch = useDispatch();
  const nav = useNavigate();

  const verifyPayment = async () => {
    try {
      const res = await paymentApi.verifyPayment(reference);
      if (res?.data?.success) {
        dispatch(setUser(res?.data?.data?.student));
        const userPlan = res?.data?.data?.student?.plan || "Premium";
        setPlan(userPlan);
        setIsVerifying(false);
      } else {
        nav("/subscription"); // Redirect to a relevant page
      }
    } catch {
      setTimeout(() => {
        nav("/overview");
      }, 2000);
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);
  return <>{isVerifying ? <Loading /> : <PaymentSuccessfull plan={plan} />}</>;
};

export default VerifyPayment;
