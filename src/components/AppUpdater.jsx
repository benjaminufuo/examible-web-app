import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useIsInstalledApp } from "../hooks/useIsInstalledApp";
import { isSafeToReload } from "../utils/examRoutes";
import { setSwUpdate } from "../utils/swUpdate";
import { isOnline } from "../utils/connectivity";
import "../styles/appUpdater.css";

const UPDATE_CHECK_MS = 60 * 60 * 1000; // look for a new version hourly

const UpdateToast = ({ onRefresh }) => (
  <div className="update-toast">
    <span className="update-toast__text">
      A new version of Examible is ready.
    </span>
    <button type="button" className="update-toast__button" onClick={onRefresh}>
      Refresh
    </button>
  </div>
);

// Registers the service worker and applies new versions safely.
// Reloading wipes React Router's location.state, which result pages, payment
// and the exam rely on, so updates are only applied on pages where a reload
// loses nothing (isSafeToReload).
const AppUpdater = () => {
  const installed = useIsInstalledApp();
  const { pathname } = useLocation();
  const updateTimer = useRef(null);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_, registration) {
      if (!registration) return;
      setSwUpdate({ registration });
      clearInterval(updateTimer.current);
      updateTimer.current = setInterval(() => {
        if (!isOnline()) return;
        // A failed check (connection dropped) just waits for the next one
        registration.update().catch(() => {});
      }, UPDATE_CHECK_MS);
    },
  });
  useEffect(() => () => clearInterval(updateTimer.current), []);

  // Shared with the forced update ("Update now"), so it uses this same path
  useEffect(() => {
    setSwUpdate({ ready: needRefresh, update: updateServiceWorker });
  }, [needRefresh, updateServiceWorker]);
  const safe = isSafeToReload(pathname);

  // Installed app: offer the update, only on safe pages
  useEffect(() => {
    if (!installed || !needRefresh) return;
    if (safe) {
      toast.info(<UpdateToast onRefresh={() => updateServiceWorker(true)} />, {
        autoClose: false,
        closeOnClick: false,
        toastId: "app-update",
      });
    } else {
      toast.dismiss("app-update");
    }
  }, [installed, needRefresh, safe, updateServiceWorker]);

  // Website: apply silently on the next navigation to a safe page
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!installed && needRefresh && safe) updateServiceWorker(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
};

export default AppUpdater;
