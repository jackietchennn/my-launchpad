import { ChainConfiguration } from "@/types/i-chain"

import { useMemo, useState } from "react"

import { STAKING_POOL_ID, stakingPoolAddress } from "@/config"
import { useWallet } from "./useWallets"
import { useAppSelector } from "@/redux/store"
import { to } from "@/utils"
import { BigNumber } from "ethers"
import { C2NFarming, C2NToken } from "../../typechain-types"

const getSpecificTypeAddress = (addressType: 'stakingAddress' | 'depositTokenAddress' | 'earnedTokenAddress', activatedChain?: ChainConfiguration) => {
    return stakingPoolAddress.find(item => item.chainId === activatedChain?.chainId)?.[addressType] ?? ''
}

export const useStake = () => {
    const signer = useAppSelector(state => state.contract.signer)
    const stakingContract = useAppSelector(state => state.contract.stakingContract)
    const depositTokenContract = useAppSelector(state => state.contract.depositTokenContract)
    const earnedTokenContract = useAppSelector(state => state.contract.earnedContract)
    const { activatedChainConfig, activatedAccountAddress } = useWallet()

    // 获取当前用户信息：代币余额
    // 获取当前用户存储代币信息：存储代币标识、存储代币兑换比、存储代币数量、存储代币合约地址
    // 获取当前用户奖励代币信息：奖励代币标识、奖励代币数量、奖励代币合约地址
    // 获取当前用户质押信息：授权质押合约代币数量、质押合约地址
    // 获取质押总奖励（A池在过去一段时间中产生的总奖励）
    // 获取质押奖励代币标识（可以理解为平台限定A池的质押代币B，而奖励的代币并不一定是代币B，可能是代币C、D，由平台规定）
    // 获取当前用户质押相关的质押代币合约实例
    // 获取当前用户质押相关的存储代币合约实例
    // 获取当前用户质押相关的奖励代币合约实例
    
    // 质押池ID
    const [poolId, setPoolId] = useState<BigNumber>(BigNumber.from(STAKING_POOL_ID))
    // 当前用户余额
    const [balance, setBalance] = useState<bigint>()
    // 当前用户授权质押合约可消费的代币数量
    const [allowance, setAllowance] = useState<bigint>()

    // 当前用户与存储代币合约关联信息
    const [depositSymbol, setDepositSymbol] = useState<string>()
    const [depositDecimals, setDepositDecimals] = useState<bigint>()
    const [depositAmount, setDepositAmout] = useState<bigint>()

    // 当前用户与奖励代币合约关联信息
    const [earnedSymbol, setEarnedSymbol] = useState<string>()
    const [earnedAmount, setEarnedAmount] = useState<bigint>()
    const [totalPending, setTotalPending] = useState<bigint>()

    // 质押、存储代币、奖励代币合约
    const stakingAddress = useMemo(() => getSpecificTypeAddress('stakingAddress', activatedChainConfig), [activatedChainConfig])
    const allowanceAddress = useMemo(() => getSpecificTypeAddress('stakingAddress', activatedChainConfig), [activatedChainConfig])
    const depositTokenAddress = useMemo(() => getSpecificTypeAddress('depositTokenAddress', activatedChainConfig), [activatedChainConfig])
    const earnedTokenAddress = useMemo(() => getSpecificTypeAddress('earnedTokenAddress', activatedChainConfig), [activatedChainConfig])

    
    const syncDepositTokenContractInfo = async (accountAddress?: string, depositContract?: C2NToken) => {
        if (!accountAddress || !depositContract) return
        
        const [depositTokenErr, depositTokenRes] = await to(Promise.all([
            depositContract.balanceOf(accountAddress),
            depositContract.decimals(),
            depositContract.symbol(),
        ]))
        
        if (depositTokenErr || !depositTokenRes) {
            console.log('---depositTokenErr ', depositTokenErr);
            return 
        }

        setBalance(depositTokenRes[0])
        setDepositDecimals(depositTokenRes[1])
        setDepositSymbol(depositTokenRes[2])
    }
    const syncEarnedTokenContractInfo = async (accountAddress?: string, earnedContract?: C2NToken) => {
        if (!accountAddress || !earnedContract) return
        
        const [earnedErr, symbol] = await to(earnedContract.symbol())

        if (earnedErr || !symbol) {
            console.log('---earnedErr ', earnedErr)
            return
        }

        setEarnedSymbol(symbol)
    }
    const syncStakingContractInfo = async (poolId: BigNumber, accountAddress?: string, stakingContract?: C2NFarming) => {
        if (!accountAddress || !stakingContract) return

        const [stakingErr, stakingRes] = await to(Promise.all([
            stakingContract.pending(poolId),
            stakingContract.totalPending(),
            stakingContract.deposited(poolId, accountAddress),
        ]))

        if (stakingErr || !stakingRes) {
            console.log('---stakingErr ', stakingErr);
            return
        }

        setEarnedAmount(stakingRes[0])
        setTotalPending(stakingRes[1])
        setDepositAmout(stakingRes[2])
    }
    const syncDepositContractAllowance = async (owner?: string, spender?: string, tokenContract?: C2NToken) => {
        if (!owner || !spender || !tokenContract) return

        const [allowanceErr, allowance] = await to(tokenContract.allowance(owner, spender))

        if (allowanceErr || !allowance) {
            console.log('---allowanceErr ', allowanceErr, allowance);
            return
        }

        setAllowance(allowance)
    }
    const syncDepositContractDeposited = async (poolId: BigNumber, accountAddress?: string, stakingContract?: C2NFarming) => {
        if (!accountAddress || !stakingContract) return

        const [depositedErr, deposited] = await to(stakingContract.deposited(poolId, accountAddress))

        if (depositedErr || !deposited) {
            console.log('---depositedErr ', depositedErr, deposited);
            return
        }

        setDepositAmout(deposited)
    }

    const syncContractInfo = () => {
        if (!activatedAccountAddress) return

        syncDepositTokenContractInfo(activatedAccountAddress, depositTokenContract)
        syncEarnedTokenContractInfo(activatedAccountAddress, earnedTokenContract)
        syncStakingContractInfo(poolId, activatedAccountAddress, stakingContract)
        syncDepositContractAllowance(activatedAccountAddress, stakingAddress, depositTokenContract)
        syncDepositContractDeposited(poolId, activatedAccountAddress, stakingContract)
    }

    const approve = async (spender: string, amount: number) => {}
    const deposit = async (poolId: BigNumber, amount: number) => {}
    const withdraw = async (poolId: BigNumber) => {}

    return {
        poolId,
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
        approve,
        deposit,
        withdraw,
    }
}