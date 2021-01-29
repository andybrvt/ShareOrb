// This would be the post page for the personal profile

import React from 'react';
import axios from 'axios';
import { Route, useLocation, Switch, Link} from 'react-router-dom';
import { authAxios } from '../../components/util';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { Button, Modal, Avatar, Steps, Divider, message} from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import * as exploreActions from '../../store/actions/explore';
import * as authActions from '../../store/actions/auth';
import '../../components/UserProfiles/ProfilePage.css';
import ChangeProfilePic from '../CurrUser/ChangeProfilePic';
import FollowList from '../../components/UserProfiles/FollowList';
import UserPostList from './UserPostList';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import EditProfileForm from '../../components/UserProfiles/EditProfile/EditProfileForm';
import FollowersList from '../../components/UserProfiles/FollowersList';
import PersonalProfileHeader from '../../components/UserProfiles/PersonalProfileHeader';



const { Step } = Steps


class PersonalProfilePostList extends React.Component{
  constructor(props){
    super(props);
    // this.initialiseProfile()

  }

  state = {
    followerShow: false,
    followingShow: false,
    showProfileEdit: false,
    showProfilePicEdit: false,
    current: 1,
    // showFriendConfirm: false,
    // showUnfriend: false,

  }

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
      // put remove redux functions here
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

  onCalendarTabClick = () => {
    this.props.history.push("/explore/"+ this.props.parameter.username)
  }

  onRenderTabs= () => {
    const location = this.props.location.pathname

    return (
      <div className = 'profile-tabContainer'>
        <div style={{
        background:'white'}} class="stepTab">
        <Steps
          type="navigation"
          size="large"
          current={1}
          onChange={this.onChange}>
          <Step
            title="Calendar"
            icon={<i class="far fa-calendar-alt"></i>}
            onClick = {() => this.onCalendarTabClick()}
            style = {{
              cursor: "pointer"
            }}
          />

          {/*  PersonalProfilePostList.js */}
          <Step
            title="Posts"
            onClick = {() => this.onPostTabClick()}
            icon={<i class="far fa-edit"></i>}
            style = {{
              cursor: "pointer"
            }}
            />

          {/*  PersonalProfileEventList.js */}

          <Step
            title="Events"
            onClick = {() => this.onEventTabClick()}
            icon={<i class="fas fa-users"></i>}
            style = {{
              cursor: "pointer"
            }}
            />
        </Steps>
        </div>


        <div className = 'profile-tabPanel'>
          <UserPostList
          posts = {this.props.profile.get_posts}
          cells = {this.props.profile.get_socialCal}
          allpost = {this.props.profile.get_allPost}
          location = {location}
           />

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
    let location = ""
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

      if(this.props.profile.requested){
        requested = this.props.profile.requested
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

    return (
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
      following: state.auth.following
    };
};

const mapDispatchToProps = dispatch => {
  return {
    changeProfilePic: (profilePic) => dispatch(exploreActions.changeProfilePic(profilePic)),
    closeProfile: () => dispatch(exploreActions.closeProfile()),
    changeProfilePicAuth: profilePic => dispatch(authActions.changeProfilePicAuth(profilePic)),
    grabUserCredentials: () => dispatch(authActions.grabUserCredentials()),
    updateFollowers: (followerList) => dispatch(authActions.updateFollowers(followerList))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfilePostList);
