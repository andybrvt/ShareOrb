import React from 'react';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import '../containers/Container_CSS/EventSync.css'



class PickEventSyncWeek extends React.Component{

  state = {
    active: null
  }

  renderHeader(){
    // This is to render the mini Calendar month givien the date range
    const dateFormat = 'MMMM yyyy'
    const minDate = this.props.minDate
    return(
      <div className = 'header'>
        <div className = 'col-center'>
          <span>
            {dateFns.format(new Date(minDate) , dateFormat)}
          </span>
        </div>
      </div>
    )
  }

  renderDays() {
    // This is just to render out the days in the date range
    const dateFormat = 'iiii'
    const dayFormat = 'd'
    const days = []

    let minDate = dateFns.addDays(new Date(this.props.minDate),1)
    let maxDate = dateFns.addDays(new Date(this.props.maxDate),1)
    console.log(minDate, maxDate)
    console.log(this.props.minDate, this.props.maxDate)

    const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))
    console.log(difference)
    let cloneMinDate = this.props.minDate

    for(let i = 0; i<difference; i++){
        const cloneCloneMinDate = cloneMinDate
        days.push(
          <div
          className = 'syncCol col-center'
          key = {i}
          >
            {dateFns.format(dateFns.addDays(minDate, i), dateFormat)}
            <br />
            {dateFns.format(dateFns.addDays(minDate, i), dayFormat)}
          </div>
        )
        cloneMinDate = dateFns.addDays(cloneMinDate, 1)
    }
    return <div className = 'days row'>{days}</div>
  }

  renderSide() {
    const dateFormat = 'h a'
    const hour = []
    let startHour = dateFns.startOfDay(new Date(this.props.minDate))
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

  renderWeekCell(events){
    console.log(events)
    console.log(events.length)
    // Render the week cell, so what you want to do is pick the first to be the minDate and
    // the last day will be the maxDate
    // You will loop through each hour of each day and then redner through each day of the week
    const minDate = dateFns.addDays(new Date(this.props.minDate),1);
    const maxDate = dateFns.addDays(new Date(this.props.maxDate),1);
    // This will be different from the calendar week calendar in that it doesn't start from the beginning
    // of the week but rather it will start from beginning of the date range
    const hourFormat = 'h a'
    const dayFormat = 'd MMMM'
    // This hour list will hold 24 items, each list will be for each hour of each day 5x24
    const hours = []

     // This list will hold all the events
     let toDoStuff = []
     // This will be a list with teh same hour of all the days
     let days = []
     // You will need the start day and the start hour
     // The start day will be the minDate
     let date = minDate
     console.log(new Date(date))
     const startHourDay = dateFns.startOfDay(date);
     const endHourDay = dateFns.endOfDay(date);

     let formattedDay = '';

     let hour = startHourDay;
     let formattedHour = '';

     // The counter is to give each box a seperate id so that it will highlight when you click on it
     let counter = 0

     const difference = -dateFns.differenceInCalendarDays(new Date(minDate), new Date(maxDate))

     // The plan for the loop is ot have a while loop that loops thorugh each hour of the same day
     // then go down to the next hour then go through all the days

     while (hour <= endHourDay){
       // When adding things to the calendar you have to match the date and the hour

       for (let i = counter; i< (counter+difference); i++){
          const cloneDay = date
          const cloneHour = hour
          formattedHour = dateFns.format(hour, hourFormat)
          formattedDay = dateFns.format(date, dayFormat)
          // This loop will loop thorugh all the events and if the hour and day matches and it will
          // add it to the toDoStuff which will loopp thorugh each each cell then it will be
          // cleared out again
          for (let item = 0; item<events.length; item++){
            // console.log(new Date(events[item].start_time))
            // console.log(new Date(hour))
            // console.log(events[item].start_time)
            if(dateFns.getHours(new Date(events[item].start_time)) === dateFns.getHours(new Date(hour))
              && dateFns.isSameDay(new Date(events[item].start_time), cloneDay)
            ) {toDoStuff.push(
              events[item]
            )}
          }

          // You can always have access to the events, you just got to loop through
          // toDoStruff in the if below if you want to check
          if (toDoStuff.length > 0){
            console.log(toDoStuff)
            days.push(
              <div
                className = 'syncCol nonhourcell disabled'
              >
              </div>
            )
          } else {
            days.push(
              <div
                style = {{background: this.color(i)}}
                className = 'col hourcell'
                onClick = {(e) => this.onDayHourClick(e, i, cloneDay, cloneHour)}
              >
              <span className = 'number'></span>
              </div>
            )
          }
          toDoStuff = []
          date = dateFns.addDays(date, 1)
       }
       // After you loop thorugh the hour, you will want to put that hur into the hour
       // list and then clear out days list ot redo it again then you add in the next hour, then
       // set the start day again to the start of the week then run it throuhg again
       // Remember teh date must be resetted before adding the hour because
       // of the while condition
       hours.push(
         <div className = 'row'>
          {days}
         </div>
       )
       counter = counter + 7
       days = []
       date = minDate
       hour = dateFns.addHours(hour, 1)
     }

     return <div className = 'body'>{hours}</div>
  }

  onDayHourClick = (e,position, day, hour) => {
    if (this.state.active === position){
      this.setState({active: null})
    } else {
      this.setState({active: position})
    }
    console.log(day, hour)
  }

  color = (position) => {
    if (this.state.active === position){
      return 'blue';
    }
    return '';
  }


  render() {
    return (
      <div className = 'eventSyncCalendarContainer'>
        <div className = 'timecol'>
          {this.renderSide()}
        </div>
        <div className = 'calendar'>
          {this.renderHeader()}
          {this.renderDays()}
          {this.renderWeekCell(this.props.filterEvent)}
        </div>
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    minDate: state.eventSync.minDate,
    maxDate: state.eventSync.maxDate,
    filterEvent: state.eventSync.filterEvent
  }
}

const mapDispatchToProps = dispatch => {

}


export default connect(mapStateToProps, mapDispatchToProps)(PickEventSyncWeek);
