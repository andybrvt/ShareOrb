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

  connect(postId){
    const path = 'ws://127.0.0.1:8000/ws/like-commenting-post/'+postId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      console.log(e.data)
      this.socketNewPost(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log(e.message);
    }

    this.socketRef.onclose = () => {
      console.log('WebSocket is closed')
      this.connect(postId)
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

    if (command === 'likes'){
      const likes_num = JSON.parse(parsedData.likes_num)
      const postId = JSON.parse(parsedData.postId)
      const likeObject = {
        postId: postId,
        likes: likes_num
      }
      console.log(likeObject)
      this.callbacks['likes'](likeObject)
      console.log(likes_num)
    } else if (command === 'new_like'){
      console.log('new_like')
    } else if (command === 'comments'){
      console.log('comments')
    } else if (command === 'new_comments'){
      console.log('new_comments')
    }
  }

  addCallbacks(likesCallback, newLikeCallback, commentsCallback, newCommentsCallback){
    this.callbacks['likes'] = likesCallback;
    this.callbacks['new_like'] = newLikeCallback;
    this.callbacks['comments'] = commentsCallback;
    this.callbacks['new_comments'] = newCommentsCallback;
  }

  fetchLikes(postId){
    // This function will fetch the likes in the post at the intial
    // load out
    this.sendPostsInfo({
      postId: postId,
      command: 'fetch_post_likes'
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
