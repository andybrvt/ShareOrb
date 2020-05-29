import React from 'react';
import { Menu, Dropdown, List, Button, Avatar } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';
import './Container_CSS/Notifications.css';
import { UserOutlined, SmileTwoTone, FrownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as notificationsActions from '../store/actions/notifications';
import * as eventSyncActions from '../store/actions/eventSync';
import PickEventSyncModal from '../components/PickEventSyncModal';
import * as dateFns from 'date-fns';

// This one is for holding the notifications and all its function

class NotificationsDropDown extends React.Component{

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

  onEventSyncDecline = (actor, recipient, minDate, maxDate) => {
    const declineNotificationObject = {
      command: 'decline_event_sync',
      actor: actor,
      recipient: recipient,
      minDate: minDate,
      maxDate: maxDate
    }
    NotificationWebSocketInstance.sendNotification(declineNotificationObject)
  }

  onEventSyncAccept = (actor, recipient, minDate, maxDate) => {
    const acceptNotificationObject = {
      command: 'accept_event_sync',
      actor: actor,
      recipient: recipient,
      minDate: minDate,
      maxDate: maxDate
    }
    NotificationWebSocketInstance.sendNotification(acceptNotificationObject)
  }

  onDeleteNotifcation = (notificationId) => {
    console.log(notificationId)
    authAxios.delete('http://127.0.0.1:8000/userprofile/notifications/delete/'+notificationId)
    this.props.deleteNotification(notificationId)
  }

  renderNotifications = () => {
    // For the accept notificaiton, you want to pass in min and max date and the requested user so you can
     // filter out later
    const notificationList = []
    const notifications = this.props.notifications
    console.log(notifications)
    for (let i = 0; i<notifications.length; i++){
      if(notifications[i].type === 'friend'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'blue',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
            <span>
            {notifications[i].actor.username} sent you a friend request.
            </span>
            <br />
            <Button type ="primary" onClick = {()=> this.onAccept(notifications[i].recipient, notifications[i].actor.username)}> Accept</Button>
            <Button type ="primary" onClick = {()=> this.onDecline(notifications[i].recipient, notifications[i].actor.username)}> Decline </Button>
            <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'accepted_friend') {
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
          <Avatar size = {55} style ={{
            backgroundColor: 'lightskyblue',
            verticalAlign: 'middle'}}
            icon = {<UserOutlined />}
            >
          </Avatar>
        </div>
          <h4 className = 'listNotification'>
              {notifications[i].actor.username} accepted your friend request.
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'declined_friend'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'orangered',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
              {notifications[i].actor.username} declined your friend request.
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'send_friend_event_sync'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'limegreen',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
            <span>
            {notifications[i].actor.username} wants to event sync with you.
            </span>
            <br />
            <span>
            {notifications[i].minDate}
            <br />
            {notifications[i].maxDate}
            </span>
            <Button type ="primary" onClick = {()=> this.onEventSyncAccept(
              notifications[i].recipient,
              notifications[i].actor.username,
              notifications[i].minDate,
              notifications[i].maxDate
            )}> Accept</Button>
            <Button type ="priamry" onClick = {()=> this.onEventSyncDecline(
              notifications[i].recipient,
              notifications[i].actor.username,
              notifications[i].minDate,
              notifications[i].maxDate
            )}> Decline </Button>
            <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'declined_event_sync'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'darkgrey',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
              {notifications[i].actor.username} declined your event sync request.
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'accepted_event_sync'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'fuchsia',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
              <span>
              {notifications[i].actor.username} accepted your event sync request.
              </span>
              <br />
              <span>
              {notifications[i].minDate}
              <br />
              {notifications[i].maxDate}
              </span>
              <Button type = 'primary' onClick = {() => this.props.openPickEventSyncModal(
                notifications[i].recipient,
                notifications[i].actor.username,
                notifications[i].minDate,
                notifications[i].maxDate
              )}> Pick Date </Button>
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'new_event'){
        notificationList.push(
        <li className = 'notificaitonListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'orangered',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
              {notifications[i].actor.username} set an event on {dateFns.format(new Date(notifications[i].minDate), 'MMM d, yyyy')} at {dateFns.format(new Date(notifications[i].minDate), 'h a')}
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }


    }
    return (
      <List>
      <li className = 'topNotification' >
        <h2> Notifications </h2>
      </li>
      {notificationList}
      </List>
    )
  }



  render() {
    console.log(this.props)
    const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="http://www.taobao.com/">2nd menu item</a>
      </Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );

    return(
      <Dropdown overlay={this.renderNotifications} trigger={['click']}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          Notifications
          <DownOutlined />
        </a>
      </Dropdown>
    )
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  // most of the other props are in the Layouts
  return {
    deleteNotification: notificationId => dispatch(notificationsActions.deleteNotification(notificationId)),
  }
}

export default connect(null, mapDispatchToProps)(NotificationsDropDown);
