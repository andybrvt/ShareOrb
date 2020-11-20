// This websocket is gonna be sued for user post events. This iwll include
// include acitons such as liking, commenting, editing the post and adding
// into events

class WebSocketUserPostPage{
  static instance = null;
  callbacks = {};


  static getInstance(){
    // This will check if the instnace of the websocket exist if ti does not
    // then it will make one
    if(!WebSocketUserPostPage.instance){
      WebSocketUserPostPage.instance = new WebSocketUserPostPage;
    }

    return WebSocketUserPostPage.instance

  }


  constructor(){
    this.socketRef = null
  }

  connect(user, postId){
    // This will be for connecting to each individaul user post events
    // each one post will have its own channel. Similarly to the social cal cell
    // this will make liking and commenting and such faster.

    const path = 'ws://127.0.0.1:8000/ws/post/'+user+'/'+postId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () =>{
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {
      this.socketNewUserPost(e.data)
    }
    this.socketRef.onerror = (e) => {
      console.log('websocket is closed')
    }
    this.socketRef.onclose = () => {
      console.log('websocket is closed')

      // No recursion need for this
    }

  }

  disconnect() {
    console.log('disconnect')
    this.socketRef.close()
  }

  fetchUserPostInfo(postId) {
    console.log("fetch user post info")
    this.sendUserPostInfo({
      command: "fetch_user_post_info",
      postId: postId
    })
  }

  sendUserPostLike (personLike, postId){
    console.log("send like")

    this.sendUserPostInfo({
      command: "send_user_post_like",
      personLike: personLike,
      postId: postId
    })
  }

  sendUserPostUnlike(){
    console.log("send unlike")
  }

  sendUserPostComment(){
    console.log("send comments")
  }



  socketNewUserPost(data){
    const parsedData = JSON.parse(data);
    const command = parsedData.command

    if(command === "user_post"){
      // This will load up the
      console.log(parsedData)
      const post = parsedData.post

      // add callbacks here
      this.callbacks['fetch_user_post_info'](post)

    }


  }

  addCallbacks(
    fetchUserPostInfo
  ){
    this.callbacks['fetch_user_post_info'] = fetchUserPostInfo
  }

  sendUserPostInfo(data){
    try{
      this.socketRef.send(JSON.stringify({...data}))
    } catch(err){
      console.log(err.message)
    }
  }

  state(){
    return this.socketRef.readyState
  }

  waitForSocketConnection(callback){
    // This is a reucrsion that keeps trying to reconnect to the channel whenever
    // it gets disconnected
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function(){
        if(socket.readyState === 1){
          console.log('connection is secure');
          if(callback != null){
            callback()
          }
          return;
        } else {
          console.log('waiting for connection...')
          recursion(callback)
        }
      }, 1)
  }


}

const UserPostPageWebSocketInstance = WebSocketUserPostPage.getInstance();

export default UserPostPageWebSocketInstance;
