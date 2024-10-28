import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Row, Col, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import LogoPNG from "@/assets/images/c2n_logo.png";
import { useResponsive } from "@/hooks/useResponsive";
import WalletModal from '@/containers/WalletModal/WalletModal'
import WalletButton from "@/components/elements/WalletButton";

// menu
const menus = [
  { title: "Home", path: "/" },
  { title: "Farm", path: "/farming" },
  { title: "Projects", path: "/project" },
  { title: "Stake", path: "/stake" },
];

export default function AppHeader() {
  /************************************************* 菜单渲染 ******************************************************/
  const router = useRouter();
  const activeMenuKey = useMemo(() => {
    return menus.map((menuItem) => menuItem.path).indexOf(router.pathname);
  }, [router]);

  const MenuRender: React.FC = () => {
    return (
      <ul className={isDesktopOrLaptop ? "flex justify-between items-center h-full" : "bg-[#000] border-2 border-[#FFB85280]"}>
        {menus.map((menuItem, index) => {
          return (
            <div className="h-12 leading-[48px] text-left text-white cursor-pointer text-[18px] hover:text-[#ffb852]" key={index}>
              <Link href={menuItem.path}>
                <div
                  className={[
                    "h-[44px] border-2 border-transparent rounded-[25px] leading-10 cursor-pointer transition-all duration-300 hover:text-[#ffb852] desktop:w-[91px] desktop:text-center desktop:hover:scale-105",
                    activeMenuKey === index ? "text-[#ffb852]" : "text-white",
                  ].join(" ")}
                >
                  {menuItem.title}
                </div>
              </Link>
            </div>
          );
        })}
        <WalletButton className={!isDesktopOrLaptop ? "ml-[14px]" : ""}></WalletButton>
        {isDesktopOrLaptop ? <Button type="primary">Network Button</Button> : null}
      </ul>
    );
  };
  /************************************************* 菜单渲染 ******************************************************/

  const [showSlider, setShowSlider] = useState<boolean>(false)
  const { isDesktopOrLaptop } = useResponsive();

  return (
    <>
      <Layout.Header className="!h-[--header-height] !px-[15px] desktop:!p-0 !bg-[#000]">
        <Row className="desktop:w-[1220px] m-auto">
          <Col span={6}>
            <Link href="/">
              <div className="cursor-pointer w-[150px] h-[var(--header-height)] bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${LogoPNG.src})` }}></div>
            </Link>
          </Col>
          <Col span={isDesktopOrLaptop ? 18 : 4} offset={isDesktopOrLaptop ? 0 : 14}>
            {isDesktopOrLaptop ? (
              <MenuRender></MenuRender>
            ) : (
              <>
                <Row justify="end" align="middle" className="w-full h-full">
                  <MenuOutlined className="!text-white text-[28.8px]" onClick={() => setShowSlider(!showSlider)}></MenuOutlined>
                </Row>
                <Layout.Sider collapsed={!showSlider} collapsedWidth={0} theme="light" className="!fixed right-0 indent-[1em] z-[100]" onClick={() => setShowSlider(!showSlider)}>
                  <MenuRender></MenuRender>
                </Layout.Sider>
                <div className="fixed top-0 right-0 bottom-0 left-0" style={{ display: showSlider ? 'block' : 'none' }} onClick={() => setShowSlider(!showSlider)}></div>
              </>
            )}
          </Col>
        </Row>
      </Layout.Header>
      <WalletModal></WalletModal>
    </>
  );
}
