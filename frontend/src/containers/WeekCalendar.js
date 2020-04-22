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
    const dateFormat = 'MMMM yyyy'
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

    let startDate = dateFns.startOfWeek(this.state.currentWeek)

    for (let i = 0; i<7; i++){
      days.push(
        <div className = 'col col-center' key = {i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          <br />
          {dateFns.format(dateFns.addDays(startDate, i), dayFormat)}
        </div>
      )
    };

    return <div className = 'days row'>{days}</div>
  }

  // This is to show the time on the side instead of in each box
  // It is too cluttered
  renderSide() {
    const dateFormat = 'h a'
    const hour = []
    let startHour = dateFns.startOfDay(this.state.currentWeek)
    const formattedHour = dateFns.format(startHour, dateFormat)
    for (let i = 0; i<24; i++){
      hour.push(
        <div
          className = ' col hourcell weekcolcell'
          key = {hour}
        >
        <span className = 'number'>{formattedHour}</span>
        </div>
      )
    }
    return <div className= 'body'> {hour} </div>
  }

  // USE THIS
  renderWeekCell(){
    // So what you wanted to do for this is that you will make a list of lsit
    // so the first list is the list of the same hour for multiple day so it
    // will be a list of 7 items of all the same time, and the big list will have
    // 24 items
    const{currentWeek, selectedDate} = this.state;
    // this will give you the first day of the week
    const weekStart = dateFns.startOfWeek(currentWeek);
    const weekEnd = dateFns.endOfWeek(currentWeek);

    const hourFormat = 'h a'
    const dayFormat = 'd MMMM'
    // So this list will hold 24 items, each list for each hour
    const hours = []
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

      // this for loop will take the hour and date and loop throuhg all the
      // hours of all the days of the week
      for(let i = 0; i<7; i++){
        const cloneDay = date
        const cloneHour = hour
        formattedHour = dateFns.format(hour, hourFormat)
        formattedDay = dateFns.format(date, dayFormat)
        days.push(
          <div
            className = 'col hourcell'
            onClick = {() => this.onDayHourClick(cloneDay, cloneHour)}
          >
          <span className = 'number'>{formattedHour}{formattedDay}</span>
          </div>
        )
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
      {this.renderWeekCell()}

      </div>
    )
  }

}

export default WeekCalendar;
