import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface WalletState {
    walletModalVisible: boolean;
    isWalletInstalled: boolean;
}

const initialState: WalletState = {
    walletModalVisible: false,
    isWalletInstalled: false,
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setWalletModalVisible: (state, action: PayloadAction<boolean>) => {
            state.walletModalVisible = action.payload;
        },
        setIsWalletInstalled: (state, action: PayloadAction<boolean>) => {
            state.isWalletInstalled = action.payload;
        },
    },
});

export const { setWalletModalVisible, setIsWalletInstalled } = walletSlice.actions;

export default walletSlice.reducer;
