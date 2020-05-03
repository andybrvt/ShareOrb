import { Menu, Button } from 'antd';
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
} from '@ant-design/icons';
import {Link} from 'react-router-dom';
import * as dateFns from 'date-fns';

import { Drawer, Layout} from 'antd';


const { Sider } = Layout;
const { SubMenu } = Menu;

export default class SideMenu extends React.Component {
  state = { visible: false,
   collapsed: true, };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };


  toggleCollapsed = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };
  render() {
    const currentDay = new Date()
    console.log(currentDay)
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    return (

      <div>

      { /*

        */
      }
      <div style={{ width: 200 }}>
        <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
          {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light"
          inlineCollapsed={this.state.collapsed}
          style={{


          }}
        >
        <Menu.Item key="1">
          <Link to="/home" className="nav-text">
            <HomeTwoTone />
            <span>Home </span>
          </Link>
        </Menu.Item>

        <Menu.Item key="2">
          <a href="/userview" className="nav-text">
            <UsergroupAddOutlined />
            <span>Users </span>
          </a>
        </Menu.Item>


        <Menu.Item key="3">
          <a href="/chat/1" className="nav-text">
            <MessageOutlined />
            <span>Messages </span>
          </a>
        </Menu.Item>



        <Menu.Item key="4">
          <Link to={"/personalcalendar/"+selectYear+'/'+selectMonth}
          className="nav-text">
            <CalendarOutlined />
            <span>Personal Calendar </span>
          </Link>
        </Menu.Item>



        <Menu.Item key="5">
          <Link to="/personalcalendar" className="nav-text">
            <HeartTwoTone twoToneColor="#eb2f96" />
            <span>Social Calendar </span>
          </Link>
        </Menu.Item>
        
          <SubMenu
            key="sub2"
            title={
              <span>
                <AppstoreOutlined />
                <span>Navigation Two</span>
              </span>
            }
          >
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="11">Option 11</Menu.Item>
              <Menu.Item key="12">Option 12</Menu.Item>
            </SubMenu>
          </SubMenu>
        </Menu>
      </div>


      <Button type="primary" onClick={this.showDrawer} style={{ marginBottom: 16 }}>
           Test
       </Button>
      <Drawer
          title="Basic Drawer"

          closable={false}
          width={840}
          placement="left"
          onClose={this.onClose}
          visible={this.state.visible}
          style={{ marginBottom: 16 }}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <Sider>


          </Sider>
      </Drawer>

     </div>
    );
  }
}
