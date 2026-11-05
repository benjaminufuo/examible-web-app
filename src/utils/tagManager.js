// Loads Google Tag Manager: the same as Google's install snippet, but from our
// own code instead of an inline <script>, which the Content Security Policy
// blocks (see vercel.json). The consent defaults (consent.js) are already in
// the data layer, so nothing is tracked until the student accepts.

const GTM_URL = "https://www.googletagmanager.com/gtm.js";

let loaded = false;

export const loadTagManager = (id) => {
  // No id (local development without one), or already loaded (React's
  // development double-run)
  if (!id || loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `${GTM_URL}?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
};
