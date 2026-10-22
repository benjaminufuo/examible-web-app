import { INSTALLED_AT_BOOT } from "./installMode";

// How the student can install the app on this device:
// - "prompt":    the browser gave us its install dialog (Chrome, Edge, Samsung
//                Internet on Android and desktop): one tap opens it
// - "ios":       iPhone/iPad: no install dialog exists, so we show the steps
// - "mac-safari": Safari 17+ on a Mac installs with File > Add to Dock, and
//                has no install dialog either: we show those steps
// - "in-app":    Instagram, TikTok, Facebook... browsers can't install at all:
//                the student has to open the page in their real browser
// - "installed": already running as the app, or just installed
// - "none":      this browser can't install (e.g. Firefox on desktop), or
//                Chrome hasn't offered it (yet)
//
// Imported by main.jsx so the listeners exist before React renders:
// beforeinstallprompt can fire very early and only fires once per page load.

const ua = navigator.userAgent;

// iPadOS 13+ reports itself as a Mac; the touch screen gives it away
const IS_IOS =
  /iphone|ipad|ipod/i.test(ua) ||
  (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const IS_ANDROID = /android/i.test(ua);
const IN_APP_BROWSER =
  /FBAN|FBAV|FB_IAB|Instagram|TikTok|musical_ly|BytedanceWebview|Snapchat|Twitter|Line\//i.test(
    ua,
  );

// Safari 17+ on a Mac (other Mac browsers also say "Safari" in their user agent)
const IS_MAC_SAFARI =
  !IS_IOS &&
  /Macintosh/.test(ua) &&
  !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS|OPR/.test(ua) &&
  Number(ua.match(/Version\/(\d+)[\d.]* Safari/)?.[1]) >= 17;

/** Phones and tablets (the Overview card only shows there) */
export const IS_MOBILE_DEVICE = IS_IOS || IS_ANDROID;

let deferredPrompt = null;
let installed = INSTALLED_AT_BOOT;
const listeners = new Set();

const resolveMode = () => {
  if (installed) return "installed";
  if (IN_APP_BROWSER) return "in-app";
  if (deferredPrompt) return "prompt";
  if (IS_IOS) return "ios";
  if (IS_MAC_SAFARI) return "mac-safari";
  return "none";
};

let mode = resolveMode();

const update = () => {
  const next = resolveMode();
  if (next === mode) return;
  mode = next;
  listeners.forEach((fn) => fn());
};

if (!installed) {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Keep it for our own button (this also stops Chrome's mini-infobar)
    e.preventDefault();
    deferredPrompt = e;
    update();
  });
}

window.addEventListener("appinstalled", () => {
  installed = true;
  deferredPrompt = null;
  update();
});

export const getInstallMode = () => mode;

export const subscribeInstallMode = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/**
 * Opens the browser's install dialog ("prompt" mode only).
 * Resolves to "accepted", "dismissed" or "unavailable".
 */
export const promptInstall = async () => {
  if (!deferredPrompt) return "unavailable";
  const event = deferredPrompt;
  // The dialog can only be shown once per event; Chrome sends a new
  // beforeinstallprompt later if the student says no
  deferredPrompt = null;
  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  } catch {
    return "unavailable";
  } finally {
    update();
  }
};
