import AppPopover from "@/components/elements/AppPopover";
import TransactionButton from "@/components/elements/TransactionButton";
import { usePageLoading } from "@/hooks/usePageLoading";
import { useResponsive } from "@/hooks/useResponsive";
import { useStake } from "@/hooks/useStake";
import { useWallet } from "@/hooks/useWallets";
import { ComponentBaseProps } from "@/types/i-base";
import { mergeClassName, seperateWithComma } from "@/utils/shared";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Col, InputNumber, Row, message } from "antd";
import { noop } from "antd/es/_util/warning";
import { CarouselRef } from "antd/es/carousel";
import { formatEther, formatUnits, parseEther, parseUnits } from "ethers/lib/utils";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Motion, spring } from "react-motion";
import { C2NFarming } from "../../../typechain-types";
import { to } from "@/utils";
import { BigNumber } from "ethers";

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

const TokenOperation = (props: {
    isDesktopOrLaptop: boolean;
    operationNum?: string;
    balance?: BigNumber;
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
                        <div className="max text-[#55BC7E] cursor-pointer" onClick={() => onMaxClick()}>
                            MAX
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={isDesktopOrLaptop ? 12 : 24}>
                    <div className="input w-full h-[54px] border-transparent rounded-[10px] relative bg-[#f4f4f4] text-[22px] leading-[54px]">
                        <InputNumber
                            value={operationNum}
                            max={balance ? formatEther(balance) : "0"}
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
                <Col span={isDesktopOrLaptop ? 12 : 24}>
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
    const { isDesktopOrLaptop } = useResponsive();
    const { PageLoader } = usePageLoading();
    const { activatedChainConfig, activatedAccountAddress } = useWallet();
    const {
        poolId,
        balance,
        depositSymbol,
        depositAmount,
        stakingAddress,
        stakingContract,

        approve,
        deposit,
        withdraw,
        syncContractInfo,
    } = useStake();

    const carouselRef = useRef<CarouselRef>(null);
    const [depositNum, setDepositNum] = useState<string>();
    const [withdrawNum, setWithdrawNum] = useState<string>();

    // 以太币对USD汇率（一般由后端提供）
    const stakedTokenToUSD: number = 0;
    // 当前用户质押数量
    const depositedAmountInEther = depositAmount ? formatEther(depositAmount) : "0";
    // 质押池信息
    const [poolInfo, setPoolInfo] = useState<Awaited<ReturnType<C2NFarming["poolInfo"]>>>();
    // 质押池总质押代币数量
    const totalDeposited = useMemo(() => poolInfo?.totalDeposits ?? 1, [poolInfo]);
    const syncPoolInfo = async (_poolId: BigNumber) => {
        if (!stakingContract) return false;

        const [poolErr, data] = await to(stakingContract.poolInfo(_poolId));
        if (poolErr || !data) {
            console.log("---poolErr ", poolErr, data);
            return false;
        }
        setPoolInfo(data);
        return true;
    };

    let poolInfoTimer: ReturnType<typeof setInterval>;
    useEffect(() => {
        if (!stakingContract) return;

        const clearTimer = () => clearInterval(poolInfoTimer);
        const syncInfo = () => {
            syncPoolInfo(poolId);
            syncContractInfo();
        };

        clearTimer();
        syncInfo();
        poolInfoTimer = setInterval(syncInfo, 20000);

        return clearTimer;
    }, [poolId, stakingContract, activatedAccountAddress, activatedChainConfig]);

    const triggerDeposit = async () => {
        // 判断输入值
        if (!depositNum || depositNum === "0.0000") {
            message.error(`Cannot stake 0 ${depositSymbol}!`);
            return;
        }
        // 判断余额前，同步钱包信息
        await syncContractInfo();
        // 判断余额是否足够支付
        if (parseUnits(depositNum).gt(balance)) {
            message.error(`Not enough ${depositSymbol} to stake!`);
            return;
        }
        // `approve` 授权质押合约 `depositNum` 代币数量
        const [approveErr, approveSucceed] = await to(approve(stakingAddress, depositNum));
        if (approveErr || approveSucceed === false) {
            console.log('---approveErr ', approveErr, approveSucceed);
            return 
        }
        // `deposit` 存储 `depositNum` 代币数量
        const [depositErr, depositSucceed] = await to(deposit(poolId, depositNum))
        if (depositErr || depositSucceed === false) {
            console.log('---depositErr ', depositErr, depositSucceed);
            return
        }
        console.log('---depositSucceed ', depositSucceed);
        message.success(`Congratulations, you have successfully deposited ${depositNum} ${depositSymbol}`)
        setDepositNum(undefined)
        syncContractInfo()
    };
    const triggerWithdraw = async () => {
        // 判断输入值
        if (!withdrawNum || withdrawNum === '0.0000') {
            message.error(`Invalid ${depositSymbol} to withdraw!`)
            return
        }

        // `withdraw` 提取 `withdrawNum` 代币数量
        const [withdrawErr, withdrawSucceed] = await to(withdraw(poolId, withdrawNum))
        if (withdrawErr || withdrawSucceed === false) {
            console.log('---withdrawErr ', withdrawErr, withdrawSucceed);
            return
        }
        console.log('---withdrawSucceed ', withdrawSucceed);
        message.success('Withdraw success!');
        setWithdrawNum(undefined)
        syncContractInfo()
    };

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
                            <TokenOperationTitle
                                title={`Withdraw ${depositSymbol}`}
                                icon="icon-stake-5"
                            ></TokenOperationTitle>
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
                                (parseFloat(depositedAmountInEther) * stakedTokenToUSD).toFixed(2)
                            )}`}
                        >
                            <Motion defaultStyle={{ x: 0 }} style={{ x: spring(parseFloat(depositedAmountInEther)) }}>
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
                                style={{ x: spring(parseFloat(formatEther(totalDeposited))) }}
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
