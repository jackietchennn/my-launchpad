import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import { BigNumber } from "ethers";
import { formatEther, parseUnits } from "ethers/lib/utils";

import { to } from "@/utils";
import { useStake } from "./useStake";
import { useWallet } from "./useWallets";

export const useStakeOperationInEther = () => {
    const { activatedAccountAddress, activatedChainConfig } = useWallet();
    const {
        poolId,
        poolInfo,
        balance,
        depositSymbol,
        depositAmount,
        earnedSymbol,
        earnedAmount,
        stakingAddress,
        stakingContract,

        syncPoolInfo,
        syncContractInfo,
        approve,
        deposit,
        withdraw,
    } = useStake();

    // 当前用户余额
    const balanceInEther = formatEther(balance);
    // 当前用户质押代币数量
    const depositedAmountInEther = formatEther(depositAmount ?? 0);
    // 当前用户奖励代币数量
    const earnedAmountInEther = earnedAmount ? formatEther(earnedAmount) : undefined;
    // 所有用户质押总代币数量
    const totalDepositedAmountInEther = formatEther(poolInfo?.totalDeposits ?? 0);

    // 质押数量
    const [depositNumInEther, setDepositNumInEther] = useState<string>();
    // 取款数量
    const [withdrawNumInEther, setWithdrawNumInEther] = useState<string>();
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

    // 质押按钮点击
    const triggerStakeButtonClick = useCallback(
        async (_poolId: BigNumber, _amount?: string) => {
            // 判断输入值
            if (!_amount || _amount === "0.0000") {
                message.error(`Cannot stake 0 ${depositSymbol}!`);
                return;
            }

            // 判断余额前，同步钱包信息
            await syncContractInfo();

            // 判断余额是否足够
            if (parseUnits(_amount).gt(balance)) {
                message.error(`Not enough ${depositSymbol} to stake!`);
                return;
            }

            // `approve` 授权质押合约 `depositNum` 代币数量
            const [approveErr, approveSucceed] = await to(approve(stakingAddress, _amount));
            if (approveErr || approveSucceed === false) {
                console.log("---approveErr ", approveErr, approveSucceed);
                return;
            }

            // `deposit` 存储 `depositNum` 代币数量
            const [depositErr, depositSucceed] = await to(deposit(_poolId, _amount));
            if (depositErr || depositSucceed === false) {
                console.log("---depositErr ", depositErr, depositSucceed);
                return;
            }

            message.success(`Congratulations, you have successfully deposited ${_amount} ${depositSymbol}`);
            setDepositNumInEther(undefined);
            syncContractInfo();
        },
        [syncContractInfo, balance, depositSymbol, stakingAddress]
    );
    // 取款按钮点击
    const triggerWithdrawButtonClick = useCallback(
        async (_poolId: BigNumber, _amount?: string) => {
            // 判断输入值
            if (!_amount || _amount === "0.0000") {
                message.error(`Invalid ${depositSymbol} to withdraw!`);
                return;
            }

            // `withdraw` 提取 `withdrawNum` 代币数量
            const [withdrawErr, withdrawSucceed] = await to(withdraw(_poolId, _amount));
            if (withdrawErr || withdrawSucceed === false) {
                console.log("---withdrawErr ", withdrawErr, withdrawSucceed);
                return;
            }

            message.success("Withdraw success!");
            setWithdrawNumInEther(undefined);
            syncContractInfo();
        },
        [syncContractInfo, depositSymbol]
    );

    return {
        poolId,
        poolInfo,
        balanceInEther,
        depositSymbol,
        depositedAmountInEther,
        totalDepositedAmountInEther,
        earnedSymbol,
        earnedAmountInEther,
        depositNumInEther,
        withdrawNumInEther,

        setDepositNumInEther,
        setWithdrawNumInEther,
        triggerStakeButtonClick,
        triggerWithdrawButtonClick,
    };
};
