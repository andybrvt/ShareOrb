import React from 'react';
import * as dateFns from 'date-fns';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { Button, Tooltip, List, message, Avatar } from 'antd';
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




class DayCalendar extends React.Component{
  state ={
      currentDay: new Date(),
      selectedDate: new Date(),
      events: [],
      activeX: null,
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

  componentDidMount(){
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    const selectedDay = this.props.match.params.day;
    const newDate = [selectedYear, selectedMonth, selectedDay]
    const newsSelectedDate = new Date(newDate)
    this.props.getSelectedDate(newsSelectedDate)
    this.props.getEvents()
  }


  componentWillReceiveProps(newProps){
    if (this.props.currentDate !== newProps.currentDate){
      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      const day = dateFns.getDate(newProps.currentDate)
      this.props.history.push('/personalcalendar/'+year+'/'+(month+1)+'/'+day)
    }
  }



// render the date on top
  renderHeader(){
    const dateFormat = 'iiii MMMM dd, yyyy'

    return (
      <div className = {`dayHeader row flex-middle
        ${dateFns.isSameDay(this.props.currentDate, new Date()) ? 'cellBorderHeader' : ''}
        `}>
        <div className = 'col col-start'>
          <div className = "icon" onClick = {this.prevDay}>
          <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = "col col-center">
          <span>
            {dateFns.format(this.props.currentDate, dateFormat)}
          </span>
        </div>
        <div className = "col col-end" onClick = {this.nextDay}>
          <div className = "icon">
          <i className = 'arrow arrow-right'></i>
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
      <div className = 'dayDays row'>
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
    return <div className = 'body'>{hours}</div>
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
    const currentDay = this.state.currentDay
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

    // Hour is in a date format with the day and time and it will go till the
    // Same day(endHourday) but till the last sec of the day
    // Since we are not doing a list of list and there is just days we do not
    // need the while statment, just a list
    for (let i = 0; i<48; i++){
      formattedHour = dateFns.format(hour, hourFormat)
      for(let item = 0; item < events.length; item ++){
        // For the if statements and what you put into the calendar depends on
        // if the day is on the day or if the day and time falls between the two days and
        // times
        const startDate = new Date(events[item].start_time)
        const endDate = new Date(events[item].end_time)
        const cloneHour = hour
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

      const cloneHour = hour
      const cloneToDoStuff = toDoStuff
      if (toDoStuff.length > 0){
        hours.push(
            toDoStuff.map(item => (
              item.accepted.includes(this.props.id) ?
              <div className = "eventsDay"
              style = {{
                gridRow: this.dayEventIndex(item.start_time, item.end_time, i),
                backgroundColor: item.color
              }}
              onClick = {() => this.onClickItem(item)}>
              <span > {dateFns.format(new Date(item.start_time),'hh:mm a')} - {dateFns.format(new Date(item.end_time),'hh:mm a')}</span>
              <span className = ' ' > {item.content} </span>
              </div>

              :

              <div className = "eventsDayAccept"
              style = {{
                gridRow: this.dayEventIndex(item.start_time, item.end_time, i),
                backgroundColor: "#E8E8E8"
              }}
              onClick = {() => this.onClickItem(item)}>
              <span > {dateFns.format(new Date(item.start_time),'hh:mm a')} - {dateFns.format(new Date(item.end_time),'hh:mm a')}</span>
              <span className = ' ' > {item.content} </span>
              </div>


            ))
        )}
      const hourIndex = i;
      border.push(
        <div
        style = {{background: this.color(hourIndex)}}
        onClick = {(e)=> this.onDayHourClick(hourIndex)}
        className = {`${i%2 === 0 ? 'dayCellT' : 'dayCellB'}`}
        // onClick = {() => this.onHourClick(cloneHour)}
        >
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
      {hours}
      </div>
      </div>
    )
  }

  dayEventIndex = (start_time, end_time, start_index) =>{
    // This function is used to get the index for the grid values for each of the events
    // you will basically get the differnece between the start and end time and add it to the
    // starting index and then you will then add one for any extra 30 mins (there is more math involved
    // but that is the gist of it)
    console.log(start_time, end_time, start_index)
    let bottomIndex = ''
    const start = new Date(start_time)
    const end = new Date(end_time)
    const actualStartIndex = (start_index)+1
    const startHour = dateFns.getHours(start)
    const endHour = dateFns.getHours(end)
    const startMin = dateFns.getMinutes(start)
    const endMin = dateFns.getMinutes(end)
    // for the numberator of the index you want to go from the starting index
    // and then decide if you add 1 or not depending if there is a 30 mins
    const topIndex = (actualStartIndex)
    // For the denominator you have to start from the starting index and then add
    // the number of indexes depending on the hour and then add one if there is a
    // 30 min mark

    if (startMin === 30 && endMin === 0){
      if (endHour === startHour +1){
        bottomIndex = topIndex+(Math.abs(endMin-startMin)/30)
      }
      else {
        bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
      }
    } else {
        bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin - startMin)/30)
    }

    const ratio = topIndex + '/' + bottomIndex
    return ratio
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
    const selectMonth = (dateFns.getMonth(this.props.currentDate)+1).toString()
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onWeekClick = () => {
    const week = dateFns.startOfWeek(this.props.currentDate)
    const selectYear = dateFns.getYear(week).toString()
    const selectMonth = (dateFns.getMonth(week)+1).toString()
    const selectDay = dateFns.getDate(week).toString()
    this.props.history.push('/personalcalendar/w/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onClickItem = oneEvent =>{
    this.props.openModal(oneEvent)
  }

  onOpenEvent = () => {
    this.props.openDrawer()
  }

  onYearClick = () => {
    const selectYear = this.props.match.params.year
    this.props.history.push('/personalcalendar/'+selectYear)
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }

  render() {
    console.log(this.props)
    return (
      <div className = 'calendarContainer'>
        <EventSyncModal
          {...this.props}
          isVisble = {this.props.showEventSyncModal}
          close = {() => this.props.closeEventSyncModal()}
        />

        <div className ='mainCalContainer'>

          <div className = "weekCalendar">
          <EventModal visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
          {this.renderHeader()}
          {this.renderDays()}
          </div>
          <div className = 'testBox'>
          <div className = 'dayFlex-Container'>
            <div className = 'timecol'>
              {this.renderHours()}
            </div>
            <div className = 'calendar'>

              {this.renderCells(this.props.events)}
              </div>
            </div>
            <EditEventPopUp
            isVisible = {this.props.showModal}
            close = {() => this.props.closeModal()}
            />
          </div>
          </div>


          <div className = 'miniCalContainer'>
          <Button
           // type="primary"
           className = 'addEventButton'
           onClick = {this.onOpenEvent} >
            Add Event
          </Button>
            <MiniCalendar {...this.props}/>
            <Button
             type = 'primary'
             className = 'miniEventSyncButton'
            onClick = {this.openEventSyncModal}>
              Event Sync
            </Button>
            <div className = 'timeLayerCon'>
            <Button
            type="primary"
            // shape="round"
            className = 'yearButton'
            onClick = {this.onYearClick}>
            Year
            </Button>
            <Button
            type="primary"
            // shape="round"
            className = 'monthButton'
            onClick = {this.onMonthClick}>
            Month
            </Button>
            <Button
            type="primary"
            // shape="round"
            className = 'weekButton'
            onClick = {this.onWeekClick}>
            Week
            </Button>
            <CalendarViewDropDown
            calType = "day"
            history = {this.props.history}
            match = {this.props.match}
            curDate = {this.props.currentDate}
            />
            </div>
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
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    openEventSyncModal: () => dispatch(eventSyncActions.openEventSyncModal()),
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal())
  }
}

export default connect(mapStateToProps,mapDispatchToProps) (DayCalendar);
