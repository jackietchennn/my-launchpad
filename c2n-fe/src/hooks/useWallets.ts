import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { chainConfigurations, getChainConfiguration } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setWalletModalVisible } from "@/redux/modules/wallet";
import { setActivatedAccountAddress, setActivatedChainConfig, setContract, setSigner } from "@/redux/modules/contract";
import { message } from "antd";
import { Contract, providers } from "ethers";
import { ENARED_TOKEN_ADDRESS, STAKED_TOKEN_ADDRESS, tokenAbi } from "@/config";

export const listenToWallet = () => {
    const { chainId, account, connector } = useWeb3React();

    const dispatch = useAppDispatch();
    const activatedChainConfig = useAppSelector((state) => state.contract.activatedChainConfig);
    const activatedAccountAddress = useAppSelector((state) => state.contract.activatedAccountAddress);
    const signer = useAppSelector((state) => state.contract.signer);

    // trigger activated chain configuration update
    useEffect(() => {
        triggerChainChange();
    }, [chainId]);
    // trigger activated account address update
    useEffect(() => {
        triggerAccountChange();
    }, [account]);
    // trigger provider signer update
    useEffect(() => {
        triggerSignerChange();
    }, [connector, activatedAccountAddress, activatedChainConfig]);
    // trigger contracts of staking function udpate
    useEffect(() => triggerTokenContractChange(), [signer, activatedChainConfig]);

    const triggerChainChange = () => {
        const newChain = getChainConfiguration(chainId);

        dispatch(setActivatedChainConfig(newChain));
    };
    const triggerAccountChange = () => {
        dispatch(setActivatedAccountAddress(account ?? undefined));
        account && message.success(`You have connected to account ${account}`);
    };
    const triggerSignerChange = async () => {
        if (!activatedAccountAddress || !activatedChainConfig) {
            dispatch(setSigner());
            return;
        }

        if (typeof window !== "undefined" && connector) {
            const provider = await connector.getProvider();
            const newProvider = new providers.Web3Provider(provider);
            const newSigner = newProvider.getSigner();

            dispatch(setSigner(newSigner));
        }
    };
    const triggerTokenContractChange = () => {
        if (!activatedChainConfig || !signer) {
            clearContract();
            return;
        }

        const depositTokenContract = new Contract(STAKED_TOKEN_ADDRESS, tokenAbi, signer);
        const breContract = new Contract(ENARED_TOKEN_ADDRESS, tokenAbi, signer);

        dispatch(setContract({ depositTokenContract, breContract }));
    };

    const clearContract = () => {
        dispatch(
            setContract({
                depositTokenContract: undefined,
                breContract: undefined,
                stakingContract: undefined,
                saleContract: undefined,
            })
        );
    };
};

export const useWallet = () => {
    const dispatch = useAppDispatch();

    const walletModalVisible = useAppSelector((state) => state.wallet.walletModalVisible);
    const activatedAccountAddress = useAppSelector((state) => state.contract.activatedAccountAddress);

    const showWallet = (visible?: boolean) => {
        dispatch(setWalletModalVisible(visible ?? !walletModalVisible));
    };

    return {
        walletModalVisible,
        activatedAccountAddress,

        showWallet,
    };
};
