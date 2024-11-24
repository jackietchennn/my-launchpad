import { usePageLoading } from "@/hooks/usePageLoading";
import { useResponsive } from "@/hooks/useResponsive";
import { ComponentBaseProps } from "@/types/i-base";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Col, Row } from "antd";
import { noop } from "antd/es/_util/warning";
import { CarouselRef } from "antd/es/carousel";
import { useRef } from "react";

export interface StakingFormProps extends ComponentBaseProps {
    poolId?: number;
    available?: boolean;
}

const TierCard = (props: { data?: string[] }) => {
    const data = props.data ?? [];

    return (
        <div className="tier-card tier-card">
            <div className="wrapper">
                <Row justify="center" className="tier-title">{data[0] || ""}</Row>
                <Row justify="center" className="tier-label">Staking Requirement</Row>
                <Row justify="center" className="tier-value-large">{data[1] || ""}</Row>
                <Row justify="center" className="tier-label">Whitelist Requirement Twitter</Row>
                <Row justify="center" className="tier-value-small">Like, Comment & Retweet</Row>
                <Row justify="center" className="tier-label">Guaranteed Allocation</Row>
                <Row justify="center" className="tier-value-small">Yes</Row>
                <Row justify="center" className="tier-label">Allocation Weight</Row>
                <Row justify="center" className="tier-value-medium">{data[2] || ""}</Row>
            </div>
        </div>
    );
};

const StakingForm = () => {
    const { isDesktopOrLaptop } = useResponsive();
    const { PageLoader } = usePageLoading();

    const carouselRef = useRef<CarouselRef>(null);

    return (
        <PageLoader>
            <div className="staking-form">
                {/* deposit form */}
                <section className="staking-token">
                    <Row gutter={[16, 16]} justify="space-between">
                        <Col span={isDesktopOrLaptop ? 12 : 24} className="left">
                            <h2 className="title">
                              <i className="icon icon-stake-3"></i>
                              <span className="ml-[10px]">Stake {"TODO"}</span>
                            </h2>
                            <Row gutter={[16, 16]} justify="space-between">
                              <Col span={isDesktopOrLaptop ? 12 : 24}>
                                <Row justify="space-between">
                                  <div className="balance">
                                    {/* Balance: {stakingContract} */}
                                  </div>
                                  <div className="max" onClick={noop}></div>
                                </Row>
                              </Col>
                            </Row>
                            <Row gutter={[16, 16]} justify="space-between"></Row>
                        </Col>
                        <Col span={isDesktopOrLaptop ? 12 : 24} className="right">
                            <Carousel ref={carouselRef} dots={false} className="slider" autoplay>
                                {[
                                    ["Tier One", "1-5,000", "1"],
                                    ["Tier Two", "5,001-25,000", "2"],
                                    ["Tier Three", "25,001-50,000", "3"],
                                    ["Tier Four", "50,001-100,000", "4"],
                                    ["Tier Five", "More than 100,000", "5"],
                                ].map((data, index) => <TierCard data={data} key={index}></TierCard>)}
                            </Carousel>
                        </Col>
                    </Row>
                </section>
                <LeftOutlined className="tier-left-arrow" onClick={() => carouselRef.current?.prev()} />
                <RightOutlined className="tier-right-arrow" onClick={() => carouselRef.current?.next()} />
                
                {/* desport stats */}
                <section className="staking-stats"></section>
            </div>
        </PageLoader>
    );
};

export default StakingForm;
