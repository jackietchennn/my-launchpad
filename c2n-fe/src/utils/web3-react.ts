// import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
import { ConnectorEnum } from "@/types/connector";
import { CHAIN_ID } from "@/config/constants/network";
import { getChainRPCRandom } from "@/utils";

/** Injected Connector */
const injectedConnector = new InjectedConnector({});
/** Walletconnect Connector */
const walletConnectConnector = new WalletConnectConnector({
  rpc: {
    [CHAIN_ID]: getChainRPCRandom(),
  },
  qrcode: true,
});
/** BinanceChain Connector */
const bscConnector = new BscConnector({});

export const connectorTypeMap = {
  [ConnectorEnum.Injected]: injectedConnector,
  [ConnectorEnum.Walletconnect]: walletConnectConnector,
  [ConnectorEnum.BSC]: bscConnector,
};
