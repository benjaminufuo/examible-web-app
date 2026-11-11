// First: analytics consent defaults must be set before Tag Manager loads
import "./utils/consent";
import { StrictMode } from "react";
import { MotionConfig } from "framer-motion";
import { createRoot } from "react-dom/client";
import "./fonts";
import "./index.css";
// Copying rendered maths gives its LaTeX ($x^2$) instead of jumbled symbols
import "katex/contrib/copy-tex";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./global/store.js";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import ExamibleContext from "./context/ExamibleContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Loading from "./components/Loading.jsx";
import { HelmetProvider } from "react-helmet-async";
import { INSTALLED_AT_BOOT } from "./utils/installMode";
// Listens for the browser's install offer before anything renders
import { IS_IOS } from "./utils/installPrompt";
import { checkConnection } from "./utils/connectivity";
import { initOfflineTracking } from "./utils/analytics";
import { initInstallEvents } from "./utils/installEvents";
import { initSentry, reportError } from "./utils/sentry";

// Lets CSS target the installed app only:
// html[data-display-mode="standalone"] .something { ... }
// The website never matches, so it stays unchanged.
document.documentElement.dataset.displayMode = INSTALLED_AT_BOOT
  ? "standalone"
  : "browser";

// iPhone and iPad app: no zooming in when a text field is tapped (iOS zooms
// into fields under 16px). iOS still allows pinch-to-zoom with this, so it
// isn't an accessibility loss there; elsewhere it would block pinch-to-zoom,
// and Android doesn't zoom into fields anyway, so it's iOS only.
if (INSTALLED_AT_BOOT && IS_IOS) {
  const viewport = document.querySelector('meta[name="viewport"]');
  viewport?.setAttribute("content", `${viewport.content}, maximum-scale=1`);
}

// The installed app may be opened with no connection, and Safari would still
// say it's online: check for real
if (INSTALLED_AT_BOOT) checkConnection();

initOfflineTracking();
initInstallEvents();
initSentry();

// Errors React catches (error boundaries, including GlobalErrorBoundary and the
// router's) and those it doesn't: report both, and still log them like React
// does by default
const onReactError = (error, errorInfo) => {
  console.error(error);
  reportError(error, errorInfo?.componentStack);
};

createRoot(document.getElementById("root"), {
  onUncaughtError: onReactError,
  onCaughtError: onReactError,
}).render(
  <StrictMode>
    <HelmetProvider>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Provider store={store}>
          <ThemeProvider>
            <ExamibleContext>
              <ToastContainer />
              {/* Follows the device's "reduce motion" setting */}
              <MotionConfig reducedMotion="user">
                <App />
              </MotionConfig>
            </ExamibleContext>
          </ThemeProvider>
        </Provider>
      </PersistGate>
    </HelmetProvider>
  </StrictMode>,
);
