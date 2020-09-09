import React from 'react';
import * as dateFns from 'date-fns';
import { Modal, notification } from 'antd';

// import EventSyncForm from './EventSyncForm';

import EventSyncReactForm from './EventSyncReactForm';
import NotificationWebSocketInstance from '../../../notificationWebsocket';


// This class is use to pick a friend to event sync with
class EventSyncModal extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  submit = (values) => {
    console.log(values)
    let range = ''
    const startDate = dateFns.startOfDay(values.startDate)
    const endDate = new Date(values.endDate)
    const utc_end = dateFns.addHours(endDate, endDate.getTimezoneOffset()/60)
    const difference = dateFns.differenceInDays(new Date(utc_end), new Date(startDate))
    const realStart = dateFns.format(startDate, 'yyyy-MM-dd')
    if (difference === 1 ){
      range = 'day'
    } else if (difference === 7){
      range = 'week'
    }

    const NotificationOjbect = {
      command: 'send_friend_event_sync',
      actor: this.props.username,
      recipient: values.friend,
      range: range,
      startDate: realStart,
      endDate: values.endDate,
    }
    console.log(NotificationOjbect)
    this.openNotification(NotificationOjbect, 'bottomRight')
    // sending the information back into the websocket then to the backend
    NotificationWebSocketInstance.sendNotification(NotificationOjbect)
    this.props.close()
  }

  openNotification = (info, placement) => {
    const startDate = dateFns.format(
      dateFns.addHours(new Date(info.startDate),7), 'MM/dd/yyyy')
    const endDate = dateFns.format(
      dateFns.addHours(new Date(info.endDate),7), 'MM/dd/yyyy')
    const recipient = this.capitalize(info.recipient)
  notification.info({
    message: `Event Sync Request Sent to `+ recipient ,
    description:
    'Request for event sync from: '+ startDate + ' to ' + endDate,
    placement,
    });
  };



  render() {
    console.log(this.props)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
          <EventSyncReactForm
           onSubmit = {this.submit}/>
        </Modal>
      </div>
    )
  }
}

// const mapStateToProps = state => {
//   return {
//     currentUser: state.auth
//   }
// }



export default EventSyncModal;
