import React from 'react';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { connect } from "react-redux";
import { Tabs, Statistic, Badge, Modal, Avatar } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';
import * as exploreActions from '../../store/actions/explore';
import SocialCalendar from '../SocialCalendarFolder/SocialCalendar';
import background1 from '../../components/images/background1.jpg';
import ava1 from '../../components/images/avatar.jpg'
import defaultPicture from '../../components/images/default.png'
import ExploreWebSocketInstance from '../../exploreWebsocket';
import ChangeProfilePic from './ChangeProfilePic';
import FollowList from '../../components/UserProfiles/FollowList';
import './CurrUserProfile.css';
import { EditOutlined } from '@ant-design/icons';

import {
  Button,
  Label,
  FormGroup,
  Input,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col
} from "reactstrap";


// Function: Profile of the current user
// THIS IS JUST A REMINDER FOR THE LIKING AND COMMENTING THAT FOR THE PROPS IT
// WILL BE SEPERATE FROM THAT USED FOR THE EXPLORE PROFILES SO YOU HAVE TO DO IT
//  SEPERATE IN REDUX --> THE REASON FOR THIS IS LATER ON WE HAVE TO EDIT THE
// PROFILE PAGE ALOT SO I DON'T WANT TO LOOP THROUGH TOO MUCH STUFF
class CurrUserProfile extends React.Component{
  constructor(props) {
    super(props);
    // this.initialiseExplore()
  }
  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
    followerShow: false,
    followingShow: false,
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  initialiseExplore(){
    // This will pretty much be for loading up the users following status, because
    // later we are gonna have a search function, so you want to throw this in one
    // of the very first things
    this.waitForSocketConnection(()=> {
      // ExploreWebSocketInstance.fetchCurrentUserProfile(this.props.currentUser)
    })
  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){

        if (ExploreWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  componentDidMount(){
    this.showPanel(0, 'transparent')
    console.log(this.props)
    // ExploreWebSocketInstance.fetchCurrentUserProfile(this.props.currentUser)
   }

   closeProfileEdit = () => {
     this.props.closeProfileEdit()
   }

   openProfileEdit = () =>{
     this.props.openProfileEdit()
   }

   openChangeProfilePic = () =>{
     this.props.openChangeProfilePic()
   }

   closeChangeProfilePic = () => {
     this.props.closeChangeProfilePic()
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
     const userId = this.props.curProfile.id
     var data  = new FormData()
     data.append('profile_picture', values)
     // To edit information, you usually do put instead of post
     authAxios.put('http://127.0.0.1:8000/userprofile/profile/update/'+userId,
       data
     )

   }

   renderProfilePic = () => {
     // console.log(this.props.curProfile)
     let profileImage = null

     if (this.props.curProfile){
       if(this.props.curProfile.profile_picture){
         profileImage = 'http://127.0.0.1:8000'+this.props.curProfile.profile_picture
       }
     }

     console.log(profileImage)
     return (
       <div className = 'curProfilePic'>

       <Avatar size = {180} src = {profileImage} />
       {this.renderEditButton()}


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

     // ExploreWebSocketInstance.sendFollowing(follower, following)
   }

   onUnfollow = (follower, following) => {
     // This will send an unfollow into the back end
     // It will pretty muchh just delete the follower and following

     // ExploreWebSocketInstance.sendUnFollowing(follower, following)
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

     if (this.props.curProfile){
       username = this.props.curProfile.username
       firstName = this.props.curProfile.first_name
       lastName = this.props.curProfile.last_name
       bio = this.props.curProfile.bio
       followers = this.props.curProfile.get_followers
       following = this.props.curProfile.get_following
       posts = this.props.curProfile.get_posts
       profileId = this.props.curProfile.id

     }
     // console.log(firstName)
     // console.log(following)
     // console.log(this.props.currentId)
     // console.log(following.includes(this.props.currentId.toString()))

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
             <span> {posts.length}</span>
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

       <div className = 'selfProfileButtons'>


         <div
         onClick = {() => this.openProfileEdit()}
         className = 'editProfileButton'>
           Edit Profile
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
     console.log(this.props)
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
       if (this.props.curProfile){
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
         visible = {this.props.showProfileEditModal}
         onCancel = {() => this.closeProfileEdit()}
         >
         This is for editing the profile information
         </Modal>


         <ChangeProfilePic
            visible = {this.props.changeProfilePic}
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



  };


const mapStateToProps = state => {
  return {
    currentUser: state.auth.username,
    curProfile: state.explore.profile,
    showProfileEditModal: state.explore.showProfileEdit,
    changeProfilePic: state.explore.changeProfilePic
  }
}

const mapDispatchToProps = dispatch =>{
  return {
    closeProfileEdit: () => dispatch(exploreActions.closeProfileEdit()),
    openProfileEdit: () => dispatch(exploreActions.openProfileEdit()),
    closeChangeProfilePic: () => dispatch(exploreActions.closeChangeProfilePic()),
    openChangeProfilePic: () => dispatch(exploreActions.openChangeProfilePic())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CurrUserProfile);
