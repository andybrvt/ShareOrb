import React from 'react';
import { Menu, Dropdown, List, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';

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

  renderNotifications = () => {
    const notificationList = []
    const notifications = this.props.notifications
    for (let i = 0; i<notifications.length; i++){
      if(notifications[i].type === 'friend'){
        notificationList.push(
        <li>
          <div className = 'listNotification'>
            {notifications[i].actor.username} sent you a friend request.
            <br />
            <Button type ="primary" onClick = {()=> this.onAccept(notifications[i].recipient, notifications[i].actor.username)}> Accept</Button>
            <Button type ="priamry" onClick = {()=> this.onDecline(notifications[i].recipient, notifications[i].actor.username)}> Decline </Button>
          </div>
        </li>
        )
      }
      if (notifications[i].type === 'accepted_friend') {
        notificationList.push(
        <li>
          <div className = 'listNotification'>
              {notifications[i].actor.username} accepted your friend request.
          </div>
        </li>
        )
      }
      if (notifications[i].type === 'declined_friend'){
        notificationList.push(
        <li>
          <div className = 'listNotification'>
              {notifications[i].actor.username} declined your friend request.
          </div>
        </li>
        )
      }
    }
    return <List>{notificationList}</List>
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
          Notifications <DownOutlined />
        </a>
      </Dropdown>
    )
  }
}

const mapStateToProps = state => {
  return {
    // notifications: state.notifications.notifications,
  }
}

export default NotificationsDropDown;
