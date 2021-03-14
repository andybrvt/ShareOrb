import React from 'react';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import '../PersonalCalCSS/EventSync.css';
import { DatePicker, TimePicker, Button, Input, Select, Avatar, Radio, Card, Row, Col, notification } from 'antd';
import PickEventSyncForm from './PickEventSyncForm';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../../notificationWebsocket';
import { Field, reduxForm, reset, formValueSelector, SubmissionError } from 'redux-form';
import * as eventSyncActions from '../../../store/actions/eventSync';
import * as notificationsActions from '../../../store/actions/notifications';
import { authAxios } from '../../../components/util';
import PickEventSyncUserProfileCard from './PickEventSyncUserProfileCard.js'
import moment from 'moment';


const { Option } = Select;

const { TextArea } = Input
const required = value => value ? undefined : '*Required'
const renderField = (field) => {
return (
    <Input
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>
  )
}

const renderLocationField = (field) => {
  console.log(field.meta)
  return (
    <span>
    <Input style={{width:'50%',fontSize:'14px'}}
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    className = 'box'/>

    </span>
  )
}

const renderStartDateSelect = (field) => {
  // This const will render the start time of the event
  // So before you choose any value you want to have the field
  // input as a value in your select... because the input value will be the value
  // that will be return to the field when you input a value
  // Bascially everything goes through the value first, and what ever is here inspect
  // is just for show


  console.log(field)
  return (
    <Select
      // {...field.input}
      style = {{width: '115px', marginRight:'15px'}}
      onChange = {field.input.onChange}
      value = {field.input.value}
      className = 'timebox'>

    {field.children}
    </Select>
  )
}


const renderStartTime = () => {
    const timeFormat = "hh:mm a"
    const time = []
    let start = dateFns.startOfDay(new Date())
    let startHour = dateFns.getHours(new Date())
    let startMins = dateFns.getMinutes(new Date())
    for (let i = 0; i< 48; i++){
      const cloneTime = startHour + ':' + startMins
      time.push(
        <Option
        key = {dateFns.format(start, timeFormat)}
        value= {dateFns.format(start, timeFormat)} >
        {dateFns.format(start, timeFormat)}
        </Option>
      )
      start = dateFns.addMinutes(start, 30)
    }
    console.log(time)
    return time
  }

const afterSubmit = (result, dispatch) =>
  dispatch(reset('event sync add event'))

const renderStartDate = (field) => {
  console.log(field)
  return (
    <DatePicker
    onChange = {field.input.onChange}
    value = {field.input.value}
    style = {{width: '110px', marginRight:'15px'}}
    suffixIcon={<div></div>}
    allowClear = {false}
     />
  )
}

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

      renderEndTimeSelect = () => {
      console.log(this.props.startTime)

      if (this.props.startTime !== undefined ){
        // So basically the way I am making this will be the same way I made the
        // date pick in the addeventform. But instead of using state, we will use
        // redux state
        const baseTime = renderStartTime()
        let endTime = []

        let setHour = ''
        let setMin = ''
        // You will be using setHour and setMin in order to compare to the
        // times in the baseTime so you will know which time to put inin the endTime

        // In order to compare, you have to convert all the tiems into the 1-24 hour time
        if (this.props.startTime.includes("PM")){
          setHour = parseInt(this.props.startTime.substring(0,2))
          setMin = parseInt(this.props.startTime.substring(3,5))
          if (setHour !== 12 ){
            setHour = setHour + 12
          }} else if (this.props.startTime.includes("AM")){
            setHour = parseInt(this.props.startTime.substring(0,2))
            setMin = parseInt(this.props.startTime.substring(3,5))
            if (setHour === 12){
              setHour = 0
            }
          }

          // Now we will run through the basetimes and then convert them to
          // the 1-24 hour format the from there compare what needs date is put into the
          // end date and what date does not get put in there
        for( let i = 0; i< baseTime.length; i++){
         if(baseTime[i].key.includes('PM')){
           let hour = parseInt(baseTime[i].key.substring(0,2))
           if (hour !== 12){
             hour = hour+12
           }
           const min = baseTime[i].key.substring(3,5)
           if (setHour < hour){
             endTime.push(
              <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
            )} else if (setHour === hour){
              if(setMin < min){
                endTime.push(
                  <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
                )
              }
            }
         } else if (baseTime[i].key.includes("AM")) {
           let hour = parseInt(baseTime[i].key.substring(0,2))
           if (hour === 12){
             hour = 0
           }
           const min = baseTime[i].key.substring(3,5)
           if( setHour < hour ) {
             endTime.push(
               <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
            )} else if (setHour === hour){
              if (setMin < min){
                endTime.push(
                  <Option key = {baseTime[i].key}>{baseTime[i].key}</Option>
                )
              }
            }
          }
        }
        return (endTime)
      }
    }



    onStartDateChange = (event, value) => {
      const { change } = this.props

      // So this is where the end Date will be changed if the startDate or endDate
      // seems to be ahead of the endDate
      console.log(value)
      if (dateFns.isAfter(new Date(value),new Date(this.props.endDate))){
        change('endDate', value)
      }
    }



    handleStartTimeChange = (event, value) => {
      const { change } = this.props
      // So this handleStartTimechange pretty much is used to automatically
      // change the values of the endTime, the only difference between this
      // and that of the ReactAddEventForm is that we dont need to change the
      // startTime value just the endTime value will be affected


      console.log(value)
      change('startTime', value)

      // Like every other time related events we have to converted all
      let startHour = parseInt(value.substring(0,2))
      let startMin = parseInt(value.substring(3,5))
      let ampm = value.substring(5,8)
      let endHour = parseInt(this.props.endTime.substring(0,2))
      let endMin = parseInt(this.props.endTime.substring(3,5))
      let endTime = ''

      console.log(startHour)



      // These if statement is used to change the startTime values to the 1-24 hour format
      if(value.includes('PM')){
        if(startHour !== 12 ){
          startHour = startHour + 12
        }
      } else if (value.includes('AM')){
        if(startHour === 12){
          startHour = 0
        }
      }

      // These if statements here is to change the end time values from 1-2 to
      // 1-24 for the end time
      if (this.props.endTime.includes('PM')){
        if (endHour !==  12){
          endHour = endHour + 12
        }
      } else if (this.props.endTime.includes('AM')){
        if(endHour === 12){
          endHour = 0
        }
      }

      // Now this is where the comparison of the times comes in an all the senarios
      // For this one,for times that the start hour is smaller than that of the
      // end time you don't need to change the value because due to the redux from
      // the value of the start time will chagne it self
      if(startHour === endHour ){
        if (startMin > endMin){
          endMin = "00"
          endHour = startHour + 1
          console.log(startHour)
          console.log(endHour)
          if (startHour === 11 && ampm === 'AM'){
            endTime = '12:'+endMin + ' PM'
          } else if (startHour === 23 && ampm === " PM"){
            endTime = '12:'+endMin + ' AM'
          } else {
            if (endHour < 10){
              endHour = '0'+endHour
            } else {
               if(ampm === ' AM'){
                 endHour = endHour
               } else if (ampm === ' PM'){
                 endHour = endHour-12
                 if (endHour < 10){
                   endHour = '0'+endHour
                 }
               }
             }
             endTime = endHour + ':'+endMin+ampm

          }


          change('endTime', endTime )
        } else if (startMin === endMin ){
          // This is the case where the times are identical to each other
          // REMEMBER THAT ENDHOUR AND STARTHOUR ARE USING THE 1-24 TIME
          console.log(startHour, endHour)
          if (startHour === 0 && ampm === ' AM' && startMin === 0){
            endTime = '12:30 AM'
          } else if (startHour === 12 && ampm === ' PM' && startMin === 0){
            endTime = '12:30 PM'
          } else {
            if (startMin === 30){
              endMin = '00'
              if (startHour === 12){
                endHour = '01'
                endTime = endHour + ':'+endMin+' PM'
              } else if (startHour === 11 && ampm === ' AM'){
                  endTime =   '12:' + endMin + ' PM'
                } else if ((startHour-12) === 11 && ampm === ' PM'){
                  endTime =  '12:' + endMin + ' AM'
                }
              else {
                console.log(endHour)
                endHour = startHour +1
                  if (endHour<10){
                      endHour = '0'+endHour
                  } else {
                    if(ampm === ' AM'){
                      endHour = endHour
                    } else if (ampm === ' PM'){
                      endHour = endHour-12
                      if (endHour < 10){
                        endHour = '0'+endHour
                      }
                    }
                  }
                endTime = endHour + ':' +endMin+ampm
              }
            } else if (startMin === 0){
              endMin = '30'
              console.log(ampm)
              if (endHour<10){
                  endHour = '0'+endHour
              } else {
                if(ampm === ' AM'){
                  console.log('am')
                  endHour = endHour
                } else if (ampm === ' PM'){
                  console.log('pm')
                  if (endHour === 12){
                    endHour = 12
                  }else {
                    endHour = endHour-12
                    if (endHour < 10){
                      endHour = '0'+endHour
                    }
                  }
                }
              }
              endTime = endHour + ':'+endMin +ampm
            }
          }

          change('endTime', endTime)
        }
      } else if (startHour > endHour) {
        // let startHour = parseInt(time.substring(0,2))
        // let startMin = parseInt(time.substring(3,5))
        if (startHour === 11 && ampm === ' AM' && startMin === 30){
          endTime = '12:00 PM'
        } else if (startHour === 23 && ampm === ' PM' && startMin === 30){
          endTime = '12:00 AM'
        } else {
          if (startMin === 30){
            startMin = "00"
            startHour = startHour + 1
          } else if (startMin !== 30){
            startMin = '30'
          }
          if (startHour < 10){
            startHour = '0'+startHour
          } else{
            if(ampm === ' AM'){
              startHour = startHour
            } else if (ampm === ' PM'){
              startHour = startHour-12
              if (startHour < 10){
                if (startHour === 0){
                  startHour = '12'
                } else {
                  startHour = '0'+startHour
                }
              }
            }
          }


            endTime = startHour + ':'+startMin+ampm
        }



        change('endTime', endTime)
      }

    }

    handleEndTimeChange = (event) => {
      console.log(event)

      const {change} = this.props
      return (
        console.log('endTime')
        // change('endTime', event)
      )
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
                <div>
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
