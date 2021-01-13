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
  NotificationOutlined,
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
  Select,
  Option,
} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';
import { authAxios } from '../../components/util';
import SuggestedFriends from '../../containers/Layouts/SuggestedFriends.js';

import * as navActions from '../../store/actions/nav';
import * as notificationsActions from '../../store/actions/notifications';
import * as actions from '../../store/actions/auth';
import PickEventSyncModal from '../../containers/PersonalCalendar/EventSyncForms/PickEventSyncModal';
import * as eventSyncActions from '../../store/actions/eventSync';
import NotificationsDropDown from '../../containers/NotificationsDropDown';
import Notifications from '../../containers/Notifications';
import defaultPicture from '../images/default.png';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';



import { connect } from 'react-redux';
const { Header, Sider, Content } = Layout;
const { Search } = Input;



class SideMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      dataSource: [],
      collapsed:true,
      profileList:[],
      name:'',
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };




  componentDidMount(){
    authAxios.get(`${global.API_ENDPOINT}/userprofile/all-users`)
      .then(res=> {
        console.log(res)
        this.setState({
          profileList:res.data,
       });
      });

  }

  onSelect = (value) => {
    console.log('onSelect', value);
    const nameList = value.split(" ")
    this.props.history.push("/explore/"+nameList[0])
    // window.location.href = 'http://localhost:3000/explore/'+value
  }

  handleSearch = (value) => {
   this.setState({
     dataSource: ['test1', 'test2', 'test3']
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


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onNewsfeedDirect = () => {
    // This will re redner the newsfeed if it is on the page, if it is not
    // then it will just do a history.push
    if(this.props.location.pathname === "/home"){
      // you want to re render here
      window.location.reload();

    } else {
      this.props.history.push("/home")
    }

  }

  onChatDirect = () => {
    if(this.props.location.pathname === "/chat/"+this.props.curChatId){
      window.location.reload()
    } else {
      this.props.history.push("/chat/"+this.props.curChatId)
    }

  }

  onCalendarDirect = () => {
    const currentDay = new Date()
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    const selectDay = dateFns.getDate(currentDay).toString()

    if(this.props.location.pathname === "/personalcalendar/w/"+selectYear+'/'+selectMonth+'/'+selectDay){
      window.location.reload()
    } else {
      this.props.history.push("/personalcalendar/w/"+selectYear+'/'+selectMonth+'/'+selectDay)
    }
  }

  onProfileDirect = () => {
    if(this.props.location.pathname === "/explore/"+this.props.username){
      window.location.reload()
    } else {
      this.props.history.push("/explore/"+this.props.username)
    }
  }

  onSettingDirect = () => {
    if(this.props.location.pathname === '/settings'){
      window.location.reload()
    } else {
      this.props.history.push("/settings")
    }
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
      profilePic = `${global.IMAGE_ENDPOINT}`+this.props.profilePic
    } if (this.props.firstName){
      firstName = this.props.firstName
    } if (this.props.lastName){
      lastName = this.props.lastName
    }




    const { dataSource } = this.state;
    const { Option } = Select;

    const temp=[]
    this.state.profileList.forEach(item => {
      temp.push(
        <Option value = {item.username+' '+item.first_name+' '+item.last_name}
        label = {this.capitalize(item.username)}>
          <div style={{padding:'10px'}}>
            <Avatar
              style={{marginRight:'10px'}}
              size="small"
              src={item.profile_picture}/>
            <span>
              {this.capitalize(item.first_name)} {this.capitalize(item.last_name)}
              <br/>
              <div
                class="headerPostText"
                style={{marginLeft:'35px'}}
              >
                {"@"+item.username}
              </div>
            </span>
          </div>

        </Option>
      );
    })
    console.log(temp)




    return (
      <div>

        {/*
        background everything
        */}
      <Layout  style={{width:'100vw'}}>




      <Header className="site-layout HeaderPosition appearBefore"
         style={{ background:'white'}}>
        <p class ="">
                <aside class="sidebar" >
                <div class="toggle">
                  {/*
                    <MenuFoldOutlined

                      >
                    </MenuFoldOutlined>


                    */}
                  {/*
                    <a href="#collapseExample" role = "button"
                      class="burger js-menu-toggle" data-toggle="collapse" >
                          <span></span>
                    </a>
                    */}
                    <span

                      role = "button"
                      class=" js-menu-toggle"
                      data-toggle="collapse"
                      style = {{
                      color: 'black',
                      marginLeft:'20%',
                      fontSize:'20px',
                    }}>
                      {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {

                        onClick: this.toggle,
                      })}
                    </span>


                </div>

                <div class="side-inner">

                  <div class="logo-wrap">
                    <div class="logo">
                      <span>S</span>
                    </div>
                    <span class="logo-text">hareOrb</span>
                  </div>


                  <div class="nav-menu">
                    <ul class="sidebarList">
                      <li
                      onClick = {() => this.onNewsfeedDirect()}
                      >
                      <a class="d-flex align-items-center">
                         <HomeOutlined  style={{marginRight:'10px'}}/>
                         <span class="menu-text">
                           Home
                         </span>
                      </a>
                       </li>
                      {/*<li ><a href="/explore" class="d-flex align-items-center"><UserOutlined style={{marginRight:'10px',}}/><span class="menu-text">Explore</span></a></li>
                    */}
                    <li
                    onClick = {() => this.onChatDirect()}
                    >
                    <a class="d-flex align-items-center">
                      <i class="far fa-comment"></i>
                      <span style={{marginLeft:'10px'}}  class="menu-text">Messages</span>
                    </a>
                    </li>
                      <li
                      onClick = {() => this.onCalendarDirect()}
                      >
                        <a class="d-flex align-items-center">
                          <i style={{marginLeft:'1px'}} class="far fa-calendar-alt"></i>
                          <span style={{marginLeft:'10px'}} class="menu-text">Personal</span>
                          <span style={{marginLeft:'5px'}} class="menu-text">Calendar</span>
                        </a>
                      </li>

                      <li
                      onClick = {() => this.onProfileDirect()}
                      >
                      <a class="d-flex align-items-center">
                        <i style={{marginLeft:'-2px'}} class="fas fa-user-friends"></i>
                          <span style={{marginLeft:'10px'}}  class="menu-text">Social</span>
                          <span style={{marginLeft:'5px'}} class="menu-text">Calendar</span>
                      </a>
                      </li>
                    </ul>
                  </div>
                </div>

              </aside>

        </p>

        {/*<div class="toggle">
          <a href="#collapseExample" role = "button" class="burger js-menu-toggle" data-toggle="collapse" >
                <span></span>
              </a>
        </div>




        */}



         <AutoComplete
           dataSource={temp}

           filterOption={(inputValue, option) =>
              option.value.includes(inputValue)
           }
           onSearch={this.handleSearch}
           onSelect={this.onSelect}
           dropdownClassName="certain-category-search-dropdown"
           dropdownMatchSelectWidth={700}
           style={{
            marginRight:'18%',
            left:'33%',
            top:'25%',


           // backgroundColor: 'red'
         }}


         >
        <Input.Search
          style={{
           // marginLeft:150,\

           marginRight:'8%',
           width: 700,


          // backgroundColor: 'red'
        }}

           compact size="large" placeholder="Search" />
      </AutoComplete>


      {/*
      <span style={{marginRight:'50px'}}>
        <Badge dot={true} count={6}>
            <i style={{color:'#1890ff', fontSize:'20px'}} class="fas fa-envelope"></i>
       </Badge>
      </span>
      */}

      {/*
          Grab notification length for now
           count = {this.props.notifications.length}
           */}



      <Badge
        style={{padding:'initial', margin:'initial', marginTop:'30px'}}
        dot={true}
      count = {this.props.notifications.length}>

          <Notifications {...this.props}/>

    </Badge>




    <span
      class="pointerEvent"
      style = {{
        float:'right',
        marginRight:'25px',
        marginTop:'5px',
      }}
    >
         <Dropdown overlay={
           <Menu style = {{
         }}
         selectedKeys={[]} >
             { (
               <Menu.Item
               onClick = {()=>this.props.history.push("/explore/"+this.props.username)}
               style={{marginTop:'-2px'}} key="center">

                   <i style={{marginRight:'3px' }} class="far fa-user"></i>
                   <span style={{marginLeft:'2px'}}> Profile</span>



               </Menu.Item>
             )}
             { (
               <Menu.Item
               onClick = {() => this.onSettingDirect()}
                key="settings">
                 <i class="fas fa-cog"></i>
                 <span style={{marginLeft:'2px'}}> Settings</span>
               </Menu.Item>
             )}
             { <Menu.Divider style={{marginTop:'-1px',marginBottom:'-1px'}}/>}
             <Menu.Item key="logout" onClick={this.props.logout}>
               <Link to="/">
                 <i class="fas fa-sign-out-alt"></i>
                 <span style={{marginLeft:'2px'}}> Logout</span>
               </Link>
             </Menu.Item>
           </Menu>}>




           <span >
           {
             profilePic != '' ?
               <Avatar
               size={35}
               src={profilePic}
               alt="avatar"
               className = 'miniProfilePic'
                />

               :

               <Avatar
               size="large"
               className = 'miniProfilePic'
               src={defaultPicture} alt="avatar" />
           }

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
    username: state.auth.username,
    showNotification: state.notifications.showNotification,
    notifications: state.notifications.notifications,
    profilePic: state.auth.profilePic,
    curChatId: state.message.curChatId
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
