// 引入 hardhat 工具对象
// 声明代币名称、代币标识、代币精度
// 获取代币合约 artifact，返回合约工程实例（合约部署实例）
// 调用部署实例 `deploy` 方法，向指定区块链网络部署代币合约
// 调用代币合约的 `deploy` 方法，等待验证是否部署完成
// 存储已部署的代币合约地址在文件中

import hre from "hardhat";

import { ContractName, Network } from "../typings/context";
import { saveContractAddress } from "../shared/utils";

const contractDeploy = async () => {
    const tokenName = "C2N";
    const symbol = "C2N";
    const decimal = 18;

    const tokenFactory = await hre.ethers.getContractFactory(ContractName.C2NToken);
    const tokenContract = await tokenFactory.deploy(
        tokenName,
        symbol,
        decimal,
        hre.ethers.parseUnits("1000000000", 18)
    );
    await tokenContract.waitForDeployment();
    const tokenContractAddress = await tokenContract.getAddress();

    console.log("---C2N deploy to: ", tokenContractAddress);
    saveContractAddress(hre.network.name as Network, ContractName.C2NToken, tokenContractAddress);
};

contractDeploy()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
