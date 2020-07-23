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
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {
      console.log('new message')
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
    // This is pretty much just used to send thinggs to redux
    // and pretty much anything that needs to update temporarly

    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)
    // The reason why there is only one follower following because
    // whenever somone follows someone else there will be on follower
    // for one person and one following for another so event if someone
    // follows you back the trend will still be the same
    if (command === 'new_follower'){
      console.log('new follower')
    }
  }

  addCallbacks(loadFollowerFollowingCallBack, addFollowerFollowingCallBack){
    this.callbacks['new_follower'] = loadFollowerFollowingCallBack
    this.callbacks['new_following'] = addFollowerFollowingCallBack
  }


  fetchFollowerFollowing(userId){
    this.sendFollowerFollowing({
      userId: userId,
      command: 'fetch_follower_following'
    })
  }

  sendFollowerFollowing(data){
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
