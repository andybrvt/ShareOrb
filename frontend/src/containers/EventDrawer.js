import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
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



class EventDrawer extends React.Component {


  submit = (values) => {
    const start_date = dateFns.format(new Date(moment(values.start_time)), 'yyyy-MM-dd hh:mm:ss')
    const end_date = dateFns.format(new Date(moment(values.end_time)), 'yyyy-MM-dd hh:mm:ss')
    console.log(start_date, end_date)
    // This will add information in to the backend but it doesnt change the props so you
    // have to find some way to change the props so this thing pops up
    authAxios.post('http://127.0.0.1:8000/mycalendar/events/create/',{
      title: values.title,
      content: values.content,
      start_time: start_date,
      end_time: end_date,
      location: values.location,
      person: [this.props.id]
    })
    const instanceEvent = {
      title: values.title,
      content: values.content,
      start_time: start_date,
      end_time: end_date,
      location: values.location,
      person: [this.props.id]
    }
    this.props.addEvents(instanceEvent)
    this.props.closeDrawer()
  }



  // closable={this.props.closable}
  render() {
    console.log(this.props)
    return (
      <div>
        <Drawer
          width={440}
          placement="left"
          onClose={this.props.onClose}
          visible={this.props.visible}
        >
        <ReactAddEventForm onSubmit = {this.submit} />
        </Drawer>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    addEvents: (events) => dispatch(calendarActions.addEvent(events)),
    closeDrawer: () => dispatch(navActions.closePopup())
  }
}

export default connect(null, mapDispatchToProps)(EventDrawer);
