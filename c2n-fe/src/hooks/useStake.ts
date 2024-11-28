import type { ChainConfiguration } from "@/types/i-chain";
import type { ContractTransaction, ContractReceipt, BigNumberish } from "ethers";

import { useMemo, useState } from "react";
import { BigNumber } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

import { STAKING_POOL_ID, stakingPoolAddress } from "@/config";
import { to } from "@/utils";
import { useAppSelector } from "@/redux/store";
import { useWallet } from "./useWallets";
import { C2NFarming, C2NToken } from "../../typechain-types";

const getSpecificTypeAddress = (
    addressType: "stakingAddress" | "depositTokenAddress" | "earnedTokenAddress",
    activatedChain?: ChainConfiguration
) => {
    return stakingPoolAddress.find((item) => item.chainId === activatedChain?.chainId)?.[addressType] ?? "";
};

export const useStake = () => {
    const { activatedChainConfig, activatedAccountAddress } = useWallet();

    // 质押代币合约实例
    const stakingContract = useAppSelector((state) => state.contract.stakingContract);
    // 存储代币合约实例
    const depositTokenContract = useAppSelector((state) => state.contract.depositTokenContract);
    // 奖励代币合约实例
    const earnedTokenContract = useAppSelector((state) => state.contract.earnedContract);
    // 质押池ID
    const [poolId, setPoolId] = useState<BigNumber>(BigNumber.from(STAKING_POOL_ID));
    // 质押池信息
    const [poolInfo, setPoolInfo] = useState<Awaited<ReturnType<C2NFarming["poolInfo"]>>>();

    // 当前用户与存储代币合约关联信息
    const [balance, setBalance] = useState<BigNumber>();
    const [depositSymbol, setDepositSymbol] = useState<string>();
    const [depositDecimals, setDepositDecimals] = useState<bigint>();
    const [depositAmount, setDepositAmout] = useState<BigNumber>();
    const [allowance, setAllowance] = useState<bigint>();

    // 当前用户与奖励代币合约关联信息
    const [earnedSymbol, setEarnedSymbol] = useState<string>();
    const [earnedAmount, setEarnedAmount] = useState<bigint>();
    const [totalPending, setTotalPending] = useState<bigint>();

    // 质押、存储代币、奖励代币合约地址
    const stakingAddress = useMemo(
        () => getSpecificTypeAddress("stakingAddress", activatedChainConfig),
        [activatedChainConfig]
    );
    const allowanceAddress = useMemo(
        () => getSpecificTypeAddress("stakingAddress", activatedChainConfig),
        [activatedChainConfig]
    );
    const depositTokenAddress = useMemo(
        () => getSpecificTypeAddress("depositTokenAddress", activatedChainConfig),
        [activatedChainConfig]
    );
    const earnedTokenAddress = useMemo(
        () => getSpecificTypeAddress("earnedTokenAddress", activatedChainConfig),
        [activatedChainConfig]
    );

    const syncDepositTokenContractInfo = async (accountAddress?: string, depositContract?: C2NToken) => {
        if (!accountAddress || !depositContract) return false;

        const [depositTokenErr, depositTokenRes] = await to(
            Promise.all([
                depositContract.balanceOf(accountAddress),
                depositContract.decimals(),
                depositContract.symbol(),
            ])
        );

        if (depositTokenErr || !depositTokenRes) {
            console.log("---depositTokenErr ", depositTokenErr);
            return false;
        }

        setBalance(depositTokenRes[0] as unknown as BigNumber);
        setDepositDecimals(depositTokenRes[1]);
        setDepositSymbol(depositTokenRes[2]);
    };
    const syncEarnedTokenContractInfo = async (accountAddress?: string, earnedContract?: C2NToken) => {
        if (!accountAddress || !earnedContract) return false;

        const [earnedErr, symbol] = await to(earnedContract.symbol());

        if (earnedErr || !symbol) {
            console.log("---earnedErr ", earnedErr);
            return false;
        }

        setEarnedSymbol(symbol);
    };
    const syncStakingContractInfo = async (
        poolId: BigNumber,
        accountAddress?: string,
        stakingContract?: C2NFarming
    ) => {
        if (!accountAddress || !stakingContract) return false;

        const [stakingErr, stakingRes] = await to(
            Promise.all([
                stakingContract.pending(poolId),
                stakingContract.totalPending(),
                stakingContract.deposited(poolId, accountAddress),
            ])
        );

        if (stakingErr || !stakingRes) {
            console.log("---stakingErr ", stakingErr);
            return false;
        }

        setEarnedAmount(stakingRes[0]);
        setTotalPending(stakingRes[1]);
        setDepositAmout(stakingRes[2] as unknown as BigNumber);
    };
    const syncDepositContractAllowance = async (owner?: string, spender?: string, tokenContract?: C2NToken) => {
        if (!owner || !spender || !tokenContract) return false;

        const [allowanceErr, allowance] = await to(tokenContract.allowance(owner, spender));

        if (allowanceErr || !allowance) {
            console.log("---allowanceErr ", allowanceErr, allowance);
            return false;
        }

        setAllowance(allowance);
    };
    const syncDepositContractDeposited = async (
        poolId: BigNumber,
        accountAddress?: string,
        stakingContract?: C2NFarming
    ) => {
        if (!accountAddress || !stakingContract) return false;

        const [depositedErr, deposited] = await to(stakingContract.deposited(poolId, accountAddress));

        if (depositedErr || !deposited) {
            console.log("---depositedErr ", depositedErr, deposited);
            return false;
        }

        setDepositAmout(deposited as unknown as BigNumber);
    };
    const syncContractInfo = async () => {
        if (!activatedAccountAddress) return;

        await Promise.all([
            syncDepositTokenContractInfo(activatedAccountAddress, depositTokenContract),
            syncEarnedTokenContractInfo(activatedAccountAddress, earnedTokenContract),
            syncStakingContractInfo(poolId, activatedAccountAddress, stakingContract),
            syncDepositContractAllowance(activatedAccountAddress, stakingAddress, depositTokenContract),
            syncDepositContractDeposited(poolId, activatedAccountAddress, stakingContract),
        ]);
    };
    const syncPoolInfo = async (_poolId: BigNumber) => {
        if (!stakingContract) return false;

        const [poolErr, data] = await to(stakingContract.poolInfo(_poolId));
        if (poolErr || !data) {
            console.log("---poolErr ", poolErr, data);
            return;
        }
        setPoolInfo(data);
    };

    const approve = async (spender: string, amount: string) => {
        if (!depositTokenContract || !spender) return false;

        const [approveErr, transaction] = await to<ContractTransaction>(
            depositTokenContract.approve(spender, parseUnits(amount, 18))
        );

        if (approveErr || !transaction) {
            console.log("---approveErr ", approveErr, transaction);
            return false;
        }

        await transaction.wait();
        syncDepositContractAllowance(activatedAccountAddress, spender, depositTokenContract);
    };
    const deposit = async (_poolId: BigNumberish, _amount: string) => {
        if (!stakingContract) return false;

        const [depositErr, transaction] = await to<ContractTransaction>(
            stakingContract.deposit(_poolId, parseEther(_amount))
        );
        if (depositErr || !transaction) {
            console.log("---depositErr ", depositErr, transaction);
            return false;
        }

        const [waitErr, contractReceipt] = await to<ContractReceipt>(transaction.wait());
        if (waitErr || !contractReceipt) {
            console.log("---deposit wait error ", waitErr, contractReceipt);
            return false;
        }

        return contractReceipt;
    };
    const withdraw = async (_poolId: BigNumberish, _amount: string) => {
        if (!stakingContract) return false;

        const [withdrawErr, transaction] = await to<ContractTransaction>(
            stakingContract.withdraw(_poolId, parseEther(_amount))
        );
        if (withdrawErr || !transaction) {
            console.log("---withdrawErr ", withdrawErr, transaction);
            return false;
        }

        const [waitErr, contractReceipt] = await to<ContractReceipt>(transaction.wait());
        if (waitErr || !contractReceipt) {
            console.log("---withdraw wait error ", waitErr, contractReceipt);
            return false;
        }

        return contractReceipt;
    };

    return {
        poolId,
        poolInfo,
        balance,
        allowance,
        depositSymbol,
        depositDecimals,
        depositAmount,
        earnedSymbol,
        earnedAmount,
        totalPending,
        stakingAddress,
        allowanceAddress,
        depositTokenAddress,
        earnedTokenAddress,
        stakingContract,
        depositTokenContract,
        earnedTokenContract,

        setPoolId,
        setBalance,
        setAllowance,
        setDepositSymbol,
        setDepositDecimals,
        setDepositAmout,
        setEarnedSymbol,
        setEarnedAmount,
        setTotalPending,
        syncContractInfo,
        syncPoolInfo,
        approve,
        deposit,
        withdraw,
    };
};
