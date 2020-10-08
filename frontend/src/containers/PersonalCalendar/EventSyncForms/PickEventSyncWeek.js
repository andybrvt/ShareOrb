import React from 'react';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import '../PersonalCalCSS/EventSync.css';
import { Button, notification } from 'antd';
import PickEventSyncForm from './PickEventSyncForm';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../../notificationWebsocket';
import { SubmissionError } from 'redux-form';
import * as eventSyncActions from '../../../store/actions/eventSync';
import * as notificationsActions from '../../../store/actions/notifications';
import { authAxios } from '../../../components/util';


class PickEventSyncWeek extends React.Component{

  state = {
    active: null,
    selectedDate: null,
  }

  renderHeader(){
    // This is to render the mini Calendar month givien the date range
    const dateFormat = 'MMMM yyyy'
    const minDate = this.props.minDate
    return(
      <div className = 'header'>
        <div className = 'col-center'>
          <span>
            {dateFns.format(new Date(minDate) , dateFormat)}
          </span>
        </div>
      </div>
    )
  }

  renderDays() {
    // This is just to render out the days in the date range
    const dateFormat = 'iii'
    const dayFormat = 'd'
    const days = []

    console.log (new Date(this.props.minDate))
    let minDate = dateFns.addDays(new Date(this.props.minDate),1)
    let maxDate = dateFns.addDays(new Date(this.props.maxDate),1)
    // Added one day so that you can compare them to make sure things are more accurate
    // Plus when you do new date it think it goes back 7 hours, and since the max and min
    // dates are at 00
    const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))
    let cloneMinDate = this.props.minDate

    for(let i = 0; i<difference; i++){
        const cloneCloneMinDate = cloneMinDate
        days.push(
          <div
          className = 'syncCol col-center '
          key = {i}
          >
            {dateFns.format(dateFns.addDays(minDate, i), dateFormat)}
            <br />
            {dateFns.format(dateFns.addDays(minDate, i), dayFormat)}
          </div>
        )
        cloneMinDate = dateFns.addDays(cloneMinDate, 1)
    }
    return <div className = 'days row'>{days}</div>
  }

  renderSide() {
    // Render side, you would want to start off at 11:30 am and end at 11:30 pm
    const dateFormat = 'h a'
    const hour = []
    let startHour = dateFns.addHours(dateFns.startOfDay(new Date(this.props.minDate)), 1)
    for (let i = 0; i<23; i++){
      const formattedHour = dateFns.format(startHour, dateFormat)
      hour.push(
        <div
          className = 'cell'
          key = {hour}
        >
        <span className = 'number'>{formattedHour}</span>
        </div>
      )
      startHour = dateFns.addHours(startHour, 1)
    }
    return <div className= 'body'> {hour} </div>
  }

  renderWeekCell(events){
    console.log(events)
    // Render the week cell, so what you want to do is pick the first to be the minDate and
    // the last day will be the maxDate
    // You will loop through each hour of each day and then redner through each day of the week
    const minDate = dateFns.addDays(new Date(this.props.minDate),1);
    const maxDate = dateFns.addDays(new Date(this.props.maxDate),1);
    // This will be different from the calendar week calendar in that it doesn't start from the beginning
    // of the week but rather it will start from beginning of the date range
    const hourFormat = 'h a'
    const dayFormat = 'd MMMM'
    // This hour list will hold 24 items, each list will be for each hour of each day 5x24
    const hours = []

     // This list will hold all the events
     let toDoStuff = []
     // This will be a list with teh same hour of all the days
     let days = []
     // You will need the start day and the start hour
     // The start day will be the minDate

     let date = minDate
     const startHourDay = dateFns.startOfDay(date);
     const endHourDay = dateFns.endOfDay(date);

     let formattedDay = '';

     let hour = startHourDay;
     let formattedHour = '';

     // The counter is to give each box a seperate id so that it will highlight when you click on it
     let counter = 0

     const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))



     // The plan for the loop is ot have a while loop that loops thorugh each hour of the same day
     // then go down to the next hour then go through all the days

     while (hour <= endHourDay){
       // When adding things to the calendar you have to match the date and the hour
       console.log(hour)
       for (let i = counter; i< (counter+difference); i++){
          const cloneDay = date
          const cloneHour = hour
          const checkMin = dateFns.getMinutes(new Date(hour))
          console.log(cloneDay, cloneHour)
          formattedHour = dateFns.format(hour, hourFormat)
          formattedDay = dateFns.format(date, dayFormat)
          // This loop will loop thorugh all the events and if the hour and day matches and it will
          // add it to the toDoStuff which will loopp thorugh each each cell then it will be
          // cleared out again
          for (let item = 0; item<events.length; item++){
            // You gotta make the end time minus one because if you dont it will fill
            //  up the cells of that time after it so thats not good
            const startHour = dateFns.getHours(new Date(events[item].start_time))
            const startMin = dateFns.getMinutes(new Date(events[item].start_time))
            const endHour = dateFns.getHours(new Date(events[item].end_time))
            const endMin = dateFns.getMinutes(new Date(events[item].end_time))
            const curHour = dateFns.getHours(new Date(hour))
            const curMin = dateFns.getMinutes(new Date(hour))

            const sameDayStart = dateFns.isSameDay(new Date(events[item].start_time), cloneDay)
            const sameDayEnd = dateFns.isSameDay(new Date(events[item].end_time), cloneDay)
          // First is to get the start time to be there. Gotta make sure you get
          // minutes correct

          if (
            startHour === 23
          ){

            if(
             startMin === 30
             &&
             startHour === curHour
             &&
             startMin === curMin
             &&
             (sameDayStart || sameDayEnd)
           ){
             console.log('right here')
             toDoStuff.push(
               events[item]
             )
           }
            else if(
              startMin === 0
              &&
              startMin === curMin
              &&
              startHour === curHour
              &&
              (sameDayStart || sameDayEnd)
            ) {

              toDoStuff.push(
                events[item]
              )
            }


            if (endHour === 0){
              if (
                startMin === 0
                &&
                startHour === curHour
                &&
                (sameDayStart || sameDayEnd)
              ){
                toDoStuff.push(
                  events[item]
                )
              } else if(
                startMin === 30
                &&
                startMin === curMin
                &&
                startHour === curHour
                &&
                (sameDayStart || sameDayEnd)
              ){
                toDoStuff.push(
                  events[item]
                )
              }

            }


          }
          else {
            if (
              startHour === curHour
              &&
              startMin === curMin
              &&
              (sameDayStart || sameDayEnd)

            ){
              console.log('test1')
              toDoStuff.push(
                events[item]
              )
            }
            if(
              endHour === curHour
              &&
              endMin === 30
              &&
              endMin-30 === curMin
              &&
              (sameDayStart || sameDayEnd)
            ){
              console.log('test1')
              toDoStuff.push(
                events[item]
              )
            } else if (
              endMin === 0
              &&
              endHour -1 === curHour
              &&
              endMin+30 === curMin
              &&
              (sameDayStart || sameDayEnd)
            ){
              console.log('test1')
              toDoStuff.push(
                events[item]
              )
            }

            if(
              startMin === 30

            ){
              if(
                startHour < curHour
                &&
                endHour > curHour
                &&
                (0 === curMin
                ||
                30 === curMin)
                &&
                (sameDayStart || sameDayEnd)
              ){
                console.log('test1')
                toDoStuff.push(
                  events[item]
                )
              }

            } else if (
              startMin === 0

            ){
              if (
                startHour <= curHour
                &&
                endHour> curHour
                &&
                (sameDayStart || sameDayEnd)
              ){
                toDoStuff.push(
                  events[item]
                )
              }

            }


          }

          // RENDER THE VERY FIRST CELL OF THE START TIME





          }

          // You can always have access to the events, you just got to loop through
          // toDoStruff in the if below if you want to check
          if (toDoStuff.length > 0){
            days.push(
              <div
              className = {`syncCol disabled ${checkMin === 0 ? "nonhourcellT" : "nonhourcellB" }`}
                // className = 'syncCol nonhourcell disabled'
              >
              </div>
            )
          } else {
            days.push(
              <div
                style = {{background: this.color(i)}}
                className = {`syncCol ${checkMin === 0 ? "hourcellT" : "hourcellB"}`}
                // className = 'syncCol hourcell'
                onClick = {(e) => this.onDayHourClick(e, i, cloneDay, cloneHour)}
              >
              <span className = 'number'></span>
              </div>
            )
          }
          toDoStuff = []
          date = dateFns.addDays(date, 1)
       }
       // After you loop thorugh the hour, you will want to put that hur into the hour
       // list and then clear out days list ot redo it again then you add in the next hour, then
       // set the start day again to the start of the week then run it throuhg again
       // Remember teh date must be resetted before adding the hour because
       // of the while condition
       hours.push(
         <div className = 'row'>
          {days}
         </div>
       )
       counter = counter + 7
       days = []
       date = minDate
       hour = dateFns.addMinutes(hour, 30)
     }

     return <div className = 'body'>{hours}</div>
  }

  onDayHourClick = (e,position, day, hour) => {

    const selectedHour = dateFns.getHours(hour)
    const selectedYear = dateFns.getYear(day)
    const selectedMonth = dateFns.getMonth(day)
    const selectedDate = dateFns.getDate(day)
    const selectedMin = dateFns.getMinutes(hour)

    const finalSelectedDate = new Date(selectedYear, selectedMonth, selectedDate, selectedHour, selectedMin)
    if (this.state.active === position){
      this.setState({
        active: null,
        selectedDate: null
      })
    } else {
      this.setState({
        active: position,
        selectedDate: finalSelectedDate
      })
    }
    console.log(finalSelectedDate)
  }

  color = (position) => {
    console.log(position)
    // Just the color of the selected time on the pick event sync calendar
    if (this.state.active === position-7){
      return '#91d5ff'
    }
    if (this.state.active === position){
      return '#91d5ff';
    }

    return '';
  }

  submit = (value) => {
    // On this onSubmit, you want to first get both the date, the
    // event information, and both the user and then you will pass into the the websocket
    // stuff and then pass it into the backend into the consumer then create the new notificaiton
    // then group send it, then pass into redux in the front end (make sure to crate the callbacks)
    // The value includes

    // IN PROGRESS OF CHECKING
    console.log(value)
    console.log(this.props.currentUser)
    console.log(this.props.userFriend)
    if (this.state.selectedDate === null){
      throw new SubmissionError({
        _error: '*Please pick a date'
      })
    } else {
      const notificationId = this.props.notificationId
      const startTime = this.state.selectedDate
      const endTime = dateFns.addHours(startTime, 1)

      let content = ''
      let location = ''
      if (value.content){
        content = value.content
      }
      if (value.location){
        location = value.location
      }
      // For submitEvent object:
      // title, value, location, event color will just be strings
      // person, and invited will be a list of usernames
      // repeatCondition will be none
      // the host will the id of the actor
      const submitEvent = {
        command: 'add_sync_event',
        title: value.title,
        person: [this.props.currentUser, this.props.userFriend],
        invited: [this.props.userFriend],
        content: content,
        location: location,
        eventColor: value.eventColor,
        startDate: startTime,
        endDate: endTime,
        repeatCondition: "none",
        host: this.props.id,
      }
      const submitNotification = {
        command: 'send_new_event_sync_notification',
        actor: this.props.currentUser,
        recipient: this.props.userFriend,
        date: this.state.selectedDate
      }
      console.log(submitEvent)
      // So the webSocket is to send the info into the backend in tho the channles to make the
      // event for both parties
      CalendarEventWebSocketInstance.sendEvent(submitEvent);
      // This is to send a notification to the other person that an event was choosen
      NotificationWebSocketInstance.sendNotification(submitNotification)
      this.props.closePickEventSyncModal()
      // // This is just to delete the notificaiton
      authAxios.delete('http://127.0.0.1:8000/userprofile/notifications/delete/'+notificationId)
      this.props.deleteNotification(notificationId)
      this.openNotification('bottomLeft', this.state.selectedDate)
    }
  }

  openNotification = (placement,date)  => {
    // this is to show a small notification on the side to show that the user
    // added an event into his calendar
    console.log(date)
    const day = dateFns.format(new Date(date), 'MMM d, yyyy')
    const time = dateFns.format(new Date(date), 'h a')
    notification.info({
      message: 'You set an event on '+ day + ' at ' + time + '.',
      placement,
    })
  }

  getInitialValue = () => {
    return {
      eventColor:'#01D4F4'
    }
  }


  render() {
    console.log(this.state)
    console.log(this.props)
    return (
      <div className = 'eventSyncCalendarContainer'>
        <div className = 'syncCalendar'>
          <div className = 'syncHeader'>
            {this.renderHeader()}
            <div style={{marginLeft:'200px'}} class="header">{this.props.userFriend} calendar</div>


            {this.renderDays()}
          </div>
          <div className = 'syncBody'>
            <div className = 'timecol'>
              {this.renderSide()}
            </div>
            <div className = 'syncGrid'>
            {this.renderWeekCell(this.props.filterEvent)}
            </div>
          </div>
        </div>
        <PickEventSyncForm
        onSubmit = {this.submit}
        initialValues = {this.getInitialValue()}
        active = {this.state.active} />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    minDate: state.eventSync.minDate,
    maxDate: state.eventSync.maxDate,
    filterEvent: state.eventSync.filterEvent,
    currentUser: state.auth.username,
    currentProfile: state.auth.profilePic,
    userFriend: state.eventSync.userFriend,
    notificationId: state.eventSync.notificationId,
    id: state.auth.id,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePickEventSyncModal: () => dispatch(eventSyncActions.closePickEventSyncModal()),
    deleteNotification: notificationId => dispatch(notificationsActions.deleteNotification(notificationId))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(PickEventSyncWeek);
