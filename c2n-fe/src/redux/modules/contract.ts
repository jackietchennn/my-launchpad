import type { PayloadAction } from "@reduxjs/toolkit";
import type { ChainConfiguration } from "@/types/i-chain";

import { Contract, providers } from "ethers";
import { createSlice } from "@reduxjs/toolkit";
import type { C2NFarming, C2NToken } from "../../../typechain-types";

export interface ContractState {
    activatedChainConfig?: ChainConfiguration;
    activatedAccountAddress?: string;
    signer?: providers.JsonRpcSigner;
    loading?: boolean;

    depositTokenContract?: C2NToken;
    earnedContract?: C2NToken;
    stakingContract?: C2NFarming;
    saleContract?: Contract;
}

const initialState: ContractState = {
    activatedChainConfig: undefined,
    activatedAccountAddress: undefined,
    signer: undefined,
    loading: false,

    depositTokenContract: undefined,
    earnedContract: undefined,
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
        },
        setSigner: (state, action: PayloadAction<providers.JsonRpcSigner | undefined>) => {
            state.signer = action.payload;
        },
        setContract: (state, action: PayloadAction<Pick<ContractState, 'depositTokenContract' | 'earnedContract' | 'stakingContract' | 'saleContract'>>) => {
            Object.assign(state, action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { setActivatedChainConfig, setActivatedAccountAddress, setSigner, setContract, setLoading } = contractState.actions;

export default contractState.reducer;
