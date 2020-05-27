import React from 'react';
import { Modal } from 'antd';
import * as eventSyncActions from '../store/actions/eventSync';
import { connect } from 'react-redux';
import axios from 'axios';
import { authAxios } from './util';
import PickEventSyncWeek from './PickEventSyncWeek';
import PickEventSyncForm from './PickEventSyncForm';
import CalendarEventWebSocketInstance from '../calendarEventWebsocket';


// Unlike the event sync modal, this is where you would pick the
// time you would like to be good to meet up
// The eventsyncmodal is just to send the request


class PickEventSyncModal extends React.Component{
  constructor(props){
    super(props);
    this.initialiseCalendarEvent()
  }

  state = {
    syncEvents: []
  }

  initialiseCalendarEvent(){
    // You can add a function in to the waitForSocketConnection
    this.waitForSocketConnection()
  }

  waitForSocketConnection (callback){
    const component = this;
    setTimeout(
      function(){
        console.log(CalendarEventWebSocketInstance.state())
        if (CalendarEventWebSocketInstance.state() === 1){
          console.log('connection is secure');
          console.log(CalendarEventWebSocketInstance.state())
          // callback();
          return;
        } else {
            console.log('waiting for connection...')
            component.waitForSocketConnection();
        }
      }, 100)
  }

  componentDidMount () {
    CalendarEventWebSocketInstance.connect(this.props.currentUser)
    const friend = this.props.userFriend
    const date_min = this.props.minDate
    const date_max = this.props.maxDate
    const person = this.props.currentUser
    authAxios.get('http://127.0.0.1:8000/mycalendar/testEvents/', {
      params:{
        friend,
        person,
        date_min,
        date_max
      }
    }) .then(res =>{
      console.log(res)
    })
  }

  componentWillReceiveProps (newProps){
    console.log(newProps)
    if(this.props.currentUser !== newProps.currentUser){
      CalendarEventWebSocketInstance.disconnect()
      CalendarEventWebSocketInstance.connect(newProps.currentUser)
      console.log('newWebsocket')
    }

    // friend is the person you are sending the request to
    // Person is the person sending the request
    // You want to get both events from both people and then add it to the
    // same list so then you can render then on a min week check box
    const friend = newProps.userFriend
    const date_min = newProps.minDate
    const date_max = newProps.maxDate
    const person = newProps.currentUser
    authAxios.get('http://127.0.0.1:8000/mycalendar/testEvents/', {
      params:{
        friend,
        person,
        date_min,
        date_max
      }
    }) .then(res =>{
      console.log(res.data)
      this.props.eventEventSyncModal(res.data)

    })
  }

  // Now that you can pull the data from both users, now you will make a mincalendar
  // where you can pick a date (remeber to use websocket so it sends over properly)


  render () {
    console.log(this.props)
    console.log(this.state)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}
          width = {1500}>
          <PickEventSyncWeek />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    currentUser: state.auth.username,
    userFriend: state.eventSync.userFriend,
    minDate: state.eventSync.minDate,
    maxDate: state.eventSync.maxDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    eventEventSyncModal: filterEvent => dispatch(eventSyncActions.eventEventSyncModal(filterEvent))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickEventSyncModal);
