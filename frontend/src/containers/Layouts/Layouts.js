import React from 'react';
import { Layout, Menu, Breadcrumb, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/auth';
import '../Containers.css'
import { authAxios } from '../../components/util';
import { Icon } from 'semantic-ui-react'
import { Tag, Input } from 'antd';
import * as navActions from '../../store/actions/nav'

import moment from 'moment';
// import SearchBar from '../HeaderSearch';


import SideMenu from '../../components/SideMenu/SideMenu';

import './Layouts.css';

import Notifications from '../Notifications';
import NotificationsDropDown from '../NotificationsDropDown';
import PickEventSyncModal from '../PersonalCalendar/EventSyncForms/PickEventSyncModal';
import * as eventSyncActions from '../../store/actions/eventSync';
import SuggestedFriends from './SuggestedFriends.js'

const { Header, Footer, Content } = Layout;
const { Search } = Input;


// Function: boarder layout that wraps around each of the other containers, and has
// menu items that go to each page

class CustomLayout extends React.Component {
  state = {
    username: '',
  }



  async componentDidMount(){
    await authAxios.get('http://127.0.0.1:8000/userprofile/current-user/')
      .then(res=> {
        this.setState({
          username: res.data.username,
       });
     });
   }


    render() {
      console.log(this.props)

      return (
      <div>


                <Layout>
                  {/*
                   <Content
                     className=""
                     style={{
                       height: "710px",

                     }}
                   >

                       <SuggestedFriends/>

                   </Content>

                   */}
                  </Layout>



              >
              }


                <Footer style={{
                  // position: 'relative',
                  // top: "-120px",
                  // textAlign: 'center',
                 }}>
                ShareOrb ©2020
                </Footer>



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



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout));
