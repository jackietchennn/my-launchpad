import { usePageLoading } from "@/hooks/usePageLoading";
import { useResponsive } from "@/hooks/useResponsive";
import { ComponentBaseProps } from "@/types/i-base"
import { Col, Row } from "antd";

export interface StakingFormProps extends ComponentBaseProps {
  poolId?: number;
  available?: boolean;
}

const StakingForm = () => {

  const { isDesktopOrLaptop } = useResponsive()
  const { PageLoader } = usePageLoading()

  return (
    <PageLoader>
      <div className="staking-form">
        <section className="staking-token">
          <Row gutter={[16, 16]} justify="space-between">
            <Col span={isDesktopOrLaptop ? 12 : 24} className="left">
              <i className="icon icon-stake-3"></i>
              <span className="ml-[10px]">Stake {"TODO"}</span>
            </Col>
            <Col span={isDesktopOrLaptop ? 12 : 24} className="right"></Col>
          </Row>
        </section>
        <section className="staking-stats"></section>
      </div>
    </PageLoader>
  )
}

export default StakingForm
