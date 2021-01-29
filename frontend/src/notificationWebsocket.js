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
    const path = `${global.WS_HEADER}://${global.WS_ENDPOINT}/ws/friend-request-notification/`+username
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
    const notificationObject = JSON.parse(info.notification)

    console.log(notificationObject.actor.username)
    const actor = this.capitalize(notificationObject.actor.username)
    const verb = notificationObject.verb
    console.log('here')
    notification.info({
      message: actor +' ' + verb,
      placement
    })
  }

// this will handle the commands that are sent from the websocket
// The command notification is sent from the friends.consumer.fetch_messages
// The command new_notification comes from the group send on the friends.viwes.sendFriendRequest
  socketNewNotification(data) {
    console.log(data)
    const parsedData = JSON.parse(data);
    const command = parsedData.command;
    console.log(parsedData)

    if (command === 'notifications') {
        const notifications = JSON.parse(parsedData.notifications);
        this.callbacks['notifications'](notifications)
            // createNotification(notifications[i]);
        if(parsedData.requestList){
          const requestList = JSON.parse(parsedData.requestList)

          console.log(requestList)
          // Add call back here

          this.callbacks['update_follow_request'](requestList)
        }
        if(parsedData.followersList){
          const followersList = JSON.parse(parsedData.followersList)

          console.log(followersList)

          // Add call back here
          this.callbacks['auth_update_followers'](followersList)
        }


    } else if (command === 'new_notification') {
        this.showNotification(parsedData, 'bottomRight')

        const notification = JSON.parse(parsedData.notification)
        this.callbacks['new_notification'](notification)
        if(notification.type === "follow_request_notification"){
          // put the call back for updating the request in the auth here.


          const newRequest = JSON.parse(parsedData.requestObj)

          console.log(newRequest)
          this.callbacks['new_follow_request'](newRequest)
        }
        if(notification.type === "follow_notification"){

          console.log(parsedData.followerObj)
          const newFollower = JSON.parse(parsedData.followerObj)

          console.log(newFollower)
          // START HERE AND TRYING GETTING AUTH TO UPDATE

          // add call back here
          this.callbacks['auth_add_follower'](newFollower)
        }
        // createNotification(JSON.parse(data['notification']));
    }
  }

  addCallbacks(
    notificationsCallback,
    newNotificationCallback,
    addNewFollowRequest,
    updateFollowRequest,
    authAddFollower,
    authUpdateFollowers
  ){

    this.callbacks['notifications'] = notificationsCallback;
    this.callbacks['new_notification'] = newNotificationCallback;
    this.callbacks['new_follow_request'] = addNewFollowRequest;
    this.callbacks['update_follow_request'] = updateFollowRequest;
    this.callbacks['auth_add_follower'] = authAddFollower;
    this.callbacks['auth_update_followers'] = authUpdateFollowers;
  }
  // this will send the messages to the backend
  // it will pull all the notifications taht currently exist
  fetchFriendRequests(userId){
    this.sendNotification({
      userId: userId,
      command: 'fetch_friend_notifications'
    })
  }

  // This will send the pending social event information into the backend
  sendPendingSocialEvent = (socialEventObj) => {
    this.sendNotification({
      command: 'send_pending_social_event',
      socialEventObj: socialEventObj
    })
  }

  // This will send the pending photos notification for the social
  // calendar into the backend. It recieved information from the http
  // call and then send inot websocket
  sendPendingSocialPics = (notificationId) => {

    this.sendNotification({
      command: 'send_pending_social_pics',
      notificationId: notificationId
    })
  }



  sendNotification(data) {
    // this is good, it only sends 1 time
    // This will recieve information from onClickSend from PersonalProfile.js
    // and will send it to the userprofile.consumers

    // GOOD TILL HERE

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
