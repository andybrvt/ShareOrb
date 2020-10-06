import React from 'react';
import { Modal } from 'antd';
import '../PersonalCalCSS/NewCalendar.css';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';


class RemoveEventModal extends React.Component{

  sendDeleteAll = (eventId, user) => {
    // This function will be send if the host decides to delete all the events
    // this will remove all the events for everyone
    console.log(eventId, user)
    CalendarEventWebSocketInstance.deleteEvent(eventId, user)
  }

  render(){



    console.log(this.props)
    return (
      <Modal
      visible= {this.props.visible}
      onCancel = {this.props.close}
      zIndex = {2000}
      onOk = {() => this.sendDeleteAll(this.props.item, this.props.user)}
      className = "deleteModal"
      >
      Are you sure you want to remove the event? This will remove the event
      for all other users that are shared within this event
      </Modal>
    )
  }
}

export default RemoveEventModal;
