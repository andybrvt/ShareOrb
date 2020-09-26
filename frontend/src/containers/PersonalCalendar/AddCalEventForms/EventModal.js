import React, { Component } from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import { connect } from "react-redux";
import { authAxios } from '../../../components/util';
import { Drawer, List, Avatar, Divider, Col, Row, Modal, Button } from 'antd';
import * as calendarActions from '../../../store/actions/calendars'
import * as navActions from '../../../store/actions/nav';
import ReduxAddEventForm from './ReduxAddEventForm';
import ReactAddEventForm from './ReactAddEventForm';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import CalendarForm from './CalendarForm'



const pStyle = {
  fontSize: 16,
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    className="site-description-item-profile-wrapper"
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
    }}
  >
    <p
      className="site-description-item-profile-p"
      style={{
        marginRight: 8,
        display: 'inline-block',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);



class EventModal extends React.Component {

  timeConvert = (time) => {
    // This function will take in a time and then covert the time to
    // a 1-24 hour hour so that it cna be used to add into the
    // date and be submited
    let hour = parseInt(time.substring(0,2))
    let minutes = parseInt(time.substring(3,5))
    let ampm = time.substring(5,8)

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
    console.log(values)
    // const start_date = dateFns.format(new Date(moment(values.start_time)), 'yyyy-MM-dd HH:mm')
    // const end_date = dateFns.format(new Date(moment(values.end_time)), 'yyyy-MM-dd HH:mm')
    let start_date = dateFns.startOfDay(new Date(values.start_date))
    let end_date = dateFns.startOfDay(new Date(values.end_date))

    const start_time  = this.timeConvert(values.start_time)
    const end_time = this.timeConvert(values.end_time)
    // So the start time and end time are dicitonaries that hold
    // the hours and minutes fo teh time so in order to retrived them
    // you have to call firstHour for hour and firstMin for minutes

    start_date = dateFns.addHours(start_date, start_time.firstHour)
    start_date = dateFns.addMinutes(start_date, start_time.firstMin)

    end_date = dateFns.addHours(end_date, end_time.firstHour)
    end_date = dateFns.addMinutes(end_date, end_time.firstMin)


    const temp_start_date = dateFns.format(start_date, 'yyyy-MM-dd HH:mm:ss')
    const temp_end_date = dateFns.format(end_date, 'yyyy-MM-dd HH:mm:ss')
    console.log(start_date, end_date)
    console.log(temp_start_date, temp_end_date)
    // This will add information in to the backend but it doesnt change the props so you
    // have to find some way to change the props so this thing pops up
    if (values.person.length === 0){
      authAxios.post('http://127.0.0.1:8000/mycalendar/events/create/',{
        title: values.title,
        content: values.content,
        start_time: start_date,
        end_time: end_date,
        location: values.location,
        color: values.event_color,
        person: [this.props.id],
        repeatCondition: values.repeatCondition,
        host: this.props.id,
        accepted: [this.props.id]
      })

      // The event instance is pretty much used when you just recently added an
      // event, so because of that you want to add the date in just as how the
      // date and event will be added according to the loaded event


      const instanceEvent = {
        title: values.title,
        content: values.content,
        start_time: temp_start_date,
        end_time: temp_end_date,
        location: values.location,
        color: values.event_color,
        person: [this.props.id],
        repeatCondition: values.repeatCondition,
        host: this.props.id,
        accepted: [this.props.id]
      }
      // add color to addEvents in redux
      this.props.addEvents(instanceEvent)
    } else {
      let shareList = values.person
      shareList.push(this.props.username)
      const createSharedEventObject = {
        command: 'add_shared_event',
        title: values.title,
        content: values.content,
        startDate: start_date,
        endDate: end_date,
        location: values.location,
        eventColor: values.event_color,
        person: shareList,
        repeatCondition: values.repeatCondition,
        host: this.props.id,
      }
      CalendarEventWebSocketInstance.sendEvent(createSharedEventObject);


    }



    this.props.closePopup()
  }



  // closable={this.props.closable}
  render() {
    console.log(this.props)
    return (
      <div>
        <Modal
          onCancel={this.props.onClose}
          visible={this.props.visible}
          footer = {false}
          width  = {450}
        >
        <ReactAddEventForm
        friendList = {this.props.friendList}
        onSubmit = {this.submit} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    friendList: state.auth.friends,
    username: state.auth.username,
    id: state.auth.id,

  }
}

const mapDispatchToProps = dispatch => {
  return {
    addEvents: (events) => dispatch(calendarActions.addEvent(events)),
    closePopup: () => dispatch(navActions.closePopup())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventModal);
