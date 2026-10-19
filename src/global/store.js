import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import rootReducer from "./slice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  throttle: 1000,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

// Exported so logout can save the signed-out state at once (persistor.flush()):
// with the throttle above, redux-persist writes one key per second, so a refresh
// right after logout would otherwise reload the old, signed-in state.
export const persistor = persistStore(store);
