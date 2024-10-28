export interface Configuration {
  /**
   * 区块链名称
   */
  name: string;
  /**
   * 区块链ID
   */
  chainId: number;
  /**
   * 区块链简名
   */
  shortName: string;
  /**
   * 区块链网络ID
   */
  networkId: number;
  /**
   * 区块链原生加密货币
   */
  nativeCurrency: NativeCurrency;
  /**
   * 区块链网络RPC协议地址
   */
  rpc: string[];
  faucets: string[];
  /**
   * 区块链网络网站地址
   */
  infoURL: string;
}
