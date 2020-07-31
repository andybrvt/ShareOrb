import React from 'react';
import { Tabs, Statistic } from 'antd';
import axios from 'axios';
import { authAxios } from '../../components/util';
import './CurrUserProfile.css';
import SocialCalendar from '../SocialCalendar';
import background1 from '../../components/images/background1.jpg';
import ava1 from '../../components/images/avatar.jpg'
import ExploreWebSocketInstance from '../../exploreWebsocket';


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

class CurrUserProfile extends React.Component{
  constructor(props) {
    super(props);
  }
  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  componentDidMount(){
    this.showPanel(0, 'transparent')
    

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

     // if (this.props.data){
     //   username = this.props.data.username
     //   firstName = this.props.data.first_name
     //   lastName = this.props.data.last_name
     //   bio = this.props.data.bio
     //   followers = this.props.data.get_followers
     //   following = this.props.data.get_following
     //   posts = this.props.data.get_posts
     //   profileId = this.props.data.id
     // }
     // console.log(firstName)
     // console.log(following)
     // console.log(this.props.currentId)
     // console.log(following.includes(this.props.currentId.toString()))

     return (
       <div className = 'profileInfo'>

         <div>
           <div className = 'profileName'>
            ADMIN
           </div>


         <div className = 'profilePostFollow'>
           <div className = 'followItem'>
             <span
             className = 'postFollowWords'
             >Post</span>
             <br />
             <span></span>
           </div>
           <div className = 'followItem'>
             <span
             className = 'postFollowWords'
             >Followers</span>
             <br />
             <span></span>
           </div>
           <div className = 'followItem'>
             <span
             className = 'postFollowWords'
             >Following</span>
             <br />
             <span></span>
           </div>
         </div>

         <div className = 'profileBio'>
         {bio}
         </div>
       <div>

       <div className = 'selfProfileButtons'>


         <div className = 'editProfileButton'>
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
           <div className = 'profile-description_tab profile-active profile-Tab' onClick = {() => this.showPanel(0, 'transparent')} > People</div>
           <div className = 'profile-description_tab profile-Tab' onClick = {() => this.showPanel(1, 'transparent')}> Posts </div>
           <div className = 'profile-description_tab profile-Tab' onClick = {() => this.showPanel(2, 'transparent')}> Events </div>
           <div className = 'profile-slider'></div>
         </div>
         <div className = 'profile-tabPanel'>
           Tab 1: Content
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

export default CurrUserProfile;
