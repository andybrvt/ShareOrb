import React from 'react';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import '../PersonalCalCSS/EventSync.css';
import {  Modal, DatePicker, TimePicker, Button, Input, Select, Avatar, Radio, Card, Row, Col, notification } from 'antd';
import PickEventSyncForm from './PickEventSyncForm';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../../notificationWebsocket';
import { Field, reduxForm, reset, formValueSelector, SubmissionError } from 'redux-form';
import * as eventSyncActions from '../../../store/actions/eventSync';
import * as notificationsActions from '../../../store/actions/notifications';
import { authAxios } from '../../../components/util';
import PickEventSyncUserProfileCard from './PickEventSyncUserProfileCard.js'
import moment from 'moment';



class PickEventSyncDay extends React.Component{
  state = {
    active: null,
    selectedDate: null,
    tempStart: -1,
    tempEnd: -1,
    tempDate: null,
    tempColor: "#1890FF",
    tempTitle: ""
  }

  renderTempEvent = (startIndex, endIndex) =>{
    // This function will return the row index for the grid

    console.log(startIndex, endIndex)
    return startIndex +"/"+endIndex

  }

  onClose = () =>{
    this.setState({
      selectedDate: null,
      tempStart: -1,
      tempEnd: -1,
      tempDate: null,
      tempColor: "#1890FF",
      tempTitle: ""
    })
    this.props.close()
  }

  // onClearTempEvent = () => {
  //
  //   this.setState({
  //     tempStart: -1,
  //     tempEnd: -1,
  //     selectedDate: null
  //   })
  // }

  onFormChange = (value) => {
    // This function will be in charge of tracking the changes of the form
    // for posting on the event sync
    console.log(value)

    if(value.startTime
      && value.endTime
      && (value.title || value.title === "")
      && value.eventColor){
      if(value.startTime === "" || value.endTime === ""){
        this.setState({
          tempStart: -1,
          tempEnd: -1,
          tempTitle: value.title,
          tempColor: value.eventColor
        })
      } else {
        console.log(value.title)
        this.setState({
          tempStart: value.startTime,
          tempEnd: value.endTime,
          tempTitle: value.title,
          tempColor: value.eventColor
        })
      }
    }


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




      renderDays() {
        // This is just to render out the days in the date range
        const dateFormat = 'iii'
        const dayFormat = 'd'
        const days = []
        const monthFormat = 'MMMM'
        const yearFormat='yyyy'
        let minDate = dateFns.addDays(new Date(this.props.minDate),1)
        let maxDate = dateFns.addDays(new Date(this.props.maxDate),1)
        var eventSyncWeekText="'s calendar"
        const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))
        let cloneMaxDate = this.props.maxDate

        // This is only for one day but the css and everything is already set up
        for(let i = 0; i<difference; i++){
            const cloneCloneMaxDate = cloneMaxDate
            days.push(
              <div
              className = 'syncCol col-center '
              key = {i}
              style={{fontSize:'20px'}}
              >
                {dateFns.format(dateFns.addDays(minDate, i), dateFormat)}
                ,&nbsp;
                {dateFns.format(new Date(cloneMaxDate) , monthFormat)}
                &nbsp;
                {dateFns.format(dateFns.addDays(minDate, i), dayFormat)}
                <span style={{marginLeft:'100px'}}>{this.props.userFriend.first_name}{eventSyncWeekText}</span>
              </div>
            )
            cloneMaxDate = dateFns.addDays(cloneCloneMaxDate, 1)
        }
        return <div className = 'days row'>{days}</div>
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

      renderWeekCell(events){
        console.log(events)
        // Render the week cell, so what you want to do is pick the first to be the minDate and
        // the last day will be the maxDate
        // You will loop through each hour of each day and then redner through each day of the week

        // Probally have to fix this later when we readjust the timezone issue.
        const minDate = dateFns.addHours(new Date(this.props.minDate),7);
        const maxDate = dateFns.addHours(new Date(this.props.maxDate),7);
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

         console.log(startHourDay)

         let formattedDay = '';

         let hour = startHourDay;
         let formattedHour = '';

         // The counter is to give each box a seperate id so that it will highlight when you click on it
         let counter = 0

         const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))

         console.log(difference)
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
              for (let item = 0; item<events.length; item++){
                const startHour = dateFns.getHours(new Date(events[item].start_time))
                const startMin = dateFns.getMinutes(new Date(events[item].start_time))
                const endHour = dateFns.getHours(new Date(events[item].end_time))
                const endMin = dateFns.getMinutes(new Date(events[item].end_time))
                const curHour = dateFns.getHours(new Date(hour))
                const curMin = dateFns.getMinutes(new Date(hour))


                const sameDayStart = dateFns.isSameDay(new Date(events[item].start_time), cloneDay)
                const sameDayEnd = dateFns.isSameDay(new Date(events[item].end_time), cloneDay)


                if (
                  startHour === 23
                ){
                //Conditional to show the event if the event
                // start at 11:30pm and it will match
                // the startdate and end date but will not
                // cover in the middle
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
                    // If the event starts at 11;00 and you need to make a conditional
                    // for it
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
                    // this is if the end event is
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


              }

              // You can always have access to the events, you just got to loop through
              // toDoStruff in the if below if you want to check
              if (toDoStuff.length > 0){
                days.push(
                  <div
                    className = {`syncCol ${checkMin === 0 ? "nonhourcellT":"nonhourcellB"} `}
                  >
                  </div>
                )
              } else {
                days.push(
                  <div
                    style = {{background: this.color(i)}}
                    className = {`syncCol ${checkMin === 0 ? "hourcellT" : "hourcellB"}`}
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
           counter = counter + 1
           days = []
           date = minDate
           hour = dateFns.addMinutes(hour, 30)
         }

         return(
           <div className = 'body'>

             <div className = "eventSyncDayGrid">

               <div
                 // onClick = {() => this.onClearTempEvent() }
                 className = "weekEvent"
                 style = {{
                   display: this.state.tempStart === -1 ? "none":"",
                   gridColumn: "0/1",
                   gridRow: this.hourEventIndex(this.state.tempStart, this.state.tempEnd) ,
                   backgroundColor: this.state.tempColor
                 }}
                 >
                <div>
                  {this.state.tempTitle}
                </div>
                <div>
                  {this.state.tempStart}-{this.state.tempEnd}
                </div>


               </div>

             </div>

             {hours}

           </div>
         )
      }




      onDayHourClick = (e,position, day, hour) => {
        // For this function, you will use to set up the temp start and temp
        // end time so that you can move around the temp event

        // You might also want to set up the day too that the event is selected
        // on
        console.log( position, day, hour)

        const startTime = dateFns.format(hour, "HH:mm")
        const newStartTime = this.timeConvertFunction(startTime)

        // DO A CONDITIONAL HERE WHERE IF THERE IS A BLOCKED OUT EVENT, YOU
        // ONLY DO 30 MINS
        const endTime = dateFns.format(dateFns.addHours(hour, 1), "HH:mm")
        const newEndTime = this.timeConvertFunction(endTime)

        const date = day

        // Now that you have all the values you can now pass the values
        // into the state so that the temp event can change

        this.setState({
          tempStart: newStartTime,
          tempEnd: newEndTime,
          tempDate: date
        })
        // if (this.state.tempStart === position){
        //   this.setState({
        //     tempStart: -1,
        //     tempEnd: -1,
        //     selectedDate: null
        //   })
        // } else {
        //   this.setState({
        //     tempStart: position+1,
        //     tempEnd: position+3,
        //     selectedDate: finalSelectedDate
        //   })
        // }
      }

      addEventClick = () => {
        // This function will be in charge of passing in the right data



      }

    color = (position) => {
      // Just the color of the selected time on the pick event sync calendar
      if (this.state.active === position-1){
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
      // if (this.state.selectedDate === null){
      //   throw new SubmissionError({
      //     _error: '*Please pick a date'
      //   })
      // } else {
        const notificationId = this.props.notificationId

        // sicne we are not doing the selected time thing any more we will
        // take the selected date which is jsut the current date and then
        // add in the times that were choose but you first gotta convert it
        // to 24 hour time

        // Since this is just for one day you can just pick
        // the date directly from the minDate
        const dateStart = new Date(this.props.minDate)
        const dateEnd = new Date(this.props.minDate)
        // adjusted will be for the the time zone change
        const adjustedStart = dateFns.addHours(dateStart, dateStart.getTimezoneOffset()/60)
        const adjustedEnd = dateFns.addHours(dateEnd, dateEnd.getTimezoneOffset()/60)


        const convertStartTime = this.timeConvert(value.startTime)
        const convertEndTime = this.timeConvert(value.endTime)

        let startDateTime = dateFns.addHours(adjustedStart, convertStartTime.firstHour )
        startDateTime = dateFns.addMinutes(startDateTime, convertStartTime.firstMin)

        let endDateTime = dateFns.addHours(adjustedEnd, convertEndTime.firstHour)
        endDateTime = dateFns.addMinutes(endDateTime, convertEndTime.firstMin)


        console.log(startDateTime)
        console.log(endDateTime)
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
          eventColor: value.eventColor,
          startDate: startDateTime,
          endDate: endDateTime,
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
      // }
      this.setState({
        selectedDate: null,
        tempStart: -1,
        tempEnd: -1,
        tempDate: null,
        tempColor: "#1890FF",
        tempTitle: ""
      })
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

    getInitialValue = (tempTitle, tempStart, tempEnd, tempColor) => {

      // This function will get the initial value for the pickeventsync
      // values


      // since it is just the title and the times you  just need the
      // tiem frame, at this point it is tempStart and tempEnd
      // And then when you submit it will just be the tempStart and end
      // and since this is the day view the date is already there. This will
      // also mean that I might need to put a conditional for the
      // pick event sync form

      const startTime = tempStart
      const endTime = tempEnd

      console.log(startTime, endTime)
      const title = tempTitle
      console.log(tempTitle)

      const eventColor = tempColor

      if((startTime === -1 || endTime === -1) && title === "" ){
        return {
          startTime: "",
          endTime: "",
          title: title,
          eventColor: eventColor
        }
      } else {
        return {
          startTime: startTime,
          endTime: endTime,
          title: title,
          eventColor: eventColor
        }
      }


      // // This will pass an initial value through the Field
      //
      // // There is an issue with the utc_start and utc_end and start_time and end time
      // const date_start = new Date(this.state.selectedDate)
      // const utc_start = dateFns.addHours(date_start, date_start.getTimezoneOffset()/60)
      // const date_end = new Date(this.state.end_date)
      // const utc_end = dateFns.addHours(date_end, date_end.getTimezoneOffset()/60)
      // // const start_time = dateFns.getHours(date_start)
      // // const end_time = dateFns.getMinutes(date_start)
      //
      // // console.log(start_time)
      // return{
      //   // start_time: dateFns.format(new Date(this.props.start_time), 'yyyy-MM-dd HH:mm a'),
      //   // end_time: dateFns.format(new Date(this.props.end_time), 'yyyy-MM-dd HH:mm a'),
      //   // dateRange: [dateFns.format(date_start, 'yyyy-MM-dd'), dateFns.format(date_end, 'yyyy-MM-dd')],
      //   dateRange: [moment(this.props.start_date, 'YYYY-MM-DD'), moment(this.props.end_date, 'YYYY-MM-DD')],
      //   startDate: moment(this.props.start_date, 'YYYY-MM-DD'),
      //   endDate: moment(this.props.end_date, 'YYYY-MM-DD'),
      //   location: this.props.location,
      //   eventColor: this.props.eventColor,
      //   repeatCondition: 'none',
      //   friends: [],
      //   eventColor:'#91d5ff',
      //   startTime:"12:00 AM",
      //   endTime:"01:00 AM",
      //   whichDay:3,
      // }
    }



    render() {
      console.log(this.state)
      console.log(this.props)

      let tempStart = ""
      let tempEnd = ''
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

      console.log(tempStart)

      return (

        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          // visible = {true}
          onCancel = {this.onClose}
          width = {1100}
          centered
          bodyStyle={{height:'575px', top:'100px'}}>
          <div class="parentEventSyncContainer">

        <div className = 'eventSyncCalendarContainer'>
          <div className = 'syncCalendar'>
            <div className = 'syncHeader'>
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

          <Row style={{}}>

            <div class="rightEventSyncContainer">
              <div class="rightTopEventSync">

                <div>
                  <Avatar
                    size={60}
                    src={`${global.API_ENDPOINT}`+this.props.userFriend.profile_picture} />
                </div>
                <div style={{marginTop:'25px'}}>
                  <i class="fas fa-user" style={{fontSize:'15px', color:'#8c8c8c', marginRight:'10px'}}></i>

                  {this.props.userFriend.first_name+" "+this.props.userFriend.last_name}
                </div>



                <div style={{marginTop:'10px'}}>

                  <i class="fas fa-clock" style={{fontSize:'15px', color:'#8c8c8c', marginRight:'10px'}}></i>
                  60 Minutes

                </div>

                <div style={{marginTop:'10px'}}>

                  <i class="fas fa-map-marker-alt" style={{fontSize:'15px', color:'#8c8c8c', marginRight:'10px'}}></i>
                  Tucson, Arizona

                </div>

              </div>
              <div>
                <div style={{fontSize:'15px', color:'#8c8c8c', marginRight:'10px'}}>
                  *Pick a time either by clicking on the cells or the dropdown*
                </div>
              </div>
              <div class="rightBottomEventSync">
                <PickEventSyncForm
                onSubmit = {this.submit}
                initialValues = {this.getInitialValue(tempTitle, tempStart, tempEnd, tempColor)}
                active = {this.state.active}
                onChange = {this.onFormChange}
                // startTime = {tempStart}
                // endTime = {this.state.tempEnd}
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
    id: state.auth.id,
    userFriend: state.eventSync.userFriend,
    notificationId: state.eventSync.notificationId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePickEventSyncModal: () => dispatch(eventSyncActions.closePickEventSyncModal()),
    deleteNotification: notificationId => dispatch(notificationsActions.deleteNotification(notificationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PickEventSyncDay);
