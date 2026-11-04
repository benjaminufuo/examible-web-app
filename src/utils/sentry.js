// Error reporting with Sentry. Off unless VITE_SENTRY_DSN is set (and only in
// production builds); until then reportError does nothing and Sentry's code
// isn't even downloaded: it's loaded on start-up only when a DSN is set.
// Never sends personal data: no IP or cookies (sendDefaultPii: false), the
// login token header is removed, and every address in a report or trace is
// cleaned first (see scrubUrl), so reset and verification links never leave
// the device.

import { INSTALLED_AT_BOOT } from "./installMode";

let sentry = null;

// Removes what an address could leak: the query string and hash
// (/reset-password?token=…, /verify?…, /callback?code=…), and any token-like
// path segment (20+ letters, digits or -_.), shown as ":token"
const TOKEN_SEGMENT = /^[A-Za-z0-9._-]{20,}$/;
export const scrubUrl = (url) => {
  if (typeof url !== "string" || !url) return url;
  const [withoutHash] = url.split("#");
  const [address] = withoutHash.split("?");
  // Keep "GET https://host" as it is (a host name can be long too); clean
  // only the path after it
  const origin = address.match(/^(?:[A-Z]+ )?[a-z][a-z0-9+.-]*:\/\/[^/]+/i);
  const prefix = origin ? origin[0] : "";
  const path = address
    .slice(prefix.length)
    .split("/")
    .map((segment) => (TOKEN_SEGMENT.test(segment) ? ":token" : segment))
    .join("/");
  return prefix + path;
};

const scrubBreadcrumb = (crumb) => {
  if (crumb?.data) {
    for (const key of ["url", "to", "from"]) {
      if (key in crumb.data) crumb.data[key] = scrubUrl(crumb.data[key]);
    }
  }
  return crumb;
};

const scrubSpanData = (data) => {
  for (const key of ["url", "http.url", "url.full"]) {
    if (data?.[key]) data[key] = scrubUrl(data[key]);
  }
};

const scrubEvent = (event) => {
  if (event.request) {
    if (event.request.url) event.request.url = scrubUrl(event.request.url);
    delete event.request.query_string;
    if (event.request.headers) {
      delete event.request.headers.Authorization;
      delete event.request.headers.authorization;
      if (event.request.headers.Referer) {
        event.request.headers.Referer = scrubUrl(event.request.headers.Referer);
      }
    }
  }
  if (event.transaction) event.transaction = scrubUrl(event.transaction);
  event.breadcrumbs = event.breadcrumbs?.map(scrubBreadcrumb);
  // Performance traces: span names and URLs of requests and navigations,
  // and the page load or navigation itself (the trace's root span)
  event.spans?.forEach((span) => {
    if (span.description) span.description = scrubUrl(span.description);
    scrubSpanData(span.data);
  });
  scrubSpanData(event.contexts?.trace?.data);
  return event;
};

export const initSentry = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!import.meta.env.PROD || !dsn) return;
  try {
    const Sentry = await import("@sentry/react");
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION, // matches the uploaded source maps
      tracesSampleRate: 0.1,
      sendDefaultPii: false,
      integrations: [Sentry.browserTracingIntegration()],
      initialScope: {
        tags: { app_mode: INSTALLED_AT_BOOT ? "installed" : "browser" },
      },
      beforeSend: scrubEvent,
      beforeSendTransaction: scrubEvent,
      beforeBreadcrumb: scrubBreadcrumb,
    });
    sentry = Sentry;
  } catch {
    /* Sentry failed to load (e.g. offline): the app runs without it */
  }
};

/** Report an error (does nothing while Sentry is off) */
export const reportError = (error, componentStack) => {
  sentry?.captureException(
    error,
    componentStack ? { contexts: { react: { componentStack } } } : undefined,
  );
};
