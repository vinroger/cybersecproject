import React from "react";
import { Button, Layout, Menu, Typography } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer } = Layout;

const TopLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Handles menu item click
  const onNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
          <Menu.Item key="home" onClick={() => onNavigate("/home")}>
            Home
          </Menu.Item>
          <Menu.Item key="editor" onClick={() => onNavigate("/editor")}>
            Editor
          </Menu.Item>
          <Menu.Item key="layout" onClick={() => onNavigate("/about")}>
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
