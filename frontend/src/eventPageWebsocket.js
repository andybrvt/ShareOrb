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
    const path = 'ws://127.0.0.1:8000/ws/calendarEvent/'+eventId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onpen = () => {
      // This will pretty much open the websocket, so if you wanted to run
      // anythinig here you can
      console.log('websocket open')
    }
    this.socketRef.onmessage = (e) => {
      // This will be the funciton runned after you sent something into the
      // the backend and then it goes to receive thne gets sent back
      console.log(e.data)
      this.socketNewMessage(e.data)
    }
    this.socketRef.onerror = (e) => {
      // This will be run if there is an error running or conencting to the websocket
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      this.connect(eventId)
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
    this.sendMessage({
      command: 'fetch_event_messages',
      eventId: eventId
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
    }

  }


  addCallbacks (
    fetchEventInfo
  ){
    // Add all the call backs here
    this.callbacks['fetch_event_info'] = fetchEventInfo
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
