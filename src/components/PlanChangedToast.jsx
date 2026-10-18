import { toast } from "react-toastify";
import "../styles/planChangedToast.css";

// Shown once when a paid plan ends while the student is using the app.
// Rendered by the ToastContainer outside the router, so "Renew" navigates
// with a plain page load instead of useNavigate.
const PlanEndedToast = () => (
  <div className="plan-toast">
    <p className="plan-toast__text">
      Your Premium plan has ended. Renew to unlock everything again.
    </p>
    <button
      type="button"
      className="plan-toast__button"
      onClick={() => window.location.assign("/subscription")}
    >
      Renew
    </button>
  </div>
);

export const showPlanEndedToast = () =>
  toast.info(<PlanEndedToast />, {
    toastId: "plan-ended", // never stacked, even if several responses notice it
    autoClose: 10000,
  });
