import { IconEth,IconAppLogo } from "@/components/Icons";

export const validChains = [
    {
        name: "Sepolia",
        chainId: 11155111,
        logo: IconEth,
        shortName: "sepolia",
        networkId: 11155111,
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpc: ["https://rpc.sepolia.org"],
        faucets: [],
        infoURL: "https://www.sepolia.io",
    },
    {
        name: "Localhost",
        chainId: 31337,
        logo: IconAppLogo,
        shortName: "localhost",
        networkId: 31337,
        nativeCurrency: {
            name: "GO",
            symbol: "GO",
            decimals: 18,
        },
        rpc: ["http://localhost:8545"],
        faucets: [],
        infoURL: "http://localhost:8545",
    },
    {
        name: "Arbitrum Sepolia",
        chainId: 421614,
        logo: IconEth,
        shortName: "arb-sepolia",
        networkId: 421614,
        nativeCurrency: {
            name: "Arbitrum Rinkeby Ether",
            symbol: "ARETH",
            decimals: 18,
        },
        rpc: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
        faucets: [],
        infoURL: "https://sepolia-explorer.arbitrum.io",
    },
];
