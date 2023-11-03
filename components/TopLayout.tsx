import React from "react";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Typography,
} from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const TopLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical" />
        <Header className="text-white">
          <div className="flex flex-row items-center space-x-3">
            <img
              className="rounded-lg"
              src="/naunidh.jpeg"
              alt="john"
              height="40"
            />
            <div className="w-full">Naunidh</div>
          </div>
        </Header>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="dashboard" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Menu.Item>
          <Menu.SubMenu key="workflow" title="Workflow">
            <Menu.Item
              key="createNew"
              onClick={() => router.push("/workflow/createNew")}
            >
              Create New
            </Menu.Item>
            <Menu.Item
              key="saved"
              onClick={() => router.push("/workflow/saved")}
            >
              Saved
            </Menu.Item>
          </Menu.SubMenu>

          <Menu.Item
            key="marketplace"
            onClick={() => router.push("/marketplace")}
          >
            Marketplace
          </Menu.Item>

          <Menu.Item
            key="integrations"
            onClick={() => router.push("/integrations")}
          >
            Integrations
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ minHeight: "calc(100vh - 80px)" }}>{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Tetrix</Footer>
      </Layout>
      <div className="absolute bottom-0 right-0 mr-3 mb-3 rounded-xl bg-white p-2 flex flex-col">
        <img src="/chatb.png" alt="chatb.png" height="40" />
        Ask me
      </div>
    </Layout>
  );
};

export default TopLayout;
