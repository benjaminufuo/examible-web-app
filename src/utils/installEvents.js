import { getConsent } from "./consent";
import { INSTALLED_AT_BOOT } from "./installMode";
import { read, remove, write } from "./safeStorage";
import { track } from "./analytics";

// app_installed and app_first_open usually happen before the student has
// answered the cookie banner, when GTM would drop them. So they're kept until
// consent is given, and the "sent" flags are only saved after sending.
const FIRST_OPEN = "examible-first-open";
const INSTALL_PENDING = "examible-install-pending";

const sendInstallEvents = () => {
  if (getConsent() !== "granted") return; // tried again on consentchange
  if (read(INSTALL_PENDING)) {
    track("app_installed");
    remove(INSTALL_PENDING);
  }
  if (INSTALLED_AT_BOOT && !read(FIRST_OPEN)) {
    track("app_first_open"); // also covers iPhone, which has no install event
    write(FIRST_OPEN, "1");
  }
};

// Call once at start-up (main.jsx)
export const initInstallEvents = () => {
  // "appinstalled" fires only once, so it's remembered until it can be sent
  window.addEventListener("appinstalled", () => {
    write(INSTALL_PENDING, "1");
    sendInstallEvents();
  });
  window.addEventListener("consentchange", sendInstallEvents);
  sendInstallEvents();
};
