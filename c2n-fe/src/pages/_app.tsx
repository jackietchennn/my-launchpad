import type { AppProps } from "next/app";

import { ConfigProvider } from "antd";

import RootProvider from "@/Provider";
import "@/styles/globals.css";

// 提供布局Wrapper组件
// AppHeader
// The pages router ...
// AppFooter
function Wrapper({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps}></Component>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <RootProvider>
        <Component {...pageProps} />
      </RootProvider>
    </ConfigProvider>
  );
}
