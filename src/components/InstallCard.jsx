import { useEffect, useState } from "react";
import { LuSmartphone, LuX } from "react-icons/lu";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { IS_MOBILE_DEVICE } from "../utils/installPrompt";
import { dismissInstallCard, isInstallCardDue } from "../utils/installNudge";
import InstallSheet from "./InstallSheet";
import { track } from "../utils/analytics";
import "../styles/installPrompt.css";

// "shown" is reported once per visit to the site: coming back to Overview,
// the card returning after a cancelled dialog, or React's development
// double-run don't count again
let shownReported = false;

// Overview card inviting the student to install the app. Phones and tablets
// only; when it shows is decided in utils/installNudge
const InstallCard = () => {
  const { mode, canInstall, install, sheetOpen, closeSheet } =
    useInstallPrompt();
  const [due, setDue] = useState(isInstallCardDue);
  const visible = IS_MOBILE_DEVICE && due && canInstall;

  const report = (action) =>
    track("install_prompt", {
      action,
      source: "overview_card",
      install_mode: mode,
    });

  useEffect(() => {
    if (!visible || shownReported) return;
    shownReported = true;
    report("shown");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    dismissInstallCard();
    setDue(false);
  };

  // install(): "accepted" / "dismissed" (the browser's dialog) or "sheet"
  // (the steps). Cancelling the dialog counts as "Not now".
  const onInstall = async () => {
    const outcome = await install();
    report(outcome);
    if (outcome === "dismissed") dismiss();
  };

  const notNow = () => {
    report("not_now");
    dismiss();
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
            onClick={notNow}
          >
            Not now
          </button>
        </div>
      </div>
      <button
        type="button"
        className="installCard-close"
        onClick={notNow}
        aria-label="Dismiss"
      >
        <LuX size={18} />
      </button>
      <InstallSheet open={sheetOpen} mode={mode} onClose={closeSheet} />
    </section>
  );
};

export default InstallCard;
