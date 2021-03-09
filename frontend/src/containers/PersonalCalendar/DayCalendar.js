import React from 'react';
import * as dateFns from 'date-fns';
import axios from 'axios';
import { authAxios } from '../../components/util';
import Liking from '../NewsfeedItems/Liking';
import { Input,
   Drawer,
    message,
    List,
    Avatar,
    Divider,
    Col,
    Row,
    Tag,
    Button,
    Tooltip,
    Progress,
    DatePicker,
    AvatarGroup,
    notification,
    Popover } from 'antd';
import { connect } from 'react-redux';
import * as navActions from '../../store/actions/nav'
import * as calendarEventActions from '../../store/actions/calendarEvent';
import * as calendarActions from '../../store/actions/calendars';
import * as eventSyncActions from '../../store/actions/eventSync';
import EventModal from './AddCalEventForms/EventModal';
import MiniCalendar from './MiniCalendar';
import EventSyncModal from './EventSyncForms/EventSyncModal';
import EditEventPopUp from './EditCalEventForms/EditEventPopUp';
import CalendarViewDropDown from './CalendarViewDropDown';
import './PersonalCalCSS/NewCalendar.css';
import CalendarPopOver from './CalendarPopOver.js';



class DayCalendar extends React.Component{

  constructor(props) {
        super(props)
        this.myRef = React.createRef()
        this.eventRef = React.createRef()
        this.wrapperRef = React.createRef()
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

  state ={
      currentDay: new Date(),
      selectedDate: new Date(),
      events: [],
      activeX: null,
      showAddEventPopover: false,

      // the temp state willb e used to change the position
      // of the selected date
      tempStart: -1,
      tempEnd: -1,
      tempStartDate: -1,
      tempEndDate: -1,
      tempColor: "blue",
      tempTitle: "",
  }

  handleClickOutside(event) {
    console.log(event.target)
    console.log(this.wrapperRef)
    console.log("does this hit")

    // var popoverElement = document.getElementById
      if (this.wrapperRef && this.wrapperRef.current.contains(event.target)) {
        this.setState({
          showAddEventPopover: false,
          tempStart: -1,
          tempEnd: -1,
          tempStartDate: -1,
          tempEndDate: -1,
          tempColor: "blue",
          tempTitle: "",
        })
      }
    }

   setWrapperRef(node) {
     this.wrapperRef = node;
   }

  onDayHourClick = (positionX) => {
    console.log(positionX)
    if(this.state.activeX == positionX){
      this.setState({
        activeX: null,
      })
    } else {
      this.setState({
        activeX: positionX
      })
    }
  }

  color = (positionX) => {
    if(this.state.activeX === positionX){
      return '#91d5ff'
    }
    return '';
  }

  onTempChange = (values) => {
    // This function will be in charge of the on change of the states
    // that will be used to show the tempoaray event
    console.log(this.props.parameter)
    console.log(values)

    // The values that come in you have to check if they fall within the
    // week of the current week. So what you have to do is get teh date
    // from the url and then check it on the start date to see if it fall
    // within if not then you do a push
    const selectedYear = this.props.parameter.year;
    const selectedMonth = this.props.parameter.month;
    const startWeekDay = this.props.parameter.day;

    const curWeek = [selectedYear, selectedMonth, startWeekDay]
    const curStartSelectedDate = dateFns.startOfWeek(new Date(curWeek))

    // now check if the selected date falls wtih the cur week

    if(values.startDate){
      const pickedDate = new Date(values.startDate);

      const startPickedDate = dateFns.startOfWeek(pickedDate)

      if(!dateFns.isSameWeek(curStartSelectedDate, pickedDate)){
        const pickedYear = dateFns.getYear(startPickedDate)
        const pickedMonth= dateFns.getMonth(startPickedDate)+1
        const pickedDay = dateFns.getDate(startPickedDate)


        this.props.history.push('/personalcalendar/w/'+pickedYear+'/'+pickedMonth+'/'+pickedDay)
      }

    }

    console.log(curStartSelectedDate)
    // Now you will get the start of the week


    this.setState({

      tempStart: values.startTime,
      tempEnd: values.endTime,
      tempStartDate: values.startDate,
      tempEndDate: values.endDate,
      tempColor: values.eventColor,
      tempTitle: values.title,
    })



  }

  onClearEditTextInfo = () => {
    // This is used to clear out the events whne you submit
    this.setState({
      showAddEventPopover: false,
      tempStart: -1,
      tempEnd: -1,
      tempStartDate: -1,
      tempEndDate: -1,
      tempColor: "blue",
      tempTitle: "",
    })
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutside);


    const selectedYear = this.props.parameter.year;
    const selectedMonth = this.props.parameter.month;
    const selectedDay = this.props.parameter.day;
    const newDate = [selectedYear, selectedMonth, selectedDay]
    const newsSelectedDate = new Date(newDate)
    this.props.getSelectedDate(newsSelectedDate)

    console.log(newsSelectedDate)
    const startDate = dateFns.format(dateFns.startOfDay(newsSelectedDate), "yyyy-MM-dd HH:mm:ss")
    const endDate = dateFns.format(dateFns.endOfDay(newsSelectedDate), "yyyy-MM-dd HH:mm:ss")
    console.log(startDate, endDate)
    this.props.getEvents(startDate, endDate)
  }

  scrollToEvent = () => {
    if(this.eventEnd){
      this.eventEnd.scrollIntoView({ behavior: "smooth" })
    }
  }

  componentDidUpdate() {
    // this.scrollToBottom();
    this.scrollToEvent()
  }


  componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
  }


  componentWillReceiveProps(newProps){
    if (this.props.currentDate !== newProps.currentDate){
      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      const day = dateFns.getDate(newProps.currentDate)
      this.props.history.push('/personalcalendar/'+year+'/'+(month+1)+'/'+day)

      const startDate = dateFns.format(dateFns.startOfDay(newProps.currentDate), "yyyy-MM-dd HH:mm:ss")
      const endDate = dateFns.format(dateFns.endOfDay(newProps.currentDate), "yyyy-MM-dd HH:mm:ss")
      this.props.getEvents(startDate, endDate)

    }
  }



// render the date on top
  renderHeader(){
    return (
      <div className = 'header'>
        <div className = 'arrowLeft'>
          <div className = "icon" onClick = {this.prevDay}>
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-left"></i>
          </div>
        </div>
        <div className = "midText">
          <span>
            {dateFns.format(this.props.currentDate, 'iiii MMMM dd, yyyy')}
          </span>
        </div>
        <div className = "arrowRight" onClick = {this.nextDay}>
          <div className = "icon">
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-right"></i>
          </div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = 'iiii'
    const dayFormat = 'd'
    const days = []

    let startDate = dateFns.startOfWeek(this.props.currentDate)
    let cloneStartDate = dateFns.startOfWeek(this.props.currentDate)
    for (let i = 0; i<7; i++){
      const cloneCloneStartDate = cloneStartDate

      days.push(
        <div
        className = {`weekcol col-center`}
        key = {i}
        onClick = {() => this.onDateClick(cloneCloneStartDate)}
        >

        </div>
      )
      cloneStartDate = dateFns.addDays(cloneStartDate, 1)
    };

    return (
      <div className = 'dayDays'>
      {days}
      </div>
      )
  }

// render the time on the side
  renderHours() {
    // this format is to render it by hour and am pm
    // the hours will store the divs
    const dateFormat = "h a"
    const hours = []

    // starttime will be the start of the day where the time is 00:00
    // then you will loop loop from 1 am to 11 pm
    let startTime = dateFns.addHours(dateFns.startOfDay(this.props.currentDate),1);
    for(let i = 0; i<23; i++){
      const formattedHour = dateFns.format(startTime, dateFormat)
      hours.push(
        <div className = 'cell' key = {i}>
          <span className = 'number'> {formattedHour}</span>
        </div>
      )
      startTime = dateFns.addHours(startTime, 1)
    }
    // render it our but you have to fix the css
    return <div className = 'sideTime'>{hours}</div>
  }



  renderColor = () => {
    const color = ["green","yellow","red","blue","orange","pink","cyan"]
    const len = color.length
    const randomNum = Math.floor(Math.random()*len)
    const pickcolor = color[randomNum]
    return pickcolor

  }

  onDateClick = (date) => {
    console.log(date)
  }

// render all the hour cell within each day
  renderCells(events) {

    console.log(events)

    let tempTitle = ""
    if(this.state.tempTitle){
      tempTitle = this.state.tempTitle
    }
    const selectedDate = this.props.currentDate
    const startHourDay = dateFns.startOfDay(selectedDate)
    const endHourDay = dateFns.endOfDay(selectedDate)

    // So you have the current day and the selected day
    // The you get the day, and then you get the first hour of that day
     // You will do the same with the endHourDay
     // You will want to loop through all the hours of that day starting with
     // startHourDay and ending with endHourDay
    let border = []
    // The border is to draw the lines for the calendars
    let toDoStuff = []
    const hourFormat = "h a"
    // Since there will only be the hours we wont be need a row list
    let hours = [];
    // Start of the hour and then loop through all the 24 hours
    let hour = startHourDay;
    let formattedHour = "";
    // they are the same time because when you do a new date it goes on the GM time
    const text = "You're host"
    // Hour is in a date format with the day and time and it will go till the
    // Same day(endHourday) but till the last sec of the day
    // Since we are not doing a list of list and there is just days we do not
    // need the while statment, just a list
    for (let hourIndex = 0; hourIndex<48; hourIndex++){
      formattedHour = dateFns.format(hour, hourFormat)

      const cloneHourIndex = hourIndex;
      const cloneHour = hour
      for(let item = 0; item < events.length; item ++){
        // For the if statements and what you put into the calendar depends on
        // if the day is on the day or if the day and time falls between the two days and
        // times
        const startDate = new Date(events[item].start_time)
        const endDate = new Date(events[item].end_time)
        const utcStart = dateFns.addHours(startDate, startDate.getTimezoneOffset()/60)
        const utcEnd = dateFns.addHours(endDate, endDate.getTimezoneOffset()/60)

        if (events[item].repeatCondition === 'weekly'){
          // This will be the day of the week (0-6)
          const startEventDayWeek = dateFns.getDay(startDate)
          const endEventDayWeek = dateFns.getDay(endDate)
          const cloneDayWeek = dateFns.getDay(cloneHour)
          const eventDayHour = dateFns.getHours(startDate)
          const cloneDayHour = dateFns.getHours(cloneHour)
          const eventDayMinute = dateFns.getMinutes(startDate)
          const cloneDayMinute = dateFns.getMinutes(cloneHour)
          console.log('hit here')
          console.log(startEventDayWeek, cloneDayWeek )
          if (
            // startEventDayWeek === cloneDayWeek
            eventDayHour === cloneDayHour
            && eventDayMinute === cloneDayMinute
            && startEventDayWeek <= cloneDayWeek
            && endEventDayWeek >= cloneDayWeek
          ){

            toDoStuff.push(
              events[item]
            )
          }


        } else if (events[item].repeatCondition === 'daily'){
          const eventDayHour = dateFns.getHours(startDate)
          const cloneDayHour = dateFns.getHours(cloneHour)
          const eventDayMinute = dateFns.getMinutes(startDate)
          const cloneDayMinute = dateFns.getMinutes(cloneHour)

          if (
            eventDayHour === cloneDayHour
            && eventDayMinute === cloneDayMinute
          ) {
            toDoStuff.push(
              events[item]
            )
          }
        } else if (events[item].repeatCondition === 'none'){
          if (dateFns.isSameHour(startDate, cloneHour)
              && dateFns.isSameDay(startDate, cloneHour)
              && dateFns.isSameMinute(startDate, cloneHour)
             ){
            toDoStuff.push(
              events[item]
            )
          } if (dateFns.isAfter(cloneHour, startDate)
          && dateFns.isBefore(cloneHour, endDate)
          && dateFns.getHours(startDate) === dateFns.getHours(cloneHour)
          && dateFns.getMinutes(startDate) === dateFns.getMinutes(cloneHour)
        ){
          console.log(cloneHour, endDate)
            toDoStuff.push(
              events[item]
            )
          }
        }

      }

      const cloneToDoStuff = toDoStuff
      console.log(cloneToDoStuff)
      if (cloneToDoStuff.length > 0){
        hours.push(
            toDoStuff.map(item => (

              <CalendarPopOver
                orientation="bottom"
                item={item}
                date={hour}
                dayIndex={0}
                cloneHourIndex={cloneHourIndex}
                cloneDay={startHourDay}
                {...this.props}
              />

            ))
        )}


      {/*
        //used to popover for edit form when youre selecting empty
        // for var dayDay
        const selectedDate=this.props.currentDate
        const weekStart = dateFns.startOfWeek(selectedDate);
        date=weekStart
        dayday=date
        // for var hourHour
        const selectedDate=this.props.currentDate
        const weekStart = dateFns.startOfWeek(selectedDate);
        date=weekStart
        const startHourDay = dateFns.startOfDay(date);
        let hour = startHourDay;
        hourHour = hour

        <Popover trigger="click"  placement="right" onClick = {() =>
        this.addEventClick(dayDay, hourHour)}  content={<div>
          <EditEventPopUp
          isVisible = {this.props.showModal}
          close = {() => this.props.closeModal()}
          dayNum={dateFns.format(cloneDay, 'd')}

          />
          </div>}>


        </Popover>
        */}
      border.push(

            <div
              onClick = {() => this.addEventClick(selectedDate, cloneHour)}
              className = {`backWeekCol ${hourIndex % 2 === 0 ? 'dayCellT' : 'dayCellB' }` }
            >
            { hourIndex === 13 ?

              <div style={{ float:"left", clear: "both" }}
                  ref={(el) => { this.messagesEnd = el; }}>
             </div>

             :

             <div>
             </div>

            }
            </div>

      )
      toDoStuff = []
      hour = dateFns.addMinutes(hour, 30);
    }
    return(
      <div className = 'scrollBody'>
        <div className = 'backDayBody'>
          {border}
        </div>
        <div className = 'dayBody'>

            <Popover
              // placement = 'left'
              visible = {this.state.showAddEventPopover}
              content = {
                <div>
                  <EditEventPopUp
                  onChange = {this.onTempChange}
                  // isVisible = {this.props.showModal}
                  close = {this.onClearEditTextInfo}
                  // dayNum={dateFns.format(selectedDate, 'd')}

                  />
                </div>
              }>

              <div
                // ref={(el) => { this.eventEnd = el; }}

                className = "weekEvent"
                style = {{
                  display: this.state.tempStart === -1 ? "none": "",
                  gridColumn: this.dayEventIndex(this.state.tempStartDate, this.state.tempEndDate),
                  gridRow: this.hourEventIndex(this.state.tempStart, this.state.tempEnd),
                  backgroundColor: this. state.tempColor
                }}
                >
                <span className = "pointerEvent">
                  <div className = "eventPageTitle pointerEvent">
                    {tempTitle.substring(0, 19)}
                  </div>

                  <div className = 'eventTimeInfo pointerEvent'>
                    {this.state.tempStart}
                    -
                    {this.state.tempEnd}
                  </div>
                </span>

              </div>

            </Popover>




          {hours}
        </div>
      </div>
    )
  }


  addEventClick = (day, hour) => {
    console.log(day, hour)
    // So we will be using the edit modal to add a new event in
    // but because it requres certain objects we need to have a
    // dicitonary that holds those specitic attribute so that we can
    //  meet those requirements
    // We only need the start and end time tho so all the other fields can
    // be empty


    this.setState({
      showAddEventPopover: true,
    })

    let endDate = ''
    const specificHour = dateFns.getHours(hour)
    const specificMinute = dateFns.getMinutes(hour)
    const startDate = dateFns.addHours (day, specificHour)
    const newStartDate = dateFns.addMinutes(startDate, specificMinute)
    console.log(dateFns.getHours(newStartDate));
    if (dateFns.getHours(newStartDate) === 23 && dateFns.getMinutes(newStartDate) === 30){
      endDate = dateFns.addMinutes(newStartDate, 30);
    } else {
      endDate = dateFns.addHours(newStartDate, 1);
    }

    const finalStart = dateFns.format(newStartDate, 'yyyy-MM-dd HH:mm:ss')
    const finalEnd = dateFns.format(endDate, 'yyyy-MM-dd HH:mm:ss')
    console.log(specificHour, specificMinute)
    if(specificMinute==0){
      console.log("made it")
      this.setState({
        selectCondition:true,
      });
    }
    console.log(this.state.selectCondition)
    const subInEvent = {
      addEvent: true,
      title: '',
      content: '',
      start_time: finalStart,
      end_time: finalEnd,
      location: '',
      color: '#1890ff',
      calendarId: ''
    }
    console.log(subInEvent)
    this.props.openModal(subInEvent)

  }


  // dayEventIndex = (start_time, end_time, start_index) =>{
  //   // This function is used to get the index for the grid values for each of the events
  //   // you will basically get the differnece between the start and end time and add it to the
  //   // starting index and then you will then add one for any extra 30 mins (there is more math involved
  //   // but that is the gist of it)
  //   console.log(start_time,end_time, start_index)
  //   let bottomIndex = ''
  //   const start = new Date(start_time)
  //   const end = new Date(end_time)
  //   const actualStartIndex = (start_index)+1
  //   const startHour = dateFns.getHours(start)
  //   const endHour = dateFns.getHours(end)
  //   const startMin = dateFns.getMinutes(start)
  //   const endMin = dateFns.getMinutes(end)
  //   // for the numberator of the index you want to go from the starting index
  //   // and then decide if you add 1 or not depending if there is a 30 mins
  //   const topIndex = (actualStartIndex)
  //   // For the denominator you have to start from the starting index and then add
  //   // the number of indexes depending on the hour and then add one if there is a
  //   // 30 min mark
  //
  //   if (startMin === 30 && endMin === 0){
  //     if (endHour === startHour +1){
  //       bottomIndex = topIndex+(Math.abs(endMin-startMin)/30)
  //     }
  //     else {
  //       bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
  //     }
  //   } else {
  //       bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin - startMin)/30)
  //   }
  //
  //   const ratio = topIndex + '/' + bottomIndex
  //   console.log(ratio)
  //   return ratio
  // }

  dayEventIndex = (startDate, endDate) => {

    // Simlar to taht of the dayEventIndex in calednarpoppover but the only input
    // will be that of the startDate
     if(startDate === -1 || endDate === -1){
       return "-1"
     } else {
       console.log(new Date(startDate))
       const curStartDate = new Date(startDate)
       const curEndDate = new Date(endDate)
       const curDayDiff = dateFns.differenceInCalendarDays(curEndDate, curStartDate)
       const startWeek = dateFns.startOfWeek(curStartDate)
       const dayDiff = dateFns.differenceInCalendarDays(curStartDate, startWeek)


       let startIndex = dayDiff+1
       let endIndex = startIndex+curDayDiff+ 1

       console.log(dayDiff)
       console.log(curDayDiff)

       return startIndex+'/'+endIndex

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

      return startIndex+"/"+endIndex


    }


  }


  onHourClick = (hour) =>{
    // console.log(day)
    // console.log(events)
    const finalStart = dateFns.format(hour, 'yyyy-MM-dd HH:mm:ss')
    const endDate = dateFns.addHours(hour, 1)
    const finalEnd = dateFns.format(endDate, 'yyyy-MM-dd HH:mm:ss')
    console.log(finalStart, finalEnd)

    const subInEvent = {
      addEvent: true,
      title: '',
      content: '',
      start_time: finalStart,
      end_time: finalEnd,
      location: '',
      color: '#01D4F4',
      calendarId: ''
    }

    this.props.openModal(subInEvent)


  }

// Use addDays function to change the day
//This will pretty much push all the render cell and stuff on top by 1 day
  nextDay = () => {
    this.props.nextDay()
  }

  prevDay = () => {
    this.props.prevDay()
  }

  onMonthClick = () => {
    const selectYear = dateFns.getYear(this.props.currentDate).toString()
    const selectMonth = (dateFns.getMonth(this. props.currentDate)+1).toString()
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onWeekClick = () => {
    const week = dateFns.startOfWeek(this.props.currentDate)
    const selectYear = dateFns.getYear(week).toString()
    const selectMonth = (dateFns.getMonth(week)+1).toString()
    const selectDay = dateFns.getDate(week).toString()
    console.log(selectYear, selectMonth, selectDay)
    this.props.history.push('/personalcalendar/w/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onClickItem = oneEvent =>{
    this.props.openModal(oneEvent)
  }

  onOpenEvent = () => {
    this.props.openDrawer()
  }

  onYearClick = () => {
    const selectYear = this.props.parameter.year
    this.props.history.push('/personalcalendar/'+selectYear)
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }

  onEventPage = (eventId) => {
    this.props.history.push('/personalcal/event/'+eventId)
  }

  onAddEvent = () => {
    this.props.openDrawer()
  }

  render() {

    console.log(this.props)
    console.log(this.props.currentDate)
    return (
      <div
        ref={this.wrapperRef}

        className = 'calendarContainer'>
        <EventSyncModal
          {...this.props}
          isVisble = {this.props.showEventSyncModal}
          close = {() => this.props.closeEventSyncModal()}
        />

        <div className ='mainCalContainer'>
            <div className = 'weekCalendar'>
              <div className = "topHeaderCal">
                {this.renderHeader()}
                <CalendarViewDropDown
                  calType = "day"
                  curDate = {this.props.currentDate}
                  history = {this.props.history}
                  matchPara = {this.props.parameter} />
              </div>

              {this.renderDays()}
            </div>
          <div className = 'scrollCalContent'>
            <div className = 'weekDayFlex-Container'>
              <div className = 'timecol'>
                {this.renderHours()}
              </div>
              <div className = 'calendar'>
                {this.renderCells(this.props.events)}
                </div>
              </div>
            </div>

            <EventModal visible = {this.props.showDrawer} onClose = {this.props.closeDrawer} {... this.props} />

          </div>


          <div className = 'miniCalContainer'>
            <Button
              type="primary"
              className = 'weekCreateEvent'
              onClick = {this.onAddEvent}>
              Create Event
            </Button>
            <MiniCalendar {...this.props}/>
            <Button
              style={{marginTop:'40px'}}
              type = 'primary'
              className = 'miniEventSyncButton'
              onClick = {this.openEventSyncModal}>
                Event Sync
            </Button>
            {/*
            <div className = 'timeLayerCon'>
              list of people to be added!
            </div>
            */}>
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    showDrawer: state.nav.showPopup,
    showModal: state.calendarEvent.showModal,
    currentDate: state.calendar.date,
    events: state.calendar.events,
    showEventSyncModal: state.eventSync.showEventSyncModal,
    id: state.auth.id


  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextDay: () => dispatch(calendarActions.nextDay()),
    prevDay: () => dispatch(calendarActions.prevDay()),
    getEvents: (startDate, endDate) => dispatch(calendarActions.getUserEvents(startDate, endDate)),
    openEventSyncModal: () => dispatch(eventSyncActions.openEventSyncModal()),
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal())
  }
}

export default connect(mapStateToProps,mapDispatchToProps) (DayCalendar);
