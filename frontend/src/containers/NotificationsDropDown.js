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
import { AimOutlined, ArrowRightOutlined } from '@ant-design/icons';


// This one is for holding the notifications and all its function

class NotificationsDropDown extends React.Component{
  state = {
    visible: false,
  };

  handleMenuClick = (e) => {
    if (e.key === '3') {
      this.setState({ visible: false });
    }
  }


  handleVisibleChange = (flag) => {
      this.setState({ visible: flag });
    }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
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

  onEventSyncDecline = (actor, recipient, minDate, maxDate) => {
    const declineNotificationObject = {
      command: 'decline_event_sync',
      actor: actor,
      recipient: recipient,
      minDate: minDate,
      maxDate: maxDate
    }
    // console.log(declineNotificationObject)
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
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'blue',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationFriend'>
            <span className = 'notificationWords'>
            <b>{this.capitalize(notifications[i].actor.username)} </b>
             sent you a friend request.
            </span>
            <div className ='pickEventSyncButton'>
            <Button
             type ="primary"
             className = 'acceptButton'
             onClick = {()=> this.onAccept(notifications[i].recipient, notifications[i].actor.username)}> Accept</Button>
            <Button
             className = 'declineButton'
             onClick = {()=> this.onDecline(notifications[i].recipient, notifications[i].actor.username)}> Decline </Button>
            </div>

            <Button

              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'accepted_friend') {
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
          <Avatar size = {55} style ={{
            backgroundColor: 'lightskyblue',
            verticalAlign: 'middle'}}
            icon = {<UserOutlined />}
            >
          </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
              accepted your friend request.
              <div>
              <Button
              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
              </div>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'declined_friend'){
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'orangered',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
               declined your friend request.
              <div>
              <Button
              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
              </div>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'send_friend_event_sync'){
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'limegreen',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationFriend'>
            <span className ='notificationWords'>
            <b>{this.capitalize(notifications[i].actor.username)} </b>
            wants to event sync with you from:
            <b>
            {dateFns.format(
              dateFns.addHours(new Date(notifications[i].minDate),7), 'MM/dd/yyyy')}
              -
              {dateFns.format(
                dateFns.addHours(new Date(notifications[i].maxDate),7), 'MM/dd/yyyy')}
            </b>
            </span>
            <div className = 'pickEventSyncButton'>
            <Button
            className = 'acceptButton'
            type ="primary"
            onClick = {()=> this.onEventSyncAccept(
              notifications[i].recipient,
              notifications[i].actor.username,
              notifications[i].minDate,
              notifications[i].maxDate
            )}> Accept</Button>
            <Button
            type ="priamry"
            className = 'declineButton'
            onClick = {()=> this.onEventSyncDecline(
              notifications[i].recipient,
              notifications[i].actor.username,
              notifications[i].minDate,
              notifications[i].maxDate
            )}> Decline </Button>
            </div>
            <Button type ='text'
             shape = 'circle'
             className = 'deleteButton'
             onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }>
             X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'declined_event_sync'){
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar
        size = {55}
        style ={{
          backgroundColor: 'darkgrey',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
               declined your event sync request.
              <Button
              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }
      if (notifications[i].type === 'accepted_event_sync'){
        // DONE
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'fuchsia',
          verticalAlign: 'middle'}}
          icon = {<UserOutlined />}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
              <span className = 'notificationWords'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
               accepted your event sync request from:
               <b>
              {dateFns.format(
                dateFns.addHours(new Date(notifications[i].minDate),7), 'MM/dd/yyyy')}
                -
              {dateFns.format(
                dateFns.addHours(new Date(notifications[i].maxDate),7), 'MM/dd/yyyy')}
              </b>
              </span>
              <div className = 'pickEventSyncButton'>
              <Button
              type = 'primary'
              style = {{
                width: '200px'
              }}
              onClick = {() => this.props.openPickEventSyncModal(
                notifications[i].recipient,
                notifications[i].actor.username,
                notifications[i].minDate,
                notifications[i].maxDate,
                notifications[i].id,
              )}> Pick Date </Button>
              </div>
              <Button
              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }>
               X </Button>

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
              {this.capitalize(notifications[i].actor.username)} set an event on {dateFns.format(new Date(notifications[i].minDate), 'MMM d, yyyy')} at {dateFns.format(new Date(notifications[i].minDate), 'h a')}
              <Button type ='primary' shape = 'circle' onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }> X </Button>
          </h4>
        </li>
        )
      }


    }
    return (
      <List onClick = {this.handleMenuClick}>
      <div
      className = 'notificationHeader'
      >
        <h2 className = 'notificationWord'> Notifications </h2>
      </div>
      { notificationList.length === 0 ?
        <li
        style = {{
          textAlign: 'center'
        }}
        > You have no notifications </li>
        :
        notificationList}
      </List>
    )
  }



  render() {
    console.log(this.props)
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">Clicking me will not close the menu.</Menu.Item>
        <Menu.Item key="2">Clicking me will not close the menu also.</Menu.Item>
        <Menu.Item key="3">Clicking me will close the menu</Menu.Item>
      </Menu>
    );

    return(
      <Dropdown overlay={this.renderNotifications()}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
        trigger = {['click']}
      >
        <a className="ant-dropdown-link" href="#">
          Notifications
          <DownOutlined style = {{
                      position: 'relative',
                      top: '-3px'
                    }}/>
        </a>
      </Dropdown>
    )
  }
}

const mapStateToProps = state => {
  return {
    showNotification: state.notifications.showNotification
  }
}

const mapDispatchToProps = dispatch => {
  // most of the other props are in the Layouts
  return {
    deleteNotification: notificationId => dispatch(notificationsActions.deleteNotification(notificationId)),
    openNotification: () => dispatch(notificationsActions.openNotification())
  }
}

export default connect(null, mapDispatchToProps)(NotificationsDropDown);
