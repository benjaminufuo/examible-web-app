import { useSyncExternalStore } from "react";
import { isOnline, subscribeConnectivity } from "../utils/connectivity";

// Whether the app can reach Examible (see utils/connectivity.js: this is more
// than navigator.onLine, which Safari keeps at true with Wi-Fi off)
export const useOnline = () =>
  useSyncExternalStore(subscribeConnectivity, isOnline);
