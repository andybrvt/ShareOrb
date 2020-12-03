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
    authAxios.get('http://127.0.0.1:8000/userprofile/all-users')
      .then(res=> {
        console.log(res)
        this.setState({
          profileList:res.data,
       });
      });

  }

  onSelect = (value) => {
    console.log('onSelect', value);
    window.location.href = 'http://localhost:3000/explore/'+value
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
    const { Option } = Select;


    const temp=[]
    this.state.profileList.forEach(item => {
      temp.push(
        <Option value = {item.username}
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
      <div style={{marginBottom:30}}>




      <Layout>




      <Header className="site-layout HeaderPosition appearBefore" style={{  mfontSize:20,   position: 'fixed', background:'white' }}>
        <p class ="show-sidebar">
                <aside class="sidebar" >
                <div class="toggle">
                  <a href="#collapseExample" role = "button" class="burger js-menu-toggle" data-toggle="collapse" >
                        <span></span>
                      </a>
                </div>

                <div class="side-inner">

                  <div class="logo-wrap">
                    <div class="logo">
                      <span>S</span>
                    </div>
                    <span class="logo-text">Colorlib</span>
                  </div>


                  <div class="nav-menu">
                    <ul>
                      <button type="button" class="btn btn-primary">Primary</button>
                      <li class="active"><a href="#" class="d-flex align-items-center"><i class="fas fa-calendar-alt"> Personal calendar</i><span class="menu-text">Home</span></a></li>
                      <li class="active"><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-home2 mr-3"></span><span class="menu-text">Home</span></a></li>
                      <li><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-videocam mr-3"></span><span class="menu-text">Videos</span></a></li>
                      <li><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-book mr-3"></span><span class="menu-text">Books</span></a></li>
                      <li><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-shopping-cart mr-3"></span><span class="menu-text">Store</span></a></li>
                      <li><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-pie-chart mr-3"></span><span class="menu-text">Analytics</span></a></li>
                      <li><a href="#" class="d-flex align-items-center"><span class="wrap-icon icon-cog mr-3"></span><span class="menu-text">Settings</span></a></li>
                    </ul>
                  </div>
                </div>

              </aside>

        </p>
      <span style = {{
        color: 'black',
        marginLeft:'10%',

      }}>
        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: this.toggle,
        })}
      </span>



         <AutoComplete
           dataSource={temp}

           filterOption={(inputValue, option) =>
             option.props.children.toUpperCase().
             indexOf(inputValue.toUpperCase()) !== -1}
           onSearch={this.handleSearch}
           onSelect={this.onSelect}
           dropdownClassName="certain-category-search-dropdown"
           dropdownMatchSelectWidth={400}
           style={{
            // marginLeft:150,
            marginLeft:'25%',
            marginRight:'20%', width: 400,
           // backgroundColor: 'red'
         }}

         >
        <Input.Search size="large" placeholder="Search" />
      </AutoComplete>



         <span className="avatar-item" style={{marginRight:40}}>
    </span>

    <span
    style = {{

    }}
     >


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
        marginLeft:'20px',
    }}
    >
         <Dropdown overlay={


           <Menu style = {{
         }}
         selectedKeys={[]} >
             { (
               <Menu.Item style={{marginTop:'-2px'}} key="center">
                 <Link to={"/explore/"+this.props.username}>
                   <i style={{marginRight:'3px' }} class="far fa-user"></i>
                   <span style={{marginLeft:'2px'}}> Profile</span>

                 </Link>

               </Menu.Item>
             )}
             { (
               <Menu.Item key="settings">
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
               size="large"
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
    username: state.auth.username,
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
