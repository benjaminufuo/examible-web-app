import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./global/store.js";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import ExamibleContext from "./context/ExamibleContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Loading from "./components/Loading.jsx";
import { HelmetProvider } from "react-helmet-async";

let persistor = persistStore(store);

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
