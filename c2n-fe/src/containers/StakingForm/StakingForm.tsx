import type { ReactNode } from "react";
import type { CarouselRef } from "antd/es/carousel";
import type { ComponentBaseProps } from "@/types/i-base";

import { useRef } from "react";
import { Motion, spring } from "react-motion";
import { Carousel, Col, InputNumber, Row } from "antd";
import { noop } from "antd/es/_util/warning";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { mergeClassName, seperateWithComma } from "@/utils/shared";
import { usePageLoading } from "@/hooks/usePageLoading";
import { useResponsive } from "@/hooks/useResponsive";
import { useWallet } from "@/hooks/useWallets";
import { useStakeOperationInEther } from "@/hooks/useStakeOperation";
import AppPopover from "@/components/elements/AppPopover";
import TransactionButton from "@/components/elements/TransactionButton";

export interface StakingFormProps extends ComponentBaseProps {
    poolId?: number;
    available?: boolean;
}

const TierCard = (props: { data?: string[] }) => {
    const data = props.data ?? [];

    return (
        <div className="tier-card inline-block w-full max-w-[575px] h-[512px] py-[55px] cursor-pointer leading-[30px] text-center z-0">
            <div className="wrapper inline-block w-[calc((425/575)*100%)] h-[414px] rounded-[10px]  shadow-[0_2px_50px_0_rgba(0,0,0,0.15)] transition-all duration-1000 scale-100 hover:shadow-[5px_5px_30px_0_rgba(0,0,0,0.15)] hover:scale-[1.02]">
                <Row
                    justify="center"
                    className="tier-title h-[90px] border-b-[1px] border-b-[#f4f4f4] mb-[5px] leading-[90px] !text-[34px] text-[#55bc7e]"
                >
                    {data[0] || ""}
                </Row>
                <Row
                    justify="center"
                    className="tier-label font-['ArialMT, Roboto'] text-[#707070] !text-[16px] mb-[10px]"
                >
                    Staking Requirement
                </Row>
                <Row
                    justify="center"
                    className="tier-value-large text-black font-['ArialMT, Roboto'] font-bold !text-[30px]"
                >
                    {data[1] || ""}
                </Row>
                <Row
                    justify="center"
                    className="tier-label font-['ArialMT, Roboto'] text-[#707070] !text-[16px] mb-[10px]"
                >
                    Whitelist Requirement Twitter
                </Row>
                <Row
                    justify="center"
                    className="tier-value-small text-black font-['ArialMT, Roboto'] font-bold !text-[18px]"
                >
                    Like, Comment & Retweet
                </Row>
                <Row
                    justify="center"
                    className="tier-label font-['ArialMT, Roboto'] text-[#707070] !text-[16px] mb-[10px]"
                >
                    Guaranteed Allocation
                </Row>
                <Row
                    justify="center"
                    className="tier-value-small text-black font-['ArialMT, Roboto'] font-bold !text-[18px]"
                >
                    Yes
                </Row>
                <Row
                    justify="center"
                    className="tier-label font-['ArialMT, Roboto'] text-[#707070] !text-[16px] mb-[10px]"
                >
                    Allocation Weight
                </Row>
                <Row
                    justify="center"
                    className="tier-value-medium text-black font-['ArialMT, Roboto'] font-bold !text-[30px]"
                >
                    {data[2] || ""}
                </Row>
            </div>
        </div>
    );
};

const TokenOperationTitle = (props: { icon: string; title: string }) => {
    return (
        <h2 className="title mb-[10.5px] text-[rgba(0,0,0,0.85)] font-medium text-[21px]">
            <i className={mergeClassName(["icon", props.icon])}></i>
            <span className="ml-[10px]">{props.title}</span>
        </h2>
    );
};

export const TokenOperation = (props: {
    isDesktopOrLaptop: boolean;
    operationNum?: string;
    balance?: string;
    symbol?: string;
    available?: boolean;
    chainId?: number;
    block?: boolean;
    onClick(): void;
    onMaxClick(): void;
    onChange(value: string | null): void;
}) => {
    const {
        isDesktopOrLaptop,
        operationNum,
        balance,
        symbol,
        available,
        chainId,
        block,
        onClick,
        onMaxClick,
        onChange,
    } = props;

    return (
        <>
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={block ? 24 : isDesktopOrLaptop ? 12 : 24}>
                    <Row justify="space-between">
                        <div className="balance">Balance: {balance ? `${balance} ${symbol}` : "-"}</div>
                        <div className="max text-[#55BC7E] cursor-pointer" onClick={() => onMaxClick()}>
                            MAX
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={block ? 24 : isDesktopOrLaptop ? 12 : 24}>
                    <div className="input w-full h-[54px] border-transparent rounded-[10px] relative bg-[#f4f4f4] text-[22px] leading-[54px]">
                        <InputNumber
                            value={operationNum}
                            max={balance ?? "0"}
                            controls={false}
                            variant="borderless"
                            step="0.0001"
                            className="number w-full height-[54px] px-[20px] border-transparent text-[#707070] text-[22px] bg-transparent align-middle leading-[54px]"
                            stringMode
                            onChange={onChange}
                        ></InputNumber>
                        <div className="unit pr-[20px] absolute top-0 right-0 leading-[54px] text-[#707070]">
                            {symbol}
                        </div>
                    </div>
                </Col>
                <Col span={block ? 24 : isDesktopOrLaptop ? 12 : 24}>
                    {available ? (
                        <TransactionButton
                            requiredChainId={chainId}
                            noConnectText="Connect Wallet"
                            switchNetworkText="Switch Network"
                            className="button w-full h-[54px] rounded-[10px] text-white text-[20px] text-center leading-[54px]"
                            style={{ backgroundImage: "linear-gradient(179deg, #4DCC8A 0%, #1EA152 100%)" }}
                            onClick={() => onClick()}
                        >
                            Stake
                        </TransactionButton>
                    ) : (
                        <AppPopover content="Coming Soon" wrap>
                            <TransactionButton
                                noConnectText="Connect Wallet"
                                className="button w-full h-[54px] rounded-[10px] text-white text-[20px] text-center leading-[54px]"
                                style={{ backgroundImage: "linear-gradient(179deg, #4DCC8A 0%, #1EA152 100%)" }}
                                disabled
                                onClick={noop}
                            >
                                Stake
                            </TransactionButton>
                        </AppPopover>
                    )}
                </Col>
            </Row>
        </>
    );
};

const TokenStats = (props: {
    isDesktopOrLaptop: boolean;
    title: string;
    subValue?: ReactNode;
    children?: ReactNode;
}) => {
    const { isDesktopOrLaptop, title, subValue, children } = props;

    return (
        <Col span={isDesktopOrLaptop ? 8 : 24}>
            <Row
                gutter={4}
                align="middle"
                className="box flex-1 min-h-full border-2 border-[#dedede] rounded-[10px] mr-[50px] relative cursor-pointer transition-all duration-1000 scale-100 hover:shadow-[2_2px_50px_#00000010] last-of-type:mr-0 text-center"
            >
                <Col span={24} className="label !text-[18px] leading-[30px]">
                    <span>{title}</span>
                </Col>
                <Col span={24} className="value !text-[30px] font-['ArialMT, Roboto'] font-bold leading-[30px]">
                    {children}
                    <div className="extra !text-[18px] text-[#a3a3a3] leading-[30px]">{subValue ?? <>&nbsp;</>}</div>
                </Col>
            </Row>
        </Col>
    );
};

const StakingForm = (props: StakingFormProps) => {
    const { PageLoader } = usePageLoading();
    const { isDesktopOrLaptop } = useResponsive();
    const { activatedChainConfig } = useWallet();
    const {
        poolId,
        balanceInEther,
        depositSymbol,
        depositedAmountInEther,
        totalDepositedAmountInEther,
        depositNumInEther,
        withdrawNumInEther,

        setDepositNumInEther,
        setWithdrawNumInEther,
        triggerStakeButtonClick,
        triggerWithdrawButtonClick,
    } = useStakeOperationInEther();

    const carouselRef = useRef<CarouselRef>(null);

    // 以太币对USD汇率（一般由后端提供）
    const stakedTokenToUSD: number = 0;

    return (
        <PageLoader>
            <div className="staking-form w-full pt-[1px] bg-transparent">
                {/* deposit form */}
                <section className="staking-token px-[45px] mt-[42px] whitespace-nowrap rounded-tl-[16px] rounded-tr-[16px]">
                    <Row gutter={[16, 16]} justify="space-between">
                        <Col
                            span={isDesktopOrLaptop ? 12 : 24}
                            className="left mt-[40px] relative inline-block w-1/2 leading-[54px] align-top"
                        >
                            {/* deposit */}
                            <TokenOperationTitle
                                title={`Stake ${depositSymbol}`}
                                icon="icon-stake-3"
                            ></TokenOperationTitle>
                            <TokenOperation
                                isDesktopOrLaptop={isDesktopOrLaptop}
                                operationNum={depositNumInEther}
                                balance={balanceInEther}
                                symbol={depositSymbol}
                                available={props.available}
                                chainId={activatedChainConfig?.chainId}
                                onClick={() => triggerStakeButtonClick(poolId, depositNumInEther)}
                                onMaxClick={() => balanceInEther && setDepositNumInEther(balanceInEther)}
                                onChange={(val: string) => setDepositNumInEther(val ?? "")}
                            ></TokenOperation>
                            <Row>&nbsp;</Row>

                            {/* withdraw */}
                            <TokenOperationTitle
                                title={`Withdraw ${depositSymbol}`}
                                icon="icon-stake-5"
                            ></TokenOperationTitle>
                            <TokenOperation
                                isDesktopOrLaptop={isDesktopOrLaptop}
                                operationNum={withdrawNumInEther}
                                balance={depositedAmountInEther}
                                symbol={depositSymbol}
                                available={props.available}
                                chainId={activatedChainConfig?.chainId}
                                onClick={() => triggerWithdrawButtonClick(poolId, withdrawNumInEther)}
                                onMaxClick={() =>
                                    depositedAmountInEther && setWithdrawNumInEther(depositedAmountInEther)
                                }
                                onChange={(val: string) => setWithdrawNumInEther(val ?? "")}
                            ></TokenOperation>
                        </Col>
                        <Col
                            span={isDesktopOrLaptop ? 12 : 24}
                            className="right relative inline-block w-full leading-[54px]"
                        >
                            <Carousel ref={carouselRef} dots={false} className="slider" autoplay>
                                {[
                                    ["Tier One", "1-5,000", "1"],
                                    ["Tier Two", "5,001-25,000", "2"],
                                    ["Tier Three", "25,001-50,000", "3"],
                                    ["Tier Four", "50,001-100,000", "4"],
                                    ["Tier Five", "More than 100,000", "5"],
                                ].map((data, index) => (
                                    <TierCard data={data} key={index}></TierCard>
                                ))}
                            </Carousel>
                            <LeftOutlined
                                className="tier-left-arrow text-[32px] absolute top-1/2 left-[1.4px] text-[#666]"
                                onClick={() => carouselRef.current?.prev()}
                            />
                            <RightOutlined
                                className="tier-right-arrow text-[32px] absolute top-1/2 right-[1.4px] text-[#666]"
                                onClick={() => carouselRef.current?.next()}
                            />
                        </Col>
                    </Row>
                </section>

                {/* deposit stats */}
                <section className="staking-stats px-[45px] py-[55px] pt-[14px] rounded-br-[16px] rounded-bl[16px]">
                    <TokenOperationTitle title="Staking stats" icon="icon-stake-4"></TokenOperationTitle>
                    <Row
                        gutter={isDesktopOrLaptop ? [16, 16] : [0, 16]}
                        className="wrap flex justify-between mt-[47px]"
                    >
                        {/* deposited stats */}
                        <TokenStats
                            isDesktopOrLaptop={isDesktopOrLaptop}
                            title={`My Staked ${depositSymbol}`}
                            subValue={`~$${seperateWithComma(
                                (parseFloat(depositedAmountInEther ?? "0") * stakedTokenToUSD).toFixed(2)
                            )}`}
                        >
                            <Motion
                                defaultStyle={{ x: 0 }}
                                style={{ x: spring(parseFloat(depositedAmountInEther ?? "0")) }}
                            >
                                {(value) => (
                                    <>
                                        {seperateWithComma(value.x.toFixed(2))} {depositSymbol}
                                    </>
                                )}
                            </Motion>
                        </TokenStats>
                        {/* total stats */}
                        <TokenStats isDesktopOrLaptop={isDesktopOrLaptop} title="Total Value Locked">
                            $
                            <Motion
                                defaultStyle={{ x: 0 }}
                                style={{ x: spring(parseFloat(totalDepositedAmountInEther ?? "0")) }}
                            >
                                {(value) => <>{seperateWithComma(value.x.toFixed(0))}</>}
                            </Motion>
                        </TokenStats>
                        {/* symbol price */}
                        <TokenStats isDesktopOrLaptop={isDesktopOrLaptop} title={`${depositSymbol} Price`}>
                            ${(stakedTokenToUSD && stakedTokenToUSD.toFixed(4)) || "0.00"}
                        </TokenStats>
                    </Row>
                </section>
            </div>
        </PageLoader>
    );
};

export default StakingForm;
