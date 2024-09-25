import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./modules/global";
import mediaQueryReducer from "./modules/media-query";

const store = configureStore({
  reducer: {
    global: globalReducer,
    mediaQuery: mediaQueryReducer,
  },
});

export default store;

// Infer the `AppState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {[name]: xxxState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
