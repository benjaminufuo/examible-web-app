import { useEffect, useState } from "react";

// The browser's online status. It can say "online" on Wi-Fi with no internet;
// failed requests are handled by BaseApi's network error message.
export const useOnline = () => {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
};
