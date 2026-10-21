import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

// Lets CSS target the installed app only:
// html[data-display-mode="standalone"] .something { ... }
// The website never matches, so it stays unchanged.
document.documentElement.dataset.displayMode = INSTALLED_AT_BOOT
  ? "standalone"
  : "browser";

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
