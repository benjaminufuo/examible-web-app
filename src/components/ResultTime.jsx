import { useId, useState } from "react";
import { LuClock, LuChevronDown } from "react-icons/lu";
import { useIsPhone } from "../hooks/useIsPhone";

// 1122 → "18:42"; 6730 → "1:52:10"
const clock = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

// 22 → "22s"; 65 → "1m 05s"
const shortDuration = (seconds) => {
  const s = Math.round(seconds);
  return s < 60
    ? `${s}s`
    : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};

// The exam's time on the result summary (CBT and mock tests; past questions
// have no timer). Phones: one line ("Time taken 18:42 of 30:00") that opens
// to the details, so the subject breakdown stays on the first screen. Larger
// screens: the details are always shown.
// "Per question" is a simple average: time taken ÷ questions answered.
const ResultTime = ({ totalSeconds, secondsUsed, answered }) => {
  const isPhone = useIsPhone();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  if (!(totalSeconds > 0) || !(secondsUsed >= 0)) return null;

  const used = Math.min(secondsUsed, totalSeconds);
  const showDetails = !isPhone || open;
  const summary = (
    <>
      <LuClock className="mr-time-icon" aria-hidden="true" />
      <span className="mr-time-summary">
        Time taken <strong>{clock(used)}</strong> of {clock(totalSeconds)}
      </span>
    </>
  );

  return (
    <section className="mr-time" aria-label="Time">
      {isPhone ? (
        <button
          type="button"
          className="mr-time-header"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((o) => !o)}
        >
          {summary}
          <LuChevronDown
            className={`mr-time-chevron ${open ? "open" : ""}`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <div className="mr-time-header">{summary}</div>
      )}

      {showDetails && (
        <dl className="mr-time-details" id={detailsId}>
          <div>
            <dt>Time allowed</dt>
            <dd>{clock(totalSeconds)}</dd>
          </div>
          <div>
            <dt>Time taken</dt>
            <dd>{clock(used)}</dd>
          </div>
          <div>
            <dt>Time left</dt>
            <dd>{clock(totalSeconds - used)}</dd>
          </div>
          {answered > 0 && (
            <div>
              <dt>Per question</dt>
              <dd>{shortDuration(used / answered)} avg</dd>
            </div>
          )}
        </dl>
      )}
    </section>
  );
};

export default ResultTime;
