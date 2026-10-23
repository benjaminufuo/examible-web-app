import { getSwUpdate, waitForNewVersion } from "./swUpdate";

// The backend said this build is too old (426 UPDATE_REQUIRED). UpdateRequired
// reads this and shows the "Update required" screen.

let required = false;
const listeners = new Set();

export const markUpdateRequired = () => {
  if (required) return;
  required = true;
  listeners.forEach((fn) => fn());
};

export const isUpdateRequired = () => required;

export const subscribeUpdateRequired = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

/** True when an API error response is the backend's "update required" */
export const isUpdateRequiredResponse = (status, body) =>
  status === 426 && body?.code === "UPDATE_REQUIRED";

const NEW_VERSION_WAIT_MS = 20000; // downloading and installing it
const RELOAD_FALLBACK_MS = 10000;

// Last resort: remove this device's service worker and cached files, so the
// reload comes straight from the server (the latest build)
const clearAppCache = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
};

/**
 * Gets the latest build and reloads, through AppUpdater's update path (the
 * same one as the Refresh toast, so it reloads once):
 * 1. a new version is ready (downloaded and installed): switch to it
 * 2. otherwise ask for it and wait (up to 20 s) until it has installed
 * 3. if none turns up: clear this device's service worker and cache
 * Without a service worker (website, or not registered yet): just reload.
 */
export async function applyUpdate() {
  try {
    let { ready, update, registration } = getSwUpdate();
    if (!ready && registration) {
      await registration.update().catch(() => {});
      ready = await waitForNewVersion(NEW_VERSION_WAIT_MS);
      update = getSwUpdate().update;
    }
    if (ready && update) {
      await update(true); // switches and reloads
      // In case the switch doesn't reload by itself
      setTimeout(() => window.location.reload(), RELOAD_FALLBACK_MS);
      return;
    }
    if (registration) await clearAppCache();
  } catch {
    // fall through to a plain reload
  }
  window.location.reload();
}
