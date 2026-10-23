import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuRefreshCw } from "react-icons/lu";
import { isExamRoute, isSafeToReload } from "../utils/examRoutes";
import {
  applyUpdate,
  isUpdateRequired,
  subscribeUpdateRequired,
} from "../utils/updateRequired";
import "../styles/planEndedModal.css"; // same shell as the plan pop-up

// Shown when the backend says this build is too old (426 UPDATE_REQUIRED).
// It can't be dismissed: the old build can't talk to the backend any more.
// "Update now" reloads, so it only shows where a reload loses nothing (the
// same pages as the Refresh toast), and on an exam page whose exam isn't
// running (e.g. its questions were refused). It waits through a running exam,
// results and payment verification; the backend never blocks exam submission
// or payment verification.
const UpdateRequired = () => {
  const required = useSyncExternalStore(
    subscribeUpdateRequired,
    isUpdateRequired,
  );
  const { pathname } = useLocation();
  const examRunning = useSelector(
    (state) => state.mockExamQuestions?.length > 0,
  );
  const [updating, setUpdating] = useState(false);

  const canShow =
    isSafeToReload(pathname) || (isExamRoute(pathname) && !examRunning);
  if (!required || !canShow) return null;

  const update = () => {
    setUpdating(true);
    applyUpdate();
  };

  return createPortal(
    <div className="planEnded-overlay" role="presentation">
      <div
        className="planEnded-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="updateRequired-title"
        aria-describedby="updateRequired-text"
      >
        <div className="planEnded-icon">
          <LuRefreshCw size={32} />
        </div>
        <h2 id="updateRequired-title" className="planEnded-title">
          Update required
        </h2>
        <p id="updateRequired-text" className="planEnded-message">
          A new version of Examible is needed to continue. It&apos;s a small
          download.
        </p>
        <div className="planEnded-actions">
          <button
            type="button"
            className="planEnded-primary"
            onClick={update}
            disabled={updating}
            autoFocus
          >
            {updating ? "Updating…" : "Update now"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UpdateRequired;
