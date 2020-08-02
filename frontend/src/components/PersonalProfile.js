import React from 'react';
import axios from 'axios';
import {Button, Form} from 'antd';
import { authAxios } from '../components/util';
import NotificationWebSocketInstance from '../../src/notificationWebsocket';
import ExploreWebSocketInstance from '../../src/exploreWebsocket';
import { connect } from "react-redux";
import './ProfileComponents/ProfilePage.css';
import background1 from './images/background1.jpg';
import ava1 from './images/avatar.jpg'
import SocialCalendar from '../containers/SocialCalendar'



class PersonalProfile extends React.Component{
  constructor(props) {
    super(props);
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

      renderImage = () => {

        return(
          <div className = 'background'>
            <img className = 'backgroundImage' src = {background1}  alt = 'background'/>
          </div>
        )

      }

      renderProfilePic = () => {
        return (
          <div className = 'profilePic'>
            <img  className = 'profile-pic' src = {ava1} alt = 'profilePic' />
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
          recipient: this.props.data.username
        }

        NotificationWebSocketInstance.sendNotification(notificationObject)
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
        let followers = ''
        let following = ''
        let posts = ''
        let profileId = ''

        if (this.props.data){
          username = this.props.data.username
          firstName = this.props.data.first_name
          lastName = this.props.data.last_name
          bio = this.props.data.bio
          followers = this.props.data.get_followers
          following = this.props.data.get_following
          posts = this.props.data.get_posts
          profileId = this.props.data.id
        }
        console.log(firstName)
        console.log(following)
        console.log(this.props.currentId)
        console.log(following.includes(this.props.currentId.toString()))

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
              <div className = 'followItem'>
                <span
                className = 'postFollowWords'
                >Followers</span>
                <br />
                <span>{followers.length}</span>
              </div>
              <div className = 'followItem'>
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
            <div className = 'unFollowButton'>
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
            <SocialCalendar />
           </div>
          <div className = 'profile-tabPanel'> Tab 2: Content </div>
          <div className = 'profile-tabPanel'> Tab 3: Content </div>
        </div>
      )
    }

  render(){

      console.log(this.props)

      return(
        <div className = 'profilePage'>
        {this.renderProfilePic()}
        {this.onRenderProfileInfo()}
        {this.onRenderTabs()}
        </div>
      )

    }
    };

const mapStateToProps = state => {
    return {
      currentId: state.auth.id,
      currentUser: state.auth.username,
      token: state.auth.token
      };
    };

export default connect(mapStateToProps)(PersonalProfile);
