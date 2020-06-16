import React from 'react';
import * as dateFns from 'date-fns';
import '../containers/Container_CSS/NewCalendar.css';
import { connect } from 'react-redux';
import * as calendarActions from '../store/actions/calendars'




class MiniCalendar extends React.Component{

// So when making the minicalendar, you can just use states because nothing too
// crazy is happening here
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  }

  renderHeader() {
    const dateFormat = "MMMM yyyy"
    return (
      <div className= "header miniRow flex-middle">
        <div className = "miniCol miniCol-start">
          <div className = "icon" onClick ={this.prevMonth}>
          <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = "miniCol miniCol-center" onClick = {() => this.onMonthClick(
            this.state.currentMonth
        )}>
          <span>
           {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className= "miniCol miniCol-end" onClick = {this.nextMonth}>
          <div className = "icon">
          <i className = 'arrow arrow-right'></i>
          </div>
        </div>
      </div>
    );
  }



  renderDays() {
    const dateFormat = 'iiiii'
    const days = []
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i=0; i< 7; i++){
      days.push(
        <div className = 'miniCol miniCol-center' key = {i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      )
    }

    return <div className = 'days miniRow'>{days}</div>

  }

  renderSide() {
    // This is just to render the tiny tabs for the week view in the mini
    // calendar
    const {currentMonth, selectedDate} = this.state
    const startDateMonth = dateFns.startOfMonth(currentMonth);
    const endDateMonth = dateFns.endOfMonth(currentMonth);
    const startFirstWeek = dateFns.startOfWeek(startDateMonth);
    const startLastWeek = dateFns.startOfWeek(endDateMonth);

    let date = startFirstWeek;
    let formattedWeek = '';
    const weekFormat = 'dd mmmm yyyy'

    const week = []
    while (date <= startLastWeek){
      formattedWeek = dateFns.format(date, weekFormat)
      const cloneDate = date
      week.push(
        <div className = 'miniholder'>
        <div
        onClick = {() => this.onWeekClick(cloneDate)}
        className = 'minitabs'
        >
        <span></span>
        </div>
        </div>
      )
      date = dateFns.addWeeks(date, 1)
    }
    return <div className = 'minisideBar'> {week} </div>


  }


  renderCells () {
    const {currentMonth, selectedDate} = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let toDoStuff = [];
    let days = [];

    let day = startDate;
    let formattedDate = "";

    while (day <= endDate){
      for (let i=0; i<7; i++){
        formattedDate = dateFns.format(day, dateFormat)
        const cloneDay = day;
        days.push(
          <div
            className = {`miniCol miniCell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
            : dateFns.isSameDay(day, currentMonth) ?
          "selected": ""
            }`}
            key = {day}
          >
            <div className = 'circle' onClick = {() =>
            this.onDateClick(cloneDay)}>
              <span className = 'number'>{formattedDate}</span>
            </div>
          </div>
        )
        day = dateFns.addDays(day, 1)
      }

      rows.push(
        <div className = 'miniRow' key = {day}>
          {days}
        </div>
      )
      days = []
    }
    return <div className = 'body'>{rows}</div>
  }

  onDateClick = date => {
    const selectYear = dateFns.getYear(date).toString()
    const selectMonth = (dateFns.getMonth(date)+1).toString()
    const selectDay = dateFns.getDate(date).toString()
    console.log(selectYear, selectMonth, selectDay)
    this.props.getSelectedDate(date)
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onMonthClick = date => {
    const selectYear = dateFns.getYear(date).toString()
    const selectMonth = (dateFns.getMonth(date)+1).toString()
    console.log(selectYear, selectMonth)
    this.props.getSelectedDate(date)
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onWeekClick = week => {
    const selectYear = dateFns.getYear(week).toString()
    const selectMonth = (dateFns.getMonth(week)+1).toString()
    const selectDay = dateFns.getDate(week).toString()
    this.props.getSelectedDate(week)
    this.props.history.push('/personalcalendar/w/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  nextMonth = () =>{
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    })
  }

  prevMonth = () =>{
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    })
  }


  render() {
    // You can add in {this.renderSide()} any time
    return(
      <div className = "miniflex-container">
        <div className = 'miniSidecol'>

        </div>
        <div className = 'miniCalendar'>
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderCells()}
        </div>
      </div>
    )
  }

}


const mapDispatchToProps = dispatch => {
  return{
  getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate))
  }
}



export default connect(null, mapDispatchToProps)(MiniCalendar);
