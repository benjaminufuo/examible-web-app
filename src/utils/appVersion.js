import { INSTALLED_AT_BOOT } from "./installMode";

// Sent with every API request, so the backend knows which build each student
// uses (installed apps can stay on an old build for days) and can ask builds
// that are too old to update (426 UPDATE_REQUIRED). Not shown in the UI.
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || "dev";
export const APP_MODE = INSTALLED_AT_BOOT ? "installed" : "website";

export const appHeaders = () => ({
  "X-App-Version": APP_VERSION,
  "X-App-Mode": APP_MODE,
});
