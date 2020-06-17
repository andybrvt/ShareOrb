
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
import testPic from './antd.png';
import { Drawer, Layout, LocaleProvider, Icon,Row, Col, Dropdown,  Menu, Breadcrumb, Space} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';
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
    const currentDay = new Date()
    console.log(currentDay)
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    const selectDay = dateFns.getDate(currentDay).toString()
    console.log(this.props)

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
            <Icon type="home" />
            <span> Home </span>
            <Link to={"/home"} />
          </Menu.Item>


            <Menu.Item key="2"  icon={<VideoCameraOutlined />}>
              <Icon type="user" />
              <span> Find friends </span>
              <Link to={"/userview"} />
            </Menu.Item>

            <Menu.Item key="3">
              <Icon type="inbox" />
              <span>Messages</span>
              <Link to={"chat/1"} />
            </Menu.Item>


            <Menu.Item key="4">
              <Icon type="calendar" />
              <span>Personal Calendar </span>
              <Link to={"/personalcalendar/w/"+selectYear+'/'+selectMonth+'/'+selectDay} />
            </Menu.Item>



            <Menu.Item key="5">
              <Icon type="smile" />
              <span>Social Calendar</span>
              <Link to={"/current-user/"} />
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
            className=""
            style={{
              height: "710px",
              // backgroundColor: 'red'
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
