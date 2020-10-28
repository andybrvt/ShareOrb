// This websocket is gonna be used for the event. This includes the inofmraiton
// for the socialevent, editing the soical events, with group chats and inviting
// sharing etc... more social features

class WebSocketSocialEventPage{
  static instance = null;
  callbacks = {};

  static getInstance() {
    // This will check if the instance for the websocket exist if it does not
    // then it will make one
    if(!WebSocketSocialEventPage.instance){
      WebSocketSocialEventPage.instance = new WebSocketSocialEventPage();
    }

    return WebSocketSocialEventPage.instance
  }

  constructor(){
    this.sockeRef = null
  }

  connect(socialEventId){
    // This will connect individually whne you opne up the soical events. Each social
    // event will be its own channel, like a big gropu chat

    const path = 'ws://127.0.0.1:8000/ws/socialCalendarEvent/'+socialEventId
    console.log(path)
    // This will make a new WebSocket with teh path name
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      // This will pretty much open the websocket. if you want to run anything
      // during the connect this is where you would do it
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      // This will be where the information will be sent to after the backend consumers
      // gets sent to the frontend
      this.socketNewSocialMessage(e.data)
    }
    this.socketRef.onerror = (e) => {
      // this will be run if there is an error running or connecting
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      // unlike the other websockets that are made, this one will not be  recursion
      // because you dont want it to connect after you disconnect for this one
    }
  }

  disconnect() {
    // This function will be used to disconnect with the channel whneever you are
    // trying to switch between event pages
    console.log('disconnected')
    this.socketRef.close()
  }

  fetchSocialMessages(socialEventId){
    // This will fetch all the messages of that specific event
    console.log('fetch social messages')
    this.sendSocialMessage({
      command: "fetch_social_event_messages",
      socialEventId: socialEventId
    })
  }

  sendSocialEventMessage = (message, userId, eventId) => {
    // This will send the social event message from the group chats

    // So you need the message to make the message, the userId to know who sent
    // the message and then the eventId will be used to know which event to connect
    // it will
    console.log('send social event messages')
    this.sendSocialMessage({
      command: 'send_social_event_message',
      message: message,
      userId: userId,
      socialEventId: eventId
    })
  }

  sendEditSocialEvent = (editSocialEventObj) => {
    // This is for editing the social event
    console.log(editSocialEventObj)

    this.sendSocialMessage({
      command: 'send_social_edit_event_info',
      editSocialEventObj: editSocialEventObj
    })

  }

  socketNewSocialMessage(data){
    // This will be the function that will be calling the callbacks
    console.log('call backs')

    const parsedData= JSON.parse(data);
    const command = parsedData.command;

    console.log(parsedData)
    if(command === 'fetch_social_event_info'){
      console.log('here here here')
      const eventInfo = parsedData.eventInfo
      const messages = parsedData.eventInfo.get_socialEventMessage

      const socialEventInfoObj = {
        eventInfo: eventInfo,
        messages: messages
      }
      this.callbacks['fetch_social_event_info'](socialEventInfoObj)

    }
    if(command === 'send_social_event_message'){
      console.log('sup sup sup')
      const socialMessageObj = parsedData.socialEventMessgaeObj
      const socialEventId = parsedData.socialEventId
      this.callbacks['send_social_event_message'](socialMessageObj)
    }

    if(command === "edited_social_event"){
      const eventObj = parsedData.editedSocialEvent

      // ADD CALL BACKS HERE
      this.callbacks['update_social_event_page'](eventObj)
    }
  }

  addCallbacks(
    fetchSocialEventInfo,
    sendSocialMessageCallbacks,
    updateSocialEventCallbacks
  ){
    this.callbacks['fetch_social_event_info'] = fetchSocialEventInfo
    this.callbacks['send_social_event_message'] = sendSocialMessageCallbacks
    this.callbacks['update_social_event_page'] = updateSocialEventCallbacks
  }

  sendSocialMessage (data){
    // This is for the function that actually sends stuff to the backedn
    try{
      this.socketRef.send(JSON.stringify({...data}))
    } catch (err){
      console.log(err.message);
    }
  }

  state(){
    // Return how the websocket is doing. 0 is not good and 1 is working
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


const SocialEventPageWebSocketInstance = WebSocketSocialEventPage.getInstance();

export default SocialEventPageWebSocketInstance;
