import React, { useState } from "react";
import { useLoaderData, Outlet, useParams } from "react-router-dom";
import { Layout, Menu, theme, Button } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

// import { getCampaign, getProducts } from "../utils/fetchData.js";

export async function loader({ params }) {}

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Issue", "1", <UserOutlined />),
  getItem("Project", "2", <AppstoreOutlined />),
  getItem("Stat", "3", <BarChartOutlined />),
  getItem("Alert", "4", <UserOutlined />),
  getItem("Setting", "5", <TeamOutlined />),
];

const { Header, Content, Footer, Sider } = Layout;

export default function Root() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          defaultOpenKeys={["sub1"]}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            textAlign: "left",
          }}
        >
          <h1>Issue</h1>
        </Header>
        <Content
          style={{ margin: "24px 16px 0", background: colorBgContainer }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
            }}
          ></div>
          <p>long content</p>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
