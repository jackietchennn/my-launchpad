import type { ReactNode } from "react";
import type { FarmConfiguration } from "@/config/farms";
import type { ComponentBaseProps } from "@/types/i-base";

import { useState } from "react";
import { Col, Divider, Row, Spin } from "antd";
import { useRouter } from "next/router";

import { useStakeOperationInEther } from "@/hooks/useStakeOperation";
import { useWallet } from "@/hooks/useWallets";
import { seperateWithComma } from "@/utils/shared";
import TransactionButton from "@/components/elements/TransactionButton";
import { noop } from "antd/es/_util/warning";

export interface FarmingFormProsp extends ComponentBaseProps, FarmConfiguration {}

const FarmingInfoItem = (props: { label: string; children?: ReactNode }) => {
    return (
        <Row className="record leading-[30px] mx-[12px] my-[10px]">
            <Col className="record-label text-[16px] text-[#707070]">{props.label}</Col>
            <Col className="record-value text-[16px] text-black font-bold">{props.children}</Col>
        </Row>
    );
};

const FarmingForm = (props: FarmingFormProsp) => {
    const router = useRouter();
    const { chainId, title } = props;
    const { activatedChainConfig, switchNetwork } = useWallet();
    const {
        poolInfo,
        balanceInEther,
        depositSymbol,
        depositedAmountInEther,
        earnedSymbol,
        earnedAmountInEther,
        totalDepositedAmountInEther,
    } = useStakeOperationInEther();

    const [apr, setApr] = useState<any>("**");

    const isChainAvailable = activatedChainConfig?.chainId === chainId;

    return (
        <div className="farming-card">
            {/* disabled in wrong network */}
            {!isChainAvailable && (
                <div className="mask" onClick={() => switchNetwork(chainId)}>
                    <div className="mask-text">Switch network to use this farm</div>
                </div>
            )}
            {/* stake farm */}
            <section className="container">
                <Row className="container-title" align="middle" justify="start">
                    {title}
                </Row>
                <Divider style={{ margin: 0 }}></Divider>
                <Row className="apy" justify="center">
                    {apr === null ? <Spin /> : <>{apr || "-"} %</>}
                </Row>
                <Row className="apy-extra" justify="center">
                    APR
                </Row>
                <div className="records">
                    <FarmingInfoItem label="Earned">{earnedSymbol}</FarmingInfoItem>
                    <FarmingInfoItem label="Total staked">
                        {poolInfo === null ? <Spin /> : seperateWithComma(totalDepositedAmountInEther)} {depositSymbol}
                    </FarmingInfoItem>
                    <FarmingInfoItem label="My staked">
                        {depositedAmountInEther === null ? <Spin /> : depositedAmountInEther} {depositSymbol}
                    </FarmingInfoItem>
                    <FarmingInfoItem label="Available">
                        {balanceInEther === null ? <Spin /> : balanceInEther} {depositSymbol}
                    </FarmingInfoItem>
                </div>
                <Row>
                    <TransactionButton noConnectText="Connect Wallet" className="button w-full" onClick={noop}>
                        Stake
                    </TransactionButton>
                </Row>
                <FarmingInfoItem label="Rewards">
                    {earnedAmountInEther === null ? <Spin /> : earnedAmountInEther} {earnedSymbol}
                    <span className="link bg-[#dedede] text-[#707070]" onClick={noop}>
                        Claim
                    </span>
                </FarmingInfoItem>
                <FarmingInfoItem label={title}>
                    <span className="link bg-[#d9ee77]" onClick={() => router.push("/")}>
                        GET {depositSymbol}
                    </span>
                </FarmingInfoItem>
            </section>
        </div>
    );
};
