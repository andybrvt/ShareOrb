import React from 'react';
import * as dateFns from 'date-fns';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Button, Tooltip } from 'antd';
import './Container_CSS/NewCalendar.css';




class DayCalendar extends React.Component{
  state ={
      currentDay: new Date(),
      selectedDate: new Date(),
      events: [],
  }

  componentDidMount(){
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    const selectedDay = this.props.match.params.day;
    const newDate = [selectedYear, selectedMonth, selectedDay]
    const newsSelectedDate = new Date(newDate)
    this.setState({
      selectedDate: newsSelectedDate
    })
    authAxios.get('http://127.0.0.1:8000/mycalendar/events')
    .then(res => {
      this.setState({
        events: res.data
      })
    })
  }
  componentWillReceiveProps(newProps){
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    const selectedDay = this.props.match.params.day;
    const newDate = [selectedYear, selectedMonth, selectedDay]
    const newsSelectedDate = new Date(newDate)
    this.setState({
      selectedDate: newsSelectedDate
    })
    authAxios.get('http://127.0.0.1:8000/mycalendar/events')
    .then(res => {
      this.setState({
        events: res.data
      })
    })
  }

// render the date on top
  renderHeader(){
    const dateFormat = 'iiii MMMM dd, yyyy'

    return (
      <div className = 'header row flex-middle'>
        <div className = 'col col-start'>
          <div className = "icon" onClick = {this.prevDay}>
            chevron_left
          </div>
        </div>
        <div className = "col col-center">
          <span>
            {dateFns.format(this.state.selectedDate, dateFormat)}
          </span>
        </div>
        <div className = "col col-end" onClick = {this.nextDay}>
          <div className = "icon"> chevron_right </div>
        </div>
      </div>
    );
  }
// render the time on the side
  renderHours() {
    // this format is to render it by hour and am pm
    // the hours will store the divs
    const dateFormat = "h a"
    const hours = []

    // starttime will be the start of the day where the time is 00:00
    // then you will loop by 0-23 and add hours accordingly
    let startTime = dateFns.startOfDay(this.state.selectedDate);
    for(let i = 0; i<24; i++){
      hours.push(
        <div className = 'sidecell' key = {i}>
        </div>
      )
    }
    // render it our but you have to fix the css
    return <div className = 'sidepanel'>{hours}</div>
  }

// render all the hour cell within each day
  renderCells(events) {
    const {currentDay, selectedDate} = this.state
    const startHourDay = dateFns.startOfDay(selectedDate)
    const endHourDay = dateFns.endOfDay(selectedDate)

    // So you have the current day and the selected day
    // The you get the day, and then you get the first hour of that day
     // You will do the same with the endHourDay
     // You will want to loop through all the hours of that day starting with
     // startHourDay and ending with endHourDay

    let toDoStuff = []
    const hourFormat = "h a"
    // Since there will only be the hours we wont be need a row list
    let hours = [];
    // Start of the hour and then loop through all the 24 hours
    let hour = startHourDay;
    let formattedHour = "";
    console.log(dateFns.isSameHour(new Date("2020-04-16T07:48:40Z"), new Date('Thu Apr 16 2020 00:00:00 GMT-0700')))
    console.log(new Date("2020-04-16T07:48:40Z"))
    console.log(new Date('Thu Apr 16 2020 00:00:00 GMT-0700'))
    // they are the same time because when you do a new date it goes on the GM time

    // Hour is in a date format with the day and time and it will go till the
    // Same day(endHourday) but till the last sec of the day
    // Since we are not doing a list of list and there is just days we do not
    // need the while statment, just a list
    for (let i = 0; i<24; i++){
      formattedHour = dateFns.format(hour, hourFormat)
      for(let item = 0; item < events.length; item ++){
        if (dateFns.isSameHour(new Date(events[item].start_time), hour)
            && dateFns.isSameDay(new Date(events[item].start_time), hour) ){
          toDoStuff.push(
            events[item]
          )
        }
      }

      const cloneHour = hour
      const cloneToDoStuff = toDoStuff
      if (toDoStuff.length > 0){
        hours.push(
          <div
            className = ' daycell'
            key = {hour}
            onClick = {
              () => this.onHourClick(cloneHour, cloneToDoStuff)}
          >
          <span className = 'number'>{formattedHour}</span>
          <span className = 'bg'> {formattedHour}</span>
          <ul>
            {toDoStuff.map(item => (
              <li key={item.content}>
                {item.content}
              </li>
            ))}
          </ul>
          </div>
        )} else {
        hours.push(
          <div
            className = ' daycell'
            key = {hour}
            onClick = {
              () => this.onHourClick(cloneHour, cloneToDoStuff)}
          >
          <span className = 'number'>{formattedHour}</span>
          <span className = 'bg'> {formattedHour}</span>
          </div>
        )}
      toDoStuff = []
      hour = dateFns.addHours(hour, 1);
    }
    return <div className = 'body'>{hours}</div>
  }

  onHourClick = (day,events) =>{
    console.log(day)
    console.log(events)
  }

// Use addDays function to change the day
//This will pretty much push all the render cell and stuff on top by 1 day
  nextDay = () => {
    this.setState({
      selectedDate: dateFns.addDays(this.state.selectedDate, 1)
    })
  }

  prevDay = () => {
    this.setState({
      selectedDate: dateFns.subDays(this.state.selectedDate,1)
    })
  }

  onBackClick = () => {
    this.props.history.push('/personalcalendar')
  }

  render() {
    console.log(this.state)
    return (

      <div className = 'calendar'>
        <Button type="primary" shape="circle" onClick = {this.onBackClick}>
        A
        </Button>
        {this.renderHeader()}
        {this.renderHours()}
        {this.renderCells(this.state.events)}
      </div>
    )
  }
}

export default DayCalendar;
