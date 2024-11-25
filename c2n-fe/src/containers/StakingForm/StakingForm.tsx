import AppPopover from "@/components/elements/AppPopover";
import TransactionButton from "@/components/elements/TransactionButton";
import { usePageLoading } from "@/hooks/usePageLoading";
import { useResponsive } from "@/hooks/useResponsive";
import { useStake } from "@/hooks/useStake";
import { useWallet } from "@/hooks/useWallets";
import { ComponentBaseProps } from "@/types/i-base";
import { mergeClassName } from "@/utils/shared";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Col, InputNumber, Row } from "antd";
import { noop } from "antd/es/_util/warning";
import { CarouselRef } from "antd/es/carousel";
import { formatEther } from "ethers/lib/utils";
import { useRef, useState } from "react";

export interface StakingFormProps extends ComponentBaseProps {
    poolId?: number;
    available?: boolean;
}

const TierCard = (props: { data?: string[] }) => {
    const data = props.data ?? [];

    return (
        <div className="tier-card tier-card">
            <div className="wrapper">
                <Row justify="center" className="tier-title">
                    {data[0] || ""}
                </Row>
                <Row justify="center" className="tier-label">
                    Staking Requirement
                </Row>
                <Row justify="center" className="tier-value-large">
                    {data[1] || ""}
                </Row>
                <Row justify="center" className="tier-label">
                    Whitelist Requirement Twitter
                </Row>
                <Row justify="center" className="tier-value-small">
                    Like, Comment & Retweet
                </Row>
                <Row justify="center" className="tier-label">
                    Guaranteed Allocation
                </Row>
                <Row justify="center" className="tier-value-small">
                    Yes
                </Row>
                <Row justify="center" className="tier-label">
                    Allocation Weight
                </Row>
                <Row justify="center" className="tier-value-medium">
                    {data[2] || ""}
                </Row>
            </div>
        </div>
    );
};

const TokenOperationTitle = (props: { icon: string; title: string }) => {
    return (
        <h2 className="title">
            <i className={mergeClassName(["icon", props.icon])}></i>
            <span className="ml-[10px]">{props.title}</span>
        </h2>
    );
};

const TokenOperation = (props: {
    isDesktopOrLaptop: boolean;
    operationNum?: string;
    balance?: bigint;
    symbol?: string;
    available?: boolean;
    chainId?: number;
    onClick(): void;
    onMaxClick(): void;
    onChange(value: string | null): void;
}) => {
    const { isDesktopOrLaptop, operationNum, balance, symbol, available, chainId, onClick, onMaxClick, onChange } =
        props;

    return (
        <>
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={isDesktopOrLaptop ? 12 : 24}>
                    <Row justify="space-between">
                        <div className="balance">Balance: {balance ? `${formatEther(balance)} ${symbol}` : "-"}</div>
                        <div className="max" onClick={() => onMaxClick()}>
                            MAX
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={isDesktopOrLaptop ? 12 : 24}>
                    <div className="input">
                        <InputNumber
                            value={operationNum}
                            max={balance ? formatEther(balance) : "0"}
                            controls={false}
                            variant="borderless"
                            step="0.0001"
                            className="number"
                            stringMode
                            onChange={onChange}
                        ></InputNumber>
                        <div className="unit">{symbol}</div>
                    </div>
                </Col>
                <Col span={isDesktopOrLaptop ? 12 : 24}>
                    {available ? (
                        <TransactionButton
                            requiredChainId={chainId}
                            noConnectText="Connect Wallet"
                            switchNetworkText="Switch Network"
                            className="button w-full"
                            onClick={() => onClick()}
                        >
                            Stake
                        </TransactionButton>
                    ) : (
                        <AppPopover content="Coming Soon" wrap>
                            <TransactionButton
                                noConnectText="Connect Wallet"
                                className="button w-full"
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

const StakingForm = (props: StakingFormProps) => {
    const { isDesktopOrLaptop } = useResponsive();
    const { PageLoader } = usePageLoading();
    const { activatedChainConfig } = useWallet();
    const { balance, depositSymbol, depositAmount, stakingContract } = useStake();

    const [depositNum, setDepositNum] = useState<string>();
    const [withdrawNum, setWithdrawNum] = useState<string>();

    const carouselRef = useRef<CarouselRef>(null);

    const triggerDeposit = () => {};
    const triggerWithdraw = () => {};

    return (
        <PageLoader>
            <div className="staking-form">
                {/* deposit form */}
                <section className="staking-token">
                    <Row gutter={[16, 16]} justify="space-between">
                        <Col span={isDesktopOrLaptop ? 12 : 24} className="left">
                            {/* deposit */}
                            <TokenOperationTitle title={`Stake ${depositSymbol}`} icon="icon-stake-3"></TokenOperationTitle>
                            <TokenOperation
                                isDesktopOrLaptop={isDesktopOrLaptop}
                                operationNum={depositNum}
                                balance={balance}
                                symbol={depositSymbol}
                                available={props.available}
                                chainId={activatedChainConfig?.chainId}
                                onClick={triggerDeposit}
                                onMaxClick={() => balance && setDepositNum(formatEther(balance))}
                                onChange={(val: string) => setDepositNum(val ?? "")}
                            ></TokenOperation>
                            <Row>&nbsp;</Row>

                            {/* withdraw */}
                            <TokenOperationTitle title={`Withdraw ${depositSymbol}`} icon="icon-stake-5"></TokenOperationTitle>
                            <TokenOperation
                                isDesktopOrLaptop={isDesktopOrLaptop}
                                operationNum={withdrawNum}
                                balance={depositAmount}
                                symbol={depositSymbol}
                                available={props.available}
                                chainId={activatedChainConfig?.chainId}
                                onClick={triggerWithdraw}
                                onMaxClick={() => depositAmount && setWithdrawNum(formatEther(depositAmount))}
                                onChange={(val: string) => setWithdrawNum(val ?? "")}
                            ></TokenOperation>
                        </Col>
                        <Col span={isDesktopOrLaptop ? 12 : 24} className="right">
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
                        </Col>
                    </Row>
                </section>
                <LeftOutlined className="tier-left-arrow" onClick={() => carouselRef.current?.prev()} />
                <RightOutlined className="tier-right-arrow" onClick={() => carouselRef.current?.next()} />

                {/* desport stats */}
                <section className="staking-stats">
                    <TokenOperationTitle title="Staking stats" icon="icon-stake-4"></TokenOperationTitle>
                    
                </section>
            </div>
        </PageLoader>
    );
};

export default StakingForm;
