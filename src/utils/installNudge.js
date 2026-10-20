// When the Overview install card may show. Stored on this device only.
// - It waits until the student has done something useful: finished a CBT or
//   mock exam, or answered a past question (markEngaged)
// - "Not now" or ✕ hides it for 14 days; after 3 dismissals it stops for good

const ENGAGED_KEY = "ex-install-engaged";
const DISMISS_KEY = "ex-install-dismissed";
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const MAX_DISMISSALS = 3;

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
      until: Number(value?.until) || 0,
    };
  } catch {
    return { count: 0, until: 0 };
  }
};

export const markEngaged = () => write(ENGAGED_KEY, "1");

export const isInstallCardDue = () => {
  if (read(ENGAGED_KEY) !== "1") return false;
  const { count, until } = readDismissals();
  return count < MAX_DISMISSALS && Date.now() >= until;
};

export const dismissInstallCard = () => {
  const { count } = readDismissals();
  write(
    DISMISS_KEY,
    JSON.stringify({ count: count + 1, until: Date.now() + SNOOZE_MS }),
  );
};
