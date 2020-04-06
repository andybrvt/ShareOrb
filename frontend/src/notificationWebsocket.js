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

  connect(){
    const path = 'ws://127.0.0.1:8000/ws/friend-request-notification/'
    console.log(path)
    this.socketRef = new WebSocket(path)
    this.socketRef.onopen = () =>{
      console.log('websocket open')
    }
// I guess group_send also sends it to onmessage
    console.log('here')
    this.socketRef.onmessage = (e) => {
      console.log(e.data)
      this.socketNewNotification(e.data)
    }

    this.socketRef.onerror = (e)=> {
      console.log(e.message);
    }

    this.socketRef.onclose = () => {
      console.log('websocket is closed')
      this.connect();
    }
  }

  disconnect(){
    this.socketRef.close();
  }

// this will handle the commands that are sent from the websocket
// The command notification is sent from the friends.consumer.fetch_messages
// The command new_notification comes from the group send on the friends.viwes.sendFriendRequest
  socketNewNotification(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    if (command === 'notifications') {
        const notifications = JSON.parse(parsedData.notifications);
        for (let i = 0; i < notifications.length; i++) {
            this.callbacks['notifications'](notifications[i])
            // createNotification(notifications[i]);
        }
    } else if (command === 'new_notification') {

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
