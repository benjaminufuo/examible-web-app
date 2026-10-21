import { useState } from "react";
import { LuSmartphone, LuX } from "react-icons/lu";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { IS_MOBILE_DEVICE } from "../utils/installPrompt";
import { dismissInstallCard, isInstallCardDue } from "../utils/installNudge";
import InstallSheet from "./InstallSheet";
import "../styles/installPrompt.css";

// Overview card inviting the student to install the app. Phones and tablets
// only; when it shows is decided in utils/installNudge
const InstallCard = () => {
  const { mode, canInstall, install, sheetOpen, closeSheet } =
    useInstallPrompt();
  const [due, setDue] = useState(isInstallCardDue);

  if (!IS_MOBILE_DEVICE || !due || !canInstall) return null;

  const dismiss = () => {
    dismissInstallCard();
    setDue(false);
  };

  // Cancelling Chrome's install dialog counts as "Not now"
  const onInstall = async () => {
    if ((await install()) === "dismissed") dismiss();
  };

  const inApp = mode === "in-app";

  return (
    <section className="installCard" aria-labelledby="installCard-title">
      <div className="installCard-icon" aria-hidden="true">
        <LuSmartphone size={22} />
      </div>
      <div className="installCard-body">
        <h3 id="installCard-title">Get the Examible app</h3>
        <p>
          {inApp
            ? "Open Examible in your browser to add it to your home screen."
            : "Open it from your home screen, full screen and faster to load."}
        </p>
        <div className="installCard-actions">
          <button
            type="button"
            className="installCard-primary"
            onClick={onInstall}
          >
            {inApp ? "Show me how" : "Install"}
          </button>
          <button
            type="button"
            className="installCard-secondary"
            onClick={dismiss}
          >
            Not now
          </button>
        </div>
      </div>
      <button
        type="button"
        className="installCard-close"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        <LuX size={18} />
      </button>
      <InstallSheet open={sheetOpen} mode={mode} onClose={closeSheet} />
    </section>
  );
};

export default InstallCard;
