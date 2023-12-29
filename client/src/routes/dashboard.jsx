import React, { useState } from 'react';
import { useLoaderData, Outlet, Link, redirect, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Avatar, Modal, Button } from 'antd';
import Swal from 'sweetalert2';
import {
  FolderViewOutlined,
  AlertOutlined,
  AreaChartOutlined,
  ContainerOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { getUser, getProjects } from '../utils/fetchData.js';

export async function loader() {
  try {
    const jwt = localStorage.getItem('jwt');
    const userRes = await getUser(jwt);
    const projectsRes = await getProjects(jwt);

    console.log(projectsRes);
    const { user } = userRes.data;
    const { data } = projectsRes;
    return { user, projects: data };
  } catch (err) {
    await Swal.fire({
      title: 'Error!',
      text: 'Please sign in first',
      icon: 'error',
      timer: 1500,
      position: 'top',
      showConfirmButton: false,
      toast: true,
    });
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
  // getItem('3', <AreaChartOutlined />, <Link to="/stats">Stat</Link>),
  getItem('4', <AlertOutlined />, <Link to="/alerts">Alerts</Link>),
];
const { Sider } = Layout;

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const data = useLoaderData();

  const user = data.user;
  const projects = data.projects;

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = async () => {
    setIsModalOpen(false);
    localStorage.removeItem('jwt');
    await Swal.fire({
      title: 'Success!',
      text: 'Log out successfully',
      icon: 'success',
      timer: 1500,
      position: 'top',
      showConfirmButton: false,
      toast: true,
    });
    navigate('/signin');
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
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <div className="flex flex-row items-center gap-4">
          <Avatar
            size={48}
            shape="square"
            onClick={showModal}
            className="bg-[#fde3cf] text-[#f56a00] ml-4 my-5 font-medium !text-[30px] cursor-pointer"
          >
            {user.first_name[0]}
          </Avatar>
          {!collapsed && (
            <span className="text-white text-[1.3rem] font-semibold">{`${user.first_name} ${user.second_name}`}</span>
          )}
        </div>
        <Modal
          title="User Profile"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleOk}
          footer={
            <Button key="back" onClick={handleCancel}>
              Logout
            </Button>
          }
        >
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
      <Outlet context={projects} />
    </Layout>
  );
}
