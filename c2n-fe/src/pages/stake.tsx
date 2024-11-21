import BasicButton from "@/components/elements/BasicButton";
import { CHAIN_ID } from "@/config/constants/network";
import { useResponsive } from "@/hooks/useResponsive";
import { useWallet } from "@/hooks/useWallets";
import { QuestionCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { noop } from "antd/es/_util/warning";
import Link from "next/link";
import React, { useMemo } from "react";
import PoolBgPNG from "@/assets/images/pools_bg.png";

const WarningContent = ({ content }: { content: string }) => {
    return (
        <>
            <Row justify="center" align="middle">
                <WarningOutlined className="text-[60px] text-[red]"></WarningOutlined>
            </Row>
            <Row justify="center" align="middle">
                <Col className="title">
                    <h2>{content}</h2>
                </Col>
            </Row>
        </>
    );
};

export default function Stake() {
    const { isDesktopOrLaptop } = useResponsive();
    const { isWalletInstalled, activatedChainConfig, validChains, token, switchNetwork, triggerTokenAdd } = useWallet();

    const WarningInstall = useMemo(() => <WarningContent content="Please Install MetaMask" />, []);
    const WarningNetwork = useMemo(() => <WarningContent content="Wrong Network" />, []);

    return (
        <main
            className="container bg-auto bg-repeat bg-black"
            style={{
                backgroundImage: `url(${PoolBgPNG})`,
                backgroundPosition: "center top",
            }}
        >
            <section className="introduction pt-[1px] text-white">
                <h2 className="stake-title text-white mt-0 w-full text-[40px]">
                    <Row justify="space-between">
                        <Col>
                            <span>C2N Staking</span>
                        </Col>
                        <Col>
                            <span className="text-[16px] align-middle"></span>
                            <QuestionCircleOutlined className="mr-[2.8px] align-middle text-[36px]" />
                            See Tutorial: &nbsp;
                            <span className="link text-[#ffb852] cursor-pointer hover:underline" onClick={noop}>
                                {`${isDesktopOrLaptop ? "C2N Staking Tutorial" : "Tutorial"} `}
                            </span>
                        </Col>
                    </Row>
                </h2>
                <div className="info mt-0 w-full p-[30px] rounded-[6px] bg-[#303030a0] text-[20px] leading-[28px] font-['PingfangSC, Roboto']">
                    There is NO extra fee for {token.symbol} token staking, NO extra fee for unlocking. Members in C2N are attracted by our promising projects, not restricted by us charging a fee.
                    However, IDO projects might require their own different lock-up period, see more details from the
                    <Link href="/pool">&nbsp;Projects Page</Link>.
                    <br />
                    <br />
                    <Row>
                        <Col span={isDesktopOrLaptop ? 16 : 24}>
                            Step1: Connect your wallet to stake {token.symbol} token, which is required to participate in IDOs.
                            <br />
                            Step2: Use {token.symbol} token to register for IDOs on C2N website, first come first serve.
                            <br />
                            Step3: Always remember, the longer you hold our BRE tokens, the more projects which have potentials and values you could participate with us!
                            <br />
                        </Col>
                        <Col span={isDesktopOrLaptop ? 8 : 24}>
                            <Row justify="center" align="bottom" className="h-full" style={{ marginTop: isDesktopOrLaptop ? 0 : "14px" }}>
                                <BasicButton className="wallet-button w-[287px] h-[54px]" onClick={() => triggerTokenAdd(token.chainId, token.address, token.symbol)}>
                                    Add {token.symbol} To Wallet
                                </BasicButton>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </section>
            <section className="staking w-full pb-[60px] bg-transparent">
                <div className="main-content">
                    {!isWalletInstalled ? (
                        <div className="pt-[42px]">{WarningInstall}</div>
                    ) : !activatedChainConfig ? (
                        <div className="py-[28px] bg-white">
                            {WarningNetwork}
                            <Row justify="center" align="middle">
                                <Col>
                                    You are not currently connected to <b>{validChains[0].name}</b>. Please switch networks to use this application.
                                </Col>
                            </Row>
                            <Row justify="center" align="middle" className="mt-[14px]">
                                <Col span={8}>
                                    <BasicButton className="connect-button w-full" onClick={() => switchNetwork(CHAIN_ID)}>
                                        Switch Network
                                    </BasicButton>
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <h1>质押表单</h1>
                    )}
                </div>
            </section>
        </main>
    );
}
