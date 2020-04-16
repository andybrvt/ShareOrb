import React from 'react';
import * as dateFns from 'date-fns';


class DayCalendar extends React.Component{
  state ={
      currentDay: new Date(),
      selectedDate: new Date()
  }
// render the date on top
  renderHeader(){
    const dateFormat = 'iiii MMMM yyyy'

    return (
      <div className = 'header row flex-middle'>
        <div className = 'col col-start'>
          <div className = "icon" onClick = {this.prevDay}>
            chevron_left
          </div>
        </div>
        <div className = "col col-center">
          <span>
            {dateFns.format(this.state.currentDay, dateFormat)}
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
    let startTime = dateFns.startOfDay(this.state.currentDay);
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
  renderCells() {
    const {currentDay, selectedDate} = this.state
    const startHourDay = dateFns.startOfDay(currentDay)
    const endHourDay = dateFns.endOfDay(currentDay)

    // So you have the current day and the selected day
    // The you get the day, and then you get the first hour of that day
     // You will do the same with the endHourDay
     // You will want to loop through all the hours of that day starting with
     // startHourDay and ending with endHourDay


    const hourFormat = "h a"
    // Since there will only be the hours we wont be need a row list
    let hours = [];
    // Start of the hour and then loop through all the 24 hours
    let hour = startHourDay;
    let formattedHour = "";
    // Hour is in a date format with the day and time and it will go till the
    // Same day(endHourday) but till the last sec of the day
    // Since we are not doing a list of list and there is just days we do not
    // need the while statment, just a list
    for (let i = 0; i<24; i++){
      formattedHour = dateFns.format(hour, hourFormat)

      hours.push(
        <div
          className = ' daycell'
          key = {hour}
          onClick = {
            () => this.onHourClick()}
        >
        <span className = 'number'>{formattedHour}</span>
        <span className = 'bg'> {formattedHour}</span>
        </div>
      )
      hour = dateFns.addHours(hour, 1);
    }
    return <div className = 'body'>{hours}</div>
  }

  onHourClick = day =>{
    console.log(day)
  }

// Use addDays function to change the day
//This will pretty much push all the render cell and stuff on top by 1 day
  nextDay = () => {
    this.setState({
      currentDay: dateFns.addDays(this.state.currentDay, 1)
    })
  }

  prevDay = () => {
    this.setState({
      currentDay: dateFns.subDays(this.state.currentDay,1)
    })
  }

  render() {
    return (
      <div className = 'calendar'>
        {this.renderHeader()}
        {this.renderHours()}
        {this.renderCells()}
      </div>
    )
  }
}

export default DayCalendar;
