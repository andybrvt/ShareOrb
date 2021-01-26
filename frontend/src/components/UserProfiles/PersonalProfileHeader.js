import React from 'react';
import { connect } from "react-redux";
import { Button, Modal, Avatar, Steps, Divider, message } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import { authAxios } from '../util';
import EditProfileForm from './EditProfile/EditProfileForm';
import ChangeBackgroundModal from '../../containers/PersonalCalendar/EventPage/ChangeBackgroundModal.js';
import FollowList from './FollowList';
import FollowersList from './FollowersList';

class PersonalProfileHeader extends React.Component{
  state = {
    followerShow: false,
    followingShow: false,
    showProfileEdit: false,
    showProfilePicEdit: false,
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


  onDirectMessages = () => {
    // This function will be used be used to direct the page to the chats
    // when someone clicks on the message button


    let profileId = ""
    let userId = ""
    if(this.props.profile.id){
        profileId = this.props.profile.id
    }
    if(this.props.currentId){
      userId= this.props.currentId
    }


    console.log(profileId)
    authAxios.post(`${global.API_ENDPOINT}/newChat/getExisitingChat`, {
      user1: profileId,
      user2: userId
    })
    .then(res => {
      console.log(res.data)
      if(res.data !== "No chat"){
        // When there is a chat that exist
        this.props.history.push("/chat/"+res.data)
      } else {
        // When there is  not chat that exist
      }

    })
  }


  onUnfollow = (follower, following) => {
    // This will send an unfollow into the back end
    // It will pretty muchh just delete the follower and following

    ExploreWebSocketInstance.sendUnFollowing(follower, following)
    this.props.grabUserCredentials()

  }

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

  }

  successFollow = () => {
    message.success('You accepted a follower.');
  };


  openProfileEdit = () => {
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfileEdit: true,
      })
    }
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

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  onFollowerOpen = () => {
    // This is used to open up the follower list
    this.setState({
      followerShow: true
    })
  }

  onFollowingOpen = () => {
    // This is used to open up the following list
    this.setState({
      followingShow: true
    })
  }



  closeProfileEdit = () => {
    // You wanna check if the person open and opening is the current user
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfileEdit: false,
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

  onOpenChangeProfilePic = () => {
    if(this.props.parameter.username === this.props.currentUser){
      this.setState({
        showProfilePicEdit: true
      })
    }
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


  onFollowerCancel = () => {
    // This is used to close the follower list
    this.setState({
      followerShow: false
    })
  }

  onFollowingCancel = () => {
    // This is to close the following list
    this.setState({
      followingShow: false
    })
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
          className = "picture"
          onClick = {() => this.onOpenChangeProfilePic()}
          size = {125}
          src = {`${global.IMAGE_ENDPOINT}`+profileImage} />

      </div>

    )
  }


  render(){
    console.log(this.props)
    let username = ''
    let firstName = ''
    let lastName = ''
    let followers = []
    let fulFollowers = []
    let following = []
    let fulfollowing = []
    let posts = ''
    let profileId = ''
    let friends = []
    let curId = ''
    let bio=''
    let profilePic = ""

    // Requested will be froe the other user so you can know if you reqested them
    let requested = []

    // curRequested is your requst to show whether or not you can accept
    let curRequested = []

    let curCurRequested = []
    // userObj will be the object used tos end into teh auth in order to update
    // the follower and following
    let userObj = {}

    if(this.props.currentId){
      curId = this.props.currentId
    }
    if(this.props.curRequested){
      curCurRequested = this.props.curRequested
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
      if(this.props.profile.profile_picture){
        profilePic = this.props.profile.profile_picture
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

      if(this.props.profile.get_followers){
        if(this.props.profile.id === this.props.currentId){
          fulFollowers = this.props.followers
        } else {
          fulFollowers = this.props.profile.get_followers
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

    return (
      <div class="profileEventCard">
          <div class="parentFlexContainer">

            <div className = "picFollowerHolder">
              {this.renderProfilePic()}
              <div className = 'profilePostFollow'>
                <div
                onClick = {() => this.onFollowerOpen()}
                className = 'followItem'>


                  <div
                  className = 'postFollowWords'
                  >Followers</div>
                  <div
                    className = "postFollowNum"
                    >{followers.length}</div>
                </div>
                <div
                onClick = {() => this.onFollowingOpen()}
                className = 'followItem'>
                  <div
                  className = 'postFollowWords'
                  >Following</div>
                  <div
                    className = "postFollowNum"
                    >{following.length}</div>
                </div>
              </div>
            </div>




            <div className = "nameBioHolder">
              <span className = 'profileName'>
                {this.capitalize(firstName)} {this.capitalize(lastName)}
              </span>
              <br />
              <span class="profileUserName">{"@"+this.props.username}</span>
              <div class="profileBio">{bio}</div>

            </div>





            <div className = "buttonHolder">
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
                  {  (curRequested.includes(profileId)) ?
                    <div>
                      <Button
                        type="primary"
                        shape="round"
                        onClick = {() => this.onAcceptFollow(profileId, curId)}
                        icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                        style={{fontSize:'15px'}} size={'large'}>
                        Accept
                      </Button>
                    </div>

                    :
                    followers.includes(this.props.currentUser.toString()) ?
                    <div>

                      <Button
                        type="primary"
                        shape="round"
                        icon={<i  style={{marginRight:'10px'}} class="fas fa-user-minus"></i>}
                        onClick = {() => this.onUnfollow(this.props.currentId, profileId)}
                        style={{fontSize:'15px'}} size="large">
                        Unfollow
                      </Button>
                      <br />
                      <br />
                      <Button
                        type="primary"
                        shape="round"
                        icon={<i  style={{marginRight:'10px'}} class="far fa-comment"></i>}
                        onClick = {() => this.onDirectMessages()}
                        style={{fontSize:'15px'}} size="large"
                        >
                        Message
                      </Button>

                    </div>
                    :
                    <div>
                    {
                        requested.includes(this.props.currentId) ?
                        <Button
                          type="primary"
                          shape="round"
                          icon={<i  style={{marginRight:'10px'}} class="fas fa-user-edit"></i>}
                          style={{fontSize:'15px'}} size="large"
                          onClick = {() => this.onUnRequest(this.props.currentId, profileId)}
                          > Requested </Button>

                        :

                        <Button
                          type="primary"
                          shape="round"
                          icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                          style={{fontSize:'15px'}} size="large"
                          onClick = {() => this.onFollow(this.props.currentId, profileId)}
                          > Follow
                        </Button>

                    }
                    </div>
                  }
                  </div>
              }
            </div>
        </div>

        <Modal
        visible = {this.state.showProfileEdit}
        onCancel = {() => this.closeProfileEdit()}
        footer = {null}
        width={700}
        bodyStyle={{padding:'25px'}}
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
            request = {curCurRequested}
            follow = {fulFollowers}
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

export default PersonalProfileHeader;
