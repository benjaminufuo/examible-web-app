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
// Installed app: true once the server has actually answered (since the last
// time it went offline). At start-up `online` is only navigator.onLine, which
// Safari keeps at true with no connection. The website trusts the browser.
let confirmed = !INSTALLED_AT_BOOT;
let probing = null;
let retryTimer = null;
const listeners = new Set();

const setOnline = (value, reachedServer = false) => {
  const wasConfirmed = confirmed;
  if (!value) confirmed = false;
  else if (reachedServer || !INSTALLED_AT_BOOT) confirmed = true;
  if (value) {
    clearInterval(retryTimer);
    retryTimer = null;
  } else if (INSTALLED_AT_BOOT && !retryTimer) {
    retryTimer = setInterval(() => {
      if (!document.hidden) checkConnection();
    }, RETRY_MS);
  }
  // Also tell listeners when the connection becomes confirmed (the analytics
  // queue waits for that)
  if (value === online && confirmed === wasConfirmed) return;
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

// One check at a time; resolves to reachServer's own answer
const probe = () => {
  if (!probing) {
    probing = reachServer()
      .then((reachable) => {
        if (reachable !== null) setOnline(reachable, reachable);
        return reachable;
      })
      .finally(() => {
        probing = null;
      });
  }
  return probing;
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
  return probe().then(() => online);
};

/**
 * Resolves true only once the connection is confirmed: in the installed app,
 * the server actually answered (a failed or timed-out check isn't enough);
 * on the website, the browser says online. Used before sending anything that
 * would be lost if sent offline (the analytics queue).
 */
export const confirmOnline = () => {
  if (!navigator.onLine) return Promise.resolve(false);
  if (!INSTALLED_AT_BOOT) return Promise.resolve(true);
  if (confirmed && online) return Promise.resolve(true);
  return probe().then((reachable) => reachable === true);
};

/** Online and, in the installed app, confirmed by the server answering */
export const isConfirmedOnline = () => online && confirmed;

/** An API request failed with no response: find out whether we're offline */
export const reportNetworkError = () => {
  if (INSTALLED_AT_BOOT) checkConnection();
};

/** The API answered (any status, even an error): we're online, unless the
 *  browser itself says offline (only possible with a local backend) */
export const reportServerResponse = () => {
  if (navigator.onLine && (!online || !confirmed)) setOnline(true, true);
};

export const isOnline = () => online;

export const subscribeConnectivity = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

window.addEventListener("offline", () => setOnline(false));
window.addEventListener("online", () => checkConnection());
