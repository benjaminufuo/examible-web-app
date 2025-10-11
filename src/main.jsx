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

let persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <ExamibleContext>
          <ToastContainer />
          <App />
        </ExamibleContext>
      </Provider>
    </PersistGate>
  </StrictMode>
);
