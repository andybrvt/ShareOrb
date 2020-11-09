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
      WebSocketSocialCalCellPage.instance = new WebSocketSocialCalCellPage
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
    const path = 'ws://127.0.0.1:8000/ws/socialCalendarCellPage/'+user+'/'+year+'/'+month+'/'+day
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

    console.log('hit the like')
    console.log(cellDate, personLike, owner)
    this.sendSocialCalCellInfo({
      command: "send_social_cal_cell_like",
      cellDate: cellDate,
      personLike: personLike,
      cellOwner: owner

    })

  }

  sendSocialCalCellUnlike() {
    //This is for unliking the social cal cell
  }

  sendSocialCalCellComment(){
    //This is to send comments in the social cal cell
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
    if(command === 'send_social_cal_cell_like'){
      //This will send a like to the redux so it can show it in the front end

      //Pretty much what you are ognna do it just repalce the whole like list
      // with new one
      const likeList = parsedData.likeList


      //ADD CALLBACK HERE
      this.callbacks['send_social_cal_cell_like'](likeList)
    }
  }

  addCallbacks(
    fetchSocialCalCellInfo,
    sendSocialCalCellLike,
  ){
    this.callbacks['fetch_social_cal_cell_info'] = fetchSocialCalCellInfo
    this.callbacks['send_social_cal_cell_like'] = sendSocialCalCellLike
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
