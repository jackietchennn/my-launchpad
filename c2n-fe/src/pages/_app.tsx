import type { AppProps } from "next/app";

import React, { useRef, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { ConfigProvider, Layout } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import RootProvider from "@/Provider";
import "@/styles/globals.css";

// 提供布局Wrapper组件
// AppHeader
// The pages router ...
// AppFooter
function Wrapper({ Component, pageProps }: AppProps) {
  const { Content } = Layout;
  const mainRef = useRef<HTMLDivElement>(null);
  const RouteLoadingLayer = () => {
    const [routeLoading, setRouteLoading] = useState<boolean>(false);

    Router.events.on("routeChangeStart", () => setRouteLoading(true));
    Router.events.on("routeChangeComplete", () => {
      mainRef.current && (mainRef.current.scrollTop = 0);
      setRouteLoading(false);
    });

    return routeLoading ? (
      <div className="loading-layer">
        <div className="loading-modal">
          <LoadingOutlined />
        </div>
      </div>
    ) : null;
  };

  return (
    <div className="main-wrapper">
      <RouteLoadingLayer></RouteLoadingLayer>
      <div ref={mainRef} className="main-body">
        <Content>
          <Component {...pageProps} />
        </Content>
      </div>
    </div>
  );
}

const RootApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <ConfigProvider>
      <RootProvider>
        <Head>
          <title>C2N</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
          <meta name="description" content="C2N is the first exclusive launchpad for decentralized fundraising in Boba ecosystem, offering the hottest and innovative projects in a fair, secure, and efficient way." />
        </Head>
        <Wrapper pageProps={pageProps} Component={Component} router={router}></Wrapper>
      </RootProvider>
    </ConfigProvider>
  );
};

export default RootApp;
