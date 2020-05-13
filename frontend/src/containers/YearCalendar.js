import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';
import { connect } from 'react-redux';


class YearCalendar extends React.Component{
  state = {
    currentYear: new Date(),
  }

  renderYear() {
    // This is used to render the year
    const dateFormat = 'yyyy'

    return(
      <div className = "header row flex-middle">
        <div className = "col col-start">
          <div className = "icon" onClick = {this.prevYear} >
            chevron_left
          </div>
        </div>
        <div className = "col col-center">
          <span>
            {dateFns.format(this.props.currentDate, dateFormat)}
          </span>
        </div>
        <div className = 'col col-end' onClick = {this.nextYear}>
          <div className = 'icon'>
            chevron_right
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
        year.push(
        <div className = 'yearcol yearcell'>
          {dateFns.format(month, dateFormat)}
          {this.renderDayInMonth(month)}
        </div>
      )
      month = dateFns.addMonths(month, 1)
    }
    return <div className = 'body row'>{year}</div>
  }

  renderDayInMonth = (month) =>{
    console.log(month)
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
        week.push(
          <div
          className ={`monthCellCol monthDayCell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
          : dateFns.isSameDay(day, currentMonth) ?
        "selected": ""
          }`}
          key = {day}
          >
          {dateFns.format(day, dateFormat)}
          </div>
        )
        day = dateFns.addDays(day, 1)
      }
      rows.push(
        <div className = 'row'>
          {week}
        </div>
      )
      week = []
    }

    return <div className = 'monthcell'> {rows} </div>
  }

  prevYear(){

  }

  prevMonth(){

  }

  render(){
    return(
      <div className = 'calendarContainer'>
        <div className = 'calendar'>
        {this.renderYear()}
        {this.renderMonthCell()}
        </div>
      </div>
    )
  }

}

const mapStateToProps = state =>{
  return {
    currentDate: state.calendar.date
  }
}

// const mapDispatchToProps = dispatch => {
//   return (
//
//   )
// }

export default connect(mapStateToProps)(YearCalendar);
