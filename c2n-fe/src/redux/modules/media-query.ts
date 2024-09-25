import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface MediaQueryState {
  // 是否大型屏幕
  isBigScreen: boolean;
  // 是否PC端设备（台式机、笔记本）
  isDesktopOrLaptop: boolean;
  // 是否移动端设备（平板、手机）
  isTabletOrMobile: boolean;
}

const initialState: MediaQueryState = {
  isBigScreen: false,
  isDesktopOrLaptop: false,
  isTabletOrMobile: false,
};

const mediaQuerySlice = createSlice({
  name: "mediaQuery",
  initialState,
  reducers: {
    setMediaQuery: (state, action: PayloadAction<MediaQueryState>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setMediaQuery } = mediaQuerySlice.actions;

export default mediaQuerySlice.reducer;
