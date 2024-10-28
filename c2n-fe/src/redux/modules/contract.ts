import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChainConfiguration } from "@/types/i-chain";

import { Contract, providers } from "ethers";
import { createSlice } from "@reduxjs/toolkit";

export interface ContractState {
    activatedChainConfig?: ChainConfiguration;
    activatedAccountAddress?: string;
    signer?: providers.JsonRpcSigner;

    depositTokenContract?: Contract;
    breContract?: Contract;
    stakingContract?: Contract;
    saleContract?: Contract;
}

const initialState: ContractState = {
    activatedChainConfig: undefined,
    activatedAccountAddress: undefined,
    signer: undefined,

    depositTokenContract: undefined,
    breContract: undefined,
    stakingContract: undefined,
    saleContract: undefined,
};

const contractState = createSlice({
    name: "contractState",
    initialState,
    reducers: {
        setActivatedChainConfig: (state, action: PayloadAction<ChainConfiguration | undefined>) => {
            state.activatedChainConfig = action.payload;
        },
        setActivatedAccountAddress: (state, action: PayloadAction<string | undefined>) => {
            state.activatedAccountAddress = action.payload;
            console.log('--- setActivatedAccountAddress', action);
        },
        setSigner: (state, action: PayloadAction<providers.JsonRpcSigner | undefined>) => {
            state.signer = action.payload;
        },
        setContract: (state, action: PayloadAction<Pick<ContractState, 'depositTokenContract' | 'breContract' | 'stakingContract' | 'saleContract'>>) => {
            Object.assign(state, action.payload)
        }
    },
});

export const { setActivatedChainConfig, setActivatedAccountAddress, setSigner, setContract } = contractState.actions;

export default contractState.reducer;
