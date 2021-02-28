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
    } else if (command === "update_new_cell_social_newsfeed"){
      // path to update the newsfeed
      // You grab the postObj
      const socialPostObj = parsedData.socialPostObj
      const curId = parsedData.curId
      const created = parsedData.created
      console.log(curId)
      console.log(socialPostObj)
      console.log(parseInt(this.callbacks['curId']) === socialPostObj.owner.id)
      if(parseInt(this.callbacks['curId']) === socialPostObj.owner.id){
        console.log('this is true')
        // Put call back for updating the cursocialcalcell
        // just load up the cur social cal cell
        this.callbacks['fetch_cur_social_cell'](socialPostObj.post)
      }

      if(created === true){
        // this is if this is a new social cal cell so you just add it to the top
        // of the newsfeed
        this.callbacks['add_first_social_cell_post'](socialPostObj)

      } else if(created === false){
        // if its a old newsfeed cell and needs to be updated

        this.callbacks['update_social_cell_post'](socialPostObj)

      }


      // Now check if the currentId equals to taht of the user in the social postobj
      // if it is equal then that means you should update the curSocialCal


    } else if(command === "remove_all_photo_social_post"){
      // This will be use to update the soical cal cell of the curUser and update the
      // newsfeed when you remove all your pics

      // so you would need one that updates just your social cal cell
      const curId = parsedData.curId

      const curSocialCalCellList = parsedData.curSocialCalCell

      let curSocialCell = {}
      if(curSocialCalCellList.length > 0){
        curSocialCell = curSocialCalCellList[0];
      }

      if(parseInt(this.callbacks['curId']) === curId){
        this.callbacks['fetch_cur_social_cell'](curSocialCell)

      }

      const socialPost = parsedData.social_posts
      this.callbacks['fetch_social_posts'](socialPost)




    }

  }

  addCallbacks(
    curId,
    loadSocialPostCallback,
    addSocialLikeCallback,
    loadCurSocialCellCallback,
    addFirstSocialCellPost,
    updateSocialCellPost
  ){
    this.callbacks['curId'] = curId
    this.callbacks['fetch_social_posts'] = loadSocialPostCallback
    this.callbacks['add_social_post_like'] = addSocialLikeCallback
    this.callbacks['fetch_cur_social_cell'] = loadCurSocialCellCallback
    this.callbacks['add_first_social_cell_post'] = addFirstSocialCellPost
    this.callbacks['update_social_cell_post'] = updateSocialCellPost
  }

  fetchSocialPost(userId, curDate){
    // Because of the timezone issue we need to get timezone from front end
    this.sendPostsInfo({
      userId: userId,
      curDate: curDate,
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


  removeAllPhotoSocialPost(curId, curDate){
    // This function happens when you remove all the pictures in
    // you day cell. This is just use to update the cursoical cal cell
    // and then update the newsfeed
    this.sendPostsInfo({
      curDate: curDate,
      userId: curId,
      command: "remove_all_photo_social_post"
    })
  }

  addUpdateSocialPost(curId, cellId, created){
    // The curId will be used later to check if the social cal cell belongs to that
    // of the current user, if it is then you would update it

    // The cellid will be used to grab the actual cell

    // Craeted will check if it is new or not so that for the redux
    // you can either add to the top of the list of update an existing one

    // This will run when you have already made a cell and everything is updated
    // make an axios call and then send it through the here
    this.sendPostsInfo({
      curId: curId,
      socialCalCellId: cellId,
      created: created,
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
