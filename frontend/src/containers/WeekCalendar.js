import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';
import { authAxios } from '../components/util';
import axios from 'axios';
import { Button, Tooltip } from 'antd';
import { connect } from 'react-redux';
import EditEventPopUp from '../components/EditEventPopUp';
import * as navActions from '../store/actions/nav'
import * as calendarEventActions from '../store/actions/calendarEvent'
import * as calendarActions from '../store/actions/calendars'
import EventDrawer from '../containers/EventDrawer.js';
import MiniCalendar from '../components/MiniCalendar';



class WeekCalendar extends React.Component{
  // So when ever you do calendars, for states  you always want
  // to set the currentWeek as the current day because, you can use
  // get current week to get the firstday
  state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    events: []
  }

  componentDidMount(){
    //I will be pulling the first day of the week to set the week
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    // This will pretty much be the first day of the week
    const startWeekDay = this.props.match.params.day;
    // this is just to put things in a format so we can get the date working
    const newWeek = [selectedYear, selectedMonth, startWeekDay]
    const newSelectedDate = new Date(newWeek)
    this.props.getSelectedDate(newSelectedDate)
    // you want to call the events from the redux instead of the states
    this.props.getEvents()

  }

  componentWillReceiveProps(newProps){
    console.log(this.props.currentDate, newProps.currentDate)
    // you bascially want to check if the date in props and the date in
    // the url is the safe, if they are not --> you gotta change it
    // We would use new props here is because when you go to the nextWeek
    // or previous week the props changes
    if (this.props.currentDate !== newProps.currentDate) {
      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      const day = dateFns.getDate(newProps.currentDate)
      this.props.history.push('/personalcalendar/w/'+year+'/'+(month+1)+'/'+day)
    }
  }

  // This will be rending the header of the view, for weekly view, it will be
  // the start week to the end of the start week and start of the week
  renderHeader() {
    const dateFormat = 'MMMM yyyy'
    const startWeek = dateFns.startOfWeek(this.props.currentDate)
    const endWeek = dateFns.endOfWeek(this.props.currentDate)
    return(
      <div className = 'header row flex-middle'>
        <div className = 'col col-start'>
          <div className = 'icon' onClick = {this.prevWeek}>
            chevron_left
          </div>
        </div>
        <div className = 'col col-center'>
          <span>
            {dateFns.format(startWeek, dateFormat)}
          </span>
        </div>
        <div className = 'col col-end' onClick = {this.nextWeek}>
          <div className = 'icon'>
            chevron_right
          </div>
        </div>
      </div>
    )
  }



  // This is to render the days on top (like Mon, tuesday etc)
  renderDays(){
    // so iiii format actually renders the name of the day
    const dateFormat = 'iiii'
    const dayFormat = 'd'
    const days = []

    let startDate = dateFns.startOfWeek(this.props.currentDate)
    let cloneStartDate = dateFns.startOfWeek(this.props.currentDate)
    for (let i = 0; i<7; i++){
      const cloneCloneStartDate = cloneStartDate
      days.push(
        <div
        className = 'col col-center'
        key = {i}
        onClick = {() => this.onDateClick(cloneCloneStartDate)}
        >
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          <br />
          {dateFns.format(dateFns.addDays(startDate, i), dayFormat)}
        </div>
      )
      cloneStartDate = dateFns.addDays(cloneStartDate, 1)
    };

    return <div className = 'days row'>{days}</div>
  }

  // This is to show the time on the side instead of in each box
  // It is too cluttered
  renderSide() {
    const dateFormat = 'h a'
    const hour = []
    let startHour = dateFns.startOfDay(this.props.currentDate)
    for (let i = 0; i<24; i++){
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

  // USE THIS
  renderWeekCell(events){
    // So what you wanted to do for this is that you will make a list of lsit
    // so the first list is the list of the same hour for multiple day so it
    // will be a list of 7 items of all the same time, and the big list will have
    // 24 items
    const currentWeek = this.state.currentWeek;
    const selectedDate = this.props.currentDate;
    // this will give you the first day of the week
    const weekStart = dateFns.startOfWeek(selectedDate);
    const weekEnd = dateFns.endOfWeek(selectedDate);

    const hourFormat = 'h a'
    const dayFormat = 'd MMMM'
    // So this list will hold 24 items, each list for each hour
    const hours = []

    // this list will hold all the events
    let toDoStuff = []
    // This will be a list the same hour of all the days
    let days = []
    // The things we need is the start day and then we need the start of the
    // hour so we can loop through it
    let date = weekStart
    const startHourDay = dateFns.startOfDay(date);
    const endHourDay = dateFns.endOfDay(date);

    // Just for the development, we want to show the hourt=
    let formattedDay = '';

    let hour = startHourDay;
    let formattedHour = '';

    // The plan for the loop is to have a while loop that loops through all the
    // hours then with in each hour have a for loop that loops through each day
    while (hour <= endHourDay){
      // When adding things to the calendar you have to match the date and the
      // hour for this one


      // this for loop will take the hour and date and loop throuhg all the
      // hours of all the days of the week
      for(let i = 0; i<7; i++){
        const cloneDay = date
        const cloneHour = hour
        formattedHour = dateFns.format(hour, hourFormat)
        formattedDay = dateFns.format(date, dayFormat)
        // this loop will loop through all the events and if the hour and day matches
        // it will add it to the toDoStuff which will loop through each cell
        // then it will be cleared out again
        for (let item = 0; item<events.length; item++){
            if(dateFns.getHours(new Date(events[item].start_time)) === dateFns.getHours(new Date(hour))
            && dateFns.isSameDay(new Date(events[item].start_time), cloneDay)
          )
            toDoStuff.push(
              events[item]
            )
        }

        if(toDoStuff.length > 0){
          days.push(
            <div
              className = 'col hourcell'
              onClick = {() => this.onDayHourClick(cloneDay, cloneHour)}
            >
            <ul className = 'monthList'>
              {toDoStuff.map(item => (
                <li key = {item.content} className = 'monthListItem'>
                  <div onClick = {() => this.onClickItem(item)}>
                  <span className = 'eventTime'> {dateFns.format(new Date(item.start_time), 'ha')}</span>
                  <span className = 'eventTime' > {item.content} </span>
                  </div>
                </li>
              ))}
            </ul>
            </div>
          )
        } else {
          days.push(
            <div
              className = 'col hourcell'
              onClick = {() => this.onDayHourClick(cloneDay, cloneHour)}
            >
            <span className = 'number'></span>
            </div>
          )
        }
        toDoStuff = []
        date = dateFns.addDays(date, 1)
      }
      // After you loop through the hour, you will then want to put it into the
      // hours list and then clear out days list to redo it again, then you want
      // to set your date again to the start of the week but now the hour would be
      //  1 more added  and you repeat
      // Also remember that the date must be resetted before adding the hour
      // because of the while loop condition
      hours.push(
        <div className = 'row' >
          {days}
        </div>
      )
      days = []
      date = weekStart
      hour = dateFns.addHours(hour, 1)
    }

    return <div className = 'body'> {hours}</div>
  }


  onDayHourClick = (day, hour) => {
    console.log(day, hour)
  }

  // this is a onclick function that goes to the next week
  nextWeek =() =>{
    this.props.nextWeek()
  }


  // onClick function that goes to the prvious week
  prevWeek = () => {
    this.props.prevWeek()
  }

  onBackClick = () => {
    const selectYear = dateFns.getYear(this.props.currentDate).toString()
    const selectMonth = (dateFns.getMonth(this.props.currentDate)+1).toString()
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onDateClick = day => {
    const selectYear = dateFns.getYear(day).toString()
    const selectMonth = (dateFns.getMonth(day)+1).toString()
    const selectDay = dateFns.getDate(day).toString()
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onClickItem = oneEvent => {
    // The one event you put in here will just be data on one event
    // it will be passed into the redux to calendarEvent openmodal and then
    // be sent to the intital state where it will then open the Edit event popup
    this.props.openModal(oneEvent)
  }

  onAddEvent = () => {
    this.props.openDrawer()
  }


  render() {
    return (
    <div className = 'calendarContainer'>
        <div className = 'miniCalContainer'>
          <MiniCalendar {...this.props}/>
        </div>
        <div className = 'mainCalContainer'>
          <div className = 'flex-container'>
          <EditEventPopUp
          isVisible = {this.props.showModal}
          close = {() => this.props.closeModal()}
          />
            <div className = 'timecol'>
              {this.renderSide()}
            </div>
            <div className = 'calendar'>
            <Button type="primary" shape="circle" onClick = {this.onBackClick}>
            M
            </Button>
            <Button type="primary" onClick = {this.onAddEvent}>
            Add event
            </Button>
            <EventDrawer visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
              {this.renderHeader()}
              {this.renderDays()}
              {this.renderWeekCell(this.props.events)}
            </div>

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
    events: state.calendar.events
  }
}

// The get selected date action will get the date based on the url
const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextWeek: () => dispatch(calendarActions.nextWeek()),
    prevWeek: () => dispatch(calendarActions.prevWeek()),
    getEvents: () => dispatch(calendarActions.getUserEvents())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekCalendar);
