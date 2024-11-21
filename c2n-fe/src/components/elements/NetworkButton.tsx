import { validChains } from "@/config/validChains";
import { useWallet } from "@/hooks/useWallets";
import { ComponentBaseProps } from "@/types/i-base";
import { mergeClassName } from "@/utils/shared";
import { Dropdown, MenuProps } from "antd";
import { useMemo } from "react";
import { IconDown } from "../Icons";

// activatedAccountAddress 不存在，不显示网络信息
// activatedAccountAddress 存在
// 显示区块链logo（无则显示默认样式）
// 显示区块链名称（无则显示切换网络文案）
// 显示下拉Icon

interface NetworkButton extends ComponentBaseProps {}

export default function NetworkButton(props: NetworkButton) {
    const { activatedAccountAddress, activatedChainConfig, switchNetwork } = useWallet();

    // 菜单数据
    const menus: MenuProps["items"] = useMemo(() => {
        return validChains.map((chain, index) => {
            return {
                key: index,
                label: (
                    <div
                        key={chain.chainId}
                        className={[
                            "w-full h-[64px] leading-[64px] text-left text-[#000] cursor-pointer text-[18px] hover:text-[#ffb852] font-['PingfangSC','Roboto']",
                            chain.chainId === activatedChainConfig?.chainId ? "text-[#ffb852] !cursor-not-allowed" : "",
                        ].join(" ")}
                        onClick={() => switchNetwork(chain.chainId)}
                    >
                        <chain.logo className="inline-block mx-[9px] align-middle"></chain.logo>
                        <div className="inline-block text-ellipsis overflow-hidden whitespace-nowrap break-words text-left align-middle">{chain.name}</div>
                    </div>
                ),
            };
        });
    }, [activatedChainConfig, switchNetwork]);

    // 已激活区块链信息
    const activatedValidChain = useMemo(() => {
        return validChains.find((chain) => chain.chainId === activatedChainConfig?.chainId);
    }, [activatedChainConfig]);

    return (
        <Dropdown menu={{ items: menus }}>
            {activatedAccountAddress ? (
                <div
                    className={mergeClassName([
                        "w-[248px] h-12 rounded-[5px] relative z-[100] text-left cursor-pointer whitespace-nowrap font-['PingfangSC','Roboto'] leading-[48px] text-[18px] flex items-center gap-[10px] pl-[10px] hover:font-medium hover:filter-[brightness(1.1)] hover:shadow-[5px,5px,50px,10px,#d7ff1e11]",
                        props.className,
                    ])}
                    style={{ backgroundImage: 'linear-gradient(179deg, #d7ff1e 0%, #ffb852 100%)' }}
                >
                    {/* logo */}
                    {activatedValidChain?.logo ? <activatedValidChain.logo></activatedValidChain.logo> : <div className="inline-block mx-[9px] align-middle"></div>}
                    {/* name */}
                    <div className="inline-block text-ellipsis overflow-hidden whitespace-nowrap break-words text-left align-middle">{activatedValidChain?.name ?? "Switch Network"}</div>
                    {/* icon */}
                    <IconDown className="absolute right-[7px] top-1/2 translate-y-[-30%] text-white"></IconDown>
                </div>
            ) : (
                <div />
            )}
        </Dropdown>
    );
}
