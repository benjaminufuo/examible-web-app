import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuWifi, LuWifiOff } from "react-icons/lu";
import { useOnline } from "../hooks/useOnline";
import { useIsInstalledApp } from "../hooks/useIsInstalledApp";
import { isOnline } from "../utils/connectivity";
import "../styles/offline.css";

const BACK_ONLINE_MS = 2000; // "You're back online" stays this long
const COLLAPSE_MS = 400; // matches the --ex-offline-bar transition in offline.css

// Installed app only. A slim bar while the device is offline; when the
// connection returns it turns brand-coloured, says "You're back online" for
// two seconds, then collapses upward with the page following it.
const OfflineBanner = () => {
  const online = useOnline();
  const installed = useIsInstalledApp();
  // hidden → offline → back (2s) → leaving (collapse) → hidden
  const [status, setStatus] = useState(() =>
    installed && !isOnline() ? "offline" : "hidden",
  );
  const statusRef = useRef(status);
  statusRef.current = status;

  useEffect(() => {
    if (!installed) return undefined;
    if (!online) {
      setStatus("offline");
      return undefined;
    }
    if (statusRef.current !== "offline") return undefined;

    // Back online: brand-coloured notice, then collapse, then unmount
    setStatus("back");
    let collapse;
    const leave = setTimeout(() => {
      setStatus("leaving");
      collapse = setTimeout(() => setStatus("hidden"), COLLAPSE_MS);
    }, BACK_ONLINE_MS);
    // Going offline again (or unmounting) cancels the pending steps
    return () => {
      clearTimeout(leave);
      clearTimeout(collapse);
    };
  }, [online, installed]);

  // The page (and its pinned top bars) sits below the bar while it shows
  const open = status === "offline" || status === "back";
  useEffect(() => {
    document.documentElement.classList.toggle("ex-offline", open);
    return () => document.documentElement.classList.remove("ex-offline");
  }, [open]);

  if (status === "hidden") return null;

  const back = status === "back" || status === "leaving";
  return (
    <div
      className={`offline-banner ${back ? "offline-banner--back" : ""}`}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={back ? "back" : "offline"}
          className="offline-banner__content"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {back ? (
            <>
              <LuWifi size={14} aria-hidden="true" />
              You're back online
            </>
          ) : (
            <>
              <LuWifiOff size={14} aria-hidden="true" />
              You're offline. Some features need internet.
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default OfflineBanner;
