import { useAppSelector } from "@/redux/store"
import { Contract } from "ethers";

import { AIRDROP_CONTRACT } from "@/config";
import AirdropABI from '@/utils/abi/C2NAirdrop.json'
import type { C2NAirdrop } from "../../typechain-types";

export const useAirdropContract = () => {
    const signer = useAppSelector(state => state.contract.signer)
    const activatedAccountAddress = useAppSelector(state => state.contract.activatedAccountAddress)

    if (!signer || !activatedAccountAddress) {
        console.log('---no signer ');
    }

    const airdropContract = new Contract(AIRDROP_CONTRACT, AirdropABI.abi, signer) as unknown as C2NAirdrop

    return { airdropContract }
}