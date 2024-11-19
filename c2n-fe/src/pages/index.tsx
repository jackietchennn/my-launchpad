import { useMemo } from "react";

import { useResponsive } from "@/hooks/useResponsive";
import { useWallet } from "@/hooks/useWallets";
import HomeBanner from "@/containers/HomeBanner/HomeBanner";
import { Col, Row } from "antd";
import Link from "next/link";
import index1BgPNG from "@/assets/images/index_1_bg.png";
import bannerJPEG from '@/assets/images/banner.jpeg'

export default function Home() {
    const { isDesktopOrLaptop } = useResponsive();
    const { activatedAccountAddress, walletModalVisible } = useWallet();

    const section1 = useMemo(() => {
        return (
            <section className="relative bg-black pt-[1px] pb-[50px] overflow-y-visible">
                <div className="w-full h-full absolute -z-[999] bg-center bg-repeat-x" style={{ backgroundImage: `url(${index1BgPNG.src})` }}></div>
                <div className="main-content pt-[10px] pb-[100px] m-auto relative overflow-hidden desktop:w-[1220px]">
                    <HomeBanner></HomeBanner>
                    <Row>
                        <Col span={isDesktopOrLaptop ? 18 : 24}>
                            <h1 className="title text-[46px] text-white font-['LucidaGrande-Bold, Roboto']">
                                C2N: Fundraising platform
                                <br />
                                on Sepolia
                            </h1>
                            <div className="sec-1 desc text-[20px] mt-[23px] leading-[40px]">
                                C2N is the first exclusive launchpad for decentralized fundraising
                                <br />
                                offering the hottest and innovative projects in
                                <br />a fair, secure, and efficient way.
                            </div>
                            <Link href="/stake" passHref>
                                <div className="button mt-[30px] text-[22px] w-[254px] h-[54px] rounded-lg bg-[#ffb852] text-black text-center leading-[54px] hover:bg-[#3eeb7a]">Stake</div>
                            </Link>
                        </Col>
                        <Col span={isDesktopOrLaptop ? 6 : 0}>
                            {isDesktopOrLaptop ? (
                                <div className="w-[486px] h-[396px] absolute right-0 top-[10%] bg-no-repeat bg-center bg-cover" style={{ backgroundImage: `url(${bannerJPEG.src})`}}></div>
                            ) : (
                                <></>
                            )}
                        </Col>
                    </Row>
                </div>
                <style lang="scss">{`
                  .sec-1 {
                    position: relative;
                    background-color: #000000;
                  }
                  .sec-1 h1 {
                    font-size: 46px;
                    color: #ffffff;
                  }
                  .sec-1 .main-content {
                    padding-top: 10px;
                    padding-bottom: 100px;
                  }
                  .sec-1 .desc {
                    margin-top: 23px;
                    line-height: 40px;
                    font-size: 20px;
                  }
                  .sec-1 .button {
                    margin-top: 30px;
                    font-size: 22px;
                  }
                  .sec-1 .medias {
                    margin-top: 28px;
                  }
                  .sec-1 .circle {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    background-color: transparent;
                    border-radius: 50%;
                    margin-right: 10px;
                    cursor: pointer;
                    text-align: center;
                    line-height: 40px;
                  }
                  .sec-1 .circle:hover {
                    filter: brightness(0.5);
                  }
                  .sec-1 .medias i.icon {
                  }
                  .sec-1 .extra {
                    margin-top: 115px;
                  }
                  .sec-1 .extra .icon {
                    display: inline-block;
                    margin-left: 38px;
                    margin-right: 12px;
                    vertical-align: middle;
                  }
                  @media (max-width: 769px) {
                    .sec-1 .main-content {
                      padding-top: 50px;
                    }
                  }
                `}</style>
            </section>
        );
    }, [isDesktopOrLaptop]);

    return (
        <main className="relative z-0 text-[#dbdbdb] min-h-[100vh]" style={{ backgroundImage: "linear-gradient(180deg, #052c12 0%, #000000 73%)" }}>
            {section1}
        </main>
    );
}
