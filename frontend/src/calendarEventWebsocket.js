// This websocket is used for EventSync and any other information
// exchange between the calendars so you can use this for the personal
// calendar and the Social calendar
import NotificationWebSocketInstance from './notificationWebsocket'
import {authAxios} from "./components/util";


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

  connect(userId){
    const path = `ws://${global.WS_ENDPOINT}/ws/calendar/`+userId
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () => {
      console.log('websocket open')
    }

    this.socketRef.onmessage = (e) => {
      console.log(e.data)
      this.socketNewEvent(e.data, userId)
    }

    this.socketRef.onerror = (e) => {
      console.log('websocket is closed')
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      this.connect(userId);
    }
  }

  disconnect(){
    console.log('disconnected')
    this.socketRef.close();
  }

  socketNewEvent(data, userId){
    // This is where the new event from the back end get sent to redux
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)

    if (command === 'new_event'){
      this.callbacks['new_event'](parsedData.newEvent)

    }
    else if (command === 'add_accepted'){
      const acceptorId = parsedData.acceptedUser;
      const eventId = parsedData.eventId;
      const person = parsedData.person;

      const acceptShareObj = {
        acceptorId: acceptorId,
        person: person,
        eventId: eventId
      }

      this.callbacks['accept_share'](acceptShareObj)
    } else if(command === 'add_decline_else'){
      // This path is for everyone else that is not the person declining the event
      const declineId = parsedData.declineId;
      const eventId = parsedData.eventId

      const declineShareObj = {
        declineId: declineId,
        eventId: eventId
      }

      this.callbacks['decline_share_else'](declineShareObj)
    } else if(command === 'add_decline'){
      // This path is for the user that is doing the declining of the event
      console.log('user side decline works')
      const eventId = parsedData.eventId

      const declineShareObj = {
        eventId: eventId
      }

      this.callbacks['decline_share'](declineShareObj)
    } else if (command === 'delete_event'){
      // This will be run when the host deletes the event, this will
      // delete all the event for everyone who is involed with the event
      const eventId = parsedData.eventId
      const deleteObj = {
        eventId: eventId
      }
      this.callbacks['decline_share'](deleteObj)
    } else if (command === "new_shared_event_notification"){
      // This will be sending an event notification when you first make an event
      // this will allow you to press on the notifcaiton and then go to the event
      // page
      const notification = parsedData.notification
      // add call back here
      this.callbacks['new_shared_event_notification'](notification)
    }


  }

  addCallbacks(
    newEventCallback,
    acceptEventShareCallback,
    declineElseEventShareCallback,
    declineEventShareCallback,
    newShareEventNotificationCallback

  ){
    // you just need to add the event so just one call back
    this.callbacks['new_event'] = newEventCallback;
    this.callbacks['accept_share'] = acceptEventShareCallback;
    this.callbacks['decline_share_else'] = declineElseEventShareCallback;
    this.callbacks['decline_share'] = declineEventShareCallback;
    this.callbacks['new_shared_event_notification'] = newShareEventNotificationCallback;

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

  deleteEvent = (eventId, actor) => {
    // eventId will be the id of the event
    // actor id will be the id of the actor
    this.sendEvent({
      eventId: eventId,
      actor: actor,
      command: 'delete_event'
    })
  }

  sendEvent (data){
    // This is used to send the notification into the backend and add in an
    // event sync event
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
