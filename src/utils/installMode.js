// The installed app (home screen / desktop install) vs the website.
// Display mode can't change during a session, so this is read once, at boot.
// In development, localStorage "ex-force-standalone" = "1" previews the app
// behaviour in a normal browser tab.
const forcedStandalone = () => {
  if (!import.meta.env.DEV) return false;
  try {
    return localStorage.getItem("ex-force-standalone") === "1";
  } catch {
    return false;
  }
};

export const isInstalledApp = () =>
  forcedStandalone() ||
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true; // iOS Safari

export const getPlatform = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
};

export const INSTALLED_AT_BOOT = isInstalledApp();
