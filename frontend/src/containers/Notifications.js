import React from 'react';
import NotificationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';
import { List, Avatar, Button, Skeleton } from 'antd';
import { connect } from 'react-redux';
import './Container_CSS/Notifications.css';
import NotificationsDropDown from './NotificationsDropDown'


const count = 3;
// This one is mostly for just pulling and working with the information

class Notifications extends React.Component{
  state = {
    notifications: []
  }

// remember that you can add the call backs in using redux
// you like the functions in the notificationWebsocket to the notificaiton.js through callbacks and bind
// baically the information will be called to the states
  initialiseNotification(){
    this.waitForSocketConnection(() => {
      // when you do the fetchFriendRequests it already called the actions
      NotificationWebSocketInstance.fetchFriendRequests(
        this.props.id
      )
      })
      // NotificationWebSocketInstance.connect(this.props.match.params.username)
    }

    constructor(props){
      super(props)
      this.initialiseNotification()
      // these will give the commands the function --> this is similar to the command
      // array in the consumer.py
    }

  componentDidMount(){
    NotificationWebSocketInstance.connect(this.props.username)


  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){
        console.log(NotificationWebSocketInstance.state())
        if (NotificationWebSocketInstance.state() === 1){
          console.log('connection is secure');
          console.log(NotificationWebSocketInstance.state())
          callback();
          return;
        } else{
            console.log('waiting for connection...')
            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  onAccept = (actor, recipient) => {
    // this function will delete the notification that you accept and then send a notification
    // to the other person that they have accepted their frined reuqest
    // In the accept, the actor would be the person accepting and the recipient will be
    // the person that sent the request
    console.log(actor)
    console.log(recipient)
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/accept/'+recipient)
    const acceptNotificationObject = {

      command: 'accept_friend_request_notification',
      actor: actor,
      // the actor is an id of the recipient of the friend request
      recipient: recipient
      // the recipient is the actor that sent the friend request
    }
    NotificationWebSocketInstance.sendNotification(acceptNotificationObject)
  }

  onDecline = (actor, recipient) => {
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/delete/'+recipient)
    const declineNotificationObject = {
      command: 'decline_friend_request_notification',
      actor: actor,
      recipient: recipient,
    }
    NotificationWebSocketInstance.sendNotification(declineNotificationObject)
  }

  renderTimestamp = (timestamp) => {
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/60*24)} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  // renderNotifications = (notifications) => {
  //   return notifications.map(notification => (
  //     <li class="list">
  //         <a href="#" title="">
  //             <img src="images/resources/thumb-1.jpg" alt=""/>
  //             <div class="mesg-meta">
  //                 <div> This is the actor (person sending) [{notification.actor.username}] sent recepient (person receiving) [{notification.recipient}] </div>
  //                 <div>  </div>
  //                 <div> This is the message: [{notification.description}] </div>
  //                   <i>The time of this notification: {this.renderTimeStamp(notification.timestamp)}</i>
  //
  //
  //             </div>
  //         </a>
  //      </li>;
  //
  //    )
  //   )
  // }

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  };

  componentWillReceiveProps(newProps){
    console.log(newProps)
    if(this.props.username !== newProps.username){
      NotificationWebSocketInstance.disconnect()
      NotificationWebSocketInstance.connect(newProps.username)
    }


  }

  NotificationListRender (notifications) {
    const notification_list = []
    for (let i = 0; i< notifications.length; i++) {
      console.log(notifications[i].actor.username)
      console.log(notifications[i].type)
      if(notifications[i].type === 'friend'){
        notification_list.push(
          <div className = 'listNotification'>
            {notifications[i].actor.username} sent you a friend request.
            <br />
            <Button type ="primary" onClick = {()=> this.onAccept(notifications[i].recipient, notifications[i].actor.username)}> Accept</Button>
            <Button type ="priamry" onClick = {()=> this.onDecline(notifications[i].recipient, notifications[i].actor.username)}> Decline </Button>
          </div>
        )
      }
      if (notifications[i].type === 'accepted_friend') {
        notification_list.push(
          <div className = 'listNotification'>
              {notifications[i].actor.username} accepted your friend request.
          </div>
        )
      }
      if (notifications[i].type === 'declined_friend'){
        notification_list.push(
          <div className = 'listNotification'>
              {notifications[i].actor.username} declined your friend request.
          </div>
        )
      }
      if (notifications[i].type === 'send_friend_event_sync'){
        notification_list.push(
          <div className = 'listNotification'>
            {notifications[i].actor.username} wants to event sync with you.
            <br />
            <Button type ="primary" > Accept</Button>
            <Button type ="priamry" > Decline </Button>
          </div>
        )
      }
    }
    return <div> {notification_list} </div>
  }

  // <List
  //   className="demo-loadmore-list"
  //
  //   itemLayout="horizontal"
  //
  //   dataSource={this.props.notifications}
  //   renderItem={item => (
  //
  //
  //     <List.Item>
  //       <List.Item.Meta
  //         avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
  //         title={<a href="https://ant.design">{item.title}</a>}
  //
  //         description={"This is the description ["+item.description+"    ]  \n"+
  //           "This is the recipientID    "+item.recipient+"    This is the actor "+item.actor.username}
  //       />
  //       <Button type ="primary" onClick = {()=> this.onAccept(item.recipient,item.actor.username)}> Accept</Button>
  //       <Button type ="priamry" onClick = {()=> this.onDecline(item.actor.username)}> Decline </Button>
  //     </List.Item>
  //   )}
  // />

  render(){
    console.log(this.props.notifications)
    console.log(this.props)
    // <div>
    // HI HI HI
    // {this.NotificationListRender(this.props.notifications)}
    // </div>
    return (
          <NotificationsDropDown {...this.props}/>
      )

    }
  }

  const mapStateToProps = state => {
    return {
      notifications: state.notifications.notifications,
      username: state.auth.username
    }
  }

export default connect(mapStateToProps)(Notifications);
