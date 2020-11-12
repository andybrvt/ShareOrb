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


    } else if (command === 'send_social_event_old'){
      // This will be sending information to redux when the social cal cell is
      // made already
      const socialCalCellObj = parsedData.socialCalCellObj
      const socialEventObj = parsedData.socialEventObj

      const exploreObj = {
        socialCalCell: socialCalCellObj,
        socialEvent: socialEventObj
      }
      this.callbacks['social_event_old'](exploreObj)

    } else if (command === 'send_cal_cell_new'){

      // This command here will pretty much be called when ever you like, comment,
      // or add event and you need to make a new socialCalCell
      const socialCalCellObj = parsedData.socialCalCellObj
      const exploreObj = {
        socialCalCellObj: socialCalCellObj
      }
      this.callbacks['social_cal_cell_new'](exploreObj)
      this.callbacks['social_cal_cell_new_m'](exploreObj)


    } else if (command == 'add_user_social_event'){
      // EFFICENTCY: OK(COULD BE BETTER) (MAYBE REPLACE THE WHOLE PROFILE BUT WHO KNOWS)

      // This will add the user into the evnets of the calendar ... so this is gonna
      // take a lot of searching SO WE GOTTA FIX THIS LATER ON

      // The socialCalCellId will be used to find the the correct cell
      // The socialEventId will be used to find the correct event in that cal cell
      // The usreboejct is just that person that is being added to the event
      //  We will take the host form teh socialEventObj


      // You gotta do one for the modal event and then one for the over all calendar
      const socialCalCellObj = parsedData.socialCellObj
      const userObj = parsedData.userObj
      const exploreObj = {
        socialCalCellObj: socialCalCellObj,
        userObj: userObj
      }

      this.callbacks['add_user_social_event'](exploreObj)
      this.callbacks['add_user_social_event_m'](exploreObj)
    } else if (command === "remove_user_social_event"){
      // EFFICENTCY OK (COULD BE BETTER)

      // This will just remove the user from the social event
      // A way to help reduce the run time of the evnet is rather than trying to add
      //  or remove a specific person, just replace tehw hoel cell

      // You still might need the user obj to find the user
      const socialCalCellObj = parsedData.socialCellObj
      const userObj = parsedData.userObj
      const exploreObj = {
        socialCalCellObj:socialCalCellObj,
        userObj: userObj
      }

      //Make some new call backs here
      // Similar to the add event, you have to do an addevent and addeventM for the modal
      // one for the personal one for the modal

      this.callbacks['remove_user_social_event'](exploreObj)
      this.callbacks['remove_user_social_event_m'](exploreObj)

    }


  }


// call backs will pretty much be holding all the redux functions
  addCallbacks(
     loadProfile,
     addFollowerUnfollowerCallBack,
     addSocialEventOld,
     addSocialCalCellNew,
     addSocialCalCellNewM,
     addUserSocialEvent,
     addUserSocialEventM,
     removeUserSocialEvent,
     removeUserSocialEventM
   ){
    this.callbacks['load_profile'] = loadProfile
    this.callbacks['new_follower_unfollower'] = addFollowerUnfollowerCallBack
    this.callbacks['social_event_old'] = addSocialEventOld
    this.callbacks['social_cal_cell_new'] = addSocialCalCellNew
    this.callbacks['social_cal_cell_new_m'] = addSocialCalCellNewM
    this.callbacks['add_user_social_event'] = addUserSocialEvent
    this.callbacks['add_user_social_event_m'] = addUserSocialEventM
    this.callbacks['remove_user_social_event'] = removeUserSocialEvent
    this.callbacks['remove_user_social_event_m'] = removeUserSocialEventM
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
