import React from 'react';
import { Modal } from 'antd';
import CalendarForm from './CalendarForm';
import ReduxEditEventForm from './ReduxEditEventForm';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import * as calendarActions from '../store/actions/calendars';
import { connect } from "react-redux";
import * as dateFns from 'date-fns';
import axios from 'axios';
import { authAxios } from './util';
import moment from 'moment';
import { Button, notification, Divider, Space } from 'antd';
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
} from '@ant-design/icons';



class EditEventPopUp extends React.Component {
  //         <EditEventForm  {...this.props}/>
  submit = (values) => {
    console.log(values)
    const calendarId = this.props.calendarId
    const start_time = dateFns.format(new Date(moment(values.start_time)), 'yyyy-MM-dd hh:mm:ss')
    const end_time = dateFns.format(new Date(moment(values.end_time)), 'yyyy-MM-dd hh:mm:ss')

    authAxios.put('http://127.0.0.1:8000/mycalendar/events/update/'+calendarId, {
      title: values.title,
      content: values.content,
      start_time: start_time,
      end_time: start_time,
      location: values.location,
      person: [this.props.id]
    })
    const instanceEvent = {
      id: this.props.calendarId,
      title: values.title,
      content: values.content,
      start_time: start_time,
      end_time: start_time,
      location: values.location,
      person: [this.props.id]
    }
    this.props.editEvent(instanceEvent)
    this.props.close()
  }

  openNotification = placement => {
  notification.info({
    message: `Event deleted`,
    placement,
    });
  };

  delete = (e,value) => {
    e.preventDefault()
    this.props.deleteEvent(value)
    this.openNotification('bottom')
    this.props.close()

  }

  timeConvertFunction = (time) => {
    // This fucntion will take in a 1-24 hour time
    // and then returna  1-12 am/pm time
    // This fucntion will take in the time as a string in the 1-24 hour
    // time format
    if (time !== null){
      let hour = time.substring(0, 2)
      let min = time.substring(3, 5)
      let final_time = ''
      if (hour > 12 ){
        hour = hour - 12
        final_time = hour + ':'+min+' PM'
      } else if(hour <= 12 ){
        if (hour == 0){
          final_time = '12:' + min + ' AM'
        } else if (hour == 12) {
          final_time = '12:' + min + ' PM'
        } else {
          final_time = hour +':'+ min+' AM'
        }
      }

      // MIGHT HAVE TO TAKE INTO CONSIDERATION THE 12AM AND 12 PM
      return final_time
    }


  }

  // So you pass the intial values into your form but you will have to pass
  // it as a dictioanry with each one being a key corresponding with each input
  getInitialValue = () => {
    // This will pass an initial value through the Field

    // There is an issue with the utc_start and utc_end and start_time and end time
    const date_start = new Date(this.props.start_date)
    const utc_start = dateFns.addHours(date_start, date_start.getTimezoneOffset()/60)
    const date_end = new Date(this.props.end_date)
    const utc_end = dateFns.addHours(date_end, date_end.getTimezoneOffset()/60)
    const start_time = this.timeConvertFunction(this.props.start_time)
    const end_time  = this.timeConvertFunction(this.props.end_time)
    console.log(this.props)
    return{
      title: this.props.title,
      content: this.props.content,
      // start_time: dateFns.format(new Date(this.props.start_time), 'yyyy-MM-dd HH:mm a'),
      // end_time: dateFns.format(new Date(this.props.end_time), 'yyyy-MM-dd HH:mm a'),
      // dateRange: [dateFns.format(utc_start, 'yyyy-MM-dd HH:mm a'), dateFns.format(utc_end, 'yyyy-MM-dd HH:mm a')],
      dateRange: [this.props.start_date, this.props.end_date],
      startTime: start_time,
      endTime: end_time,
      location: this.props.location,

    }
  }


  render () {
    console.log(new Date(this.props.start_date))
    return (
      <div>
      <RadiusBottomleftOutlined />
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          onCancel= {this.props.close}
        >
        <ReduxEditEventForm
        {...this.props}
        onSubmit = {this.submit}
        initialValues = {this.getInitialValue()}
        onDelete = {this.delete} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    title: state.calendarEvent.title,
    content: state.calendarEvent.content,
    start_date: state.calendarEvent.start_date,
    end_date: state.calendarEvent.end_date,
    start_time: state.calendarEvent.start_time,
    end_time: state.calendarEvent.end_time,
    location: state.calendarEvent.location,
    calendarId: state.calendarEvent.calendarId,
    id: state.auth.id,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePopup: () => dispatch(navActions.closePopup()),
    changeEvent: (e) => dispatch(calendarEventActions.changeCalendarEvent(e)),
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    editEvent: (instanceEvent) => dispatch(calendarActions.editEvents(instanceEvent)),
    deleteEvent: (eventId) => dispatch(calendarActions.deleteEvents(eventId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventPopUp);
