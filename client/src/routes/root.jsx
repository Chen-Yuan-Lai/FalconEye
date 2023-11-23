import React, { useState } from "react";
import { useLoaderData, Outlet, useParams, redirect } from "react-router-dom";
import { Layout, Menu, theme, Button, Avatar } from "antd";
import {
  FolderViewOutlined,
  AlertOutlined,
  AreaChartOutlined,
  ContainerOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import { getUser } from "../utils/fetchData.js";

export async function loader() {
  try {
    const jwt = localStorage.getItem("jwt");
    const userRes = await getUser(jwt);
    const { user } = userRes.data;
    // const eventsRes = await getEvents(user.id);
    // const events = eventsRes.data.events || [];
    return user;
  } catch (err) {
    alert("Please sign in first");
    return redirect("/signin");
  }
}

function getItem(label, key, icon, children, type) {
  const iconWithClass = React.cloneElement(icon, {
    className: "!text-xl mr-3",
  });
  return {
    key,
    icon: iconWithClass,
    children,
    label,
    type,
  };
}

const items = [
  getItem("Issues", "1", <ContainerOutlined />),
  getItem("Projects", "2", <FolderViewOutlined />),
  getItem("Stat", "3", <AreaChartOutlined />),
  getItem("Alerts", "4", <AlertOutlined />),
  getItem("Setting", "5", <SettingOutlined />),
];

const { Sider } = Layout;

export default function Root() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const user = useLoaderData();
  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Avatar
          shape="square"
          size={48}
          className="bg-[#fde3cf] text-[#f56a00] ml-4 my-5 font-medium !text-[30px]"
        >
          {user.first_name[0]}
        </Avatar>
        <Menu
          className="!text-[16px]"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          items={items}
        />
      </Sider>
      <Outlet />
    </Layout>
  );
}
