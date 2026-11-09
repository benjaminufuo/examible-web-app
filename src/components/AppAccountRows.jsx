import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuChevronRight, LuCreditCard, LuLogOut } from "react-icons/lu";
import { useIsInstalledApp } from "../hooks/useIsInstalledApp";
import { useExamibleContext } from "../context/ExamibleContext";
import "../styles/installPrompt.css";

// Profile, installed app with the tab bar: Subscription and Log out live in
// the sidebar and the menu drawer, which the tab bar replaces (decision D9).
// The CSS shows these rows only up to 850px; the website never renders them.
const AppAccountRows = () => {
  const installed = useIsInstalledApp();
  const navigate = useNavigate();
  const plan = useSelector((state) => state.user?.plan);
  const { setIsLogout } = useExamibleContext();
  if (!installed) return null;

  return (
    <div className="appAccountRows">
      <button
        type="button"
        className="installRow"
        onClick={() => navigate("/subscription")}
      >
        <span className="installRow-icon" aria-hidden="true">
          <LuCreditCard size={20} />
        </span>
        <span className="installRow-text">
          <span className="installRow-title">Subscription</span>
          <span className="installRow-subtitle">
            {plan === "Freemium"
              ? "Upgrade for unlimited access"
              : "Your plan and payments"}
          </span>
        </span>
        <LuChevronRight size={18} className="installRow-chevron" />
      </button>
      <button
        type="button"
        className="installRow installRow--danger"
        onClick={() => setIsLogout(true)}
      >
        <span className="installRow-icon" aria-hidden="true">
          <LuLogOut size={20} />
        </span>
        <span className="installRow-text">
          <span className="installRow-title">Log out</span>
        </span>
      </button>
    </div>
  );
};

export default AppAccountRows;
