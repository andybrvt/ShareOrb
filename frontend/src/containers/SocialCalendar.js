import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/SocialCal.css';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Drawer, List, Avatar, Divider, Col, Row, Tag, Button } from 'antd';

import * as navActions from '../store/actions/nav';
import * as calendarActions from '../store/actions/calendars';
import { connect } from 'react-redux';
import  { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';


class SocialCalendar extends React.Component{
// new Date is form DateFns and it give you the current date and month
// SelectedDate will be the first day of the month
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    events: [],
  }

  // showDrawer = (e) => {
  //   e.preventDefault()
  //   this.setState({
  //     drawerVisible: true,
  //   });
  // };

  onClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };
  componentDidMount(){
    // const selectedYear = this.props.match.params.year;
    // const selectedMonth = this.props.match.params.month;
    // const newDate = [selectedYear, selectedMonth]
    // const newSelectedDate = new Date(newDate)
    // this.props.getSelectedDate(newSelectedDate)
    // this.props.getEvents()
  }

  componentWillReceiveProps(newProps){
    // you bascially want to check if the date in props and the date in
    // the url is the safe, if they are not --> you gotta change it
    if (this.props.currentDate !== newProps.currentDate){

      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      this.props.history.push('/personalcalendar/'+year+'/'+(month+1))
    }
    // Instead of reloading the data everytime, the editing of the events is done in the
    // redux
  }
  // When working with dates it is important that you format the
  // the date properly
  renderHeader() {
    const dateFormat = "MMMM yyyy"
    // for formatting using moment or whatever you do
    // .format('give a date here', what kind of formatting here)
    return (
      <div className= "header row flex-middle">
        <div className = "col col-start">
          <div className = "icon" onClick ={this.prevMonth}>
            <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = "col col-center">
          <span>
           {dateFns.format(this.props.currentDate, dateFormat)}
          </span>
        </div>
        <div className= "col col-end" onClick = {this.nextMonth}>
          <div className = "icon">
          <i className = 'arrow arrow-right'></i>
          </div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "iiii"
    const days = []
    // this will get the date of the first week given the date of the current month
    let startDate = dateFns.startOfWeek(this.props.currentDate);
    // for loop that loops through from 0-6 and add the days accordingly
    // to the start date which is the start of the day in the current date
    for (let i= 0; i<7; i++){
      days.push(
        <div className ="col col-center" key = {i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          </div>
      )
    }
    // the days will be a list of dates that are put in by the for loops
     // and then the return will return all those days out
    return <div className = "days row"> {days} </div>
  }


  renderCells(events) {
    console.log(events)
    // startOfMonth() will give you the date of the first day of the current month
    // endOfMonth() will give you the date of the last day of the current month
    // the const start date is to fill in the days of the week of the previous month
    // similarly as the end date
    const currentMonth = this.state.currentMonth;
    const selectedDate = this.props.currentDate;
    const monthStart = dateFns.startOfMonth(selectedDate);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    // Once you have your start date and end date you want to loop through
    // all the days in between
    // then we have to subtract the start of the month with the startoftheweek
    // if they are not the same so that they are unclickable

    const dateFormat = "d";
    const rows = []
    let toDoStuff = []
    let days = [];
    // day is the startday, which starts at the first day of the week
    // for the 42 block of time
    let day = startDate;
    let formattedDate = "";
    // this loop will loop through all the days of the month
    while (day <=endDate){


      // we make it smaller than 7 because we still want to keep the index of the
      // weekdays the same
      for (let i= 0; i<7; i++){
        for (let item = 0; item < events.length; item++){
          // So the time we put in is the UTC time (universal time ) but when you
          // put moment or new Date it gives you your time zome date so that is why you
          // have to convert it
          const date = new Date(events[item].start_time)
          const utc = dateFns.addHours(date, date.getTimezoneOffset()/60)
          if (dateFns.isSameDay(utc, day)){
            toDoStuff.push(
              events[item]
            )
          }
        }
        // this give the date will give the day numnber in 1-365

        formattedDate = dateFns.format(day, dateFormat);
        // used clone day so that it would do the selected day and not the endDay
        // because the loop will end on end day and it w3il always click that day
        const cloneDay = day;
        // the classname in the bottom is to check if its not in the smae month
        // the cell will be disabled
        // It is also to check if the day is the smae as the current day
        if (toDoStuff.length > 0){
          days.push(
            <div
              className ={`col cell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
              : dateFns.isSameDay(day, currentMonth) ?
            "selected": ""
              }`}
              key = {day}
            >

            <span className = "bg"> {formattedDate}</span>

          </div>
        )} else {days.push(
          <div
            className ={`col cell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
            : dateFns.isSameDay(day, currentMonth) ?
          "selected": ""
            }`}
            key = {day}
          >
          <span className = "bg"> {formattedDate}</span>
        </div>
        )}
      toDoStuff = []
      day = dateFns.addDays(day, 1);
      }
      // so this will start at the start of the week and then loop through the 7 days
      // once done it will push the list into the rows
      // so there will be a list of list and each list would be a week
      rows.push(
        <div className='row' key ={day}>
          {days}
        </div>
      );
      // once the list filled with each day is filled he empties the list and
      // does it again in the loop
      days = []
    }
    // now this will return a list of list and each week representing a week
    // with each item as the day

    return <div className = "body"> {rows} </div>
  }


  // so we need function to deal with cell click to change the date
  // Then you need function to show previous and next monthly
  onDateClick = day => {
    const selectYear = dateFns.getYear(day).toString()
    const selectMonth = (dateFns.getMonth(day)+1).toString()
    const selectDay = dateFns.getDate(day).toString()
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

// So what are going to do with this is get the selected month and get the first day of the
// month and then get the first day of the week and loop through it till you get the first day
// of the week for the end of the month

  onWeekClick = startDayWeek => {
    const selectedYear = dateFns.getYear(startDayWeek).toString()
    const selectedMonth = (dateFns.getMonth(startDayWeek)+1).toString()
    const selectedDay = dateFns.getDate(startDayWeek).toString()
    this.setState({
      selectedDate: startDayWeek
    })
    this.props.history.push('/personalcalendar/w/'+selectedYear+'/'+selectedMonth+'/'+selectedDay)
  }



  // You can use the addMonths function to add one month to the
  // current month
  nextMonth = () => {
    this.props.nextMonth();
  }

  prevMonth = () => {
    this.props.prevMonth()
  }


  onClickItem = oneEvent =>{
    console.log(oneEvent)
    this.props.openModal(oneEvent)
  }




  render(){
    // className is to determine the style
    console.log(this.props)
    return(
      <div className = 'socialCalContainer'>

          <div className = 'socialCalendar'>
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells(this.props.events)}
          </div>
        </div>
    )
  }
}


const mapStateToProps = state => {
  return{
    currentDate: state.calendar.date,
    events: state.calendar.events,
  }
}

// getSelectedDate will get the date from the url
// it will help with the lagging of the state so when we put it in
const mapDispatchToProps = dispatch => {
  return {
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextMonth: () => dispatch(calendarActions.nextMonth()),
    prevMonth: () => dispatch(calendarActions.prevMonth()),

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SocialCalendar);
