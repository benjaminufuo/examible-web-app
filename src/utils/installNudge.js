// When the Overview install card may show. Stored on this device only.
//
//   Showing 1: the first visit to Overview after logging in
//   Showing 2: after "no" #1, once the student uses a major feature (finishes
//              a CBT or mock exam, or answers a past question: markEngaged).
//              Only use after that "no" counts.
//   Showing 3: 14 days after "no" #2
//   Showing 4: 14 days after "no" #3
//   After "no" #4 it stops for good (the Profile row stays available)
//
// A "no" is "Not now", ✕, or cancelling the browser's install dialog.

const ENGAGED_KEY = "ex-install-engaged-at";
const DISMISS_KEY = "ex-install-card";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_DISMISSALS = 4;

const read = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode or storage full: the card just shows again later */
  }
};

const readDismissals = () => {
  try {
    const value = JSON.parse(read(DISMISS_KEY));
    return {
      count: Number(value?.count) || 0,
      at: Number(value?.at) || 0,
    };
  } catch {
    return { count: 0, at: 0 };
  }
};

/** The student used a major feature (any time; compared with the last "no") */
export const markEngaged = () => write(ENGAGED_KEY, String(Date.now()));

export const isInstallCardDue = () => {
  const { count, at } = readDismissals();
  if (count === 0) return true;
  if (count === 1) return Number(read(ENGAGED_KEY)) > at;
  if (count < MAX_DISMISSALS) return Date.now() >= at + SNOOZE_MS;
  return false;
};

export const dismissInstallCard = () => {
  const { count } = readDismissals();
  write(DISMISS_KEY, JSON.stringify({ count: count + 1, at: Date.now() }));
};
