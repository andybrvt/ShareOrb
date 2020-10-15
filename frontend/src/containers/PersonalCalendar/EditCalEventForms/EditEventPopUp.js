import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { connect } from "react-redux";
import { Button, notification, Divider, Space, Modal, Popover } from 'antd';
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { authAxios } from '../../../components/util';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import * as navActions from '../../../store/actions/nav';
import * as calendarEventActions from '../../../store/actions/calendarEvent';
import * as calendarActions from '../../../store/actions/calendars';
// import CalendarForm from './CalendarForm';

import ReduxEditEventForm from './ReduxEditEventForm';




class EditEventPopUp extends React.Component {
  //         <EditEventForm  {...this.props}/>
  timeConvert = (time) => {
    // This function will take in a time and then covert the time to
    // a 1-24 hour hour so that it cna be used to add into the
    // date and be submited

    console.log(time)
    let hour = parseInt(time.substring(0,2))
    let minutes = parseInt(time.substring(3,5))
    let ampm = time.substring(5,8)

    console.log(minutes)
    console.log(hour)

    let convertedTime = ''

    if (time.includes('PM')){
      if (hour !==  12){
        hour = hour + 12
      }
    } else if (time.includes('AM')){
      if(hour === 12){
        hour = 0
      }
    }

    const timeBundle = {
      firstHour: hour,
      firstMin: minutes
    }

    return timeBundle

  }


  submit = (values) => {

    // Similar to the submitting to addforms you still have to convert all the
    // days and times correctly in order to add them correctly into the backend

    console.log(values);

    const calendarId = this.props.calendarId

    let start_date = values.startDate.toDate()
    let end_date = values.startDate.toDate()
    const start_time = this.timeConvert(values.startTime)
    const end_time = this.timeConvert(values.endTime)

    console.log(values.startTime, values.endTime)

    start_date = dateFns.addHours(start_date, start_time.firstHour)
    start_date = dateFns.addMinutes(start_date, start_time.firstMin)
    const instance_start_date = dateFns.format(start_date, 'yyyy-MM-dd HH:mm:ss')

    end_date = dateFns.addHours(end_date, end_time.firstHour)
    end_date = dateFns.addMinutes(end_date, end_time.firstMin)

    console.log(end_date)
    const instance_end_date = dateFns.format(end_date, 'yyyy-MM-dd HH:mm:ss')
    // const start_time = dateFns.format(new Date(moment(values.start_time)), 'yyyy-MM-dd hh:mm:ss')
    // const end_time = dateFns.format(new Date(moment(values.end_time)), 'yyyy-MM-dd hh:mm:ss')

    console.log(start_date, end_date)

    if (this.props.addEvent === false ){

      // This if statement is for editing events
      authAxios.put('http://127.0.0.1:8000/mycalendar/events/update/'+calendarId, {
        title: values.title,
        content: values.content,
        start_time: start_date,
        end_time: end_date,
        location: values.location,
        color: values.eventColor,
        person: [this.props.id],
        repeatCondition: values.repeatCondition,
        host: this.props.id,
        accepted: [this.props.id]
      })
      const instanceEvent = {
        id: this.props.calendarId,
        title: values.title,
        content: values.content,
        start_time: instance_start_date,
        end_time: instance_end_date,
        location: values.location,
        color: values.eventColor,
        person: [this.props.id],
        repeatCondition: values.repeatCondition,
        host: this.props.id,
        accepted: [this.props.id]

      }
      console.log(instanceEvent)
      this.props.editEvent(instanceEvent)
    } else if (this.props.addEvent === true){
      // So two routes will go if this happens, if the share has noone then you
      // will just run the axios then run the redux but however if there is people
      // you want share with then you will run the channels

      // This is for when you make an event

      if(values.friends.length === 0 ){
        authAxios.post('http://127.0.0.1:8000/mycalendar/events/create/',{
          title: values.title,
          content: values.content,
          start_time: start_date,
          end_time: end_date,
          location: values.location,
          color: values.eventColor,
          person: [this.props.id],
          repeatCondition: values.repeatCondition,
          host: this.props.id,
          accepted: [this.props.id],
        })

        // The event instance is pretty much used when you just recently added an
        // event, so because of that you want to add the date in just as how the
        // date and event will be added according to the loaded event

        const curUserObj = {
          first_name: this.props.firstName,
          id: this.props.id,
          last_name: this.props.lastName,
          profile_picture: this.props.profilePic,
          username:this.props.username,
        }

        const instanceEvent = {
          title: values.title,
          content: values.content,
          start_time: instance_start_date,
          end_time: instance_end_date,
          location: values.location,
          color: values.eventColor,
          person: [curUserObj],
          invited: [],
          repeatCondition: values.repeatCondition,
          host: curUserObj,
          accepted: [this.props.id],
          decline: []
        }
        // add color to addEvents in redux
        this.props.addEvents(instanceEvent)
      } else {
        // This will be sent when you have poeple to share. Unlike the previous one
        // where it just the current person, this one you add everyone you are shareing
        // with along with your self into the person field


        const inviteList = values.friends.slice()
        console.log(inviteList)
        let shareList = values.friends
        shareList.push(this.props.username)
        console.log(shareList)
        console.log(inviteList)
        const createSharedEventObject = {
          command: 'add_shared_event',
          title: values.title,
          person: shareList,
          invited: inviteList,
          content: values.content,
          location: values.location,
          eventColor: values.eventColor,
          startDate: start_date,
          endDate: end_date,
          repeatCondition: values.repeatCondition,
          host: this.props.id,
          // accepted: [this.props.id]

        }

        CalendarEventWebSocketInstance.sendEvent(createSharedEventObject);
      }
    }
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

    console.log(time)
    if (time !== null){
      let hour = time.substring(0, 2)
      let min = time.substring(3, 5)
      let final_time = ''
      if (hour > 12 ){
        hour = hour - 12
        if (hour < 10){
            final_time = "0"+hour + ':'+min+' PM'
        } else {
            final_time = hour + ':'+min+' PM'
        }
      } else if(hour <= 12 ){
        if (hour == 0){
          final_time = '12:' + min + ' AM'
        } else if (hour == 12) {
          final_time = '12:' + min + ' PM'
        } else {
          final_time = hour +':'+ min+' AM'
        }
      }
      console.log(final_time)
      // MIGHT HAVE TO TAKE INTO CONSIDERATION THE 12AM AND 12 PM
      return final_time
    }


  }

  // So you pass the intial values into your form but you will have to pass
  // it as a dictioanry with each one being a key corresponding with each input
  getInitialValue = () => {
    // This will pass an initial value through the Field
    console.log(this.props)
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
      // dateRange: [dateFns.format(date_start, 'yyyy-MM-dd'), dateFns.format(date_end, 'yyyy-MM-dd')],
      dateRange: [moment(this.props.start_date, 'YYYY-MM-DD'), moment(this.props.end_date, 'YYYY-MM-DD')],
      startDate: moment(this.props.start_date, 'YYYY-MM-DD'),
      endDate: moment(this.props.end_date, 'YYYY-MM-DD'),
      startTime: start_time,
      endTime: end_time,
      location: this.props.location,
      eventColor: this.props.eventColor,
      repeatCondition: 'none',
      friends: []

    }
  }


  render () {
    console.log(this.props)
    return (
      <div>
      <RadiusBottomleftOutlined />


        <ReduxEditEventForm
        {...this.props}
        onSubmit = {this.submit}
        initialValues = {this.getInitialValue()}
        onDelete = {this.delete}
        friendList = {this.props.friendList}
        />


      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    addEvent: state.calendarEvent.addEvent,
    title: state.calendarEvent.title,
    content: state.calendarEvent.content,
    start_date: state.calendarEvent.start_date,
    end_date: state.calendarEvent.end_date,
    start_time: state.calendarEvent.start_time,
    end_time: state.calendarEvent.end_time,
    location: state.calendarEvent.location,
    eventColor: state.calendarEvent.eventColor,
    calendarId: state.calendarEvent.calendarId,
    id: state.auth.id,
    username: state.auth.username,
    friendList: state.auth.friends,
    profilePic: state.auth.profilePic,
    firstName: state.auth.firstName,
    lastName: state.auth.lastName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addEvents: (events) => dispatch(calendarActions.addEvent(events)),
    closePopup: () => dispatch(navActions.closePopup()),
    changeEvent: (e) => dispatch(calendarEventActions.changeCalendarEvent(e)),
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    editEvent: (instanceEvent) => dispatch(calendarActions.editEvents(instanceEvent)),
    deleteEvent: (eventId) => dispatch(calendarActions.deleteEvents(eventId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventPopUp);
