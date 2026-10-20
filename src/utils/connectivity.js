import { INSTALLED_AT_BOOT } from "./installMode";

// Whether the installed app can reach Examible right now. The offline banner,
// the offline screen and blocked actions read it; they only exist in the
// installed app, so the website just mirrors the browser's own signal.
//
// navigator.onLine alone isn't enough: Safari (including apps added to the
// Dock) keeps saying "online" with Wi-Fi off. So in the installed app:
// - "offline" from the browser is trusted straight away
// - any API response (even an error) means we're online: the server answered
// - an API request with no response, the app starting, and the browser saying
//   it's back online each trigger a check of the app's own server
// - while offline, that check repeats every 10 seconds (skipped while the app
//   is in the background) and stops once it succeeds
//
// The check only reports offline when the request fails outright, which is
// immediate on a device with no connection. A slow answer (timeout) proves
// nothing, so it changes nothing: slow networks are never marked offline.
//
// Same origin on purpose: a request to the API is cross-origin, and Safari
// blocks it because of the API's Cross-Origin-Resource-Policy header, so it
// would always look offline. The small manifest file is never cached here
// (no-store, and the ?ping query skips the service worker's precache).
// A local server is always reachable from the same machine, so test offline
// behaviour on a deployed build (or by stopping the local servers).

const PROBE_URL = "/manifest.webmanifest";
const PROBE_TIMEOUT_MS = 8000;
const RETRY_MS = 10000;

let online = navigator.onLine;
let probing = null;
let retryTimer = null;
const listeners = new Set();

const setOnline = (value) => {
  if (value) {
    clearInterval(retryTimer);
    retryTimer = null;
  } else if (INSTALLED_AT_BOOT && !retryTimer) {
    retryTimer = setInterval(() => {
      if (!document.hidden) checkConnection();
    }, RETRY_MS);
  }
  if (value === online) return;
  online = value;
  listeners.forEach((fn) => fn());
};

// true: reachable; false: no connection; null: no answer in time (unknown)
const reachServer = async () => {
  // AbortController + setTimeout rather than AbortSignal.timeout(), which
  // iOS 15 doesn't have
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(`${PROBE_URL}?ping=${Date.now()}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch (e) {
    return e?.name === "AbortError" ? null : false;
  } finally {
    clearTimeout(timer);
  }
};

/** Checks now (one check at a time). Resolves to the current status. */
export const checkConnection = () => {
  if (!navigator.onLine) {
    setOnline(false);
    return Promise.resolve(false);
  }
  // The website has nothing that needs more than the browser's signal
  if (!INSTALLED_AT_BOOT) {
    setOnline(true);
    return Promise.resolve(true);
  }
  if (!probing) {
    probing = reachServer()
      .then((reachable) => {
        if (reachable !== null) setOnline(reachable);
        return online;
      })
      .finally(() => {
        probing = null;
      });
  }
  return probing;
};

/** An API request failed with no response: find out whether we're offline */
export const reportNetworkError = () => {
  if (INSTALLED_AT_BOOT) checkConnection();
};

/** The API answered (any status, even an error): we're online, unless the
 *  browser itself says offline (only possible with a local backend) */
export const reportServerResponse = () => {
  if (!online && navigator.onLine) setOnline(true);
};

export const isOnline = () => online;

export const subscribeConnectivity = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

window.addEventListener("offline", () => setOnline(false));
window.addEventListener("online", () => checkConnection());
