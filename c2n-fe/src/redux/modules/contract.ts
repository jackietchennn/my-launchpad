import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContractState {
    walletAddress?: string;
}

const initialState: ContractState = {
    walletAddress: undefined
}

const contractState = createSlice({
    name: 'contractState',
    initialState,
    reducers: {
        setWalletAdress: (state, action: PayloadAction<string>) => {
            state.walletAddress = action.payload;
        }
    }
})

export const { setWalletAdress } = contractState.actions

export default contractState.reducer;
