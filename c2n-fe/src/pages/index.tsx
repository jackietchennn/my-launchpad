// import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@/hooks/useWallets";

export default function Home() {
    // const { account, chainId, active } = useWeb3React()
    // return <h1>{account} | {chainId} | {active ? 'true' : 'false'}</h1>;

    const { activatedAccountAddress, walletModalVisible } = useWallet();

    return (
      <>
        <h1 className="text-3xl font-semibold text-[green]">是否可见：{walletModalVisible ? 'true' : 'false'}</h1>
        <h1 className="text-3xl font-semibold text-[green]">账户地址：{activatedAccountAddress}</h1>
      </>
    )
}
