
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
} from 'antd';
import "./SideMenu.css"
import * as dateFns from 'date-fns';
import { authAxios } from '../../components/util';
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
    authAxios.get('http://127.0.0.1:8000/userprofile/explore')
      .then(res=> {
        console.log(res)
        this.setState({
          profileList:res.data,
       });
      });
  }

  handleSearch = (value) => {

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
    const { Option } = Select;
    const options = this.state.profileList.map(d => <Option key={d.value}>{d.text}</Option>);





    console.log(this.state.profileList)

    return (
      <div style={{marginBottom:30}}>


      <Sider trigger={null} collapsible collapsed={this.state.collapsed}style={{
        backgroundColor: 'white',
        height: '100vh',
        position: 'fixed',

      }}
      className="SideMenuAppearBefore">

              <img  class="logo" src={testPic}  style={{width:100, height:100}} />


          <Menu style={{height:1000}}
           defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          class="ant-menu"
          >


          <Menu.Item key="1" style={{height:50}}>
            <HomeOutlined />
            <span> Home </span>
            <Link to={"/home"} />
          </Menu.Item>


            <Menu.Item key="2" style={{height:50}}>
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

      <Header className="site-layout HeaderPosition appearBefore" style={{  mfontSize:20,   position: 'fixed', background:'white' }}>
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
           dataSource={options}

           onSearch={this.handleSearch}

           dropdownClassName="certain-category-search-dropdown"
           dropdownMatchSelectWidth={500}
           style={{ marginLeft:150, marginLeft:'25%', marginRight:'25%', width: 450  }}

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
        marginLeft:'20px',
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
