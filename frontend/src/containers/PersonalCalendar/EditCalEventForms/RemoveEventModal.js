import React from 'react';
import { Modal, notification } from 'antd';
import '../PersonalCalCSS/NewCalendar.css';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import * as dateFns from 'date-fns';


class RemoveEventModal extends React.Component{

  sendDeleteAll = (eventId, user) => {
    // This function will be send if the host decides to delete all the events
    // this will remove all the events for everyone
    console.log(eventId, user)
    const week = dateFns.startOfWeek(new Date())
    const year = dateFns.getYear(week)
    const month = dateFns.getMonth(week)+1
    const day = dateFns.getDate(week)
    CalendarEventWebSocketInstance.deleteEvent(eventId, user)
    if(this.props.history){
      this.props.history.push('/personalcalendar/w/'+year+'/'+month+'/'+day)
    }
    this.props.close()
    this.eventEditNotification("bottomLeft");
  }

  eventEditNotification = placement => {
    notification.info({
      message: `Event deleted.`,
      placement
    });
  };

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
