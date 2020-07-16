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
    console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    console.log(parsedData)
    if (command === 'fetch_posts'){
      const likes_num = JSON.parse(parsedData.likes_num)
      // const postId = JSON.parse(parsedData.postId)
      const postObject = {
        posts: likes_num
      }
      this.callbacks['fetch_posts'](postObject)
    } else if (command === 'new_like'){
      // This is to send a like to the post through redux
      console.log('new_like')
      const postIdNum = parsedData.postId
      const userIdNum = parsedData.user
      // The user in this case is the user who liked the post, pretty much
      // the current user but to others it will be someone else
      const likeObject = {
        postId: postIdNum,
        userId: userIdNum
      }
      this.callbacks['new_like'](likeObject)
    } else if (command == 'un_like'){
      const postIdNum = parsedData.postId
      const userIdNum = parsedData.user
      // This will just for the unlike porition
      const unlikeObject = {
        postId: postIdNum,
        userId: userIdNum
      }

      this.callbacks['un_like'](unlikeObject)
    } else if (command === 'comments'){
      console.log('comments')
    } else if (command === 'new_comments'){
      console.log('new_comments')
    }
  }

  addCallbacks(
      postsCallback,
      newLikeCallback,
      unLikeCallback,
      commentsCallback,
      newCommentsCallback){
    this.callbacks['fetch_posts'] = postsCallback;
    this.callbacks['new_like'] = newLikeCallback;
    this.callbacks['un_like'] = unLikeCallback;
    this.callbacks['comments'] = commentsCallback;
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

  fetchComments(postId){
    this.sendPostsInfo({
      postId: postId,
      command: 'fetch_post_comment'
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
