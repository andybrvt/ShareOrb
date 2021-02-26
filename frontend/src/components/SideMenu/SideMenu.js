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
import './badge.css';
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
  Tooltip,
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
import defaultPicture from '../images/default.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import mainLogo from '../../logo.svg';
import backPartLogo from '../../hareOrb.svg';
import frontPartLogo from '../../frontPartLogo.svg';
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
      showDropDown:false,
    };

    // This is used to reference the onclick outside the notification
    // drop down
    this.wrapperRef = React.createRef()
    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)

  }


  handleClickOutside(event){


    console.log(event.target)
    console.log(this.wrapperRef)
    var notification = document.getElementById('notificatonDropdownId')
    console.log(notification)
    // so this will hanlde what happens when you do click out side
    if(this.wrapperRef
      && !this.wrapperRef.current.contains(event.target)
      && this.state.showDropDown === true
    ){
      console.log('stuff happens')
      this.setState({
        showDropDown: false
      })
    }

  }

  setWrapperRef(node) {
    // node will pretty much be the who element
    this.wrapperRef = node
  }



  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };




  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutside);

    authAxios.get(`${global.API_ENDPOINT}/userprofile/all-users`)
      .then(res=> {
        console.log(res)
        this.setState({
          profileList:res.data,
       });
      });

  }

  componentWillUnmount() {
       document.removeEventListener('mousedown', this.handleClickOutside);
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

 onOpenDropDown = () =>{
   console.log("button click")
   this.setState({
     showDropDown: !this.state.showDropDown
   })
 }

 goToHome=()=> {
   // This is used to open up the social cell day post modal


   this.props.history.push({
     pathname:"/home",
   })

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

      <div
        className = "everythingContainer">
        <div className = "sideMenuContainer">
            <aside>
              <div className = "whiteFixBackground"> </div>
                <div class="side-inner">
                  <div class="logo-wrap" onClick = {() => this.goToHome()}>
                    <div class="logo">
                      <span>S</span>
                    </div>
                    <img src={backPartLogo} style={{top:'25%'}} class="testBackLogo"
                    />
                  </div>

                <div class="nav-menu">
                  <ul class="sidebarList">
                    <Tooltip placement="right" title={"Home"}>
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
                    </Tooltip>
                    <Tooltip placement="right" title={"Messages"}>
                      <li
                      onClick = {() => this.onChatDirect()}
                      >
                        <a class="d-flex">
                          {
                            this.props.unseen === 0 ?
                            <div> </div>
                            :
                            <span class="notification-count">
                              <span class="notificationInside"> {this.props.unseen} </span>
                            </span>

                          }
                            <i class="far fa-comment"></i>
                            <span style={{marginLeft:'10px'}}  class="menu-text">Messages</span>
                          </a>
                        </li>
                      </Tooltip>

                      <Tooltip placement="right" title={"Personal Calendar"}>
                        <li
                        onClick = {() => this.onCalendarDirect()}
                        >
                          <a class="d-flex align-items-center">
                            <i style={{marginLeft:'1px'}} class="far fa-calendar-alt"></i>
                            <span style={{marginLeft:'10px'}} class="menu-text">Personal</span>
                            <span style={{marginLeft:'5px'}} class="menu-text">Calendar</span>
                          </a>
                        </li>
                      </Tooltip>

                      <Tooltip placement="right" title={"Social Calendar"}>
                        <li
                        onClick = {() => this.onProfileDirect()}
                        >
                        <a class="d-flex align-items-center">
                          <i style={{fontSize:'16px'}} class="far fa-user"></i>
                            <span style={{marginLeft:'10px'}}  class="menu-text">Social</span>
                            <span style={{marginLeft:'5px'}} class="menu-text">Calendar</span>
                        </a>
                        </li>
                      </Tooltip>
                    </ul>
                  </div>
                </div>
            </aside>
        </div>

        <div className = "rightContentContainer">
            <div className="mainHeaderContainer" >
              <div className = "burgerContainer">
                <div className="toggle">
                  <span
                   role = "button"
                   class="js-menu-toggle"
                   data-toggle="collapse"
                   >
                  <i class="fas fa-bars"></i>
                  </span>
               </div>
              </div>

                <div className = "searchBarContainer">
                  <div className = "autoCompleteHeader">
                    <AutoComplete
                      dataSource={temp}
                      style = {{width:'62.25%', height:'10%'}}
                      filterOption={(inputValue, option) =>
                         option.value.includes(inputValue)
                      }
                      onSearch={this.handleSearch}
                      onSelect={this.onSelect}
                      dropdownClassName="searchBarContainer"
                      class="">
                    {/*search bar*/}
                      <Input.Search
                        class="inputSearchCSS"
                        compact placeholder="Search" />
                    </AutoComplete>
                 </div>
                </div>


                <div
                  ref = {this.wrapperRef}

                  className="headersNotificationContainer">
                  <div className = 'notificationsInner'>
                    <div class="badgeOuter">
                        <i
                          onClick = {() => this.onOpenDropDown()}
                          class={`${this.state.showDropDown ? "far fa-bell showBell" : "far fa-bell"}`}
                          aria-hidden="true"
                          style={{fontSize:'22px'}}
                          >
                        </i>
                        {this.props.notificationSeen > 0 ?
                          <span class={`${this.props.notifications.length>=10 ? "GreaterTenNotifications" : "headerNotificationButton"}`}>
                            <span class="notificationInside">{this.props.notificationSeen} </span>
                          </span>

                          :

                          <span></span>

                        }


                    </div>
                  </div>
                  <div
                    id = "notificatonDropdownId" ref = "notificationDD">
                    <NotificationsDropDown

                      {...this.props} showNoti={this.state.showDropDown}/>
                  </div>
                </div>

                <div className = "headersProfileContainer">
                  <span class="profileHeader">
                       <Dropdown overlay={
                         <Menu style={{marginTop:'20px'}}>
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
                             size={'1em'}
                             src={profilePic}
                             alt="avatar"
                             className = 'miniProfilePic'
                             style={{position:'absolute', top:'25%'}}
                              />
                             :
                             <Avatar
                             size={'1em'}
                             className = 'miniProfilePic'
                             style={{position:'absolute', top:'25%'}}
                             src={defaultPicture} alt="avatar" />
                         }
                         </span>
                     </Dropdown>
                     </span>
                </div>
            </div>


            <Layout class="mainContentContainer">
                  {this.props.children}

            </Layout>



        </div>

        <PickEventSyncModal
        // {... this.props}
        isVisible = {this.props.showPickEventSyncModal}
        close = {this.props.closePickEventSyncModal} />


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
    curChatId: state.message.curChatId,
    unseen: state.message.unseen,
    notificationSeen: state.auth.notificationSeen
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
