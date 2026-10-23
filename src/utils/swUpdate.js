// What AppUpdater knows about the service worker, shared so the forced update
// ("Update now") uses the same single update path as the Refresh toast:
// - ready: a new version has finished installing and is waiting
// - update(true): switch to it and reload (once)
// - registration: to ask for a new version

let state = { ready: false, update: null, registration: null };
const listeners = new Set();

export const setSwUpdate = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
};

export const getSwUpdate = () => state;

/** Resolves true once a new version is ready, false after `ms` */
export const waitForNewVersion = (ms) =>
  new Promise((resolve) => {
    if (state.ready) return resolve(true);
    const done = (value) => {
      clearTimeout(timer);
      listeners.delete(check);
      resolve(value);
    };
    const check = () => state.ready && done(true);
    const timer = setTimeout(() => done(false), ms);
    listeners.add(check);
  });
