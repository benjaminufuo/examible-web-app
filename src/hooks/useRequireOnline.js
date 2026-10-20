import { toast } from "react-toastify";
import { useOnline } from "./useOnline";
import { useIsInstalledApp } from "./useIsInstalledApp";

// Wraps an action so the installed app explains, instead of failing, when it's
// offline. The website keeps its current behaviour.
//   const requireOnline = useRequireOnline();
//   onClick={requireOnline(save)}
export const useRequireOnline = () => {
  const online = useOnline();
  const installed = useIsInstalledApp();
  return (fn, message = "Connect to the internet to do this.") =>
    (...args) => {
      if (installed && !online) {
        toast.info(message, { toastId: "require-online" });
        return undefined;
      }
      return fn(...args);
    };
};
