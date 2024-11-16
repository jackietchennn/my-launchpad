import path from "path";
import { readFileSync, writeFileSync } from "fs";

import { Network } from "../typings/context";

export const readFileSyncWithErrorHanding = (filePath: string, encoding: BufferEncoding = "utf-8"): [Error | null, string | null] => {
    try {
        const data = readFileSync(filePath, encoding);
        return [null, data];
    } catch (error) {
        return [error as Error, null];
    }
};

export const getJSONConfiguration = (filePath: string, encoding: BufferEncoding = "utf-8"): Record<string, any> => {
    const [_, configuration] = readFileSyncWithErrorHanding(filePath, encoding);

    // 不管能否读取到文件，都会返回对象
    try {
        return JSON.parse(configuration ?? "{}");
    } catch {
        return {};
    }
};

const ConfPath = {
    contractAddress: () => path.join(__dirname, "../../deployments/contract-addresses.json"),
    contractABI: () => path.join(__dirname, `../../deployments/contract-abis.json`),
    proxyABI: () => path.join(__dirname, `../../deployments/proxy-abis.json`),
};

export const getSavedContractAddresses = () => getJSONConfiguration(ConfPath.contractAddress());

export const getSavedContractABI = () => getJSONConfiguration(ConfPath.contractABI());

export const getSavedProxyABI = () => getJSONConfiguration(ConfPath.proxyABI());

export const saveContractAbi = (network: string, contractName: string, contractAbi: string) => {
    const abis = getSavedContractABI();

    abis[network] = abis[network] || {};
    abis[network][contractName] = contractAbi;
    writeFileSync(ConfPath.contractABI(), JSON.stringify(abis, null, "    "));
};

export const saveContractAddress = (network: Network, contractName: string, contractAddress: string) => {
    const addrs = getSavedContractAddresses();

    addrs[network] = addrs[network] || {};
    addrs[network][contractName] = contractAddress;
    writeFileSync(ConfPath.contractAddress(), JSON.stringify(addrs, null, "    "));
};
