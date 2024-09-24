import { configureStore } from "@reduxjs/toolkit";

import globalReducer from './modules/global'

const store = configureStore({
  reducer: {
    global: globalReducer
  }
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {[name]: xxxState}
export type AppDispatch = typeof store.dispatch;
