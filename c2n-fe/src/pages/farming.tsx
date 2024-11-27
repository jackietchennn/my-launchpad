import { Col, Row } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { noop } from "antd/es/_util/warning";

import { farmConfiguration } from "@/config/farms";
import { useStakeOperationInEther } from "@/hooks/useStakeOperation";
import { useWallet } from "@/hooks/useWallets";
import { useResponsive } from "@/hooks/useResponsive";

export default function Farming() {
    const { isDesktopOrLaptop } = useResponsive()
    const {} = useWallet();
    const {} = useStakeOperationInEther();

    return (
        <main className="container">
            <section className="intro main-content">
                <h2 className="stake-title mb-[20px]">
                    <Row justify="space-between" align="middle">
                        <Col>
                            <span className="text-white mt-0 w-full text-[40px]">Yield Farms</span>
                        </Col>
                        <Col>
                            <span className="text-[16px] align-middle flex items-center">
                                <QuestionCircleOutlined className="mr-[2.8px] align-middle text-[36px]" />
                                See Tutorial: &nbsp;
                                <span className="link text-[#ffb852] cursor-pointer hover:underline" onClick={noop}>
                                    {`${isDesktopOrLaptop ? "C2N Farm Tutorial" : "Tutorial"} `}
                                </span>
                            </span>
                        </Col>
                    </Row>
                </h2>
                <h3 className="stake-subtitle">Yield Farms allow users to earn Reward token while supporting C2N by staking LP Tokens.</h3>
            </section>
            <section className="staking">
                <div className="main-content">
                    <Row gutter={32}>
                        {farmConfiguration.map((conf, index) => {
                            return (
                                <Col span={isDesktopOrLaptop ? 8 : 24} key={index}>
                                    
                                </Col>
                            )
                        })}
                    </Row>
                </div>
            </section>
        </main>
    );
}
