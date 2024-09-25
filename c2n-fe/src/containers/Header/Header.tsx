import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Layout, Row, Col, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

import LogoPNG from "@/assets/images/c2n_logo.png";
import { useResponsive } from "@/hooks/useResponsive";

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
      <ul className={isDesktopOrLaptop ? "flex justify-between items-center h-full" : ""}>
        {menus.map((menuItem, index) => {
          return (
            <div className="h-12 leading-[48px] text-left text-white cursor-pointer text-[18px] hover:text-[#ffb852]" key={index}>
              <Link href={menuItem.path}>
                <div
                  className={[
                    "w-[91px] h-[44px] border-2 border-transparent rounded-[25px] text-center leading-10 cursor-pointer transition-all duration-300 text-white hover:text-[#ffb852] hover:scale-105",
                    activeMenuKey === index ? "text-[#ffb852]" : "",
                  ].join(" ")}
                >
                  {menuItem.title}
                </div>
              </Link>
            </div>
          );
        })}
        <Button type="primary">Wallet Button</Button>
        {isDesktopOrLaptop ? <Button type="primary">Network Button</Button> : null}
      </ul>
    );
  };
  /************************************************* 菜单渲染 ******************************************************/

  const { isDesktopOrLaptop } = useResponsive();

  return (
    <Layout.Header className="!h-[--header-height]">
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
                <MenuOutlined className=" text-[0.36rem]"></MenuOutlined>
              </Row>
              <Layout.Sider></Layout.Sider>
              <div className="fixed top-0 right-0 bottom-0 left-0"></div>
            </>
          )}
        </Col>
      </Row>
    </Layout.Header>
  );
}
