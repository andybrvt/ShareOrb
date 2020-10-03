import React from 'react';
import { Menu, Dropdown, List, Button, Avatar, Badge, notification } from 'antd';
import { DownOutlined, NotificationOutlined } from '@ant-design/icons';
import NotificationWebSocketInstance from '../notificationWebsocket';
import { authAxios } from '../components/util';
import axios from 'axios';
import './Container_CSS/Notifications.css';
import { UserOutlined, SmileTwoTone, FrownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as notificationsActions from '../store/actions/notifications';
import * as eventSyncActions from '../store/actions/eventSync';
import PickEventSyncModal from './PersonalCalendar/EventSyncForms/PickEventSyncModal';
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
    // This will send it back to the notification to the orignal actor
    // os that use can pick an event sync date. This funciton actually deletes
    // the notification in the backend so no need to do it in the front end
    // ADD ANIMATION FOR WHEN ACCEPTING
    const acceptNotificationObject = {
      command: 'accept_event_sync',
      actor: actor,
      recipient: recipient,
      minDate: minDate,
      maxDate: maxDate
    }
    NotificationWebSocketInstance.sendNotification(acceptNotificationObject)
  }

  deleteSideNotification = ( placement ) => {
    notification.info({
      message: 'Notification Deleted',
      placement,
    })
  }

  onDeleteNotifcation = (notificationId) => {
    console.log(notificationId)
    this.deleteSideNotification('bottomLeft')
    authAxios.delete('http://127.0.0.1:8000/userprofile/notifications/delete/'+notificationId)
    this.props.deleteNotification(notificationId)
  }

  onProfileClick = (user) => {
    console.log(user)
    this.props.history.push('/explore/'+user)

  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  renderNotifications = () => {
    // For the accept notificaiton, you want to pass in min and max date and the requested user so you can
     // filter out later
    const notificationList = []
    const notifications = this.props.notifications
    console.log(notifications)
    for (let i = 0; i<notifications.length; i++){
      if(notifications[i].type === 'friend'){
        console.log( new Date() )
        console.log(new Date(notifications[i].timestamp))
        console.log(this.renderTimestamp(notifications[i].timestamp))
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'blue',
          verticalAlign: 'middle'}}
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationFriend'>
            <span className = 'notificationWords'>
            <b>{this.capitalize(notifications[i].actor.username)} </b>
             sent you a friend request.
            </span>
            <br />
            <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
            // icon = {<UserOutlined />}
            src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
            >
          </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
              accepted your friend request.
              <br />
              <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
               declined your friend request.
               <br />
               <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
        // ACCEPTS: works
          // Bascially when you accept, it will send a notification to to the
          // orignal sender saying that you accept the event sync and then it wll
          // let the orginal sender pick a time
          // This will also delete the event in the backend
        // DECLINE: works
          // When you decline, it will send a notificaiton to the orignal send
          // saying that you declined the event sync
          // This will also delete the event in the backend

        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'limegreen',
          verticalAlign: 'middle'}}
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotification'>
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
            <br />
            <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>

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
        // This event pretty much shows the original user that the recipient
        // that you have decline the event
        // WORKS
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar
        size = {55}
        style ={{
          backgroundColor: 'darkgrey',
          verticalAlign: 'middle'}}
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
               declined your event sync request.
               <br />
               <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
      if (notifications[i].type === 'accepted_event_sync'){
        // This will be sent to the orignal sender when the recipient when they choose
        // to accept the event sync. This notification will open up the
        // pick event sync so that you can pick the date for the event
        // WORKS
        notificationList.push(
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'fuchsia',
          verticalAlign: 'middle'}}
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}

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
              <br />
              <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>

              <div className = 'pickEventSyncButton'>
              <Button
              type = 'primary'
              style = {{
                width: '200px',
                height: '20px'
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
        <li className = 'notificationListContainer'>
        <div className = 'notificationIcon'>
        <Avatar size = {55} style ={{
          backgroundColor: 'orangered',
          verticalAlign: 'middle'}}
          // icon = {<UserOutlined />}
          src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}

          >
        </Avatar>
        </div>
          <h4 className = 'listNotificationSingle'>
              <b>{this.capitalize(notifications[i].actor.username)} </b>
              set an event on {dateFns.format(new Date(notifications[i].minDate), 'MMM d, yyyy')} at {dateFns.format(new Date(notifications[i].minDate), 'h a')}
              <br />
              <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
              <div>
              <Button
              type ='text'
              shape = 'circle'
              className = 'deleteButton'
              onClick = {()=> this.onDeleteNotifcation(notifications[i].id) }>
              X </Button>
              </div>
          </h4>
        </li>
        )
      }
      if(notifications[i].type === 'like_notification'){
        notificationList.push(
          <li className = 'notificationListContainer'>
            <div className = 'notificationIcon'>
            <Avatar size = {55} style = {{
              backgroundColor: 'purple',
              verticalAlign: 'middle'}}
              // icon = {<UserOutlined />}
              src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}
              >
            </Avatar>
            </div>
            <h4 className = 'listNotificationSingle'>
                <b>{this.capitalize(notifications[i].actor.username)} </b>
                 liked your post.
                 <br />
                 <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
      } if (notifications[i].type === 'comment_notification'){
        notificationList.push(
          <li className = 'notificationListContainer'>
            <div className = 'notificationIcon'>
            <Avatar size = {55} style = {{
              backgroundColor: 'purple',
              verticalAlign: 'middle'}}
              // icon = {<UserOutlined />}
              src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}

              >
            </Avatar>
            </div>
            <h4 className = 'listNotificationSingle'>
                <b>{this.capitalize(notifications[i].actor.username)} </b>
                 commented on your post.
                 <br />
                 <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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
      } if(notifications[i].type === 'follow_notification'){
        notificationList.push(
          <li className = 'notificationListContainer' onClick = {() => this.onProfileClick(notifications[i].actor.username)}>
            <div className = 'notificationIcon'>
            <Avatar size = {55} style = {{
              backgroundColor: 'purple',
              verticalAlign: 'middle'}}
              // icon = {<UserOutlined />}
              src = {"http://127.0.0.1:8000"+notifications[i].actor.profile_picture}

              >
            </Avatar>
            </div>
            <h4 className = 'listNotificationSingle'>
                <b>{this.capitalize(notifications[i].actor.username)} </b>
                 followed you.
                 <br />
                 <span className = 'timeStamp'> {this.renderTimestamp(notifications[i].timestamp)} </span>
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


    }
    return (
      <List
      // getPopupContainer={() => document.getElementById("position")}
      style = {{
        position: 'fixed',
        right: '20px',
        bottom : '63px'
      }}
      onClick = {this.handleMenuClick}>
      <div
      className = 'notificationHeader'
      >
        <h2 className = 'notificationWord'> Notifications </h2>
      </div>
      <div className = 'notificationScroll'>
      { notificationList.length === 0 ?
        <li
        style = {{
          textAlign: 'center'
        }}
        > You have no notifications </li>
        :
        notificationList}
      </div>
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
      <Dropdown
        overlay={this.renderNotifications()}
        onVisibleChange={this.handleVisibleChange}
        visible={this.state.visible}
        placement = 'bottomRight'
        trigger = {['click']}
      >

        <a className="ant-dropdown-link" href="#">
        <i class="far fa-bell" aria-hidden="true"></i>

        </a>
      </Dropdown>

    )
  }
}

const mapStateToProps = state => {
  return {
    showNotification: state.notifications.showNotification,

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
