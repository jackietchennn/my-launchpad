import type { AppProps } from "next/app";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { ConfigProvider, Layout } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import RootProvider from "@/Provider";
import { useResponsiveInit } from "@/hooks/useResponsive";
import { useListenToWallet } from "@/hooks/useWallets";
import AppHeader from "@/containers/Header/Header";
import "@/styles/globals.css";

const RouteLoadingLayer = ({ onComplete }: { onComplete?: () => void }) => {
    const [routeLoading, setRouteLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleRouteChangeStart = () => {
            console.log("---start ", true);
            setRouteLoading(true);
        };
        const handleRouteChangeComplete = () => {
            console.log("---complete ", false);
            setRouteLoading(false);
            onComplete?.();
        };

        Router.events.on("routeChangeStart", handleRouteChangeStart);
        Router.events.on("routeChangeComplete", handleRouteChangeComplete);

        return () => {
            console.log("---clean router events ");
            Router.events.off("routeChangeStart", handleRouteChangeStart);
            Router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, []);

    return routeLoading ? (
        <div className="fixed w-screen h-screen bg-[#00000077] z-[99999]">
            <div className="w-[120px] h-[120px] rounded-[18px] fixed top-1/2 left-1/2 bg-[#000000e0] -translate-x-1/2 -translate-y-1/2 leading-[120px] text-center text-[72px] text-white">
                <LoadingOutlined />
            </div>
        </div>
    ) : <></>;
};

const Wrapper = ({ Component, pageProps }: AppProps) => {
    console.log("---render wrapper ");
    const mainRef = useRef<HTMLDivElement>(null);
    const scrollToTop = useCallback(() => {
        mainRef.current && (mainRef.current.scrollTop = 0);
    }, []);

    // 响应式布局监听
    useResponsiveInit();
    // 钱包信息变动监听
    useListenToWallet();

    return (
        <div className="main-wrapper desktop:w-full">
            <RouteLoadingLayer onComplete={scrollToTop} />
            <div ref={mainRef} className="main-body">
                <AppHeader></AppHeader>
                <Layout.Content>
                    <Component {...pageProps} />
                </Layout.Content>
            </div>
        </div>
    );
};

const RootApp = ({ Component, pageProps, router }: AppProps) => {
    return (
        <ConfigProvider>
            <RootProvider>
                <Head>
                    <title>C2N</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />

                    {/* Custom fonts not added in `pages/_document.js` will only load for a single page. This is discouraged. See: https://nextjs.org/docs/messages/no-page-custom-font */}
                    {/* <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" /> */}

                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
                    <meta
                        name="description"
                        content="C2N is the first exclusive launchpad for decentralized fundraising in Boba ecosystem, offering the hottest and innovative projects in a fair, secure, and efficient way."
                    />
                </Head>
                <Wrapper pageProps={pageProps} Component={Component} router={router}></Wrapper>
            </RootProvider>
        </ConfigProvider>
    );
};

export default RootApp;
