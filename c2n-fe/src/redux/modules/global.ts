import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface GlobalState {
  pageLoading: boolean;
}

const initialState: GlobalState = {
  pageLoading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLoading: (state, action?: PayloadAction<boolean>) => {
      state.pageLoading = action?.payload ?? !state.pageLoading;
    },
  },
});

export const { setLoading } = globalSlice.actions;

export default globalSlice.reducer;
