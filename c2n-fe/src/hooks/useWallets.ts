import { setWalletModalVisible } from "@/redux/modules/wallet";
import { useAppDispatch, useAppSelector } from "@/redux/store"

export const useWallet = () => {
    const dispatch = useAppDispatch();

    const walletModalVisible = useAppSelector((state) => state.wallet.walletModalVisible);
    const walletAddress = useAppSelector((state) => state.contract.walletAddress);

    const showWallet = (visible?: boolean) => {
        dispatch(
            setWalletModalVisible(visible ?? !walletModalVisible)
        )
    }

    return {
        walletModalVisible,
        walletAddress,

        showWallet,
    }
}