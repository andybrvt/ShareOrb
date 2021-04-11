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

    const path = `${global.WS_HEADER}://${global.WS_ENDPOINT}/ws/post/`+user+'/'+postId
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

  sendUserPostUnlike(personUnlike, postId){
    console.log("send unlike")

    this.sendUserPostInfo({
      command: "send_user_post_unlike",
      personUnlike: personUnlike,
      postId: postId
    })
  }

  sendUserPostComment(curUser, comment, postId){
    console.log(comment)
    // curUser will be the person commenting
    this.sendUserPostInfo({
      command: "send_user_post_comment",
      curUser: curUser,
      comment: comment,
      postId: postId
    })
  }



  socketNewUserPost(data){
    const parsedData = JSON.parse(data);
    const command = parsedData.command

    console.log(parsedData)
    if(command === "user_post"){
      // This will load up the
      const post = parsedData.post

      // add callbacks here
      this.callbacks['fetch_user_post_info'](post)

    }

    if(command === "send_user_post_like_unlike"){
      console.log(parsedData)

    }

    if(command === "send_user_post_like_unlike"){
      console.log(parsedData)

    }
    if(command === "send_user_post_like_unlike"){
      const likeList = parsedData.likeList


      // add callbacks for both like and unlike here (they are pretty much the same)
      this.callbacks['send_user_post_like_unlike'](likeList)

    }
    if(command === "send_user_post_comment"){

      // Add in the comments for the user post
      const postComment = parsedData.postComment

      // START HERE TOMORROW MORNING
      this.callbacks['send_user_post_comment'](postComment)
    }


  }

  addCallbacks(
    fetchUserPostInfo,
    sendUserPostLikeUnlike,
    sendUserPostComment,
    sendCommentUnLike,
  ){
    this.callbacks['fetch_user_post_info'] = fetchUserPostInfo
    this.callbacks['send_user_post_like_unlike'] = sendUserPostLikeUnlike
    this.callbacks['send_user_post_comment'] = sendUserPostComment
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
