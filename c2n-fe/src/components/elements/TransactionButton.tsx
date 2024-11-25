import { useWallet } from "@/hooks/useWallets";
import { ComponentBaseProps } from "@/types/i-base";
import { mergeClassName } from "@/utils/shared";
import AppPopover from "./AppPopover";
import { Spin } from "antd";
import { useCallback } from "react";
import { to } from "@/utils";

export interface TransactionButtonProps extends ComponentBaseProps {
    noConnectText?: string;
    transactionKey?: string;
    disabled?: boolean;
    disabledText?: string;
    loading?: boolean;
    lodaingText?: string;
    requiredChainId?: number | string;
    switchNetworkText?: string;

    onClick?: Function;
}

export default function TransactionButton(props: TransactionButtonProps) {
    const {
        activatedAccountAddress,
        activatedChainConfig,
        loading: walletLoading,

        showWallet,
        switchNetwork,
        setWalletLoading,
    } = useWallet();

    const transactionButtonClass = mergeClassName([
        "h-[54px] text-[20px] rounded-[8px] bg-[#ffb852] text-black text-center leading-[54px] cursor-pointer hover:brightness-110",
        props.disabled && "bg-[#c0c0c0] bg-none text-[#585858] cursor-not-allowed hover:bg-[#b0b0b0]",
        !activatedAccountAddress || (props.requiredChainId && activatedChainConfig?.chainId !== props.requiredChainId)
            ? "no-connect"
            : props.loading || walletLoading
            ? "loading"
            : "",
        props.className,
    ]);

    const waitForTransaction = useCallback(async () => {
        if (!props.onClick || props.disabled) return;

        setWalletLoading(true);
        await to(Promise.resolve(props.onClick()));
        setWalletLoading(false);
    }, [props.onClick, props.disabled]);

    // not connected
    if (!activatedAccountAddress) {
        return (
            <div className={transactionButtonClass} style={props.style} onClick={() => showWallet(true)}>
                {props.noConnectText || "Connect Wallet"}
            </div>
        );
    }

    // invalid chain
    if (props.requiredChainId && activatedChainConfig?.chainId !== props.requiredChainId) {
        return (
            <div
                className={transactionButtonClass}
                style={props.style}
                onClick={() => switchNetwork(props.requiredChainId as number)}
            >
                {props.switchNetworkText || "Switch Network"}
            </div>
        );
    }

    // transaction loading
    if (props.loading || walletLoading) {
        return (
            <AppPopover content="Your last transaction is pending or not confirmed.">
                <div className={transactionButtonClass} style={props.style}>
                    <Spin></Spin> {props.lodaingText || "Connecting..."}
                </div>
            </AppPopover>
        );
    }

    // normal
    return (
        <div className={transactionButtonClass} onClick={waitForTransaction}>
            {(props.disabled && props.disabledText) || props.children || "Connect Wallet"}
        </div>
    );
}
