class WebSocketPosts {
  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketPosts.instance){
      WebSocketPosts.instance = new WebSocketPosts();
    }
    return WebSocketPosts.instance
  }

  constructor() {
    this.socketRef = null
  }

  // connect(postId){
  //   const path = 'ws://127.0.0.1:8000/ws/like-commenting-post/'+postId
  //   console.log(path)
  //   this.socketRef = new WebSocket(path)
  //   this.socketRef.onopen = () => {
  //     console.log('websocket open')
  //   }
  //   this.socketRef.onmessage = (e) => {
  //     console.log(e.data)
  //     this.socketNewPost(e.data)
  //   }
  //
  //   this.socketRef.onerror = (e) => {
  //     console.log(e.message);
  //   }
  //
  //   this.socketRef.onclose = () => {
  //     console.log('WebSocket is closed')
  //     this.connect(postId)
  //   }
  // }

  connect(){
    const path = 'ws://127.0.0.1:8000/ws/newsfeed'
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      this.socketNewPost(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log(e.message);
    }

    this.socketRef.onclose = () => {
      console.log('WebSocket is closed')
      this.connect()
    }
  }

  disconnect() {
    console.log('disconnected')
    this.socketRef.close();
  }

  socketNewPost(data){
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    console.log(parsedData)
    if (command === 'fetch_posts'){
      const posts = JSON.parse(parsedData.likes_num)
      // const postId = JSON.parse(parsedData.postId)
      const postObject = {
        posts: posts
      }
      this.callbacks['fetch_posts'](postObject)
    } else if (command === 'new_like'){
      // This is to send a like to the post through redux
      // So remeber that the parsedData.user is sent as an object now not an id
      console.log('new_like')
      const postIdNum = parsedData.postId
      const userObj = parsedData.user
      // The user in this case is the user who liked the post, pretty much
      // the current user but to others it will be someone else
      const likeObject = {
        postId: postIdNum,
        userObj: userObj
      }
      console.log(likeObject)
      this.callbacks['new_like'](likeObject)
    } else if (command == 'un_like'){
      const postIdNum = parsedData.postId
      const userObj = parsedData.user
      // This will just for the unlike porition
      const unlikeObject = {
        postId: postIdNum,
        userObj: userObj
      }

      this.callbacks['un_like'](unlikeObject)
    } else if (command === 'new_comment'){
      console.log(parsedData)
      const comment = JSON.parse(parsedData.comment)
      console.log(comment)
      // This will send the comment portion into redux
      const commentObject = {
        comment: comment
      }

      this.callbacks['new_comments'](commentObject)
    }
  }

  addCallbacks(
      postsCallback,
      newLikeCallback,
      unLikeCallback,
      newCommentsCallback){
    this.callbacks['fetch_posts'] = postsCallback;
    this.callbacks['new_like'] = newLikeCallback;
    this.callbacks['un_like'] = unLikeCallback;
    this.callbacks['new_comments'] = newCommentsCallback;
  }

  fetchPosts(userId){
    // This function will fetch the likes in the post at the intial
    // load out
    this.sendPostsInfo({
      userId: userId,
      command: 'fetch_posts'
    })
  }

  sendOneLike (userId, postId) {
    console.log(userId)
    this.sendPostsInfo({
      userId: userId,
      postId: postId,
      command: 'send_one_like'
    })
  }

  unSendOneLike(userId, postId){
    console.log(userId)
    this.sendPostsInfo({
      userId: userId,
      postId: postId,
      command: 'unsend_one_like'
    })
  }

  sendComment(userId, postId, comment){
    this.sendPostsInfo({
      userId: userId,
      postId: postId,
      comment: comment,
      command: 'send_comment'
    })
  }


  sendPostsInfo(data){
    // This is pretty much what connects the back end
    // with the frontend
    // This will send info and commands to the receive in the consumers
    try {
      this.socketRef.send(JSON.stringify({...data}))
    } catch(err){
      console.log(err.message);
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
        if (socket.readyState === 1){
          console.log('connection is secure');
          if (callback != null) {
            callback();
          }
          return;
        } else{
            console.log('waiting for connection...')
            recursion(callback)
        }
      }, 1)
  }

}


const WebSocketPostsInstance = WebSocketPosts.getInstance();

export default WebSocketPostsInstance;
