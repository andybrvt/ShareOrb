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
      this.connect(username)
    }
  }

  disconnect() {
    console.log('disconnected')
    this.socketRef.close()
  }

  socketNewExplore(data){
    console.log('socketNewExplore')
    // This is pretty much just used to send thinggs to redux
    // and pretty much anything that needs to update temporarly

    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)
    // The reason why there is only one follower following because
    // whenever somone follows someone else there will be on follower
    // for one person and one following for another so event if someone
    // follows you back the trend will still be the same
    if (command === 'user_profiles'){
      const profiles = JSON.parse(parsedData.user_profiles)
      console.log(profiles)
      this.callbacks['fetch_profiles'](profiles)
    } else if (command === 'send_following'){
      // This is to add the person to your following
      const user = parsedData.actorObjSerial
      const person_following = parsedData.targetObjSerial
      console.log(user, person_following)
      // the user will be the person that will be the user will be the person
      // that will be getting the following
      const followObj = {
        user: user,
        person_following: person_following
      }
      this.callbacks['new_following'](followObj)
    } else if (command === 'send_follower'){
      // This is to add to the other person's followers
      const user = parsedData.actorObjSerial
      const person_follower = parsedData.targetObjSerial
      const followObj = {
        user: user,
        person_follower: person_follower
      }

      this.callbacks['new_follower'](followObj)
    } else if (command === 'currUser_profile') {
      // This is to send the profile info of the current user
      const profile = JSON.parse(parsedData.user_profile)[0]
      this.callbacks['current_user'](profile)
    } else if (command === 'send_unfollowing'){
      // used to send to the backend in order to
      // This is to do it on the actor side, (the person doing the
      // following side)
      // Unadd to the following side
      const user = parsedData.actorObjSerial
      const person_unfollowing = parsedData.targetObjSerial

      const followObj = {
        user: user,
        person_unfollowing: person_unfollowing
      }

      this.callbacks['new_unFollowing'](followObj)
    } else if (command === 'send_unfollower'){
      // This is to un add the other person follower
      const user = parsedData.actorObjSerial
      const person_unfollower = parsedData.targetObjSerial

      const followObj = {
        user: user,
        person_unfollower: person_unfollower
      }
      this.callbacks['new_unFollower'](followObj)
    } else if (command === 'send_social_like_new'){
      // This is used for whne someone sends a like ot a new cal cell
      // So because the information for the social cal modal gets passed into a modal AND
      // from there the infomration is added into its own redux state, so you would have to
      // make another redux fucntion to accomomate fo rthe socialcal reducer
      const socialCalCellObj = parsedData.socialCalCellObj
      const exploreObj = {
        socialCalCellObj: socialCalCellObj
      }

      console.log(exploreObj)
      // NOW PUT THE CALL BACK FOR THE REDUX HERE
      this.callbacks['social_like_new'](exploreObj)
      this.callbacks['social_like_new_m'](exploreObj)
    } else if (command === 'send_social_like_old'){
      // This is used for when someone sends a like to a old cal cell
      const socialCalCellId = parsedData.socialCalCellObjId
      // Remember that the userObj is the one that we would use to add in to the
      // likes

      // So because the information for the social cal modal gets passed into a modal AND
      // from there the infomration is added into its own redux state, so you would have to
      // make another redux fucntion to accomomate fo rthe socialcal reducer
      const userObj = parsedData.userObj
      const exploreObj = {
        socialCalCell: socialCalCellId,
        userObj: userObj
      }
      console.log(exploreObj)
      // NOW PUT THE CALL BACK FOR THE REDUX HERE
      this.callbacks['social_like_old'](exploreObj)
      this.callbacks['social_like_old_m'](exploreObj)
    } else if (command === 'send_social_unlike'){
      // This will be used for indicating the user and then removing the unlike
      // user from the  social cal cell people like
      const socialCalCellId = parsedData.socialCalCellObjId
      // Pretty much the object used is the same as the like action
      const userObj = parsedData.userObj
      const exploreObj = {
        socialCalCell: socialCalCellId,
        userObj: userObj
      }

      // Now you would put the call backs here
      console.log('stuff stuff stuff')
      this.callbacks['social_unlike'](exploreObj)
      this.callbacks['social_unlike_m'](exploreObj)
    } else if (command === 'send_social_comment_new'){
      // This will used for adding in the comment when the calcell that has not
      // been created yet
      const socialCalCellObj = parsedData.socialCalCellObj
      const exploreObj = {
        socialCalCellObj: socialCalCellObj
      }

      // NOW YOU WILL PUT THE REDUX CALL BACKS HERE
      this.callbacks['social_comment_new'](exploreObj)
      this.callbacks['social_comment_new_m'](exploreObj)
    } else if (command === 'send_social_comment_old'){
      // So you would pass the socialCalcell obj in first and then the comment
      // The socialCalCell is used to find the ower and the cell
      const socialCalCellObj = parsedData.socialCalCellObj
      const socialCommentObj = parsedData.socialCommentObj

      const exploreObj = {
        socialCalCell: socialCalCellObj,
        socialComment: socialCommentObj
      }

      this.callbacks['social_comment_old'](exploreObj)
    }


  }


// call backs will pretty much be holding all the redux functions
  addCallbacks(loadProfiles,
     addFollowerCallBack,
     addFollowingCallBack,
     loadCurrProfile,
     unFollowingCallback,
     unFollowerCallback,
     addSocialLikeNew,
     addSocialLikeOld,
     addSocialLikeNewM,
     addSocialLikeOldM,
     addSocialUnLike,
     addSocialUnLikeM,
     addSocialCommentNew,
     addSocialCommentOld,
     addSocialCommentNewM
   ){
    this.callbacks['fetch_profiles'] = loadProfiles
    this.callbacks['new_follower'] = addFollowerCallBack
    this.callbacks['new_following'] = addFollowingCallBack
    this.callbacks['current_user'] = loadCurrProfile
    this.callbacks['new_unFollowing'] = unFollowingCallback
    this.callbacks['new_unFollower'] = unFollowerCallback
    this.callbacks['social_like_new'] = addSocialLikeNew
    this.callbacks['social_like_old'] = addSocialLikeOld
    this.callbacks['social_like_new_m'] = addSocialLikeNewM
    this.callbacks['social_like_old_m'] = addSocialLikeOldM
    this.callbacks['social_unlike'] = addSocialUnLike
    this.callbacks['social_unlike_m'] = addSocialUnLikeM
    this.callbacks['social_comment_new'] = addSocialCommentNew
    this.callbacks['social_comment_old'] = addSocialCommentOld
    this.callbacks['social_comment_new_m'] = addSocialCommentNewM
  }


  fetchFollowerFollowing(){
    // This gets called in teh newsfeedview.js
    this.sendExplore({
      command: 'fetch_follower_following'
    })
  }

  fetchCurrentUserProfile(currUser){
    // Fetch the cur user seperate by the back end so we can avoid looping through
    // all the profiles in the front end
    console.log('fetch profile')
    this.sendExplore({
      command: 'fetch_curUser_profile',
      currUser: currUser
    })
  }

  sendFollowing = (follower, following) => {
    // This function will set up the object and command to send
    // to the backend. The follower is the person sending the following
    // request and the following the person gettting the following


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
    this.sendExplore({
      follower: follower,
      following: following,
      command: 'send_unfollowing'
    })


  }

  sendSocialLike = (curDate, personLike, owner) =>{
    // This function will be sending out a like to someone's profile and then
    // pick out the right social calendar cell and then add a like to it. This is
    // where it will start

    // The two things you are gonna be sending is something tha tyou cna use to identify
    // the day cell and the user who is gonna like it so you cna grab the user


    // The personLike and owner will be the ids of the persons
    console.log(curDate, personLike)
    this.sendExplore({
      socialCalDate: curDate,
      userId: personLike,
      ownerId: owner,
      command: 'send_social_like'
    })

  }

  sendSocialUnLike = (curDate, personUnLike, owner) => {
    // So you want the curDate so that you can pick the right curcell, along with the
    // the ids of the person taht is gonna unlike and the owner of the calendar
    // personUnlike would be the id of the person liking or unliking
    // owner will be the id of the social cal owner

    console.log(curDate, personUnLike, owner)
    this.sendExplore({
      socialCalDate: curDate,
      userId: personUnLike,
      ownerId: owner,
      command: 'send_social_unlike'

    })
  }

  sendSocialComment = (curDate, personComment, comment, owner) =>{
    // The curdate will be used to get the cell calendar
    // the personComment will be used for the perosn commenting, probally gonna
    // just be the id
    // Comment will be the comment itself
    // Owner will be the id of the calendar owner

    // The userId will be person commenting
    console.log(comment)
    this.sendExplore({
      socialCalDate: curDate,
      userId: personComment,
      comment: comment,
      ownerId: owner,
      command: 'send_social_comment'
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
