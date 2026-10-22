import { useCallback, useState, useSyncExternalStore } from "react";
import {
  getInstallMode,
  promptInstall,
  subscribeInstallMode,
} from "../utils/installPrompt";

// The install mode for this device (see utils/installPrompt.js), plus one
// install() for every button: it opens the browser's dialog where there is
// one, and the steps sheet everywhere else (iPhone, Mac Safari, in-app browsers).
// install() resolves to the dialog's outcome ("accepted" / "dismissed"), or
// "sheet" when it opened the steps.
// Modes where installing means following steps by hand (see InstallSheet)
const STEPS_MODES = ["ios", "mac-safari", "in-app"];

export const useInstallPrompt = () => {
  const mode = useSyncExternalStore(subscribeInstallMode, getInstallMode);
  const [sheetOpen, setSheetOpen] = useState(false);

  const install = useCallback(async () => {
    if (mode === "prompt") {
      // F5: track the outcome
      return promptInstall();
    }
    if (STEPS_MODES.includes(mode)) {
      setSheetOpen(true);
      return "sheet";
    }
    return "unavailable";
  }, [mode]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return {
    mode,
    canInstall: mode === "prompt" || STEPS_MODES.includes(mode),
    install,
    sheetOpen,
    closeSheet,
  };
};
