import React from 'react';
import axios from 'axios';
import { Route, useLocation, Switch, Link } from 'react-router-dom';

import { authAxios } from '../util';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { Button, Modal, Avatar, Steps, Divider, message } from 'antd';
import { RetweetOutlined, EditOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import * as exploreActions from '../../store/actions/explore';
import * as authActions from '../../store/actions/auth';
import defaultPicture from '../images/default.png';
import ava1 from '../images/avatar.jpg'
import SocialCalendar from '../../containers/SocialCalendarFolder/SocialCalendar';
import FollowList from './FollowList';
import FollowersList from './FollowersList';
import '@ant-design/compatible/assets/index.css';
import './ProfilePage.css';
import ChangeProfilePic from '../../containers/CurrUser/ChangeProfilePic';
import EditProfileForm from './EditProfile/EditProfileForm';
import ChangeBackgroundModal from '../../containers/PersonalCalendar/EventPage/ChangeBackgroundModal.js';
import PersonalProfileHeader from './PersonalProfileHeader';
// From here on out each profile will be its own channel, so we do not need
// to use ViewAnyUserProfile anymore
// Each profile will fetch its own information and do its own channel stuff

// For the current User I will probally gonna make it so that there are turnary
// operators that allows editing and such


// So what is gonna happen is that each personal profile will be its own channel
// so when you log on it will be an own channe, so what happnes on that page, it
// will show up. So I have to properally do the connect and disconnect for
// each page (similar to the event page)

const { Step } = Steps
//This will be the page for the social calendar
class PersonalProfile extends React.Component{
  constructor(props) {
    super(props);

    // this.initialiseProfile()
  }

  state = {
    followerShow: false,
    followingShow: false,
    showProfileEdit: false,
    showProfilePicEdit: false,
    current: 0,
    // showFriendConfirm: false,
    // showUnfriend: false,
    // following: false,
  }

  onChange = current => {
    console.log(current)
      this.setState({ current });
    };
//To get the parms from teh url use THIS.PROPS.PARAMETER.USERNAME (LOWER CASE BTW)

  initialiseProfile() {
    console.log('hit here')
    this.waitForSocketConnection(() => {
        ExploreWebSocketInstance.fetchProfile(
          this.props.parameter.username
        )
    })
    if(this.props.parameter.username){
      ExploreWebSocketInstance.connect(this.props.parameter.username)
    }
  }


  waitForSocketConnection(callback){
		// This is pretty much a recursion that tries to reconnect to the websocket
		// if it does not connect
		const component = this;
		setTimeout(
			function(){
				console.log(ExploreWebSocketInstance.state())
				if (ExploreWebSocketInstance.state() === 1){
					console.log('connection is secure');
					callback();
					return;
				} else {
					console.log('waiting for connection...')
					component.waitForSocketConnection(callback)
				}
			}, 100)
	}


  componentDidMount(){
    this.initialiseProfile()

  }

  componentWillReceiveProps(newProps){
    console.log(newProps)
    console.log('hit here')
    //This will reconnect to eh proper profile if you were to change the profiles

    if(this.props.parameter.username !== newProps.parameter.username){

      this.props.closeProfile()
      ExploreWebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        ExploreWebSocketInstance.fetchProfile(
          newProps.parameter.username
        )
      })
      ExploreWebSocketInstance.connect(newProps.parameter.username)
    }

    if(this.props.location.pathname !== newProps.location.pathname){
      //To refetch the information
      this.waitForSocketConnection(() => {
        ExploreWebSocketInstance.fetchProfile(
          newProps.parameter.username
        )
      })
      ExploreWebSocketInstance.connect(newProps.parameter.username)

    }

  }

  componentWillUnmount(){
    //This will disconnect from the channel if you ever exit the page, this will
    // avoid any connection conflicts
    //Similar to the event page channel, you will have to remove the recursion from
    // the disconnect in the websocket


    ExploreWebSocketInstance.disconnect();
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onPostTabClick = () => {
    this.props.history.push("/explore/"+ this.props.parameter.username+"/posts")

  }

  onEventTabClick = () => {
    this.props.history.push("/explore/"+this.props.parameter.username +"/events")
  }


  onRenderTabs= () => {
    return (
      <div className = 'profile-tabContainer'>
        <div style={{
        background:'white'}} >
        <Steps
          type="navigation"
          size="large"
          current={this.state.current}
          onChange={this.onChange}>
          <Step title="Calendar"
            icon={<i class="far fa-calendar-alt"></i>} />
          {/*  PersonalProfilePostList.js */}
          <Step title="Posts"
            onClick = {() => this.onPostTabClick()}
            icon={<i class="far fa-edit"></i>} />
          {/*  PersonalProfileEventList.js */}
          <Step
            title="Events"
            onClick = {() => this.onEventTabClick()}
            icon={<i class="fas fa-users"></i>} />
        </Steps>
        </div>
        <div className = 'profile-tabPanel'>
            <SocialCalendar {...this.props}/>

         </div>
      </div>
    )
  }

  onRenderPrivate = () => {
    // This function will be used to show when the account is private and


    return (
      <div className = "privateAccountPage">
        <div className = "textHolder">
        <i class="fas fa-user-shield"></i>
          <div className = "">
          This account is private.
          </div>
        </div>
      </div>
    )
  }

  render(){
      const { current } = this.state;
      console.log(this.props)
      console.log(this.state)

      let followers = []
      let following = []
      let profilePic = ""
      let firstName=""
      let lastName=""
      let bio=""
      let profileImage = null
      let privatePro = true
      let requested = []

      // follower list will used mostly for private events
      let followerList = []
      let curRequested = []


      if (this.props.profile){
        if(this.props.profile.get_followers){
          if(this.props.profile.id === this.props.currentId){
            followers = this.props.followers
          } else {
            followers = this.props.profile.get_followers
          }

        }
        if(this.props.profile.get_following){
          if(this.props.profile.id === this.props.currentId){
            following = this.props.following
          } else {
            following = this.props.profile.get_following
          }
        }
        if(this.props.profile.profile_picture){
          profilePic = this.props.profile.profile_picture
        }

        if(this.props.profile.id === this.props.currentId){
          // This will check if it is the currrent user
          privatePro = false
        } else {
          // In the case that it is not the current user
          if(this.props.profile.get_followers){
            for (let i = 0; i< this.props.profile.get_followers.length; i++){
              followerList.push(this.props.profile.get_followers[i].id)
            }
          }
          if(followerList.includes(this.props.currentId)){
            privatePro = false
          } else {
            privatePro = this.props.profile.private
          }

        }




      }
      if(this.props.profile.first_name){
        firstName = this.props.profile.first_name
      }
      if(this.props.profile.last_name){
        lastName = this.props.profile.last_name
      }
      if(this.props.profile.bio){
        bio = this.props.profile.bio
      }

      if(this.props.profile){
        console.log(this.props.profile.profile_picture)
        if(this.props.profile.profile_picture){
          profileImage = `${global.IMAGE_ENDPOINT}`+this.props.profile.profile_picture
        }
      }
      if(this.props.curRequested){
        curRequested = this.props.curRequested
      }

      console.log(privatePro)

      return(
        <div className = {`profilePage ${this.props.location.state ? "active" : ""}`}>

          <div className = "topSectProfilePage">
            <PersonalProfileHeader
              {...this.props}
            />

          </div>

          <div className = "bottomSectProfilePage">
            {
              privatePro ?
              this.onRenderPrivate()

              :

              this.onRenderTabs()

            }

          </div>


        </div>
      )

    }
  }

const mapStateToProps = state => {
    return {
      currentId: state.auth.id,
      currentUser: state.auth.username,
      token: state.auth.token,
      profile: state.explore.profile,
      curUserFriend: state.auth.friends,
      curRequested: state.auth.requestList,
      followers: state.auth.followers,
      following: state.auth.following,
      chats: state.message.chats
    };
};

const mapDispatchToProps = dispatch => {
  return {
    changeProfilePic: (profilePic) => dispatch(exploreActions.changeProfilePic(profilePic)),
    changeProfilePicAuth: profilePic => dispatch(authActions.changeProfilePicAuth(profilePic)),
    closeProfile: () => dispatch(exploreActions.closeProfile()),
    grabUserCredentials: () => dispatch(authActions.grabUserCredentials()),
    updateFollowers: (followerList) => dispatch(authActions.updateFollowers(followerList))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfile);
