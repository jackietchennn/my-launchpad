import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setMediaQuery } from "@/redux/modules/media-query";

/**
 * 初始化响应式布局，监听 `resize` 事件
 */
export const useResponsiveInit = () => {
  const dispatch = useAppDispatch();

  const handleResize = () => {
    dispatch(
      setMediaQuery(
        window.innerWidth >= 769
          ? {
              isBigScreen: false,
              isDesktopOrLaptop: true,
              isTabletOrMobile: false,
            }
          : {
              isBigScreen: false,
              isDesktopOrLaptop: false,
              isTabletOrMobile: true,
            }
      )
    );
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);
};

/**
 * 统一读取并返回全局存储值
 * @returns Object as PropType<MediaQueryState>
 */
export const useResponsive = () => {
  const isBigScreen = useAppSelector((state) => state.mediaQuery.isBigScreen);
  const isDesktopOrLaptop = useAppSelector((state) => state.mediaQuery.isDesktopOrLaptop);
  const isTabletOrMobile = useAppSelector((state) => state.mediaQuery.isTabletOrMobile);

  return { isBigScreen, isDesktopOrLaptop, isTabletOrMobile };
};
