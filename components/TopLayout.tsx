import React, { useEffect, useState } from "react";
import { Button, Layout, Menu, Typography } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer } = Layout;

const TopLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Handles menu item click
  const onNavigate = (path: string) => {
    router.push(path);
  };

  // useEffect(() => {
  //   setCurrent(router.pathname.split("/")[1]);
  // }, [router.pathname]);

  // const [current, setCurrent] = useState(router.pathname.split("/")[1]);

  // console.log("%cTopLayout.tsx line:21 current", "color: #007acc;", current);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          selectedKeys={[router.pathname.split("/")[1]]}
          // activeKey={router.pathname.split("/")[1]}
        >
          {/* <Menu.Item key="home" onClick={() => onNavigate("/home")}>
            Home
          </Menu.Item> */}
          <Menu.Item key="editor" onClick={() => onNavigate("/editor")}>
            Editor
          </Menu.Item>
          <Menu.Item key="about" onClick={() => onNavigate("/about")}>
            About
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div
          className="site-layout-content"
          style={{ margin: "16px 0", minHeight: "calc(100vh - 60px)" }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Project LLMDetection Alpha ©{new Date().getFullYear()} Created by Team
      </Footer>
    </Layout>
  );
};

export default TopLayout;
