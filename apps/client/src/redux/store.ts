import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer } from "redux-persist";
import storage from "./storage/storage";

import fileReducer from "./features/file/fileSlice";

import { uploadFilesApi } from "./apis/upload_files/uploadFilesApi";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [],
  blacklist: [],
};

const rootReducer = combineReducers({
  file: fileReducer,
  [uploadFilesApi.reducerPath]: uploadFilesApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([uploadFilesApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
