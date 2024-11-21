// import { providers } from "ethers";

interface NativeCurrency {
  /**
   * 加密货币名称
   */
  name: string;
  /**
   * 加密货币标识（单位）
   */
  symbol: string;
  /**
   * 加密货币精度
   * @example
   *  1ETH = Math.pow(10, 18)
   */
  decimals: number;
}

interface AddEthereumChainParameter {
  /**
   * chain id
   */
  chainId: string;
  /**
   * array of blockchain explorer url
   */
  blockExplorerUrls?: string[];
  /**
   * chain name
   */
  chainName?: string;
  /**
   * array of chain icon
   */
  iconUrls?: string[];
  /**
   * native currency of chain
   */
  nativeCurrency?: NativeCurrency;
  /**
   * array of chain's json-rpc url
   */
  rpcUrls?: string[];
}

declare namespace IEthereum {
  enum RequestMethod {
    /**
     * add new chain to metamask
     */
    addEthereumChain = "wallet_addEthereumChain",
    /**
     * switch chain
     */
    switchEthereumChain = 'wallet_switchEthereumChain',
  }

  interface RequestParameter<T> {
    method: ProviderRequestMethod;
    params: T;
  }

  interface Ethereum {
    request: <T>(param: RequestParameter<T>) => Promise<Error | null>;
    isMetaMask: boolean
  }
}

declare interface Window {
  ethereum: IEthereum.Ethereum;
  // ethereum: providers.Web3Provider;
  MSStream: Record<string, any>;
}
