import { useCallback, useEffect } from "react";
import { message } from "antd";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect, WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { NoBscProviderError } from "@binance-chain/bsc-connector";

import { connectorTypeMap, setupFallbackChain } from "@/utils";
import { autoConnectLocalStorageKey, connectorLocalStorageKey, ConnectorNames } from "@/types/Connecter";
import { useAppDispatch } from "@/redux/store";
import { setIsWalletInstalled } from "@/redux/modules/wallet";

export const checkMetaMask = () => !!window?.ethereum?.isMetaMask

export const useAuth = () => {
  /** get web3 information from `useWeb3React` hook */
  const {
    /** chainId */
    chainId,
    /** account address */
    account,
    /** active status */
    active,

    /** the method try to login wallet connector */
    activate,
    /** the metohd try to logout wallet connector */
    deactivate,
  } = useWeb3React();
  const dispatch = useAppDispatch()

  // activate wallet by connector
  const login = useCallback((connectorId: ConnectorNames) => {
    const connector = connectorTypeMap[connectorId];

    // check MetaMask existiing
    if (!checkMetaMask()) {
      dispatch(setIsWalletInstalled(false)); 
      message.error('Please Install MetaMask!');
      return false;
    } else {
      dispatch(setIsWalletInstalled(true));
    }

    // check Connector existing
    if (!connector) {
      message.error(`The connector config of ${connectorId} is wrong.`);
      return false;
    }

    activate(connector, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        // no available chain
        const support = await setupFallbackChain();
        support && activate(connector);
      } else if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
        // no available provider
        message.error("no provider was found");
      } else if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) {
        // user rejected
        if (connector instanceof WalletConnectConnector) {
          connector.walletConnectProvider = undefined;
        }
        message.error("Please authorize to access your account");
      } else {
        // other
        message.error(error.message);
      }
    }).then(() => {
      localStorage.setItem(autoConnectLocalStorageKey, '1');
    });
  }, [activate]);

  // deactivate wallet by removing connector's event
  const logout = useCallback(() => {
    deactivate();
  }, [deactivate]);

  // try to get wallet information when mounted
  useEffect(() => {
    const autoConnect = localStorage.getItem(autoConnectLocalStorageKey)
    const connectorId = localStorage.getItem(connectorLocalStorageKey) as ConnectorNames

    if (autoConnect && connectorId) {
      localStorage.removeItem(autoConnect)
      login(connectorId)
    }
  }, [])

  return {
    chainId,
    account,
    active,

    login,
    logout,
  };
};
