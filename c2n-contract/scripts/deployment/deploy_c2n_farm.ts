import hre from "hardhat";

import { ContractName, Network } from "../typings/context";
import { getSavedContractAddresses, saveContractAddress } from "../shared/utils";

const farmDeploy = async () => {
    // reward per second，即 报酬/秒
    const rewardPerSecond = "1";
    // 农场开启时间
    const startTimestamp = Number.parseInt(((Date.now() / 1000) + 900).toFixed(0));

    // 部署农场
    const tokenContractAddress =
        getSavedContractAddresses()[hre.network.name][ContractName.C2NToken];
    const contractDeploy = await hre.ethers.getContractFactory(ContractName.C2NFarming);
    const farmContract = await contractDeploy.deploy(
        tokenContractAddress,
        rewardPerSecond,
        startTimestamp
    );
    await farmContract.waitForDeployment();
    const farmContractAddress = await farmContract.getAddress();
    saveContractAddress(hre.network.name as Network, ContractName.C2NFarming, farmContractAddress);
    console.log("---Farm deploy to: ", farmContractAddress);

    // 农场募资
    const tokenContract = await hre.ethers.getContractAt(
        ContractName.C2NToken,
        tokenContractAddress
    );
    const approveTx = await tokenContract.approve(
        farmContractAddress,
        hre.ethers.parseEther("50000")
    );
    await approveTx.wait();
    const fundTx = await farmContract.fund(hre.ethers.parseEther("50000"));
    await fundTx.wait();
    const farmBalance = await tokenContract.balanceOf(farmContractAddress)
    console.log("---Farm fund success, balance: ", hre.ethers.formatEther(farmBalance));

    // 农场添加矿池代币
    const addTx = await farmContract.add(tokenContractAddress, 100, true);
    await addTx.wait();
    const poolLenTx = await farmContract.poolLength()
    console.log("---Farm add success, poolLen: ", poolLenTx);
    
};

farmDeploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
