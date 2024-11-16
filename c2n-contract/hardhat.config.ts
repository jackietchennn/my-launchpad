import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

import { Network } from "./scripts/typings/context";

const config: HardhatUserConfig = {
    solidity: "0.8.24",

    networks: {
        hardhat: {
            chainId: 31337,
        },
        [Network.local]: {
            url: "http://127.0.0.1:8545",
            accounts: [process.env.LOCAL_PRIVATE_KEY!],
        },
        [Network.sepolia]: {
            url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
            accounts: [process.env.PRIVATE_KEY!],
        },
    },
};

export default config;
