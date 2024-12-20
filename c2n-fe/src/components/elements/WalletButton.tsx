import { useWallet } from "@/hooks/useWallets";
import { IconWalletButton } from "../Icons";
import { ComponentBaseProps } from "@/types/i-base";

interface WalletButtonProps extends ComponentBaseProps {}

export default function WalletButton(props: WalletButtonProps) {
    const { activatedAccountAddress, showWallet } = useWallet();

    return (
        <div
            className={[
                "flex items-center justify-center gap-2 w-[160px] h-12 rounded-[27.5px] shadow-[0_2px_20px_10px_rgba(0,0,0,0.5)] text-center text-[#ffb852] leading-[48px] cursor-pointer hover:brightness-110 hover:shadow-[5px_5px_50px_10px_#7ff1e11]",
                props.className,
            ].join(" ")}
            onClick={() => showWallet(true)}
        >
            <IconWalletButton></IconWalletButton>
            {activatedAccountAddress?.replace(/^(.{6}).+(.{4})$/, "$1...$2") ?? "Connect Wallet"}
        </div>
    );
}
