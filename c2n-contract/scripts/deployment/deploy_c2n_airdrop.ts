import hre from "hardhat";

import { ContractName, Network } from "../typings/context";
import { getSavedContractAddresses, saveContractAddress } from "../shared/utils";

const airdropDeploy = async () => {
    const tokenAddress = getSavedContractAddresses()[hre.network.name][ContractName.C2NToken];
    const airdropFactory = await hre.ethers.getContractFactory(ContractName.C2NAirdrop);
    const airdropContract = await airdropFactory.deploy(tokenAddress);
    await airdropContract.waitForDeployment();
    const airdropContractAddress = await airdropContract.getAddress();
    saveContractAddress(
        hre.network.name as Network,
        ContractName.C2NAirdrop,
        airdropContractAddress
    );

    // 空投代币补充
    const tokenContract = await hre.ethers.getContractAt(ContractName.C2NToken, tokenAddress);
    let tx = await tokenContract.transfer(airdropContractAddress, hre.ethers.parseEther("10000"));
    await tx.wait();
    const airdropBalance = await tokenContract.balanceOf(airdropContractAddress);
    console.log("---Airdrop balance of C2N token: ", hre.ethers.formatEther(airdropBalance));

    // 空投代币提款
    tx = await airdropContract.withdrawTokens();
    await tx.wait();
    const airdropBalanceAfter = await tokenContract.balanceOf(airdropContractAddress);
    console.log(
        "---Airdrop balance of C2N token after withdrawTokens: ",
        hre.ethers.formatEther(airdropBalanceAfter)
    );
};

airdropDeploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
