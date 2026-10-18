import { INSTALLED_AT_BOOT } from "../utils/installMode";

// True in the installed app, false on the website (fixed for the session)
export const useIsInstalledApp = () => INSTALLED_AT_BOOT;
