class WebSocketSocialNewsfeed{

  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketSocialNewsfeed.instance){
      WebSocketSocialNewsfeed.instance = new WebSocketSocialNewsfeed();
    }
    return WebSocketSocialNewsfeed.instance
  }


  constructor(){
    this.socketRef = null
  }

  connect(){
    const path = `${global.WS_HEADER}://${global.WS_ENDPOINT}/ws/socialNewsfeed`
    console.log(path)
    this.socketRef = new WebSocket(path)

    this.socketRef.onopen = () => {
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      this.socketNewSocialPost(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log(e);
    }

    this.socketRef.onclose = () => {
      console.log('WebSocket is closed')
      // this.connect()
    }
  }


  disconnect() {
    console.log('disconnected')
    this.socketRef.close();
  }

  socketNewSocialPost(data){
    // Pretty much will process the data when it is received from the backend

    console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    console.log(parsedData)
    // Make the different calls here
    if(command === "fetch_social_posts"){
      // pull data and add callbacks here
      // add call back here
      const socialPost = JSON.parse(parsedData.social_posts)
      this.callbacks['fetch_social_posts'](socialPost)

    }

  }

  addCallbacks(
    loadSocialPostCallback
  ){
    this.callbacks['fetch_social_posts'] = loadSocialPostCallback
  }

  fetchSocialPost(userId){
    this.sendPostsInfo({
      userId: userId,
      command: "fetch_social_posts"
    })

  }

  sendOneLike(){
    // This is to send a like
  }

  unSendOneLike(){
    // This is to unsend a like
  }

  deletePost(){

  }

  addPost(){
    // make an axios call and then send it through the here
  }

  sendPostsInfo(data){
    // This is to send it to the backend
    try {
      this.socketRef.send(JSON.stringify({...data}))
    } catch(err){
      console.log(err.message);
    }
  }

  state(){
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


const WebSocketSocialNewsfeedInstance = WebSocketSocialNewsfeed.getInstance();

export default WebSocketSocialNewsfeedInstance;
