import { useCallback, useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

import { chainConfigurations, getChainConfiguration, to } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setWalletModalVisible } from "@/redux/modules/wallet";
import { setActivatedAccountAddress, setActivatedChainConfig, setContract, setSigner } from "@/redux/modules/contract";
import { message } from "antd";
import { Contract, providers } from "ethers";
import { ENARED_TOKEN_ADDRESS, STAKED_TOKEN_ADDRESS, tokenAbi, tokenInfos } from "@/config";
import { validChains } from "@/config/validChains";

export const useListenToWallet = () => {
    const { chainId, account, connector } = useWeb3React();

    const dispatch = useAppDispatch();
    const activatedChainConfig = useAppSelector((state) => state.contract.activatedChainConfig);
    const activatedAccountAddress = useAppSelector((state) => state.contract.activatedAccountAddress);
    const signer = useAppSelector((state) => state.contract.signer);

    const clearContract = useCallback(() => {
        dispatch(
            setContract({
                depositTokenContract: undefined,
                breContract: undefined,
                stakingContract: undefined,
                saleContract: undefined,
            })
        );
    }, [dispatch]);

    // trigger activated chain configuration update
    useEffect(() => {
        const triggerChainChange = () => {
            const newChain = getChainConfiguration(chainId);

            dispatch(setActivatedChainConfig(newChain));
        };

        triggerChainChange();
    }, [dispatch, chainId]);

    // trigger activated account address update
    useEffect(() => {
        const triggerAccountChange = () => {
            dispatch(setActivatedAccountAddress(account ?? undefined));
            account && message.success(`You have connected to account ${account}`);
        };

        triggerAccountChange();
    }, [dispatch, account]);

    // trigger provider signer update
    useEffect(() => {
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

        triggerSignerChange();
    }, [dispatch, connector, activatedAccountAddress, activatedChainConfig]);

    // trigger contracts of staking function udpate
    useEffect(() => {
        const triggerTokenContractChange = () => {
            if (!activatedChainConfig || !signer) {
                clearContract();
                return;
            }

            const depositTokenContract = new Contract(STAKED_TOKEN_ADDRESS, tokenAbi, signer);
            const breContract = new Contract(ENARED_TOKEN_ADDRESS, tokenAbi, signer);

            dispatch(setContract({ depositTokenContract, breContract }));
        };

        triggerTokenContractChange();
    }, [dispatch, clearContract, signer, activatedChainConfig]);
};

export const useWallet = () => {
    const dispatch = useAppDispatch();

    const walletModalVisible = useAppSelector((state) => state.wallet.walletModalVisible);
    const isWalletInstalled = useAppSelector(state => state.wallet.isWalletInstalled)
    const activatedAccountAddress = useAppSelector((state) => state.contract.activatedAccountAddress);
    const activatedChainConfig = useAppSelector((state) => state.contract.activatedChainConfig);

    const showWallet = (visible?: boolean) => {
        dispatch(setWalletModalVisible(visible ?? !walletModalVisible));
    };

    const switchNetwork = useCallback(
        async (chainId: number) => {
            if (!activatedAccountAddress) {
                console.warn("no wallet address", activatedAccountAddress);
            }

            const chain = chainConfigurations.find((chainConfig) => chainConfig.chainId === chainId) ?? validChains[0];
            const param = {
                chainId: `0x${chain.chainId.toString(16)}`,
                chainName: chain.name,
                nativeCurrency: { ...chain.nativeCurrency },
                rpcUrls: chain.rpc,
                blockExplorerUrls: [`${chain.infoURL}/`],
            };

            const [switchErr] = await to(
                window.ethereum.request({
                    // method: IEthereum.RequestMethod.switchEthereumChain,
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: param.chainId }],
                })
            );

            // 区块链不存在，尝试新增
            if ((switchErr as any)?.code === 4902) {
                const [addErr] = await to(
                    window.ethereum.request({
                        // method: IEthereum.RequestMethod.addEthereumChain,
                        method: 'wallet_addEthereumChain',
                        params: [param],
                    })
                );

                if (addErr) {
                    console.warn("addErr", addErr);
                }
            }
        },
        [activatedAccountAddress]
    );

    // activated token information
    const token = useMemo(() => {
        return tokenInfos.find((tokenItem) => tokenItem.chainId === activatedChainConfig?.chainId) ?? tokenInfos[0];
    }, [activatedChainConfig]);
    // 
    const triggerTokenAdd = useCallback(async (chainId: number, tokenAddress: string, tokenSymbol: string) => {
        if (!activatedChainConfig) {
            message.error("connect wallet and try again!");
            return;
        }

        if (activatedChainConfig.chainId !== chainId) {
            message.error("switch network and try again!");
            return;
        }

        const [watchErr] = await to(
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: 18,
                        image: '',
                    }
                },
            })
        );

        if (watchErr) {
            message.error(watchErr.message);
        }
    }, [activatedChainConfig]);

    return {
        walletModalVisible,
        isWalletInstalled,
        activatedAccountAddress,
        activatedChainConfig,
        validChains,
        token,

        showWallet,
        switchNetwork,
        triggerTokenAdd,
    };
};
