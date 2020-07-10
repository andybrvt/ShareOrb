import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';
import { connect } from 'react-redux';
import * as calendarActions from '../store/actions/calendars';
import MiniCalendar from '../components/MiniCalendar';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent';
import * as eventSyncActions from '../store/actions/eventSync';
import EventSyncModal from '../components/EventSyncModal';
import moment from 'moment';
import { Drawer, List, Avatar, Divider, Col, Row, Tag, Button } from 'antd';
import EventModal from '../containers/EventModal';





class YearCalendar extends React.Component{
  state = {
    currentYear: new Date(),
  }

  componentDidMount () {
    const selectedYear = this.props.match.params.year;
    const newDate = [selectedYear]
    console.log(newDate)
    const newSelectedDate = dateFns.addYears(new Date (newDate),1)
    console.log(newSelectedDate)
    this.props.getSelectedDate(newSelectedDate)
  }

  componentWillReceiveProps(newProps){
    if (this.props.currentDate !== newProps.currentDate){

      const year = dateFns.getYear(newProps.currentDate)
      this.props.history.push('/personalcalendar/'+year)
    }
  }

  renderColor = () => {
    const color = ["green","yellow","red","blue","orange","pink","cyan"]
    const len = color.length
    const randomNum = Math.floor(Math.random()*len)
    const pickcolor = color[randomNum]
    return pickcolor

  }

  renderYear() {
    // This is used to render the year
    const dateFormat = 'yyyy'

    return(
      <div className = "header row flex-middle">
        <div className = "col col-start">
          <div className = "icon" onClick = {this.prevYear} >
          <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = "col col-center">
          <span
          style = {{fontSize: '30px'}}
          >
            {dateFns.format(this.props.currentDate, dateFormat)}
          </span>
        </div>
        <div className = 'col col-end' onClick = {this.nextYear}>
          <div className = 'icon'>
          <i className = 'arrow arrow-right'></i>
          </div>
        </div>
      </div>
    )
  }

  renderMonthCell() {
    // To render each cell, you would want each cell to hold the months and the days
    // of that month so you first have to loop through each month and print out the
    // months then with in that month, since you get the first day of the month you
    // have to get the start of the week then you get the last day of the month
    // then get the last day of the week then render through every single day
    const dateFormat = 'MMMM'
    const selectedDate = this.props.currentDate;
    const yearStart = dateFns.startOfYear(selectedDate)
    const yearEnd = dateFns.endOfYear(selectedDate)
    // we can make a list that holds all the months then make another function
    // to put into this function to render out the days

    // The const year is just a list that holds every month
    const year = []

    let month = yearStart;

    // You will loop through each month until you hit the last month, and after each
    // loop you will add one month in until you hit the last yearEnd
    while (month <= yearEnd){
      const monthCopy = month
        year.push(
        <div className = 'yearcol yearcell'>
          <div
          className = 'monthBox'
          onClick = {() => this.onMonthClick(monthCopy)}
          style = {{backgroundImage: this.getMonthColor(monthCopy)}} >
          <span
          className = 'monthText'
          > {dateFns.format(month, dateFormat)}</span>
          </div>
          {this.renderDayName()}
          {this.renderDayInMonth(month)}
        </div>
      )
      month = dateFns.addMonths(month, 1)
    }
    return <div className = 'body yearRow'>{year}</div>
  }

  renderDayName() {
    const dateFormat = "iiiii"
    const days = []
    // this will get the date of the first week given the date of the current month
    let startDate = dateFns.startOfWeek(this.props.currentDate);
    // for loop that loops through from 0-6 and add the days accordingly
    // to the start date which is the start of the day in the current date
    for (let i= 0; i<7; i++){
      days.push(
        <div className ="monthCellCol monthDayCell" key = {i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          </div>
      )
    }
    // the days will be a list of dates that are put in by the for loops
     // and then the return will return all those days out
    return <div className = "dayYearRow"> {days} </div>
  }

  renderDayInMonth = (month) =>{
    // you would baiscally make this how you made the month view
    const currentMonth = new Date()
    const monthStart = dateFns.startOfMonth(month)
    const endMonth = dateFns.endOfMonth(monthStart)
    const startWeek = dateFns.startOfWeek(monthStart)
    const endWeek = dateFns.endOfWeek(endMonth)
    const rows = []
    let week = []
    let day = startWeek;
    const dateFormat = 'd';


    // The while loop is for each week
     // The for loop how ever is for each day of the week
     // Basically a 2D loop of the months that hold each week
    while (day <= endWeek){
      for (let i= 0; i<7; i++){
        const cloneDay = day
        week.push(
          <div
          className ='monthCellCol monthDayCell'
          key = {day}
          onClick = {() => this.onSelectedDate(cloneDay)}
          >
          <span
          className = 'dayText'
          >
          {dateFns.format(day, dateFormat)}
          </span>
          </div>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className = 'yearRow' style = {{}}>
          {week}
        </div>
      )
      week = []
    }

    return <div className = 'monthcell'> {rows} </div>
  }

  getMonthColor = (month) => {
    console.log(month)
    let monthNum = ''
    if (month){
      monthNum = dateFns.getMonth(month)
      console.log(monthNum)
    }
    console.log(monthNum)
    const listColor = [
      'linear-gradient(to bottom right, #00008B , #8B0000)',
      'linear-gradient(to bottom right, #ADD8E6 , #FFFF00)',
      'linear-gradient(to bottom right, #ADD8E6 , #FFFFFF)',
      'linear-gradient(to bottom right, #FFFF00 , #FF0000)',
      'linear-gradient(to bottom right, #FFFF00 , #32CD32)',
      'linear-gradient(to bottom right, #fffdd0 , #0000FF)',
      'linear-gradient(to bottom right, #80461b , #FF0000)',
      'linear-gradient(to bottom right, #FF0000 , #90EE90)',
      'linear-gradient(to bottom right, #A0522D , #00008B)',
      'linear-gradient(to bottom right, #FFA500 , #FFFF00)',
      'linear-gradient(to bottom right, #FFD700 , #A52A2A)',
      'linear-gradient(to bottom right, #4B0082 , #185a9d)',
    ]

    if (monthNum !== ''){
      return listColor[monthNum]
    }

  }

  prevYear = () =>{
    this.props.prevYear()
  }

  nextYear = () => {
    this.props.nextYear()
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }

  onMonthClick = (month) => {
    const selectedMonth = dateFns.getMonth(month)+1
    const selectedYear = this.props.match.params.year
    this.props.history.push('/personalcalendar/'+selectedYear+'/'+selectedMonth)
  }

  onSelectedDate = date => {
    const selectYear = dateFns.getYear(date).toString()
    const selectMonth = (dateFns.getMonth(date)+1).toString()
    const selectDay = dateFns.getDate(date).toString()
    console.log(selectYear, selectMonth, selectDay)
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  render(){
    console.log(this.getMonthColor())
    return(
      <div className = 'calendarContainer'>
      <EventSyncModal
        {...this.props}
        isVisble = {this.props.showEventSyncModal}
        close = {() => this.props.closeEventSyncModal()}
      />
        <div className = 'miniCalContainer'>
        <Button
        // type = "primary"
        className = 'addEventButton'
        onClick={() => this.props.openDrawer()}>
          Add Event
        </Button>
          <MiniCalendar {...this.props}/>
          <Button
          type = 'primary'
          className = 'miniEventSyncButton'
          onClick = {this.openEventSyncModal}>
            Event Sync
          </Button>
        </div>
        <div className = 'mainCalContainer'>
        <EventModal visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />

          <div className = 'flex-container'>
            <div className = 'calendar'>
            {this.renderYear()}
            {this.renderMonthCell()}
            </div>
          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = state =>{
  return {
    showDrawer: state.nav.showPopup,
    showModal: state.calendarEvent.showModal,
    currentDate: state.calendar.date,
    events: state.calendar.events,
    showEventSyncModal: state.eventSync.showEventSyncModal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextYear: () => dispatch(calendarActions.nextYear()),
    prevYear: () => dispatch(calendarActions.prevYear()),
    openEventSyncModal: () => dispatch(eventSyncActions.openEventSyncModal()),
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YearCalendar);
