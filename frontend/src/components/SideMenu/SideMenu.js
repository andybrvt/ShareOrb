
import React from 'react';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  HeartTwoTone,
  SearchOutlined,
  LogoutOutlined, SettingOutlined,
} from '@ant-design/icons'
import {Link, withRouter} from 'react-router-dom';
import testPic from './antd.png';
import { Drawer, Layout, LocaleProvider, Icon,Row, Col, Dropdown,  Menu, Breadcrumb, Space, Input, Avatar, Button, Divider, AutoComplete, Badge} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';
import ProfileDropDown from '../../containers/GlobalHeader/ProfileDropDown.js';
import SuggestedFriends from '../../containers/Layouts/SuggestedFriends.js';

import * as navActions from '../../store/actions/nav';
import * as notificationsActions from '../../store/actions/notifications';
import * as actions from '../../store/actions/auth';
import PickEventSyncModal from '../PickEventSyncModal';
import * as eventSyncActions from '../../store/actions/eventSync';
import NotificationsDropDown from '../../containers/NotificationsDropDown';
import Notifications from '../../containers/Notifications';
import { connect } from 'react-redux';

const { Header, Sider, Content } = Layout;
const { Search } = Input;



class SideMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };


  handleSearch = (value) => {
    this.setState({
      dataSource: localStorage.getItem('friends').split(',')
    });
  }

  onShowNotification = () => {
    if (this.props.showNotification === true){
      this.props.closeNotification()
    }
    else if (this.props.showNotification === false){
      this.props.openNotification()
    }
  }

  render() {
    const currentDay = new Date()
    console.log(currentDay)
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    const selectDay = dateFns.getDate(currentDay).toString()
    console.log(this.props)



    const { dataSource } = this.state;



    return (
      <div style={{marginBottom:30}}>


      <Sider trigger={null} collapsible collapsed={this.state.collapsed}style={{
        backgroundColor: 'white',
        height: '100vh',
        position: 'fixed',

      }}
      className="appearBefore">

              <img  class="logo" src={testPic}  style={{width:80, height:80}} />


          <Menu style={{height:1000}}
           defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          >


          <Menu.Item key="1" style={{height:50}}>
            <Icon type="home" />
            <span> Home </span>
            <Link to={"/home"} />
          </Menu.Item>


            <Menu.Item key="2"  icon={<VideoCameraOutlined />}  style={{height:50}}>
              <Icon type="user" />
              <span> Explore </span>
              <Link to={"/userview"} />
            </Menu.Item>

            <Menu.Item key="3"  style={{height:50}}>
              <Icon type="inbox" />
              <span>Messages</span>
              <Link to={"chat/1"} />
            </Menu.Item>


            <Menu.Item key="4"  style={{height:50}}>
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



      <Layout>

      <Header className="site-layout HeaderPosition appearBefore" style={{  mfontSize:20,   position: 'fixed', marginLeft:300, background:'white' }}>
      <span style = {{
        color: 'black'
      }}>
        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.toggle,
        })}
      </span>




         <AutoComplete
           dataSource={dataSource}
           filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
           onSearch={this.handleSearch}
           dropdownClassName="certain-category-search-dropdown"
           dropdownMatchSelectWidth={500}
           style={{ marginLeft:150, marginLeft:100, marginRight:400, width: 350  }}
         >
        <Input.Search size="large" placeholder="Search" />
      </AutoComplete>



         <Divider type="vertical" />


         <span className="avatar-item" style={{marginRight:40}}>
      <Badge count={8}>
        <Avatar shape="square" icon={<UserOutlined />} />
      </Badge>
    </span>

    <span >
    <Badge
    style = {{ paddingBottom: '25px', paddingTop: '0px'}}
    count = {this.props.notifications.length}>
         <Button

         onClick = {() => this.onShowNotification()}

         >
          <Notifications {...this.props}/>
          </Button>
    </Badge>
    </span>

    <span
    style = {{
      position: 'relative',
        left: '20px'
    }}
    >
         <Dropdown overlay={


           <Menu style = {{
         }}
         selectedKeys={[]} >
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
       </span>

      </Header>

      // outer boundary
        <Layout className="site-layout" style={{
          background:'#f5f5f5',
          display:'flex',

        }}>

          {/* length of banner from the very top*/}






          <Content


            style={{

              // backgroundColor: 'red'
            }}
          >

              {this.props.children}
          </Content>
        </Layout>
      </Layout>





      <div class="newsfeed">

      </div>

      <div>
        <PickEventSyncModal
        // {... this.props}
        isVisible = {this.props.showPickEventSyncModal}
        close = {this.props.closePickEventSyncModal} />
      </div>
     </div>
    );
  }
}

const mapStateToProps = state => {
  return{
    notificationDrop: state.nav.showPopup,
    showPickEventSyncModal: state.eventSync.showPickEventSyncModal,
    id: state.auth.id,
    showNotification: state.notifications.showNotification,
    notifications: state.notifications.notifications,

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
        closePickEventSyncModal: () => dispatch(eventSyncActions.closePickEventSyncModal()),
        openNotification: () =>dispatch(notificationsActions.openNotification()),
        closeNotification: () => dispatch (notificationsActions.closeNotification())
    }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SideMenu));
