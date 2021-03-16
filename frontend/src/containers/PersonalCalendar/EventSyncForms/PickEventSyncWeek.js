import React from 'react';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import '../PersonalCalCSS/EventSync.css';
import { Modal, DatePicker, TimePicker, Avatar, Button, Input, Select, Radio, Card, Row, Col, notification } from 'antd';
import PickEventSyncFormWeek from './PickEventSyncFormWeek';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../../notificationWebsocket';
import { Field, reduxForm, reset, formValueSelector, SubmissionError } from 'redux-form';
import * as eventSyncActions from '../../../store/actions/eventSync';
import * as notificationsActions from '../../../store/actions/notifications';
import { authAxios } from '../../../components/util';
import PickEventSyncUserProfileCard from './PickEventSyncUserProfileCard.js';
import moment from 'moment';




class PickEventSyncWeek extends React.Component{

    state = {
      active: null,
      selectedDate: null,
      tempStart: -1,
      tempEnd: -1,
      tempStartDate: null,
      tempEndDate: null,
      tempColor: "#1890FF",
      tempTitle: ""
    }

    onFormChange = (value) => {
      // Will take care of the on change for the form
      // so that when you change the form it changes
      // the event

      console.log(value)
      if(value.startTime
        && value.endTime
        && (value.title || value.title === "")
        && value.eventColor
        && value.startDate
      ){
        if(value.startTime === "" || value.endTime === ""){
          this.setState({
            tempStart: -1,
            tempEnd: -1,
            tempTitle: value.title,
            tempColor: value.eventColor,
            tempStartDate: value.startDate,
            tempEndDate: value.startDate
          })
        } else {
          console.log(value.title)
          this.setState({
            tempStart: value.startTime,
            tempEnd: value.endTime,
            tempTitle: value.title,
            tempColor: value.eventColor,
            tempStartDate: value.startDate,
            tempEndDate: value.startDate
          })
        }
      }

    }



    renderSide() {
      // Render side, you would want to start off at 11:30 am and end at 11:30 pm
      const dateFormat = 'h a'
      const hour = []
      let startHour = dateFns.addHours(dateFns.startOfDay(new Date(this.props.maxDate)), 1)
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


    hourEventIndex = (start_time, end_time ) => {

      // Simlar to that of the hourEvent index of the calendarpopover
      // but because the inputs are in the format "HH:MM am" there is a bit of a
      // change

      console.log(start_time, end_time)
      if(start_time === -1 || end_time === -1){
        return "-1"
      } else if(start_time && end_time){
        const start = this.timeConvert(start_time)
        const end = this.timeConvert(end_time)
        console.log(start, end)
        let startIndex = (start.firstHour * 2) +1
        if(start.firstMin === 30){
          startIndex = startIndex +1
        }

        let endIndex = end.firstHour * 2
        if(end.firstMin === 30){
          endIndex = endIndex + 1
        }
        endIndex = endIndex +1

        console.log(startIndex+"/"+endIndex)
        if(startIndex === 47){
          // handle the condition where the time is at 11pm
            return startIndex+"/"+49
        }
        if(startIndex === 48){
          return startIndex +"/"+ 49
        }


        return startIndex+"/"+endIndex


      }


    }

    dayEventIndex = (startDate, endDate) => {

      // Simlar to taht of the dayEventIndex in calednarpoppover but the only input
      // will be that of the startDate
      console.log(startDate, endDate)
       if(startDate === -1 || endDate === -1){
         return "-1"
       } else {
         console.log(new Date(startDate))
         const curStartDate = new Date(startDate)
         const curEndDate = new Date(endDate)
         console.log(curStartDate, curEndDate)
         // Int his case you cant use start of week bc the start of week is not const
         // So the start of the week has to be min date

         console.log(dateFns.addHours(new Date(this.props.minDate), new Date().getTimezoneOffset()/60))
         const curDayDiff = dateFns.differenceInCalendarDays(curEndDate, curStartDate)
         const startWeek = dateFns.addHours(new Date(this.props.minDate), new Date().getTimezoneOffset()/60)
         const dayDiff = dateFns.differenceInCalendarDays(curStartDate, startWeek)


         let startIndex = dayDiff+1

         let endIndex = startIndex+curDayDiff+1

         console.log(this.state.tempStart)
         console.log(dayDiff)
         console.log(curDayDiff)
         if(this.state.tempStart === "11:00 PM" || this.state.tempStart === "11:30 PM"){
           // handle the next day
           console.log(startIndex)
           endIndex = startIndex + 1
           return startIndex+'/'+ endIndex

         }

         console.log(startIndex, endIndex)
         return startIndex+'/'+endIndex

       }



    }

    renderBlockedTimes =( events ) => {
      // this function will run the events and then give them a grid coordinate
      console.log(events)
      let gridEvents = []

      for (let i= 0; i< events.length; i++){
        console.log(events[i].start_time)
        console.log(new Date(events[i].start_time))
        const date = new Date(events[i].start_time)
        const start = new Date(events[i].start_time)

        const end= new Date(events[i].end_time)


        const startTime = dateFns.format(start, "HH:mm")
        const newStartTime = this.timeConvertFunction(startTime)

        const endTime = dateFns.format(end, "HH:mm")
        const newEndTime = this.timeConvertFunction(endTime)

        console.log(newStartTime, newEndTime)

        gridEvents.push(
          <div
            className = "blockedEvents"
            style = {{
              gridColumn: this.dayEventIndex(date, date),
              gridRow: this.hourEventIndex(newStartTime, newEndTime),
            }}
            >

          </div>
        )
      }

      return gridEvents
    }


    renderWeekCell(events){
      console.log(events)
      // Render the week cell, so what you want to do is pick the first to be the minDate and
      // the last day will be the maxDate
      // You will loop through each hour of each day and then redner through each day of the week

      // Probally have to fix this later when we readjust the timezone issue.
      const minDate = dateFns.addHours(new Date(this.props.minDate), new Date().getTimezoneOffset()/60);
      const maxDate = dateFns.addHours(new Date(this.props.maxDate),new Date().getTimezoneOffset()/60);
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
         for (let i = counter; i< (counter+difference); i++){
            const cloneDay = date
            const cloneHour = hour
            const checkMin = dateFns.getMinutes(new Date(hour))
            formattedHour = dateFns.format(hour, hourFormat)
            formattedDay = dateFns.format(date, dayFormat)
            // This loop will loop thorugh all the events and if the hour and day matches and it will
            // add it to the toDoStuff which will loopp thorugh each each cell then it will be
            // cleared out again

            // for (let item = 0; item<events.length; item++){
            //   const startHour = dateFns.getHours(new Date(events[item].start_time))
            //   const startMin = dateFns.getMinutes(new Date(events[item].start_time))
            //   const endHour = dateFns.getHours(new Date(events[item].end_time))
            //   const endMin = dateFns.getMinutes(new Date(events[item].end_time))
            //   const curHour = dateFns.getHours(new Date(hour))
            //   const curMin = dateFns.getMinutes(new Date(hour))
            //
            //
            //   const sameDayStart = dateFns.isSameDay(new Date(events[item].start_time), cloneDay)
            //   const sameDayEnd = dateFns.isSameDay(new Date(events[item].end_time), cloneDay)
            //
            //   console.log(startHour, startMin)
            //   console.log(sameDayStart, sameDayEnd, startHour, startMin,new Date(events[item].start_time), cloneDay )
            //
            //   if (
            //     startHour === 23
            //   ){
            //
            //     if(
            //      startMin === 30
            //      &&
            //      startHour === curHour
            //      &&
            //      startMin === curMin
            //      &&
            //      (sameDayStart || sameDayEnd)
            //    ){
            //      console.log('right here')
            //      toDoStuff.push(
            //        events[item]
            //      )
            //    }
            //     else if(
            //       startMin === 0
            //       &&
            //       startMin === curMin
            //       &&
            //       startHour === curHour
            //       &&
            //       (sameDayStart || sameDayEnd)
            //     ) {
            //
            //       toDoStuff.push(
            //         events[item]
            //       )
            //     }
            //
            //
            //     if (endHour === 0){
            //       if (
            //         startMin === 0
            //         &&
            //         startHour === curHour
            //         &&
            //         (sameDayStart || sameDayEnd)
            //       ){
            //         toDoStuff.push(
            //           events[item]
            //         )
            //       } else if(
            //         startMin === 30
            //         &&
            //         startMin === curMin
            //         &&
            //         startHour === curHour
            //         &&
            //         (sameDayStart || sameDayEnd)
            //       ){
            //         toDoStuff.push(
            //           events[item]
            //         )
            //       }
            //
            //     }
            //
            //
            //   }
            //   else {
            //     if (
            //       startHour === curHour
            //       &&
            //       startMin === curMin
            //       &&
            //       (sameDayStart || sameDayEnd)
            //
            //     ){
            //       console.log('test1')
            //       toDoStuff.push(
            //         events[item]
            //       )
            //     }
            //     if(
            //       endHour === curHour
            //       &&
            //       endMin === 30
            //       &&
            //       endMin-30 === curMin
            //       &&
            //       (sameDayStart || sameDayEnd)
            //     ){
            //       console.log('test1')
            //       toDoStuff.push(
            //         events[item]
            //       )
            //     } else if (
            //       endMin === 0
            //       &&
            //       endHour -1 === curHour
            //       &&
            //       endMin+30 === curMin
            //       &&
            //       (sameDayStart || sameDayEnd)
            //     ){
            //       console.log('test1')
            //       toDoStuff.push(
            //         events[item]
            //       )
            //     }
            //
            //     if(
            //       startMin === 30
            //
            //     ){
            //       if(
            //         startHour < curHour
            //         &&
            //         endHour > curHour
            //         &&
            //         (0 === curMin
            //         ||
            //         30 === curMin)
            //         &&
            //         (sameDayStart || sameDayEnd)
            //       ){
            //         console.log('test1')
            //         toDoStuff.push(
            //           events[item]
            //         )
            //       }
            //
            //     } else if (
            //       startMin === 0
            //
            //     ){
            //       if (
            //         startHour <= curHour
            //         &&
            //         endHour> curHour
            //         &&
            //         (sameDayStart || sameDayEnd)
            //       ){
            //         toDoStuff.push(
            //           events[item]
            //         )
            //       }
            //
            //     }
            //
            //
            //   }
            //
            //
            // }

            // You can always have access to the events, you just got to loop through
            // toDoStruff in the if below if you want to check
            // if (toDoStuff.length > 0){
            //   days.push(
            //     <div
            //       className = {`syncCol disabled ${checkMin === 0 ? "nonhourcellT":"nonhourcellB"} `}
            //     >
            //     </div>
            //   )
            // } else {
              days.push(
                <div
                  style = {{background: this.color(i)}}
                  className = {`syncCol ${checkMin === 0 ? "hourcellT" : "hourcellB"}`}
                  onClick = {(e) => this.onDayHourClick(e, i, cloneDay, cloneHour)}
                >
                <span className = 'number'></span>
                </div>
              )
            // }
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

       return  (
         <div className = 'body'>
           <div className = "eventSyncWeekGrid">
             <div
               className = "weekEvent"
               style = {{
                 display: this.state.tempStart === -1 ? "none":"",
                 gridColumn: this.dayEventIndex(this.state.tempStartDate, this.state.tempEndDate),
                 gridRow: this.hourEventIndex(this.state.tempStart, this.state.tempEnd),
                 backgroundColor: this.state.tempColor,
               }}
               >
               <div>
                 {this.state.tempTitle}
               </div>
               <div>
                 {this.state.tempStart}-{this.state.tempEnd}
               </div>
             </div>

             {this.renderBlockedTimes(events)}
           </div>



           {hours}

         </div>
       )

    }

    onDayHourClick = (e,position, day, hour) => {
      // This function will pretty much grab the day and date of the
      // event that is clicked on


      console.log(position, day, hour)

      // First get the date
      const date = new Date(day)

      const startTime = dateFns.format(hour, "HH:mm")
      const newStartTime = this.timeConvertFunction(startTime)


      // Now do the end time too
      const endTime = dateFns.format(dateFns.addHours(hour,1), "HH:mm")
      const newEndTime = this.timeConvertFunction(endTime)

      // Now you set it as the states so that it can change
      // on the calendar

      console.log(date)
      this.setState({
        tempStart: newStartTime,
        tempEnd: newEndTime,
        tempStartDate: date,
        tempEndDate: date
      })


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
            <span style={{fontSize:'24px'}}>
              {dateFns.format(dateFns.addDays(minDate, i), dayFormat)}
            </span>
          </div>
        )
        cloneMinDate = dateFns.addDays(cloneMinDate, 1)
    }
    return <div className = 'days row'>{days}</div>
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
        person: [this.props.currentUser, this.props.userFriend.username],
        invited: [this.props.userFriend.username],
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
        recipient: this.props.userFriend.username,
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
      authAxios.delete(`${global.API_ENDPOINT}/userprofile/notifications/delete/`+notificationId)
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

  getInitialValue = (tempTitle, tempDate, tempStart, tempEnd, tempColor) => {
    // This will pass an initial value through the Field

    // Pretty much used to update the values in the pickeventsync form

    // For this one you pretty much jsut need the start date, the end date
    // will just follow
    console.log(tempTitle, tempDate, tempStart, tempEnd, tempColor)

    console.log(tempDate)
    const startTime = tempStart
    const endTime = tempEnd
    const title  = tempTitle
    const eventColor = tempColor
    let date = tempDate
    if(date !== null){
      date = moment(tempDate, "YYYY-MM-DD")
    }

    if((startTime === -1 || endTime === -1) && title === "" && date === null ){
      return {
        startTime: "",
        endTime: "",
        title: title,
        eventColor: eventColor,
        startDate: null,

      }
    } else {
      return {
        startTime: startTime,
        endTime: endTime,
        title: title,
        eventColor: eventColor,
        startDate: date
      }
    }


  }


  render() {
    const { Meta } = Card

    console.log(this.state)
    console.log(this.props)

    let tempStart = ""
    let tempEnd = ""
    let tempDate = null
    let tempTitle = ""
    let tempColor = ""

    if(this.state.tempStart){
      tempStart = this.state.tempStart
    }
    if(this.state.tempEnd){
      tempEnd = this.state.tempEnd
    }
    if(this.state.tempTitle){
      tempTitle = this.state.tempTitle
    }
    if(this.state.tempColor){
      tempColor = this.state.tempColor
    }
    if(this.state.tempStartDate){
      tempDate = this.state.tempStartDate
    }


    const {handleSubmit, pristine, invalid, reset, submitting, error } = this.props
    return (

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
      <div className = 'eventSyncCalendarContainer'>
        <div className = 'syncCalendar'>
          <div className = 'syncHeader' style={{marginBottom:'25px'}}>

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
        {/*
        <PickEventSyncForm
        onSubmit = {this.submit}
        initialValues = {this.getInitialValue()}
        active = {this.state.active} />
        */}
        <Row style={{}}>

          <div class="rightEventSyncContainer">
            <div class="rightTopEventSync">
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />

            </div>
            <div class="rightBottomEventSync">
              <PickEventSyncFormWeek
              onSubmit = {this.submit}
              initialValues = {this.getInitialValue(
                tempTitle,
                tempDate,
                tempStart,
                tempEnd,
                tempColor
              )}
              onChange = {this.onFormChange}
              minDate = {this.props.minDate}
              maxDate = {this.props.maxDate}
               />
             </div>

          </div>


        </Row>
      </div>
    </div>
  </Modal>
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
