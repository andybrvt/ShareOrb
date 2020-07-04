import React from 'react';
import { Modal } from 'antd';
import EventSyncForm from './EventSyncForm'
import EventSyncReactForm from './EventSyncReactForm'
import NotificationWebSocketInstance from '../../src/notificationWebsocket';
import * as dateFns from 'date-fns';


// This class is use to pick a friend to event sync with
class EventSyncModal extends React.Component{

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
    // sending the information back into the websocket then to the backend
    NotificationWebSocketInstance.sendNotification(NotificationOjbect)
  }

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
