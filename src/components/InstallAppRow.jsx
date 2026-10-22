import { LuChevronRight, LuMonitorDown, LuSmartphone } from "react-icons/lu";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { IS_MOBILE_DEVICE } from "../utils/installPrompt";
import InstallSheet from "./InstallSheet";
import "../styles/installPrompt.css";

// Profile: an always-available way to install, on every device that can
const InstallAppRow = () => {
  const { mode, canInstall, install, sheetOpen, closeSheet } =
    useInstallPrompt();

  if (!canInstall) return null;

  const Icon = IS_MOBILE_DEVICE ? LuSmartphone : LuMonitorDown;

  return (
    <>
      <button type="button" className="installRow" onClick={install}>
        <span className="installRow-icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <span className="installRow-text">
          <span className="installRow-title">Install the Examible app</span>
          <span className="installRow-subtitle">
            {IS_MOBILE_DEVICE
              ? "Open it from your home screen"
              : "Open it from your desktop or taskbar"}
          </span>
        </span>
        <LuChevronRight size={18} className="installRow-chevron" />
      </button>
      <InstallSheet open={sheetOpen} mode={mode} onClose={closeSheet} />
    </>
  );
};

export default InstallAppRow;
