import React from 'react';
import { Modal } from 'antd';
import * as eventSyncActions from '../../../store/actions/eventSync';
import { connect } from 'react-redux';
import axios from 'axios';
import { authAxios } from '../../../components/util';
import PickEventSyncWeek from './PickEventSyncWeek';
import PickEventSyncDay from './PickEventSyncDay';
import PickEventSyncForm from './PickEventSyncForm';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import * as dateFns from 'date-fns';


// Unlike the event sync modal, this is where you would pick the
// time you would like to be good to meet up
// The eventsyncmodal is just to send the request


class PickEventSyncModal extends React.Component{
  constructor(props){
    super(props);
    // this.initialiseCalendarEvent()
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

        if (CalendarEventWebSocketInstance.state() === 1){

          // callback();
          return;
        } else {

            component.waitForSocketConnection();
        }
      }, 100)
  }

  componentDidMount () {
    CalendarEventWebSocketInstance.connect(this.props.curId)
    const friend = this.props.userFriend.username

    // To better adjust for the time range
    const date = new Date()

    const utcExtraHours = date.getTimezoneOffset()/60

    console.log(utcExtraHours)



    const date_min = dateFns.addHours(new Date(this.props.minDate), utcExtraHours)
    const date_max =dateFns.addHours(new Date(this.props.maxDate), utcExtraHours)
    const person = this.props.currentUser

    console.log(date_min, date_max)
    authAxios.get(`${global.API_ENDPOINT}/mycalendar/testEvents/`, {
      params:{
        friend,
        person,
        date_min,
        date_max
      }
    }) .then(res =>{
      console.log(res)
      this.props.eventEventSyncModal(res.data)

    })
  }

  componentWillReceiveProps (newProps){
    console.log(this.props)
    console.log(newProps)
    // Gotta make sure that both the curId are the same type, it seems like it should
    // not be a problem but sometiems it comes a string so you gotta convert both to ints
    console.log(parseInt(this.props.curId) !== parseInt(newProps.curId))
    if(parseInt(this.props.curId) !== parseInt(newProps.curId)){
      CalendarEventWebSocketInstance.disconnect()
      CalendarEventWebSocketInstance.connect(newProps.curId)
      console.log('newWebsocket')
    }

    // friend is the person you are sending the request to
    // Person is the person sending the request
    // You want to get both events from both people and then add it to the
    // same list so then you can render then on a min week check box
    const friend = newProps.userFriend.username

    const date = new Date()

    const utcExtraHours = date.getTimezoneOffset()/60

    console.log(utcExtraHours)

    console.log(new Date(newProps.minDate), new Date(newProps.maxDate))
    const date_min = dateFns.addHours(new Date(newProps.minDate), utcExtraHours)
    const date_max =dateFns.addHours(new Date(newProps.maxDate), utcExtraHours)
    const person = newProps.currentUser

    console.log(date_min, date_max)
    authAxios.get(`${global.API_ENDPOINT}/mycalendar/testEvents/`, {
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
          visible = {this.props.isVisible}
          // visible = {true}
          onCancel = {this.props.close}
          width = {1100}
          centered
          bodyStyle={{height:'575px', top:'100px'}}>
          <div class="parentEventSyncContainer">
            { dateFns.differenceInCalendarDays(
              new Date (this.props.maxDate),
              new Date (this.props.minDate)
            ) === 1 ?
              <PickEventSyncDay {...this.props}/>
                :
              <PickEventSyncWeek />
            }
          </div>

        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    currentUser: state.auth.username,
    curId: state.auth.id,
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
