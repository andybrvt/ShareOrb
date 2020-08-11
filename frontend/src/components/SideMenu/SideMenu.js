
import React from 'react';
import {
  CalendarOutlined,
  HeartTwoTone,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  SmileOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {Link, withRouter} from 'react-router-dom';
import {browserHistory} from 'react-router';
import testPic from './antd.png';
import {
  Drawer,
  Layout,
  Row,
  Col,
  Dropdown,
  Menu,
  Breadcrumb,
  Space,
  Input,
  Avatar,
  Button,
  Divider,
  AutoComplete,
  Badge,
} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';

import SuggestedFriends from '../../containers/Layouts/SuggestedFriends.js';

import * as navActions from '../../store/actions/nav';
import * as notificationsActions from '../../store/actions/notifications';
import * as actions from '../../store/actions/auth';
import PickEventSyncModal from '../PickEventSyncModal';
import * as eventSyncActions from '../../store/actions/eventSync';
import NotificationsDropDown from '../../containers/NotificationsDropDown';
import Notifications from '../../containers/Notifications';
import defaultPicture from '../images/default.png';
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

  handleSelect = (value) => {
  console.log(value);
  let temp="http://localhost:3000/explore/"+value
  console.log(temp)


  }

  onShowNotification = () => {
    if (this.props.showNotification === true){
      this.props.closeNotification()
    }
    else if (this.props.showNotification === false){
      this.props.openNotification()
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render() {
    const currentDay = new Date()
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    const selectDay = dateFns.getDate(currentDay).toString()
    let profilePic = ''
    let firstName = ''
    let lastName = ''

    console.log(this.props)
    if (this.props.profilePic){
      profilePic = 'http://127.0.0.1:8000'+this.props.profilePic
    } if (this.props.firstName){
      firstName = this.props.firstName
    } if (this.props.lastName){
      lastName = this.props.lastName
    }


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
          theme="blue"
          >


          <Menu.Item key="1" style={{height:50}}>
            <HomeOutlined />
            <span> Home </span>
            <Link to={"/home"} />
          </Menu.Item>


            <Menu.Item key="2"  icon={<VideoCameraOutlined />}  style={{height:50}}>
              <UserOutlined />
              <span> Explore </span>
              <Link to={"/explore"} />
            </Menu.Item>

            <Menu.Item key="3"  style={{height:50}}>
              <InboxOutlined />
              <span>Messages</span>
              <Link to={"chat/1"} />
            </Menu.Item>


            <Menu.Item key="4"  style={{height:50}}>
              <CalendarOutlined />
              <span>Personal Calendar </span>
              <Link to={"/personalcalendar/w/"+selectYear+'/'+selectMonth+'/'+selectDay} />
            </Menu.Item>



            <Menu.Item key="5">
              <SmileOutlined />
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
           onSelect={this.handleSelect}
           dropdownClassName="certain-category-search-dropdown"
           dropdownMatchSelectWidth={500}
           style={{ marginLeft:150, marginLeft:100, marginRight:400, width: 350  }}
         >
        <Input.Search size="large" placeholder="Search" />
      </AutoComplete>



         <Divider type="vertical" />


         <span className="avatar-item" style={{marginRight:40}}>
    </span>

    <span >
    <Badge

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
        marginLeft:'40px',
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




           <span >

           {
             profilePic != '' ?
               <Avatar
               size="small"
               src={profilePic}
               alt="avatar"
               className = 'miniProfilePic'
                />

               :

               <Avatar
               size="small"
               className = 'miniProfilePic'
               src={defaultPicture} alt="avatar" />



           }
             <span>{this.capitalize(firstName)} {this.capitalize(lastName)}</span>
           </span>

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
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    notificationDrop: state.nav.showPopup,
    showPickEventSyncModal: state.eventSync.showPickEventSyncModal,
    id: state.auth.id,
    showNotification: state.notifications.showNotification,
    notifications: state.notifications.notifications,
    profilePic: state.auth.profilePic

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
