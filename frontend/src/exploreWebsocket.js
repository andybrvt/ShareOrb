// THIS WEBSOCKET WILL PRETTY MUCH BE USED FOR ALL THE FUNCTIONS THAT ARE
// RELATED TO THE PROFILE PAGES, ALL THE PROFILE PAGES, THIS INCLUDES
// YOU OWN PROFILE PAGE

import { connect } from 'react-redux';


class WebSocketExplore {
  static instance = null;
  callbacks = {}

  static getInstance() {
    if (!WebSocketExplore.instance){
      WebSocketExplore.instance = new WebSocketExplore()
    }
    return WebSocketExplore.instance
  }

  constructor() {
    this.socketRef = null
  }

  connect(username){
    const path = 'ws://127.0.0.1:8000/ws/explore/' + username
    // I place the connection path in the app.js
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {
      console.log('new message')
      this.socketNewExplore(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log(e.message);
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      // this.connect(username)
    }
  }

  disconnect() {
    console.log('disconnected')
    this.socketRef.close()
  }

  socketNewExplore(data){

    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)
    console.log(command === 'user_profile_page')

    if (command === "user_profile"){
      //STATUS REDONE

      const profile = JSON.parse(parsedData.profile)
      this.callbacks['load_profile'](profile)

    } else if (command === 'send_follower'){
      // STATUS REDONE

      // This is to add to the other person's followers
      const newFollowerList = parsedData.followerList
      this.callbacks['new_follower_unfollower'](newFollowerList)

    } else if (command === 'send_unfollower'){
      // STATUS REDONE

      // This is to un add the other person follower

      const newFollowerList = parsedData.followerList
      this.callbacks['new_follower_unfollower'](newFollowerList)


    } else if(command === 'send_social_event'){
      // STATUS REDONE

      // Two senarios, one is when a cell is created and one where there
      // already exist a cell and you just change the event field to the new
      // one

      //There is a add social cell method in the redux already so we can
      // reuse that and then we will have one where it just repalces
      // the whole event field

      const socialCalCellObj = parsedData.socialCalCellObj
      const socialCalCellEvents = parsedData.socialCalCellObj.get_socialCalEvent
      const cellId = parsedData.socialCalCellObj.id
      if(parsedData.created){
        // For new cell with new event
        console.log(socialCalCellObj)
        this.callbacks['add_social_cell'](socialCalCellObj)
      } else {
        // For old cell with new event
        this.callbacks['add_social_event_join_leave'](socialCalCellEvents, cellId)
      }
    } else if (command == 'add_user_social_event'){
      // STATUS REDONE

      console.log(parsedData)
      const socialEventList = parsedData.socialEventList
      const socialCellId = parsedData.socialCellId

      this.callbacks['add_social_event_join_leave'](socialEventList, socialCellId)

    } else if (command === "remove_user_social_event"){
      // STATUS REDONE

      const socialEventList = parsedData.socialEventList
      const socialCellId = parsedData.socialCellId

      this.callbacks['add_social_event_join_leave'](socialEventList, socialCellId)

    } else if( command === "add_user_social_event_page"){
      // For the event tabs on the profile page
      const socialEventList = parsedData.socialEventList

      // add callbacks here
      this.callbacks['add_social_event_join_leave_page'](socialEventList)
    } else if(command === "remove_user_social_event_page"){
      // for the event tabs on the profile pages
      // simlar to the else if above but make this so peple know what
      // functions there are

      const socialEventList = parsedData.socialEventList

      this.callbacks['add_social_event_join_leave_page'](socialEventList)

    } else if(command === "edited_profile"){
      // This will go in and update the profile information by just replacing
      // the whole profile with the new updated profile

      const updatedProfile = parsedData.editedProfile

      // Add the callbacks here
      this.callbacks['load_profile'](updatedProfile)
      this.callbacks['edit_profile_auth'](updatedProfile)
    } else if(command === 'add_user_close_friend'){
      // This will recieve the friend list of the current user that just added
      // a new user to the friend list. This will go into auth and replace the
      // the old friendlist

      const friendList = parsedData.friendList
      // add callbacks here
      this.callbacks['add_remove_close_friend'](friendList)

    } else if(command === 'remove_user_close_friend'){
      // This will pretty mcuh be the smae as the above command but now
      // you are reomoving a user from the friend list
      const friendList = parsedData.friendList

      this.callbacks['add_remove_close_friend'](friendList)
    } else if(command === 'approve_social_pics'){
      // This function will add in pending pictures to the social calendar in the
      // appropriate cell
      const socialCalCellObj = parsedData.socialCelCellObj

      if(parsedData.created){
        // if by approving the pending picture you created another social cell then
        // you would just add it in like ususal

        console.log('created pending pics')
        this.callbacks['add_social_cell'](socialCalCellObj)

      } else {
        // This is for when the social cal cell is alrady created so you just have
        // to add in more social cell items


        // create call back here to search for the social cell and then add the pics
        // in
        // YOU HONELSTY JUST NEED TO ADD COVER PIC HERE
        this.callbacks['add_cover_pic'](socialCalCellObj.coverPic, socialCalCellObj.id)

      }
    }


  }


// call backs will pretty much be holding all the redux functions
  addCallbacks(
     loadProfile,
     addFollowerUnfollowerCallBack,
     addSocialEventJoinLeave,
     addSocialCell,
     addSocialEventJoinLeavePage,
     editProfileAuth,
     addRemoveCloseFriend,
     addCoverPic,
   ){
    this.callbacks['load_profile'] = loadProfile
    this.callbacks['new_follower_unfollower'] = addFollowerUnfollowerCallBack
    this.callbacks['add_social_event_join_leave'] = addSocialEventJoinLeave
    this.callbacks['add_social_cell'] = addSocialCell
    this.callbacks['add_social_event_join_leave_page'] = addSocialEventJoinLeavePage
    this.callbacks['edit_profile_auth'] = editProfileAuth
    this.callbacks['add_remove_close_friend'] = addRemoveCloseFriend
    this.callbacks['add_cover_pic'] = addCoverPic
  }


  fetchProfile(username){
    // This will fetch the specific profile for the specific perosonal profile
    // page
    // The parameter username will be the username of the user (probally gonna
    // have to change it to id or a combination of id and username so we can pull
    // pull it easier and stuff like that)

    console.log(username)
    this.sendExplore({
      command: 'fetch_profile',
      username: username
    })
  }

  editChangeProfile(editProfileObj){
    // This function will recieve information when you edit an profile and will send
    // the new edited profile object whne you save the edit

    // The paraemeter editProfileObj will be an object that contains all the
    // new edited information

    this.sendExplore({
      command: 'edit_profile',
      editProfileObj: editProfileObj
    })

  }




  sendFollowing = (follower, following) => {
    // This function will set up the object and command to send
    // to the backend. The follower is the person sending the following
    // request and the following the person gettting the following

    // Call function to send following (have to send it both ways now) Now I just have
    // to send it into the single channe and rerender everytime (so much easier)
    // found in the curuserprofile and personalprofile


    this.sendExplore({
      follower: follower,
      following: following,
      command: 'send_following'
    })
  }

  sendUnFollowing = (follower, following) => {
    // This function will be used to set up for unfollowing the user
    // the follower again is the person doing the action and the following will
    // be the person receving the follow


    // Same spill as the send following

    this.sendExplore({
      follower: follower,
      following: following,
      command: 'send_unfollowing'
    })


  }

  sendSocialEvent = (eventObj) => {
    // The event object will be a dict of all the information on the event and
    // it will be sent into the consumers, There will be a same one that will be going
    // to the news feed

    //This will be creating a soical event on the event page (can be made pretty
    // easy with one single channel for that page ) Everytime you rerneder it will
    // show up again
    // This is in sendsocialeventpostmodal


    this.sendExplore({
      eventObj: eventObj,
      command: 'create_social_event'
    })
  }

  sendSocialEventParticipate = (userId, eventId, socialCalCellId) => {
    // This event obj will just be that of the event list as well as the user
    // who wants to join, so you will send it into the backend
    // We will be getting the id of the user and the id of the event


    // same deal with the sendsocialevent, should be made more efficient
    // Find this in both the eventlist

    console.log(userId, eventId)
    this.sendExplore({
      userId: userId,
      eventId: eventId,
      socialCalCellId: socialCalCellId,
      command: 'add_user_social_event'
    })
  }


  sendSocialEventLeave = (userId, eventId, socialCalCellId) => {
    // This will get the userId to know which user to remove,
    // eventId is to know which event to be removed from
    // socialCalcellid to know which cell to add into

    console.log(userId, eventId)

    //same deal as sendSocialEventParticipate

    this.sendExplore({
      userId: userId,
      eventId: eventId,
      socialCalCellId: socialCalCellId,
      command: 'remove_user_social_event'
    })

  }

  sendSocialEventJoinPage = (userId, ownerId, eventId) => {
    // Thsi will add the user to the events, this will be used
    // mostly for the event page instead of the calendar event it self

    // userId will be the person wanting to join
    //ownerId will be the person's profile that the event is on
    this.sendExplore({
      userId: userId,
      ownerId: ownerId,
      eventId: eventId,
      command: 'add_user_social_event_page'
    })
  }

  sendSocialEventLeavePage = (userId, ownerId, eventId) => {


    // This will remove the use form the events. Used for people leaving
    // the events

    this.sendExplore({
      userId: userId,
      ownerId: ownerId,
      eventId: eventId,
      command: 'remove_user_social_event_page'
    })
  }

  sendAddCloseFriend = (curId, friendId) => {
    // This will add friend with someone one, you will add them as close friend
    // and then give them access to edit their social calendar


    //curId will the current person id
    // friendid will be the person you are trying to add as close friend


    console.log("hit close friend")
    console.log(curId, friendId)
    this.sendExplore({
      curId: curId,
      friendId: friendId,
      command: 'add_user_close_friend'
    })
  }

  sendUnfriend = (curId, friendId) => {
    // This will pretty much be like sendAddCloseFriend but will be the opposite
    // of it. It will be removing the friend

    this.sendExplore({
      curId: curId,
      friendId: friendId,
      command: 'remove_user_close_friend'
    })
  }

  sendAcceptedSocialPics = (notificationId, ownerId, eventDate, curId) => {
    // This function will be when the curUser accepts the pending of picturs
    // of users. This function since we are trying to post pictures and we
    // already have the pictures in the notifcationId, we will just call it in
    // the back end and then add it to the social cal. (We will do a get or create
    // on the soical cal

    this.sendExplore({
      notificationId: notificationId,
      ownerId: ownerId,
      eventDate: eventDate,
      curId: curId,
      command: 'approve_social_pics'
    })

  }



  sendExplore(data){
    // So this is just used as a way to send info into the backend
    console.log(data)
    console.log('send_folower_following')
    try{
      this.socketRef.send(JSON.stringify({...data }))
    } catch (err) {
      console.log(err.message)
    }
  }

  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function(){
        if(socket.readyState === 1){
          console.log('connection is secure')
          if(callback != null){
            callback();
          }
          return;
        } else {
          console.log('waiting for conneciton...')
          recursion(callback)
        }
      }, 1)
  }


}



const ExploreWebSocketInstance = WebSocketExplore.getInstance();



export default ExploreWebSocketInstance;
