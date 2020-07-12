import { notification } from 'antd';


class WebSocketNotifications {
  static instance = null;
  callbacks = {}

  static getInstance(){
    if(!WebSocketNotifications.instance){
      WebSocketNotifications.instance = new WebSocketNotifications();
    }
    return WebSocketNotifications.instance
  }

  constructor(){
    this.socketRef = null
  }

// start HERE
  connect(username){
    const path = 'ws://127.0.0.1:8000/ws/friend-request-notification/'+username
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () =>{
      console.log('websocket open')
    }
// I guess group_send also sends it to onmessage
// All the json.send sends to here
    this.socketRef.onmessage = (e) => {
      this.socketNewNotification(e.data)
    }

    this.socketRef.onerror = (e)=> {
      console.log(e.message);
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

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  showNotification = (info, placement) => {
    // This will show a small notification on the side when that
    // person recieves a new notification
    const actor = this.capitalize(info.actor.username)
    const verb = info.verb
    console.log('here')
    notification.info({
      message: actor + verb
    })
  }

// this will handle the commands that are sent from the websocket
// The command notification is sent from the friends.consumer.fetch_messages
// The command new_notification comes from the group send on the friends.viwes.sendFriendRequest
  socketNewNotification(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)

    if (command === 'notifications') {
        const notifications = JSON.parse(parsedData.notifications);
        this.callbacks['notifications'](notifications)
            // createNotification(notifications[i]);
    } else if (command === 'new_notification') {
        console.log(parsedData)
        this.showNotification(parsedData, 'bottomRight')
        this.callbacks['new_notification'](JSON.parse(parsedData.notification))
        // createNotification(JSON.parse(data['notification']));
    }
  }

  addCallbacks(notificationsCallback, newNotificationCallback){

    this.callbacks['notifications'] = notificationsCallback;
    this.callbacks['new_notification'] = newNotificationCallback;

  }
  // this will send the messages to the backend
  fetchFriendRequests(userId){
    this.sendNotification({
      userId: userId,
      command: 'fetch_friend_notifications'
    })
  }

  sendNotification(data) {
    // this is good, it only sends 1 time
    // This will recieve information from onClickSend from PersonalProfile.js
    // and will send it to the userprofile.consumers
    console.log('send_notification')
    try{
      this.socketRef.send(JSON.stringify({...data }))
    } catch (err) {
      console.log(err.message);
    }
  }


  state() {
    return this.socketRef.readyState;
  }

  waitForSocketConnection(callback) {
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

const NotificationWebSocketInstance = WebSocketNotifications.getInstance();

export default NotificationWebSocketInstance;
