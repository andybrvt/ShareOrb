// This would be the post page for the personal profile

import React from 'react';
import axios from 'axios';
import { Route, useLocation, Switch, Link } from 'react-router-dom';
import { authAxios } from '../../components/util';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { Button, Modal, Avatar } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import * as exploreActions from '../../store/actions/explore';
import '../../components/UserProfiles/ProfilePage.css';
import ChangeProfilePic from '../CurrUser/ChangeProfilePic';
import FollowList from '../../components/UserProfiles/FollowList';
import UserPostList from './UserPostList';
import ExploreWebSocketInstance from '../../exploreWebsocket';



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

  closeProfileEdit = () => {
    // You wanna check if the person open and opening is the current user
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfileEdit: false,
      })
    }
  }

  openProfileEdit = () => {
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfileEdit: true,
      })
    }
  }

  openChangeProfilePic = () => {
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfilePicEdit: true
      })
    }
  }

  closeChangeProfilePic = () => {
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfilePicEdit: false,
      })
    }
  }

  renderEditButton = () => {
    return (
      <div className = 'editButton' onClick = {() => this.openChangeProfilePic()}>
       <RetweetOutlined />

      </div>
    )
  }

  handleProfilePicChange = (values) => {
    // This is used to changing the profile pic, for submiting.
    console.log(values)
    const userId = this.props.profile.id
    var data  = new FormData()
    data.append('profile_picture', values)
    // To edit information, you usually do put instead of post
    authAxios.put('http://127.0.0.1:8000/userprofile/profile/update/'+userId,
      data
    ).then(res => {
      this.props.changeProfilePic(res.data.profile_picture.substring(21,))
    })

// PROBALLY ADD IN THE REDUX LIKE EVENT PAGE
    this.closeChangeProfilePic();

  }

  // on click add friend starts here
  onClickSend = (e) =>{
    e.preventDefault()
    const username = this.props.parameter.username;
    // axios.default.headers = {
    //   "Content-type": "application/json",
    //   Authorization: `Token ${this.props.token}`
    // }
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
    const notificationObject  = {
      command: 'send_friend_notification',
      actor: this.props.currentUser,
      recipient: this.props.parameter.username,
    }
    // NotificationWebSocketInstance.disconnect()
    // NotificationWebSocketInstance.connect(this.props.match.params.username)
    NotificationWebSocketInstance.sendNotification(notificationObject)
    // NotificationWebSocketInstance.connect(this.props.currentUser)

    }


    onClickCancel = (e) =>{
      // const username = this.props.match.params.username;
      // authAxios.post('http://127.0.0.1:8000/friends/friend-request/cancel/'+username)
      }

    onClickDeleteFriend = (e) =>{
      // This is used to delete friends
        // const username = this.props.match.params.username;
        // authAxios.post('http://127.0.0.1:8000/friends/remove-friend/'+username)
    }

    renderProfilePic = () => {

      let profileImage = null

      console.log(this.props.profile)
      if(this.props.profile){
        console.log(this.props.profile.profile_picture)
        if(this.props.profile.profile_picture){
          profileImage = 'http://127.0.0.1:8000'+this.props.profile.profile_picture
        }
      }

      console.log(profileImage)
      return (
        <div className = 'profilePic'>
          <Avatar size = {180} src = {profileImage} />
          {
            this.props.parameter.username === this.props.currentUser ?
            this.renderEditButton()

            :

            <div></div>
          }
        </div>
      )
    }

    renderCalPostPic = () => {
      // This is to display the 3 sections (cal, post, pic)
      // It allows you to switch between
      return(
        <div className = 'cal-post-pic'>
          {this.onRenderTabs()}
        </div>

      )
    }

    onFollow = (follower, following) =>{
      //Send a follow in the backend
      ExploreWebSocketInstance.sendFollowing(follower, following)

      // The follower is you who is sending the reqwuest and the following is the other person
      const notificationObject = {
        command: 'send_follow_notification',
        actor: this.props.currentUser,
        recipient: this.props.profile.username
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)
    }


    onUnfollow = (follower, following) => {
      // This will send an unfollow into the back end
      // It will pretty muchh just delete the follower and following

      ExploreWebSocketInstance.sendUnFollowing(follower, following)
    }


    onRenderProfileInfo(){
      // For the following and the follwers, the get_followers will be the people taht
      // are your followers and the people that are in
      // get following are the people taht are you are following, so they would be your
      // followers
      let username = ''
      let firstName = ''
      let lastName = ''
      let bio = ''
      let followers = []
      let following = []
      let posts = ''
      let profileId = ''

      if (this.props.profile){
        if(this.props.profile.username){
          username = this.props.profile.username
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
        if(this.props.profile.get_following){
          following = this.props.profile.get_following
        }
        if(this.props.profile.get_posts){
          posts = this.props.profile.get_posts

        }
        if(this.props.profile.id){
          profileId = this.props.profile.id

        }

        if(this.props.profile.get_followers){
          for(let i =0; i<this.props.profile.get_followers.length; i++){
            followers.push(
              this.props.profile.get_followers[i].username
            )
          }
        }
      }
    console.log(followers)

      return (
        <div className = 'profileInfo'>

          <div>
            <div className = 'profileName'>
              {this.capitalize(firstName)} {this.capitalize(lastName)}
            </div>


          <div className = 'profilePostFollow'>
            <div className = 'followItem'>
              <span
              className = 'postFollowWords'
              >Post</span>
              <br />
              <span>{posts.length}</span>
            </div>
            <div
            onClick = {() => this.onFollowerOpen()}
            className = 'followItem'>
              <span
              className = 'postFollowWords'
              >Followers</span>
              <br />
              <span>{followers.length}</span>
            </div>
            <div
            onClick = {() => this.onFollowingOpen()}
            className = 'followItem'>
              <span
              className = 'postFollowWords'
              >Following</span>
              <br />
              <span>{following.length}</span>
            </div>
          </div>

          <div className = 'profileBio'>
          {bio}
          </div>
        <div>

        {
            this.props.parameter.username === this.props.currentUser ?

            <div className = 'selfProfileButtons'>


              <div
              onClick = {() => this.openProfileEdit()}
              className = 'editProfileButton'>
                Edit Profile
              </div>

            </div>

            :

            <div className = 'profileButtons'>

            {followers.includes(this.props.currentUser.toString()) ?
              <div
              onClick = {() => this.onUnfollow(this.props.currentId, profileId)}
              className = 'unFollowButton'>
                Unfollow
              </div>

              :

              <div onClick = {() => this.onFollow(this.props.currentId, profileId)} className = 'followButton'>
                Follow
              </div>

            }




              <div className = 'messageButton'>
                Message
              </div>

            </div>

        }



        </div>

        </div>

        </div>

      )

    }


    onFollowerOpen = () => {
      // This is used to open up the follower list
      this.setState({
        followerShow: true
      })
    }

    onFollowerCancel = () => {
      // This is used to close the follower list
      this.setState({
        followerShow: false
      })
    }

    onFollowingOpen = () => {
      // This is used to open up the following list
      this.setState({
        followingShow: true
      })
    }

    onFollowingCancel = () => {
      // This is to close the following list
      this.setState({
        followingShow: false
      })
    }

    onCalendarTabClick = () => {
      this.props.history.push("/explore/"+ this.props.parameter.username)
    }

    onEventTabClick = () => {
      this.props.history.push("/explore/"+ this.props.parameter.username + "/events")
    }

    onRenderTabs= () => {
      const location = this.props.location.pathname

      return (
        <div className = 'profile-tabContainer'>
          <div className = 'profile-buttonContainer'>
            <div className = 'profile-description_tab profile-Tab'
            onClick = {() => this.onCalendarTabClick()}
            >
            Calendar
            </div>

            <div className = 'profile-description_tab profile-Tab-Post'
            > Posts </div>
            <div className = 'profile-description_tab profile-Tab'
            onClick = {() => this.onEventTabClick()}
            > Events </div>
          </div>
          <div className = 'profile-tabPanel'>
            <UserPostList
            posts = {this.props.profile.get_posts}
            cells = {this.props.profile.get_socialCal}
            location = {location}
             />

           </div>

        </div>
      )
    }







  render(){

    console.log(this.props)
    console.log(this.state)
    let followers = []
    let following = []
    let location = ""

    if (this.props.profile){
      if(this.props.profile.get_followers){
        followers = this.props.profile.get_followers
      }
      if(this.props.profile.get_following){
        following = this.props.profile.get_following
      }

    }




    return (
      <div className = {`profilePage ${this.props.location.state ? "active" : ""}`}>



      {this.renderProfilePic()}
      {this.onRenderProfileInfo()}
      {this.onRenderTabs()}
        <Modal
        visible = {this.state.showProfileEdit}
        onCancel = {() => this.closeProfileEdit()}
        >
        This is for editing the profile information
        </Modal>

        <ChangeProfilePic
           visible = {this.state.showProfilePicEdit}
           onCancel = {this.closeChangeProfilePic}
           onSubmit = {this.handleProfilePicChange}
         />

        <Modal
        visible ={this.state.followerShow}
        onCancel = {this.onFollowerCancel}
        footer = {null}
        >
        <span className ='followWord'> Followers</span>
        <FollowList follow = {followers} />
        </Modal>



        <Modal
        visible = {this.state.followingShow}
        onCancel = {this.onFollowingCancel}
        footer = {null}
        >
        <span className = 'followWord'>Following</span>
        <FollowList follow = {following}/>
        </Modal>




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
    };
};

const mapDispatchToProps = dispatch => {
  return {
    changeProfilePic: (profilePic) => dispatch(exploreActions.changeProfilePic(profilePic)),
    closeProfile: () => dispatch(exploreActions.closeProfile())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PersonalProfilePostList);
