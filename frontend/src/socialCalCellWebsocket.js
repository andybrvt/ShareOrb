// This websocket is gonna be used for the socialCalCell popup. This
//  will include actions suchs as liking, commenting, editing events,
// and adding into events

class WebSocketSocialCalCellPage{
  static instance = null;
  callbacks = {};

  static getInstance(){
    //This will check if the instance for the websocket exist if it doesnt then
    // it will make one

    if(!WebSocketSocialCalCellPage.instance){
      WebSocketSocialCalCellPage.instance = new WebSocketSocialCalCellPage()
    }

    return WebSocketSocialCalCellPage.instance
  }

  constructor(){
    this.socketRef = null
  }

  connect(user, year, month, day){
    //This will be for connecting to each individual soical cal cell page
    //each one will be its own channel, this will optimize the liking and
    // commenting
    const path = `${global.WS_HEADER}://${global.WS_ENDPOINT}/ws/socialCalendarCellPage/`+user+'/'+year+'/'+month+'/'+day
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {


      this.socketNewSocialCalCell(e.data)
    }
    this.socketRef.onerror = (e) => {
      console.log('websocket is closed ')
    }
    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      // Similar to the event page you will not need to recall the connect agian


    }
  }

  disconnect() {
    //This function will be used to disconnect with the channel when you open up
    // each calendar cal cell
    console.log('disconnect')
    this.socketRef.close()
  }

  fetchSocialCalCellInfo(user, year, month, day){
    // use to fetch the information from the right social cal event
    console.log('fetch social cal cell info')
    const cellDate = year+"-"+month+"-"+day
    this.sendSocialCalCellInfo({
      command: "fetch_social_cal_cell_info",
      cellDate: cellDate,
      cellUser: user
    })
  }

  sendSocialCalCellLike (cellDate, personLike, owner){
    //This is for liking the social cal cell
    // The curDate and the owner will be used to either create the new social
    // cal cell event or filter out the right one

    this.sendSocialCalCellInfo({
      command: "send_social_cal_cell_like",
      cellDate: cellDate,
      personLike: personLike,
      cellOwner: owner

    })

  }

  sendSocialDayCaption(cellDate, cellOwner, dayCaption){
    // This is for the writing the caption of the cell
    // The cur date and the cellOwner will be used to either create or
    // find the right cal cell.

    this.sendSocialCalCellInfo({
      command: "send_social_day_caption",
      cellDate: cellDate,
      cellOwner: cellOwner,
      dayCaption: dayCaption
    })

  }

  sendSocialCalCellUnlike(cellDate, personUnlike, owner) {
    //This is for unliking the social cal cell
    //The curDate and the owner will be used to either create the new social
    //cal cell event or filter out the right one
    this.sendSocialCalCellInfo({
      command: "send_social_cal_cell_unlike",
      cellDate: cellDate,
      personUnlike: personUnlike,
      cellOwner: owner
    })
  }

  sendSocialCalCellComment(currentDate, curUser, comment, owner){
    //This is to send comments in the social cal cell
    // cellowner is an id
    // personcomment is an id
    console.log(currentDate, curUser, comment, owner)
    this.sendSocialCalCellInfo({
      command: "send_social_cal_cell_comment",
      cellDate: currentDate,
      personComment: curUser,
      comment: comment,
      cellOwner: owner
    })
  }

  sendSocialEventJoin(userId, socialEventId, socialCalCellId, cellDate){
    // This will send information for someone to join a social event
    // UserID will be the perosn wanting to join the event
    // eventid is for the event itself
    //socialcalcellid is for the social cal cell identification

    // The M is for the modal view
    this.sendSocialCalCellInfo({
      command: "add_user_social_event_M",
      userId: userId,
      socialEventId: socialEventId,
      socialCalCellId: socialCalCellId,
      cellDate: cellDate,
    })
  }

  sendSocialEventLeave(userId, socialEventId, socialCalCellId, cellDate){
    // This will let someone leave an event
    // UserId will be the perosn wanting to leave the even
    // eventId is for the even titiself

    //Pretty similar to the socialeventjoin but just someone leaving instead
    // of joining

    this.sendSocialCalCellInfo({
      command: "remove_user_social_event_M",
      userId: userId,
      socialEventId: socialEventId,
      socialCalCellId: socialCalCellId,
      cellDate: cellDate,

    })
  }

  sendDeleteSocialPic(socialItemId, socialCellId, cellDate){
    // This function will send a request into the backend inorder to delete
    // a specfic socialcalitem. The social cellId will be used to grab the
    // current cell and then just update the soical cel call. The cell date
    // will be used for the socketname

    console.log('send seoms tuff')
    this.sendSocialCalCellInfo({
      command: "delete_social_cell_item",
      socialItemId: socialItemId,
      socialCellId: socialCellId,
      cellDate: cellDate
    })
  }

  sendDeleteSocialCell(socialCellId, curId, cellDate){
    // This function will be send a request into the backend inorder to delete the
    // whole day cell object. Teh social cell id will be used to get the social
    // cal cell day. the curid and cell date be used to send it to the right
    // websocket.

    // Remember you have to check teh content type and somehow delete it too

    this.sendSocialCalCellInfo({
      command: "delete_social_cell_day",
      socialCellId: socialCellId,
      curId: curId,
      cellDate: cellDate
    })

  }


  socketNewSocialCalCell(data){
    //This is to process all the command in the backend and tell them where to
    // go

    const parsedData = JSON.parse(data);
    const command = parsedData.command

    console.log(parsedData)
    if(command === 'fetch_social_cal_cell_info'){
      // This will load up the information for the social cal cell page
      const socialCalCellObj = parsedData.socialCalCell

      // Add the call back in here
      this.callbacks['fetch_social_cal_cell_info'](socialCalCellObj)

    }
    if(command === 'send_social_cal_cell_like_unlike'){
      //This will send a like and unlike to the redux so it can show it in the front end

      //Pretty much what you are ognna do it just repalce the whole like list
      // with new one
      const likeList = parsedData.likeList

      // YOU WILL BE USING THIS FOR BOTH THE LIKING AND UNLIKING
      this.callbacks['send_social_cal_cell_like_unlike'](likeList)
    }
    if(command === "send_social_cal_cell_comment_like_unlike"){
      // This will send the comments

      // You will just add the comment in at the end
      console.log("hitting this like")

    }

    if(command === "add_user_social_event_M"){
      const socialEventList = parsedData.socialEventList

      // ADD CALL BACKS HERE
      this.callbacks['add_social_event_join_leave_M'](socialEventList)
    }
    if(command === "remove_user_social_event_M"){
      const socialEventList = parsedData.socialEventList

      this.callbacks['add_social_event_join_leave_M'](socialEventList)

    }
    if(command === "delete_social_cell_item"){
      const socialItemList = parsedData.socialItemList

      // Add the call back here
      this.callbacks['delete_social_cell_item'](socialItemList)
    }
    if(command === "send_social_day_caption"){
      const dayCaption = parsedData.dayCaption

      // This is teh calback
      this.callbacks['add_social_day_caption'](dayCaption)

    }
    if(command === "deleted_social_cal_cell"){
      // This function will be similar to redux fetch function when there
      // is no cell in that day
      const socialCalCellObj = parsedData.socialCalCell

      // Add the call back in here
      this.callbacks['fetch_social_cal_cell_info'](socialCalCellObj)
    }
    if(command === "send_social_cal_cell_comment_like_unlike"){
      const likeList = parsedData.likeList
      this.callbacks['send_social_cal_cell_comment_like_unlike'](likeList)
    }




  }

  addCallbacks(
    fetchSocialCalCellInfo,
    sendSocialCalCellLikeUnlike,
    sendSocialCalCellComment,
    addSocialEventJoinLeave,
    deleteSocialItem,
    addSocialDayCaption,
  ){
    this.callbacks['fetch_social_cal_cell_info'] = fetchSocialCalCellInfo
    this.callbacks['send_social_cal_cell_like_unlike'] = sendSocialCalCellLikeUnlike
    this.callbacks['send_social_cal_cell_comment'] = sendSocialCalCellComment
    this.callbacks['add_social_event_join_leave_M'] = addSocialEventJoinLeave
    this.callbacks['delete_social_cell_item'] = deleteSocialItem
    this.callbacks['add_social_day_caption'] = addSocialDayCaption
  }


  sendCommentLike (socialCalCellDate, socialCalCellID, commentID, personIDLike) {
    this.sendSocialCalCellInfo({
      socialCalCellDate: socialCalCellDate,
      socialCalCellID:socialCalCellID,
      commentID:commentID,
      personIDLike: personIDLike,
      command: 'send_social_cal_cell_comment_like_unlike',
    })
  }


  sendSocialCalCellInfo(data){
    //Send stuff in to the back end
    try{
      this.socketRef.send(JSON.stringify({...data}))
    } catch (err){
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

const SocialCalCellPageWebSocketInstance = WebSocketSocialCalCellPage.getInstance();

export default SocialCalCellPageWebSocketInstance;
