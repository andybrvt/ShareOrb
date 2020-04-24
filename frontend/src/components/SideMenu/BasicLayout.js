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





const { SubMenu } = Menu;

export default class App extends React.Component {
  state = {
    collapsed: false,
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
          style={{ minHeight:"100vh" }}
        >
        <Menu.Item key="1">
          <Link to="/home" className="nav-text">
            <HomeTwoTone />
            <span>Home </span>
          </Link>
        </Menu.Item>

        <Menu.Item key="2">
          <Link to="/userview" className="nav-text">
            <UsergroupAddOutlined />
            <span>Users </span>
          </Link>
        </Menu.Item>


        <Menu.Item key="3">
          <Link to="/chat/1" className="nav-text">
            <MessageOutlined />
            <span>Messages </span>
          </Link>
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
            key="sub1"
            title={
              <span>
                <MailOutlined />
                <span>Navigation One</span>
              </span>
            }
          >
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
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
    );
  }
}
