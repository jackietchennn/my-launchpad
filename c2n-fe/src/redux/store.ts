import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "./modules/global";
import mediaQueryReducer from "./modules/media-query";
import walletReducer from './modules/wallet';
import contractReducer from './modules/contract';

const store = configureStore({
  reducer: {
    global: globalReducer,
    mediaQuery: mediaQueryReducer,
    wallet: walletReducer,
    contract: contractReducer,
  },
});

export default store;

// Infer the `AppState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {[name]: xxxState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
