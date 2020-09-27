// This websocket is used for EventSync and any other information
// exchange between the calendars so you can use this for the personal
// calendar and the Social calendar
class WebSocketCalendarEvent {
  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketCalendarEvent.instance){
      WebSocketCalendarEvent.instance = new WebSocketCalendarEvent()
    }
    return WebSocketCalendarEvent.instance
  }

  constructor(){
    this.socketRef = null
  }

  connect(username){
    const path = 'ws://127.0.0.1:8000/ws/calendar/'+username
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {
      console.log(e.data)
      this.socketNewEvent(e.data)
    }

    this.socketRef.onerror = (e) => {
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      this.connect(username);
    }
  }

  disconnect(){
    console.log('disconnected')
    this.socketRef.close();
  }

  socketNewEvent(data){
    // This is where the new event from the back end get sent to redux
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)
    if (command === 'new_event'){
      this.callbacks['new_event'](parsedData.newEvent)
    }
    if (command === 'add_accepted'){
      const acceptorId = parsedData.acceptedUser;
      const eventId = parsedData.eventId

      const acceptShareObj = {
        acceptorId: acceptorId,
        eventId: eventId
      }

      this.callbacks['accept_share'](acceptShareObj)
    }
  }

  addCallbacks(newEventCallback, acceptEventShareCallback){
    // you just need to add the event so just one call back
    this.callbacks['new_event'] = newEventCallback;
    this.callbacks['accept_share'] = acceptEventShareCallback;
  }

  acceptSharedEvent = (eventId, acceptorId) => {
    // Pretty much the gate way to sending to the channels for accepting the
    // event share... pretty much you just wanna add your name to the accepted list
    // and let everyone that is part of the event shared know
    this.sendEvent({
      eventId: eventId,
      acceptorId: acceptorId,
      command: 'send_accept_shared_event'
    })
  }

  declineSharedEvent = (eventId, declineId) => {
    // The gate way to declining an event. Pretty much the same process as the accepting
    // but instead of adding events in
    this.sendEvent({
      eventId: eventId,
      declineId: declineId,
      command: 'send_decline_shared_event'
    })
  }

  sendEvent (data){
    // This is used to send the notification into the backend
    console.log('send_event')
    console.log(data)

// START RIGHT HERE
    try {
      this.socketRef.send(JSON.stringify({...data}))
    } catch (err) {
      console.log(err.message);
    }
  }

  state() {
    return this.socketRef.readyState
  }

  waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function(){
        if(socket.readyState === 1){
          console.log('connection is secure');
          if (callback != null){
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

const CalendarEventWebSocketInstance = WebSocketCalendarEvent.getInstance()

export default CalendarEventWebSocketInstance;
