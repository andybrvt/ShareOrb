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
      const curSocialCalCellList = JSON.parse(parsedData.curSocialCalCell)

      let curSocialCell = {}
      if(curSocialCalCellList.length > 0){
        curSocialCell = curSocialCalCellList[0];
      }

      const socialPost = JSON.parse(parsedData.social_posts)
      this.callbacks['fetch_social_posts'](socialPost)

      // add a call back here to update the current socialcal in redux here
      // probally just gonna include it in the soical newsfeed bc it will
      // be used mostly there

      this.callbacks['fetch_cur_social_cell'](curSocialCell)


    } else if (command === "send_social_post_like"){
      const contentTypeId = parsedData.contentTypeId
      const socialCalCellObj = parsedData.socialCalCellObj

      const content = {
        contentTypeId: contentTypeId,
        socialCalCellObj: socialCalCellObj
      }

      // put the call back here
      this.callbacks['add_social_post_like'](content)

    } else if( command === "send_social_post_unlike"){
      const contentTypeId = parsedData.contentTypeId
      const socialCalCellObj = parsedData.socialCalCellObj

      const content = {
        contentTypeId: contentTypeId,
        socialCalCellObj: socialCalCellObj
      }

      // put the call back here
      this.callbacks['add_social_post_like'](content)
    }

  }

  addCallbacks(
    loadSocialPostCallback,
    addSocialLikeCallback,
    loadCurSocialCellCallback
  ){
    this.callbacks['fetch_social_posts'] = loadSocialPostCallback
    this.callbacks['add_social_post_like'] = addSocialLikeCallback
    this.callbacks['fetch_cur_social_cell'] = loadCurSocialCellCallback
  }

  fetchSocialPost(userId){
    this.sendPostsInfo({
      userId: userId,
      command: "fetch_social_posts"
    })

  }

  sendOneLike(socialCalCellId, personLike, contentTypeId){
    // This is to send a like
    this.sendPostsInfo({
      socialCalCellId: socialCalCellId,
      personLike: personLike,
      contentTypeId: contentTypeId,
      command: "send_social_post_like"
    })
  }

  unSendOneUnlike(socialCalCellId, personUnlike, contentTypeId){
    // This is to unsend a like

    this.sendPostsInfo({
      socialCalCellId: socialCalCellId,
      personUnlike: personUnlike,
      contentTypeId: contentTypeId,
      command:"send_social_post_unlike"
    })
  }

  deletePost(){

  }

  addUpdateSocialPost(cellId){
    // This will run when you have already made a cell and everything is updated
    // make an axios call and then send it through the here
    this.sendPostsInfo({
      socialCalCellId: cellId,
      command: "grab_new_updated_social_cell"
    })

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
