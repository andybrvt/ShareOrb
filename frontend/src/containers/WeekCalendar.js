import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';


class WeekCalendar extends React.Component{
  // So when ever you do calendars, for states  you always want
  // to set the currentWeek as the current day because, you can use
  // get current week to get the firstday
  state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    events: []
  }

  // This will be rending the header of the view, for weekly view, it will be
  // the start week to the end of the start week and start of the week
  renderHeader() {
    const dateFormat = 'MMMM dd, yyyy'
    const startWeek = dateFns.startOfWeek(this.state.currentWeek)
    const endWeek = dateFns.endOfWeek(this.state.currentWeek)
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
            -
            {dateFns.format(endWeek, dateFormat)}
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
    const days = []

    let startDate = dateFns.startOfWeek(this.state.currentWeek)

    for (let i = 0; i<7; i++){
      days.push(
        <div className = 'col col-center' key = {i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    }

    return <div className = 'days row'>{days}</div>
  }

  // This will render stuff by the hour
  renderCells(){
    const {currentWeek, selectedDate} = this.state;
    const weekStart = dateFns.startOfWeek(currentWeek);
    const weekEnd = dateFns.endOfWeek(currentWeek);


    const dayFormat = 'd';
    const hourFormat = 'h a';
    // So each day will have a bunch of hours so you need to put then in each list
    // then put each list of hours into a big list that is the week
    // So you will need a list for week and a list for day
    // For the week you will need the day of the start of the week
    // For the day you will need the first hour of that day
    const week = [];
    // this list will hold all the hours of a day
    let day = [];

    // date is the actuall date of that tday
    let date = weekStart;
    const startHourDay = dateFns.startOfDay(date);
    const endHourDay = dateFns.endOfDay(date);
    let formattedDay = "";

    let hour =  startHourDay;
    let formattedHour = "";


    // The while loop basically represents each day of the week
    // The for loop is basically each hour of the day
    while (date <= weekEnd){

      for (let i = 0; i<24; i++){
        // the formatted hour is just to get the hour on top fo the cell
        formattedHour = dateFns.format(hour, hourFormat)
        const cloneHour = hour
        day.push(
          <div
            className = ' col hourcell weekcol'
            key = {hour}
            onClick = {this.onHourClick}
          >
          <span className = 'number'>{formattedHour}</span>
          <span className = 'bg'>{formattedHour}</span>
          </div>
        )
        // After rendering the hour in the day, you will add one to the current
        // hour
        hour = dateFns.addHours(hour, 1)
      }
      // Pushing the day into the week after rendering its hours
      // test
      week.push(
        <div className = '' key = {day}>
          {day}
        </div>
      )
      // then you add another day
      day = []
      date = dateFns.addDays(date, 1)
    };
    console.log(week)
    return <div className = 'body'> {week} </div>
  }


  onHourClick = () => {
    console.log('hour')
  }

  // this is a onclick function that goes to the next week
  nextWeek =() =>{
    this.setState({
      currentWeek: dateFns.addWeeks(this.state.currentWeek, 1)
    })
  }


  // onClick function that goes to the prvious week
  prevWeek = () => {
    this.setState({
      currentWeek: dateFns.subWeeks(this.state.currentWeek, 1)
    })
  }

  render() {
    return (
      <div className = 'calendar'>
      {this.renderHeader()}
      {this.renderDays()}
      {this.renderCells()}
      </div>
    )
  }

}

export default WeekCalendar;
