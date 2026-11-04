import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getConsent } from "./consent";
import { getPlatform, INSTALLED_AT_BOOT } from "./installMode";
import { read, remove, write } from "./safeStorage";
import {
  confirmOnline,
  isConfirmedOnline,
  isOnline,
  subscribeConnectivity,
} from "./connectivity";

// Only with consent: sign-ups, Google sign-in and payments send these to the
// backend, which links its own events (B4) to the student's GA visit
export const getGAClientId = () => {
  if (getConsent() !== "granted") return "";
  const match = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : "";
};

// The GA4 session cookie is named _ga_<measurement id without "G-">. Its value
// starts "GS1.1.<session id>..." (older) or "GS2.1.s<session id>..." (newer).
// Without a session id, server events land in GA4 with no traffic source.
export const getGASessionId = () => {
  if (getConsent() !== "granted") return "";
  const id = (import.meta.env.VITE_GA_MEASUREMENT_ID || "").replace(/^G-/, "");
  if (!id) return "";
  const match = document.cookie.match(
    new RegExp(`_ga_${id}=GS\\d\\.\\d\\.s?(\\d+)`),
  );
  return match ? match[1] : "";
};

// Page views: a custom "page_view" event (with page_path) on every route
// change, which GTM forwards to GA4. Through track(), so it clears values left
// by other events, carries the same details and is kept while offline. Don't
// also turn on GA4's "page changes based on browser history", or every page
// view counts twice.
export const usePageTracking = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    track("page_view", { page_path: pathname });
  }, [pathname]);
};

// ---- Events --------------------------------------------------------------
// track() pushes an event to the data layer. GTM only forwards it to GA4 once
// the student has accepted analytics (Consent Mode), so track() itself doesn't
// check consent. Events while offline are kept on the device (only with
// consent) and sent when the connection returns.

let context = {};
export const setAnalyticsContext = (patch) => {
  context = { ...context, ...patch };
};

// GTM remembers every data layer key until it's overwritten, so a value from
// one event would leak into the next: reset every event-specific key each time
const EVENT_KEYS = [
  "page_path",
  "page",
  "offline_duration_sec",
  "blocked_pages",
  "action",
  "source",
  "install_mode",
];
const resetKeys = () =>
  Object.fromEntries(EVENT_KEYS.map((key) => [key, undefined]));

const QUEUE_KEY = "examible-offline-events";
const OFFLINE_SINCE_KEY = "examible-offline-since";
const MAX_QUEUED = 50;

const queueOffline = (event) => {
  if (getConsent() !== "granted") return; // nothing stored after a decline
  let queue = [];
  try {
    queue = JSON.parse(read(QUEUE_KEY) || "[]");
  } catch {
    /* corrupt: start again */
  }
  // Storage full or blocked: the event is dropped
  write(QUEUE_KEY, JSON.stringify([...queue, event].slice(-MAX_QUEUED)));
};

export const track = (name, params = {}) => {
  // Installed app: "online" only once the server has answered, so events from
  // the first moments after opening offline (e.g. app_first_open) are queued
  // rather than lost
  const online = isConfirmedOnline();
  const event = {
    event: name,
    app_mode: INSTALLED_AT_BOOT ? "installed" : "browser",
    is_online: online,
    // Not "platform": GA4 already has a built-in Platform dimension
    app_platform: getPlatform(),
    plan: context.plan || "anonymous",
    ...resetKeys(),
    ...params,
  };
  if (!online) {
    queueOffline(event); // a hit sent offline never reaches Google
    return;
  }
  window.dataLayer?.push(event);
};

// Sends what was kept. Two cases:
// - offline time was recorded (OFFLINE_SINCE_KEY): the events happened
//   offline; they go out marked is_online: false, then connection_restored
//   with how long it lasted
// - nothing recorded: they were only held while the installed app's start-up
//   connection check ran (the device wasn't known to be offline), so they go
//   out as normal online events, with no connection_restored
const flushOfflineQueue = () => {
  let queued = [];
  try {
    queued = JSON.parse(read(QUEUE_KEY) || "[]");
  } catch {
    /* corrupt: drop it */
  }
  const since = Number(read(OFFLINE_SINCE_KEY));
  clearOfflineEvents();
  const wasOffline = since > 0;
  // Saving dropped the undefined reset keys: put them back before replaying
  queued.forEach((event) =>
    window.dataLayer?.push({
      ...resetKeys(),
      ...event,
      is_online: !wasOffline,
    }),
  );
  if (!wasOffline) return;
  track("connection_restored", {
    offline_duration_sec: Math.round((Date.now() - since) / 1000),
    blocked_pages: queued.filter((e) => e.event === "offline_page_blocked")
      .length,
  });
};

// Remembers when the device went offline (only with consent, and only the
// first moment: a reopened app keeps the original start). Accepting while
// offline counts from the moment of accepting.
const noteOffline = () => {
  if (isOnline() || getConsent() !== "granted" || read(OFFLINE_SINCE_KEY))
    return;
  write(OFFLINE_SINCE_KEY, String(Date.now()));
};

// Call once at start-up (main.jsx). Uses the app's connection check, which is
// more reliable than navigator.onLine (Safari keeps that at true offline).
// The queue is only sent once the connection is confirmed: in the installed
// app, that the server actually answered. Sending it any earlier (e.g. at
// start-up, while still offline) would lose it.
export const initOfflineTracking = () => {
  // Declined: drop what was kept offline and the student's id. Accepted: set
  // the id, and if offline right now, start counting the offline time.
  // (consent.js announces the change; the storage keys live here.)
  window.addEventListener("consentchange", () => {
    if (getConsent() === "granted") noteOffline();
    else clearOfflineEvents();
    pushUserId();
  });

  // Offline whenever the app is: opened offline, or the check finds no
  // connection (not only when the confirmed state changes)
  noteOffline();
  let wasConfirmed = isConfirmedOnline();
  subscribeConnectivity(() => {
    noteOffline();
    const confirmed = isConfirmedOnline();
    if (confirmed && !wasConfirmed) flushOfflineQueue();
    wasConfirmed = confirmed;
  });
  // Opened with a connection, or closed offline and reopened online: send
  // what was kept once the connection is confirmed (a second send finds
  // nothing)
  confirmOnline().then((ok) => {
    if (ok) flushOfflineQueue();
  });
};

// The student's account number (database id, never the email) as GA4's
// user_id, only with consent; cleared on logout and on a decline
const pushUserId = () => {
  const id = getConsent() === "granted" ? context.userId : null;
  window.dataLayer?.push({ user_id: id ?? null });
};

// Pass the logged-in student, or null on logout. Whenever the student signs
// out (the Logout button, or an expired session) or a different student
// signs in, what was kept offline is dropped: nothing collected for one
// student is sent later, possibly under someone else's id.
export const setAnalyticsUser = (user) => {
  const userId = user?.id ? String(user.id) : undefined;
  if (context.userId && context.userId !== userId) clearOfflineEvents();
  setAnalyticsContext({
    plan: user ? user.plan : undefined, // track() falls back to "anonymous"
    userId,
  });
  pushUserId();
};

// Drops anything collected offline (sign-out, a decline, or once it's sent)
const clearOfflineEvents = () => remove(QUEUE_KEY, OFFLINE_SINCE_KEY);
