
import React from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  HeartTwoTone,
} from '@ant-design/icons'
import {Link} from 'react-router-dom';
import * as dateFns from 'date-fns';
import testPic from './antd.png';
import { Drawer, Layout, LocaleProvider, Icon,Row, Col, Dropdown,  Menu, Breadcrumb, Space} from 'antd';
import "./SideMenu.css"

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

              <img  class="logo" src={testPic}  style={{width:100, height:100}} />


          <Menu theme="dark"
           defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark">

          
          <Menu.Item key="1">
            <a href='/home'>
                <Icon type="home" />
                Home
            </a>
          </Menu.Item>


            <Menu.Item key="2">
            <Icon type="user" />
                  Find Friends
            </Menu.Item>
            <Menu.Item key="3">

              <a href='/chat/1'>
                  <Icon type="inbox" />
                  Messages
              </a>
            </Menu.Item>
            <Menu.Item key="4">
              <a href='/personalcalendar/2020/6'>
                  <Icon type="calendar" />
                  Personal calendar
              </a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">

          {/* length of banner from the very top*/}

          <Header className="site-layout-background" style={{  fontSize:20 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{

              padding: 30,
              minHeight: 800,
            }}
          >
          <HeartTwoTone twoToneColor="#eb2f96" />
              {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default SideMenu;
