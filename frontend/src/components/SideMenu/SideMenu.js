
import React from 'react';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeTwoTone,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  UsergroupAddOutlined,
  MessageOutlined,
  CalendarOutlined,
  HeartTwoTone,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,

} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import * as dateFns from 'date-fns';
import testPic from './antd.png';
import { Drawer, Layout, LocaleProvider, Icon,Row, Col, Dropdown,  Menu, Breadcrumb} from 'antd';


const { Header, Sider, Content } = Layout;

class SideMenu extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>

            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <a href='//'>

                  Person
            </a>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              <a href='/chat/1'>
                  <Icon name='large comments icon' />
                  Messages
            </a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">

          {/* length of banner from the very top*/}

          <Header className="site-layout-background" style={{ marginTop: 20, fontSize:30 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '50px, 200px',
              padding: 24,
              minHeight: 280,
            }}
          >
              {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SideMenu;
