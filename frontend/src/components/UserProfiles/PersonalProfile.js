import React from 'react';
import axios from 'axios';
import { authAxios } from '../util';
import { connect } from "react-redux";
import { Form } from '@ant-design/compatible';
import { Button, Modal, Avatar } from 'antd';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import defaultPicture from '../images/default.png';
import ava1 from '../images/avatar.jpg'
import SocialCalendar from '../../containers/SocialCalendarFolder/SocialCalendar';
import FollowList from './FollowList';
import '@ant-design/compatible/assets/index.css';
import './ProfilePage.css';



class PersonalProfile extends React.Component{
  constructor(props) {
    super(props);
  }

  state = {
    followerShow: false,
    followingShow: false,
    // following: false,
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  componentDidMount(){
    this.showPanel(0, 'transparent')

  }

  // on click add friend starts here
      onClickSend = (e) =>{
        e.preventDefault()
        const username = this.props.match.params.username;
        // axios.default.headers = {
        //   "Content-type": "application/json",
        //   Authorization: `Token ${this.props.token}`
        // }
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
        const notificationObject  = {
          command: 'send_friend_notification',
          actor: this.props.currentUser,
          recipient: this.props.match.params.username,
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

        console.log(this.props.curProfile)
        if(this.props.curProfile){
          console.log(this.props.curProfile.profile_picture)
          if(this.props.curProfile.profile_picture){
            profileImage = 'http://127.0.0.1:8000'+this.props.curProfile.profile_picture
          }
        }

        console.log(profileImage)
        return (
          <div className = 'profilePic'>

            <Avatar size = {180} src = {profileImage} />
          </div>
        )
      }

      renderCalPostPic = () => {
        return(
          <div className = 'cal-post-pic'>
            {this.onRenderTabs()}
          </div>

        )
      }

      onFollow = (follower, following) =>{
        // This is to send a follow into the back end
        // It will use the id of the user to get the user and add the following
        ExploreWebSocketInstance.sendFollowing(follower, following)
        // The follower is you who is sending the reqwuest and the following is the other person
        const notificationObject = {
          command: 'send_follow_notification',
          actor: this.props.currentUser,
          recipient: this.props.curProfile.username
        }

        NotificationWebSocketInstance.sendNotification(notificationObject)
      }


      onUnfollow = (follower, following) => {
        // This will send an unfollow into the back end
        // It will pretty muchh just delete the follower and following
        ExploreWebSocketInstance.sendUnFollowing(follower, following)
      }

      // onFollowingOrNot = (username) => {
      //   // This function will check if the use is following the targeted user
      //   // or not. If they are it will show a unfollow button if they are not then they
      //   // will show a follow button
      //   if (this.props.data){
      //     if (this.props.followers){
      //       const followers = this.props.data.get_followers
      //       console.log(followers)
      //       for (let i = 0; i < followers.length; i++){
      //         if(followers[i].username === this.props.currentUser.toString()){
      //           this.setState({
      //             following: true
      //           })
      //         }
      //       }
      //     }
      //   }
      //
      //
      //
      // }

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

        if (this.props.curProfile){
          username = this.props.curProfile.username
          firstName = this.props.curProfile.first_name
          lastName = this.props.curProfile.last_name
          bio = this.props.curProfile.bio
          following = this.props.curProfile.get_following
          posts = this.props.curProfile.get_posts
          profileId = this.props.curProfile.id

          if(this.props.curProfile.get_followers){
            for(let i =0; i<this.props.curProfile.get_followers.length; i++){
              followers.push(
                this.props.curProfile.get_followers[i].username
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


          </div>

          </div>

          </div>

        )

      }

      showPanel = (panelIndex, colorCode) =>{
        var tabButtons= document.querySelectorAll('.profile-tabContainer .profile-buttonContainer .profile-Tab')
        var tabPanels= document.querySelectorAll('.profile-tabContainer .profile-tabPanel')
        if (tabButtons.length > 0 && tabPanels.length > 0){
          tabButtons.forEach(function(node){
            node.style.backgroundColor = "";
            node.style.color = "";
          })
          tabButtons[panelIndex].style.backgroundColor = colorCode;
          tabButtons[panelIndex].style.color = '#363636';
          tabPanels.forEach(function(node){
            node.style.display = 'none'
          })
          tabPanels[panelIndex].style.display = 'block';
          tabPanels[panelIndex].style.backgroundColor = colorCode;

        }

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

    onRenderTabs= () => {
      var tabs = document.getElementsByClassName('profile-Tab');
      Array.prototype.forEach.call(tabs, function(tab) {
  	       tab.addEventListener('click', setActiveClass);
      });

      function setActiveClass(evt) {
  	       Array.prototype.forEach.call(tabs, function(tab) {
  		          tab.classList.remove('profile-active');
  	           });

  	            evt.currentTarget.classList.add('profile-active');
              }

      return (
        <div className = 'profile-tabContainer'>
          <div className = 'profile-buttonContainer'>
            <div className = 'profile-description_tab profile-active profile-Tab' onClick = {() => this.showPanel(0, 'transparent')} > Calendar</div>
            <div className = 'profile-description_tab profile-Tab' onClick = {() => this.showPanel(1, 'transparent')}> Posts </div>
            <div className = 'profile-description_tab profile-Tab' onClick = {() => this.showPanel(2, 'transparent')}> Events </div>
            <div className = 'profile-slider'></div>
          </div>
          <div className = 'profile-tabPanel'>
            <SocialCalendar {...this.props}/>
           </div>
          <div className = 'profile-tabPanel'> Tab 2: Content </div>
          <div className = 'profile-tabPanel'> Tab 3: Content </div>
        </div>
      )
    }

  render(){

      let followers = []
      let following = []
      console.log(this.props)
      if (this.props.dacurProfileta){
        if(this.props.curProfile.get_followers){
          followers = this.props.curProfile.get_followers
        }
        if(this.props.curProfile.get_following){
          following = this.props.curProfile.get_following
        }
      }

      return(
        <div className = 'profilePage'>
        {this.renderProfilePic()}
        {this.onRenderProfileInfo()}
        {this.onRenderTabs()}

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
      token: state.auth.token
      };
    };

export default connect(mapStateToProps)(PersonalProfile);
