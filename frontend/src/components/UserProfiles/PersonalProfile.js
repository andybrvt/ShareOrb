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
    let userId = ""
    if(this.props.currentId){
      userId = this.props.currentId

    }
    var data  = new FormData()
    data.append('profile_picture', values)
    // To edit information, you usually do put instead of post
    authAxios.put(`${global.API_ENDPOINT}/userprofile/profile/update/`+userId,
      data
    ).then(res => {
      console.log(res)
      this.props.changeProfilePic(res.data.profile_picture
        // .substring(21,)
      )
      this.props.changeProfilePicAuth(res.data.profile_picture
        // .substring(21,)
      )
    })

// PROBALLY ADD IN THE REDUX LIKE EVENT PAGE
    this.closeChangeProfilePic();

  }



    renderProfilePic = () => {

      let profileImage = null

      console.log(this.props.profile)
      if(this.props.profile){
        console.log(this.props.profile.profile_picture)
        if(this.props.profile.profile_picture){
          profileImage = this.props.profile.profile_picture
        }
      }

      console.log(profileImage)
      return (
        <div className = 'profilePic'>

          <Avatar
            onClick = {() => this.onOpenChangeProfilePic()}
            size = {150}

            src = {`${global.IMAGE_ENDPOINT}`+profileImage} />


          {
            this.props.parameter.username === this.props.currentUser ?
            this.renderEditButton()

            :

            <div></div>
          }

        </div>

      )
    }

    onOpenChangeProfilePic = () => {
      this.setState({
        showProfilePicEdit: true
      })
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

      let privatePro = ""
      if(this.props.profile.private){
        privatePro = this.props.profile.private
      }

      if(privatePro === true ){
        // true will be if the profile is private. If it is private then it will
        // send a request to follow. Once you send in the request, if the person
        // is following you (and the other person is approved) then you can
        // see the private. If the other person does not approve then you are not
        // following them and you cannot see their page


        // So if it is private then it will sned a request instead of a follow

        // Put request here

        console.log("send a request to follow")
        // pretty much you will send a notifcation here and then antd notifcaiton
        // to tell them that they want to follow you

        // You will use the id instead of username

        const notificationObject = {
          command: 'send_follow_request_notification',
          actor: this.props.currentId,
          recipient: this.props.profile.id
        }

        // Now you will send one for requested

        // MAKE SURE TO UPDATE THE AUTH TOO

        // You have to figure out a way to grab the follower form here because
        // you cannot grab it in the explore WebSocket bc that will be sent
        // to everyone else

        ExploreWebSocketInstance.sendFollowRequest(follower, following)

        NotificationWebSocketInstance.sendNotification(notificationObject)

      } else {
        // MAKE SURE TO UPDATE THE AUTH TOO

        ExploreWebSocketInstance.sendFollowing(follower, following)

        // This is to update the AUTH
        this.props.grabUserCredentials()
        console.log('it hits here')

        // The follower is you who is sending the reqwuest and the following is the other person
        const notificationObject = {
          command: 'send_follow_notification',
          actor: this.props.currentId,
          recipient: this.props.profile.id
        }

        NotificationWebSocketInstance.sendNotification(notificationObject)
      }


    }

    onUnRequest = (follower, following) => {
      // This is to undo the request if you did send one (make sure you delete
      // the notification as well )

      // Probally gonna do a delete notification here
      ExploreWebSocketInstance.unSendFollowRequest(follower, following)

      // Pretty much this will unsend the notification for follow and stuff
      const notificationObject = {
        command: 'unsend_follow_request_notification',
        actor: this.props.currentId,
        recipient: this.props.profile.id
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)

    }


    onUnfollow = (follower, following) => {
      // This will send an unfollow into the back end
      // It will pretty muchh just delete the follower and following

      ExploreWebSocketInstance.sendUnFollowing(follower, following)
      this.props.grabUserCredentials()

    }

    successFollow = () => {
      message.success('You accepted a follower.');
    };

    onAcceptFollow = (follower, following) => {
      // This function will used to accept the follower, allow request and delete the notifications
      // The follower parameter will be the actor of the notification (it will be the
      // person trying to request)
      // The following parameter will be the recipient or in this case the person who
      // is accepting the follow

      // Make the process teh same as the onAcceptFollow on notification drop
      // down but with the explorewebsocketinstance
      authAxios.post(`${global.API_ENDPOINT}/userprofile/approveFollow`, {
        follower: follower,
        following: following
      })
      .then(res => {
        // This will update the current user auth
        this.props.updateFollowers(res.data)
        // This wil update the following for the user page
        ExploreWebSocketInstance.sendAcceptFollowing(follower)

        // Now delete the notification
        const notificationObj = {
          command: 'unsend_follow_request_notification',
          actor: follower,
          recipient: following
        }
        NotificationWebSocketInstance.sendNotification(notificationObj)

        // Now you have to send a notification ot the other perosn saying
        // that you accept their request

        const notificationObject = {
          command: 'accept_follow_request',
          actor: following,
          recipient: follower
        }
        // Then send out a notification
        NotificationWebSocketInstance.sendNotification(notificationObject)

        this.successFollow()
      })





      // Now up date your credentials
      // this.props.grabUserCredentials()

      // This function will include redux to update the auth as well


    }


    onRenderProfileInfo(){
      // For the following and the follwers, the get_followers will be the people taht
      // are your followers and the people that are in
      // get following are the people taht are you are following, so they would be your
      // followers
      let username = ''
      let firstName = ''
      let lastName = ''
      let followers = []
      let following = []
      let posts = ''
      let profileId = ''
      let friends = []
      let curId = ''
      let bio=''

      // Requested will be froe the other user so you can know if you reqested them
      let requested = []

      // curRequested is your requst to show whether or not you can accept
      let curRequested = []

      // userObj will be the object used tos end into teh auth in order to update
      // the follower and following
      let userObj = {}

      if(this.props.currentId){
        curId = this.props.currentId
      }
      if(this.props.curRequested){
        for(let i = 0; i< this.props.curRequested.length; i++){
          curRequested.push(
            this.props.curRequested[i].id
          )
        }
      }

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
        if(this.props.profile.get_following){
          if(this.props.profile.id === this.props.currentId){
            // This one is to change the following list to be same as the auth if
            // you are on your own page

            following = this.props.following
          } else {
            // This is for everyone else
            following = this.props.profile.get_following
          }

        }
        if(this.props.profile.get_posts){
          posts = this.props.profile.get_posts

        }
        if(this.props.profile.id){
          profileId = this.props.profile.id

        }
        if(this.props.profile.bio !== null){
          bio = this.props.profile.bio
        }

        if(this.props.profile.get_followers){
          if(this.props.profile.id === this.props.currentId){
            // Same deal as teh followers
            for(let i =0; i<this.props.followers.length; i++){
              followers.push(
                this.props.followers[i].username
              )
            }
          } else {
            for(let i =0; i<this.props.profile.get_followers.length; i++){
              followers.push(
                this.props.profile.get_followers[i].username
              )
            }
          }

        }

        if(this.props.profile.private){
          if(this.props.profile.get_follow_request){
            for(let i= 0; i<this.props.profile.get_follow_request.length; i++){
                requested.push(
                  this.props.profile.get_follow_request[i].id
                )
            }
          }
        }



      }
    console.log(friends)

      return (
      <div>

        <div className = 'profileInfo'>

          <div>

            <div className = 'profilePostFollow'>

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



          <div>

        {
            this.props.parameter.username === this.props.currentUser ?

            <div className = 'selfProfileButtons'>

               <Button
                  onClick = {() => this.openProfileEdit()}
                  type="primary"
                  shape="round"
                  icon={<i  style={{marginRight:'10px'}} class="fas fa-user-edit"></i>}
                  style={{fontSize:'15px'}} size={'large'}>

                 Edit Profile
               </Button>
            </div>

            :

            <div className = 'profileButtons'>
            {  curRequested.includes(profileId) ?

              <div
              style={{
                paddingTop: "7px",
                fontSize:'16px'}}
              onClick = {() => this.onAcceptFollow(profileId, curId)}
              className = 'followButton'>
                Accept
              </div>

              :

              followers.includes(this.props.currentUser.toString()) ?
              <div
              style={{
                paddingTop: "7px",
                ontSize:'16px'}}
              onClick = {() => this.onUnfollow(this.props.currentId, profileId)}
              className = 'followButton'>
                Unfollow
              </div>



              :

              <div>
              {
                  requested.includes(this.props.currentId) ?

                  <Button
                    style={{fontSize:'16px'}}
                    onClick = {() => this.onUnRequest(this.props.currentId, profileId)}
                     className = 'followButton'
                    id="follow-button"> Requested </Button>

                  :

                  <Button
                    style={{fontSize:'16px'}}
                    onClick = {() => this.onFollow(this.props.currentId, profileId)}
                     className = 'followButton'
                    id="follow-button"> Follow </Button>

              }
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

    onPostTabClick = () => {
      this.props.history.push("/explore/"+ this.props.parameter.username+"/posts")

    }

    onEventTabClick = () => {
      this.props.history.push("/explore/"+this.props.parameter.username +"/events")
    }


    onSaveEdit = (values) => {
      // This function will be called when you make a change on the profile infomraiton
      // and then save it. Pretty much it will get informaiton form the editprofileform
      // that was change and then get sent into the channel and then update it in the back
      // end then that information will get sent back into the frot end and changed


      //The currentId would not be using for the editing the user but rather find the
      // user. And since the current user can only edit its own page, the current
      // user id should be good
      console.log(values)

      const editProfileObj = {
        first_name: values.first_name,
        last_name: values.last_name,
        bio: values.bio,
        email: values.email,
        phone_number: values.phone_number,
        userId: this.props.currentId
      }

      ExploreWebSocketInstance.editChangeProfile(editProfileObj)

      this.closeProfileEdit()
    }

    getInitialValue = () => {
      // This function will get the initial value of the edit profile page, which
      // in this case is the name, last name, bio, picture etc what ever else you
      // wanna edit

      if(this.props.profile){
        let firstName = "";
        let lastName = "";
        let bio = "";
        let phone_number = "";
        let email = "";
        if(this.props.profile.first_name){
          firstName = this.props.profile.first_name
        }
        if(this.props.profile.last_name){
          lastName = this.props.profile.last_name
        }
        if(this.props.profile.bio !== null){
          bio = this.props.profile.bio
        }
        if(this.props.profile.phone_number){
          phone_number = this.props.profile.phone_number
        }
        if(this.props.profile.email){
          email = this.props.profile.email
        }

        return {
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          phone_number: phone_number,
          email: email,
        }
      }


    }

    onRenderTabs= () => {
      return (
        <div>

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
          <Divider style={{marginTop:'-1px', marginBot:'-1px'}}/>

          <div className = 'profile-tabPanel'>

              <SocialCalendar {...this.props}/>

           </div>

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

          <div class="profileEventCard" style={{marginTop:'50px', height:'300px', padding:'25px'}}>

            <div class="parentFlexContainer">

              {this.renderProfilePic()}

              <span className = 'profileName'>
                {this.capitalize(firstName)} {this.capitalize(lastName)}
                <br/>

              </span>
              <span class="profileUserName">{"@"+this.props.username}</span>
              <span class="profileBio">{bio}</span>
            </div>

            {this.onRenderProfileInfo()}

          </div>

          {
            privatePro ?
            this.onRenderPrivate()

            :

            this.onRenderTabs()

          }

          <Modal
          visible = {this.state.showProfileEdit}
          onCancel = {() => this.closeProfileEdit()}
          footer = {null}
          width={750}
          bodyStyle={{padding:'50px'}}
          centered
          >
            <EditProfileForm
              {...this.props}
              initialValues = {this.getInitialValue()}

              profilePic = {profilePic}
              onSubmit = {this.onSaveEdit}
              changeProfilePic = {this.props.changeProfilePic}
              changeProfilePicAuth = {this.props.changeProfilePicAuth}
              curId = {this.props.currentId}
             />
          </Modal>


          <ChangeBackgroundModal
            pic={profilePic}
            visible = {this.state.showProfilePicEdit}
            close = {this.closeChangeProfilePic}
            onSubmit = {this.handleProfilePicChange}
          />

          <Modal
            visible ={this.state.followerShow}
            onCancel = {this.onFollowerCancel}
            footer = {null}
            >
            <span className ='followWord'> Followers</span>
            <FollowersList
              curId = {this.props.currentId}
              profileId = {this.props.profile.id}
              request = {curRequested}
              follow = {followers}
              updateFollowers = {this.props.updateFollowers}
              />
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
      curUserFriend: state.auth.friends,
      curRequested: state.auth.requestList,
      followers: state.auth.followers,
      following: state.auth.following
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
