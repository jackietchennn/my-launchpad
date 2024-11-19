import { useAppSelector } from "@/redux/store"
import { Contract } from "ethers";

import { AIRDROP_CONTRACT } from "@/config";
import AirdropAbi from '@/utils/abi/C2NAirdrop.json'

export const useAirdropContract = () => {
    const signer = useAppSelector(state => state.contract.signer)
    const activatedAccountAddress = useAppSelector(state => state.contract.activatedAccountAddress)

    if (!signer || !activatedAccountAddress) {
        console.log('---no signer ');
    }

    const airdropContract = new Contract(AIRDROP_CONTRACT, AirdropAbi.abi, signer)

    return { airdropContract }
}