import React, { useState } from 'react';
import { useLoaderData, Outlet, Link, redirect, useLocation } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Modal } from 'antd';
import {
  FolderViewOutlined,
  AlertOutlined,
  AreaChartOutlined,
  ContainerOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { getUser } from '../utils/fetchData.js';

export async function loader() {
  try {
    const jwt = localStorage.getItem('jwt');
    const userRes = await getUser(jwt);
    const { user } = userRes.data;
    return user;
  } catch (err) {
    alert('Please sign in first');
    return redirect('/signin');
  }
}

function getItem(key, icon, label) {
  const iconWithClass = React.cloneElement(icon, {
    className: '!text-xl mr-3',
  });
  return {
    key,
    icon: iconWithClass,
    label,
  };
}

const items = [
  getItem('1', <ContainerOutlined />, <Link to="/issues">Issues</Link>),
  getItem('2', <FolderViewOutlined />, <Link to="/projects">Projects</Link>),
  getItem('3', <AreaChartOutlined />, <Link to="/stats">Stat</Link>),
  getItem('4', <AlertOutlined />, <Link to="/alerts">Alerts</Link>),
  getItem('5', <SettingOutlined />, <Link to="/settings">Setting</Link>),
];
const { Sider } = Layout;

export default function Root() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = useLoaderData();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const selectedKey =
    items.find(item => location.pathname.startsWith(item.label.props.to))?.key || '1';
  return (
    <Layout hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={toggleCollapsed}
        style={{
          overflow: 'auto',
          minHeight: '100vh',
          // position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Avatar
          shape="square"
          size={48}
          onClick={showModal}
          className="bg-[#fde3cf] text-[#f56a00] ml-4 my-5 font-medium !text-[30px] cursor-pointer"
        >
          {user.first_name[0]}
        </Avatar>
        <Modal title="User Profile" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div className="flex flex-row">
            <span>Name: </span>
            <span>{`${user.first_name} ${user.second_name}`}</span>
          </div>
          <div className="flex flex-row">
            <span>Email: </span>
            <span>{user.email}</span>
          </div>
          <div className="flex flex-row">
            <span>User Key: </span>
            <span>{user.user_key}</span>
          </div>
        </Modal>
        <Menu
          className="!text-[16px]"
          theme="dark"
          mode="inline"
          defaultSelectedKeys={selectedKey}
          defaultOpenKeys={['sub1']}
          items={items}
        />
      </Sider>
      <Outlet />
    </Layout>
  );
}
