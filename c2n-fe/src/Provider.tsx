import { Provider } from "react-redux";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import store from "@/redux/store";
import React from "react";

const POLLING_INTERVAL = 12000;
const getLibrary = (provider?: any): Web3Provider => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

export default function RootProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>{children}</Provider>
    </Web3ReactProvider>
  );
}
