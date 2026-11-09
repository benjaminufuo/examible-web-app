import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuArrowLeft, LuRefreshCw } from "react-icons/lu";
import { useIsInstalledApp } from "../hooks/useIsInstalledApp";
import { useRequireOnline } from "../hooks/useRequireOnline";
import { refreshProfile } from "../config/baseApi";
import { TABS } from "../constants/appTabs";
import "../styles/appHeaderActions.css";

const TAB_ROOTS = TABS.map((tab) => tab.to);

// Where Back goes when the app was opened straight onto this page (no
// history): the page above it, e.g. /cbt-mode/result → /cbt-mode.
// Subscription is reached from Profile in the app.
const parentOf = (pathname) => {
  const parent = pathname.replace(/\/[^/]+\/?$/, "");
  if (parent) return parent;
  return pathname.startsWith("/subscription") ? "/profile" : "/overview";
};

// Installed app: iOS has no browser back button. Shown on every dashboard
// page except the five tab pages (the CSS shows it only with the tab bar).
export const BackButton = () => {
  const { pathname, key } = useLocation();
  const navigate = useNavigate();
  const installed = useIsInstalledApp();
  if (!installed || TAB_ROOTS.includes(pathname)) return null;

  return (
    <button
      type="button"
      className="appHeader-button appHeader-back"
      aria-label="Back"
      onClick={() =>
        key === "default" ? navigate(parentOf(pathname)) : navigate(-1)
      }
    >
      <LuArrowLeft size={20} />
    </button>
  );
};

// Installed app, Overview: reloads the student's profile (plan, subjects,
// latest results). Installed apps have no pull-to-refresh.
export const RefreshButton = () => {
  const { pathname } = useLocation();
  const installed = useIsInstalledApp();
  const requireOnline = useRequireOnline();
  const [loading, setLoading] = useState(false);
  if (!installed || pathname !== "/overview") return null;

  const refresh = async () => {
    setLoading(true);
    try {
      // The same refresh as a plan change: one request, saved only if the
      // student is still signed in, and the "plan ended" notice if needed
      if (await refreshProfile()) {
        toast.success("Up to date", { toastId: "refresh", autoClose: 1500 });
      }
    } catch {
      /* baseApi already showed the error */
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="appHeader-button"
      aria-label="Refresh"
      disabled={loading}
      onClick={requireOnline(refresh)}
    >
      <LuRefreshCw
        size={18}
        className={loading ? "appHeader-spin" : undefined}
      />
    </button>
  );
};
