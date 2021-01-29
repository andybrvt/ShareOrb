// This websocket is gonna be used for the event page. This includes rendering
// the information of the event, rendering group chats, and editing events

class WebSocketEventPage{
  // This is the field that will be present throughout all the instances
  static instance = null;
  callbacks = {};

  static getInstance() {
    if(!WebSocketEventPage.instance){
      WebSocketEventPage.instance = new WebSocketEventPage()
  }

  return WebSocketEventPage.instance

}

  constructor() {
    this.socketRef = null
  }

  connect(eventId){
    // This will connect individually to each event page. So pretty much
    // each event page will be its own channel when you href to that page
    const path = `${global.WS_HEADER}://${global.WS_ENDPOINT}/ws/calendarEvent/`+eventId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      // This will pretty much open the websocket, so if you wanted to run
      // anythinig here you can
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      // This will be the funciton runned after you sent something into the
      // the backend and then it goes to receive thne gets sent back
      this.socketNewMessage(e.data)
    }
    this.socketRef.onerror = (e) => {
      // This will be run if there is an error running or conencting to the websocket
      console.log('websocket is closed')
      console.log(e.error);
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      // this.connect(eventId)
    }
  }

  disconnect(){
    // This function will disconnect the channel, you pretty much have to call this
    // whenever you wnat to switch between channels or open new channels etc
    console.log('disconnected')
    this.socketRef.close()
  }

  // First thing before you do anything is that you have to fetch the information
  // so first method is gonna take the
  fetchMessages(eventId){

    console.log('hit here')
    this.sendMessage({
      command: 'fetch_event_messages',
      eventId: eventId
    })
  }

  sendEventMessage = (message, userId, eventId) => {
    // This will send the information about a message into the backend for then
    // usually for events group chat. The user will ususally be the current user that
    // that is current logged in
    // UserId will just be the id fo the user
    // Event id will just be the id of the event page
    console.log(message, userId, eventId)
    this.sendMessage({
      command: 'send_event_message',
      message: message,
      userId: userId,
      eventId: eventId,
    })
  }

  sendEventSeen = (userId, eventId) =>{
    // This will be used when somone goes on an event page and they are not in the
    // seen list so the list must be updated

    console.log(userId, eventId)
    this.sendMessage({
      command: 'send_seen_event',
      userId: userId,
      eventId: eventId
    })
  }

  sendEditEvent = (editEventObj) =>{
    // This will send to the backend and change the information about the event
    // then will be sent back to the front end
    // The editeventobj will hold all the info of an event

    console.log(editEventObj)

    this.sendMessage({
      command: "send_edit_event_info",
      editEventObj: editEventObj
    })
  }

  socketNewMessage(data){
    // This is where things go after you sned info from the back end to the front
    // end. This will get the commands and then do stuff with the information
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    console.log(parsedData)
    if(command === 'fetch_event_info'){
      // This will populate all the infromation into the event page with all the
      // event message and messages
      const eventInfo = parsedData.eventInfo
      const messages = parsedData.eventInfo.get_eventMessages
      const eventInfoObj = {
        eventInfo: eventInfo,
        messages: messages
      }
      console.log(eventInfoObj)
      this.callbacks['fetch_event_info'](eventInfoObj)
    } else if (command === 'send_event_message'){
      // This will be sending information into the redux to fill in teh messages
      // field in the calendar file in redux and this will fill the messages
      // list

      const messageObj = parsedData.eventMessageObj
      const eventId = parsedData.eventObjId
      const eventSeenObj = parsedData.eventSeenObj

      console.log(eventSeenObj)
      console.log(messageObj, eventId)
      this.callbacks['send_event_message'](messageObj)

      this.callbacks['update_seen_event_message'](eventSeenObj)

    } else if (command == 'send_seen_event'){
      // This will be used to update the seen event when you
      // go into an event page

      const eventSeenObj = parsedData.eventSeenObj
      console.log(eventSeenObj)

      this.callbacks['update_seen_event_message'](eventSeenObj)

    }
    else if (command === 'edited_event'){
      // This will be edit information in the page when you are done editing the
      // page you will not have to change the redux for the eventweek because
      // the weekview will rerender it self

      const eventObj = parsedData.editedEvent

      this.callbacks['update_event_page'](eventObj)

    }

  }


  addCallbacks (
    fetchEventInfo,
    sendEventMessage,
    updateEventCallBack,
    updateSeenCallBack
  ){
    // Add all the call backs here
    this.callbacks['fetch_event_info'] = fetchEventInfo
    this.callbacks['send_event_message'] = sendEventMessage
    this.callbacks['update_event_page'] = updateEventCallBack
    this.callbacks['update_seen_event_message'] = updateSeenCallBack
  }


  sendMessage (data){
    // This is the actual funciton that does the sending of the event into the back
    // end to the recieve function in the consumers
    try{
      this.socketRef.send(JSON.stringify({...data}))
    } catch (err){
      console.log(err.message);
    }
  }

  state() {
    // This checks if everyting is alright. 0 is things are not working and 1 is
    // thing are working
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

const EventPageWebSocketInstance = WebSocketEventPage.getInstance()

export default EventPageWebSocketInstance;
