import { useMemo } from "react";
import { Col, message, Row } from "antd";

import { useResponsive } from "@/hooks/useResponsive";
import { tokenInfos } from "@/config";
import { IconC2N } from "@/components/Icons";
import { useWallet } from "@/hooks/useWallets";
import { CopyOutlined } from "@ant-design/icons";
import { noop } from "antd/es/_util/warning";
import { useAirdropContract } from "@/hooks/useAirdropContract";
import { to } from "@/utils";

const HomeBanner = () => {
    const { isDesktopOrLaptop } = useResponsive();
    const { activatedChainConfig, activatedAccountAddress } = useWallet();
    const { airdropContract } = useAirdropContract();

    const token = useMemo(() => {
        return tokenInfos.find((tokenItem) => tokenItem.chainId === activatedChainConfig?.chainId) ?? tokenInfos[0];
    }, [activatedChainConfig]);

    const triggerTokenClaim = async () => {
        if (!airdropContract || !activatedAccountAddress) {
            message.warning("connect wallet first");
        }
        try {
            const res = await airdropContract.withdrawTokens();
            console.log(res, "re");
        } catch (error: any) {
            message.error(error.reason || error?.data?.message || error?.message || "claim failed");
        }
    };
    const triggerTokenAdd = async () => {
        if (!activatedChainConfig) {
            message.error("connect wallet and try again!");
            return;
        }

        if (activatedChainConfig.chainId !== token.chainId) {
            message.error("switch network and try again!");
            return;
        }

        const [watchErr] = await to(
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: token.address,
                        symbol: token.symbol,
                        decimals: 18,
                        image: '',
                    }
                },
            })
        );

        if (watchErr) {
            message.error(watchErr.message);
        }
    };
    const operations = [
        {
            btnText: `Claim ${token.symbol}`,
            btnClick: triggerTokenClaim,
        },
        {
            btnText: `Add ${token.symbol} To Wallet`,
            btnClick: triggerTokenAdd,
        },
    ];

    return (
        <div className="w-full min-h-[120px] p-[10px] rounded-2xl border-2 border-[#ffb852] bg-black desktop:rounded-[80px]">
            <Row justify="space-between" align="middle" className="min-h-[120px] px-[14px] py-[2.8px] desktop:px-[42px]">
                <Col span={isDesktopOrLaptop ? 16 : 24}>
                    <Row gutter={16}>
                        <Col span={isDesktopOrLaptop ? 4 : 24}>
                            <IconC2N className="shrink-0 box-border w-[100px] h-[100px]" />
                        </Col>
                        <Col span={isDesktopOrLaptop ? 20 : 24}>
                            <Row>
                                <Col span={24} className="box-border m-0 min-w-0 font-bold text-[28px] leading-10 mt-[7px] desktop:!text-[32px]">
                                    {token.symbol} Token Online Now!
                                </Col>
                                <Col className="mt-[7px] break-all">
                                    Contract Address: &nbsp;
                                    {isDesktopOrLaptop ? <></> : <br />}
                                    {token.address}&nbsp;
                                    <CopyOutlined className="hover:text-[#ffb852]" onClick={noop}></CopyOutlined>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                {operations.map((opt, index) => (
                    <Col span={isDesktopOrLaptop ? 4 : 12} key={index}>
                        <div
                            className="box-border mt-[7px] min-w-0 appearance-none inline-block text-center text-black rounded-[30px] font-medium cursor-pointer text-[18px] w-full h-[56px] leading-[56px] hover:brightness-110 hover:shadow-[5px,5px,50px,10px,#d7ff1e11] desktop:w-[160px] desktop:m-0"
                            style={{ backgroundImage: "linear-gradient(179deg, #d7ff1e 0%, #ffb852 100%)" }}
                            onClick={opt.btnClick}
                        >
                            {opt.btnText}
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomeBanner;
