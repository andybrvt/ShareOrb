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
      const user = parsedData.actorUsername
      const person_following = parsedData.targetUsername
      // the user will be the person that will be the user will be the person
      // that will be getting the following
      const followObj = {
        user: user,
        person_following: person_following
      }
      this.callbacks['new_following'](followObj)
      // this.callbacks['new_following'](profiles)
    } else if (command === 'send_follower'){
      // This is to add to the other person's followers
      const user = parsedData.actorUsername
      const person_follower = parsedData.targetUsername
      const followObj = {
        user: user,
        person_follower: person_follower
      }

      this.callbacks['new_follower'](followObj)
    }
  }

  addCallbacks(loadProfiles, addFollowerCallBack, addFollowingCallBack){
    this.callbacks['fetch_profiles'] = loadProfiles
    this.callbacks['new_follower'] = addFollowerCallBack
    this.callbacks['new_following'] = addFollowingCallBack
  }


  fetchFollowerFollowing(){
    // This gets called in teh newsfeedview.js
    this.sendFollowerFollowing({
      command: 'fetch_follower_following'
    })
  }

  fetchCurrentUserProfile(currUser){
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
