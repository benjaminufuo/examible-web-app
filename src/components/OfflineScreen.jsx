import { useLocation, useNavigate } from "react-router-dom";
import { LuWifiOff } from "react-icons/lu";
import "../styles/offline.css";

// Shown by OnlineOnlyRoute when the installed app opens a page that needs internet
const OfflineScreen = ({ feature = "This page" }) => {
  const nav = useNavigate();
  const location = useLocation();

  // Re-enter the same route to re-check the connection, keeping its query
  // string and state (e.g. /verifying-payment?reference=... and MakePayment's state)
  const tryAgain = () =>
    nav(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: location.state },
    );

  return (
    <div className="offline-screen" role="status">
      <div className="offline-screen__icon">
        <LuWifiOff size={34} />
      </div>
      <h2 className="offline-screen__title">You're offline</h2>
      <p className="offline-screen__text">
        {feature} needs internet. Connect and try again.
      </p>
      <div className="offline-screen__actions">
        <button
          type="button"
          className="offline-screen__primary"
          onClick={tryAgain}
        >
          Try again
        </button>
        <button
          type="button"
          className="offline-screen__secondary"
          onClick={() => nav("/overview")}
        >
          Go to Overview
        </button>
      </div>
    </div>
  );
};

export default OfflineScreen;
