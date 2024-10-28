import { NoEthereumProviderError } from "@web3-react/injected-connector";

import { getChainConfiguration, to } from "@/utils";

/**
 * Prompt the user to add Boba as a network on Metamask，
 * or switch to Boba if the wallet is on a different network
 * @returns {boolean} true if the setup succeed, false otherwise
 */
export const setupFallbackChain = async () => {
  // get provider of metamask
  const provider = window.ethereum;

  if (!provider) {
    console.error(NoEthereumProviderError);
    return false;
  }

  // try to setup BSC network on metamask
  const { chainId, name, nativeCurrency, rpc: rpcs, infoURL } = getChainConfiguration();
  const [addChainErr] = await to(
    provider.request<AddEthereumChainParameter>({
      method: IEthereum.RequestMethod.addEthereumChain,
      params: {
        chainId: `0x${chainId.toString(16)}`,
        chainName: name,
        nativeCurrency: nativeCurrency,
        rpcUrls: rpcs,
        blockExplorerUrls: [infoURL],
      },
    })
  );

  if (addChainErr) {
    console.error(addChainErr);
    return false;
  }

  return true;
};
