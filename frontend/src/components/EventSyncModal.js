import React from 'react';
import { Modal } from 'antd';
import EventSyncForm from './EventSyncForm'
import NotificationWebSocketInstance from '../../src/notificationWebsocket';

// This class is use to pick a friend to event sync with
class EventSyncModal extends React.Component{

  submit = (values) => {
    const NotificationOjbect = {
      command: 'send_friend_event_sync',
      actor: this.props.username,
      recipient: values.friend,
      maxDate: values.maxDate,
      minDate: values.minDate
    }
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
          <EventSyncForm
          onSubmit = {this.submit}
          />
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
