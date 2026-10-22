import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
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
import "./utils/installPrompt";
import { checkConnection } from "./utils/connectivity";

// Lets CSS target the installed app only:
// html[data-display-mode="standalone"] .something { ... }
// The website never matches, so it stays unchanged.
document.documentElement.dataset.displayMode = INSTALLED_AT_BOOT
  ? "standalone"
  : "browser";

// The installed app may be opened with no connection, and Safari would still
// say it's online: check for real
if (INSTALLED_AT_BOOT) checkConnection();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Provider store={store}>
          <ThemeProvider>
            <ExamibleContext>
              <ToastContainer />
              <App />
            </ExamibleContext>
          </ThemeProvider>
        </Provider>
      </PersistGate>
    </HelmetProvider>
  </StrictMode>,
);
