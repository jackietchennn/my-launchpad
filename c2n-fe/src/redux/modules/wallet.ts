import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface WalletState {
    walletModalVisible: boolean;
    walletAddress?: string;
}

const initialState: WalletState = {
    walletModalVisible: false,
    walletAddress: undefined,
}

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setWalletModalVisible: (state, action: PayloadAction<boolean>) => {
            state.walletModalVisible = action.payload;
        }
    }
});

export const { setWalletModalVisible } = walletSlice.actions;

export default walletSlice.reducer;
