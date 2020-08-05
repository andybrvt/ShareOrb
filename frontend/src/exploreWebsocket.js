// THIS WEBSOCKET WILL PRETTY MUCH BE USED FOR THE FOLLOW AND
// FRIEND FUNCTION IN THE EXPLORE

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
      // const user = parsedData.actorUsername
      // const person_follower = parsedData.targetUsername
      // const followObj = {
      //   user: user,
      //   person_follower: person_follower
      // }
      //
      // this.callbacks['new_follower'](followObj)
    } else if (command === 'currUser_profile') {
      // This is to send the profile info of the current user
      const profile = JSON.parse(parsedData.user_profile)[0]
      this.callbacks['current_user'](profile)
    } else if (command === 'send_unfollowing'){
      // used to send to the backend in order to
      // This is to do it on the actor side, (the person doing the
      // following side)
      // Unadd to the following side
      const user = parsedData.actorUsername
      const person_unfollowing = parsedData.targetUsername

      const followObj = {
        user: user,
        person_unfollowing: person_unfollowing
      }

      this.callbacks['new_unFollowing'](followObj)
    } else if (command === 'send_unfollower'){
      // This is to un add the other person follower
      const user = parsedData.actorUsername
      const person_unfollower = parsedData.targetUsername

      const followObj = {
        user: user,
        person_unfollower: person_unfollower
      }
      this.callbacks['new_unFollower'](followObj)
    }


  }

  addCallbacks(loadProfiles,
     addFollowerCallBack,
     addFollowingCallBack,
     loadCurrProfile,
     unFollowingCallback,
     unFollowerCallback
   ){
    this.callbacks['fetch_profiles'] = loadProfiles
    this.callbacks['new_follower'] = addFollowerCallBack
    this.callbacks['new_following'] = addFollowingCallBack
    this.callbacks['current_user'] = loadCurrProfile
    this.callbacks['new_unFollowing'] = unFollowingCallback
    this.callbacks['new_unFollower'] = unFollowerCallback
  }


  fetchFollowerFollowing(){
    // This gets called in teh newsfeedview.js
    this.sendFollowerFollowing({
      command: 'fetch_follower_following'
    })
  }

  fetchCurrentUserProfile(currUser){
    // Fetch the cur user seperate by the back end so we can avoid looping through
    // all the profiles in the front end
    console.log('fetch profile')
    this.sendFollowerFollowing({
      command: 'fetch_curUser_profile',
      currUser: currUser
    })
  }

  sendFollowing = (follower, following) => {
    // This function will set up the object and command to send
    // to the backend. The follower is the person sending the following
    // request and the following the person gettting the following


    this.sendFollowerFollowing({
      follower: follower,
      following: following,
      command: 'send_following'
    })
  }

  sendUnFollowing = (follower, following) => {
    // This function will be used to set up for unfollowing the user
    // the follower again is the person doing the action and the following will
    // be the person receving the follow
    this.sendFollowerFollowing({
      follower: follower,
      following: following,
      command: 'send_unfollowing'
    })


  }



  sendFollowerFollowing(data){
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
