import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useIsInstalledApp } from "../hooks/useIsInstalledApp";
import { isOnline } from "../utils/connectivity";
import OfflineScreen from "../components/OfflineScreen";

// Pages that can't work offline. Website: unchanged. Installed app: shows the
// offline screen instead of a broken page.
// Decided when the page is entered (location.key), not continuously, so a short
// drop on a flaky network never unmounts a page in use (e.g. mid-payment).
// isOnline() is kept current by utils/connectivity.js (more than
// navigator.onLine, which Safari keeps at true with Wi-Fi off).
// Never wrap the exam itself: a running exam keeps working offline.
const OnlineOnlyRoute = ({ children, feature }) => {
  const installed = useIsInstalledApp();
  const { key } = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onlineAtEntry = useMemo(() => isOnline(), [key]);

  if (!installed || onlineAtEntry) return children;
  return <OfflineScreen feature={feature} />;
};

export default OnlineOnlyRoute;
