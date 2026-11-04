// Analytics consent (Google Consent Mode). Imported first in main.jsx, so the
// defaults are in the data layer before Google Tag Manager loads: nothing is
// tracked until the student accepts in the cookie banner.

import { read, write } from "./safeStorage";

const KEY = "examible-consent";
const POLICY_VERSION = "2026-10"; // bump when the privacy policy changes
const TWELVE_MONTHS = 365 * 24 * 60 * 60 * 1000;

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}

gtag("consent", "default", {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
});

// The choice made this visit when it couldn't be saved (storage blocked):
// it then lasts until the page closes
let unsaved = null;

/** "granted", "denied", or null when the student hasn't chosen (or it expired) */
export const getConsent = () => {
  try {
    const c = unsaved ?? JSON.parse(read(KEY));
    if (
      !c ||
      c.version !== POLICY_VERSION ||
      Date.now() - c.date > TWELVE_MONTHS
    ) {
      return null;
    }
    return c.analytics === "granted" ? "granted" : "denied";
  } catch {
    return null;
  }
};

/** For the backend (header and Google sign-in): "granted" or "denied" */
export const consentValue = () => getConsent() ?? "denied";

// GA sets its cookies on the widest domain it can (e.g. .examible.com from
// app.examible.com), so try the host and every parent domain:
// app.examible.com → app.examible.com, examible.com (not "com" alone). The
// browser ignores the ones the cookie wasn't set on.
const cookieDomains = () => {
  const parts = location.hostname.split(".");
  return parts.slice(0, -1).map((_, i) => parts.slice(i).join("."));
};

// Removes Google Analytics cookies (_ga, _ga_<id>)
const deleteGaCookies = () => {
  const domains = cookieDomains();
  document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"))
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
      });
    });
};

export const setConsent = (analytics) => {
  const choice = { analytics, date: Date.now(), version: POLICY_VERSION };
  unsaved = write(KEY, JSON.stringify(choice)) ? null : choice;
  gtag("consent", "update", { analytics_storage: analytics });
  if (analytics === "denied") deleteGaCookies();
  // analytics.js listens: on a decline it drops what it kept offline and the
  // student's id; on accept it sets the id
  window.dispatchEvent(new Event("consentchange"));
};

/** Re-opens the cookie banner (the footer's "Cookie settings") */
export const openCookieSettings = () =>
  window.dispatchEvent(new Event("opencookiesettings"));

if (getConsent() === "granted") {
  gtag("consent", "update", { analytics_storage: "granted" });
}
