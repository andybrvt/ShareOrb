
import React from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  HeartTwoTone,
  LogoutOutlined, SettingOutlined,
} from '@ant-design/icons'
import {Link, withRouter} from 'react-router-dom';
import testPic from './antd.png';
import { Drawer, Layout, LocaleProvider, Icon,Row, Col, Dropdown,  Menu, Breadcrumb, Space, Input, Avatar, Button, Divider} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';
import ProfileDropDown from '../../containers/GlobalHeader/ProfileDropDown.js';

import * as navActions from '../../store/actions/nav'
import * as actions from '../../store/actions/auth';
import PickEventSyncModal from '../../components/PickEventSyncModal';
import * as eventSyncActions from '../../store/actions/eventSync';
import NotificationsDropDown from '../../containers/NotificationsDropDown';
import { connect } from 'react-redux';

const { Header, Sider, Content } = Layout;
const { Search } = Input;



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
      <div style={{marginBottom:30}}>

       <Row>

      <Col span={1}>
      <Sider trigger={null} collapsible collapsed={this.state.collapsed}>

              <img  class="logo" src={testPic}  style={{width:100, height:100}} />


          <Menu style={{height:1000}}
           defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="light">


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
        col-2
      </Col>
      <Col span={2}>col-2</Col>
      <Col span={20}>col-16
      <Layout>


        <Layout className="site-layout">

          {/* length of banner from the very top*/}

          <Header className="site-layout-background HeaderPosition" style={{  fontSize:20 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: this.toggle,
            })}




            <Search
               placeholder="Search"
               onSearch={value => console.log(value)}
               style={{ marginLeft:150, marginLeft:200, marginRight:400, width: 350 }}
             />



             <Divider type="vertical" />

             <Button style={{marginRight:100}}>
              <NotificationsDropDown/>
              </Button>


             <Dropdown overlay={

               <Menu selectedKeys={[]} >
                 { (
                   <Menu.Item key="center">
                     <Link to="/current-user">
                       <UserOutlined />
                       Profile

                     </Link>

                   </Menu.Item>
                 )}
                 { (
                   <Menu.Item key="settings">
                     <SettingOutlined />
                     Settings
                   </Menu.Item>
                 )}
                 { <Menu.Divider />}





                 <Menu.Item key="logout" onClick={this.props.logout}>
                   <Link to="/">
                     <LogoutOutlined />
                     Logout

                   </Link>

                 </Menu.Item>
               </Menu>}>


              <Button>

               <span >
                 <Avatar size="small" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />
                 <span>{"admin"}</span>
               </span>
             </Button>
           </Dropdown>



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
      </Col>

      </Row>
      <div class="newsfeed">

      </div>

     </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    notificationDrop: state.nav.showPopup,
    showPickEventSyncModal: state.eventSync.showPickEventSyncModal
  }
}


const mapDispatchToProps = dispatch => {
  return {
        closeNotification: () => dispatch(navActions.closePopup()),
        openNotification: () => dispatch(navActions.openPopup()),
        logout: () => dispatch(actions.logout()),
        openPickEventSyncModal: (user, userFriend, minDate, maxDate, notificationId) => dispatch(eventSyncActions.openPickEventSyncModal(
          user,
          userFriend,
          minDate,
          maxDate,
          notificationId
        )),
        closePickEventSyncModal: () => dispatch(eventSyncActions.closePickEventSyncModal())
    }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideMenu));
