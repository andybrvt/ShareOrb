import { Drawer, List, Avatar, Divider, Col, Row, Modal, Button } from 'antd';
import React, { Component } from 'react';
import CalendarForm from '../components/CalendarForm'
import ReduxAddEventForm from '../components/ReduxAddEventForm';
import ReactAddEventForm from '../components/ReactAddEventForm';
import * as calendarActions from '../store/actions/calendars'
import { connect } from "react-redux";
import * as dateFns from 'date-fns';
import moment from 'moment';
import { authAxios } from '../components/util';
import * as navActions from '../store/actions/nav';



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
    console.log(start_date)

    console.log(values)


    // This will add information in to the backend but it doesnt change the props so you
    // have to find some way to change the props so this thing pops up


    // authAxios.post('http://127.0.0.1:8000/mycalendar/events/create/',{
    //   title: values.title,
    //   content: values.content,
    //   start_time: start_date,
    //   end_time: end_date,
    //   location: values.location,
    //   person: [this.props.id]
    // })
    // const instanceEvent = {
    //   title: values.title,
    //   content: values.content,
    //   start_time: start_date,
    //   end_time: end_date,
    //   location: values.location,
    //   person: [this.props.id]
    // }
    // this.props.addEvents(instanceEvent)
    // this.props.closePopup()
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
        <ReactAddEventForm onSubmit = {this.submit} />
        </Modal>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    addEvents: (events) => dispatch(calendarActions.addEvent(events)),
    closePopup: () => dispatch(navActions.closePopup())
  }
}

export default connect(null, mapDispatchToProps)(EventModal);
