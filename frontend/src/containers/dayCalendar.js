import React from 'react';

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
    const dateFormat = "h a..aaa"
    const hours = []

    let startTime = dateFns.startOfHour(this.state.currentDay);
    for(let i = 0; i<24; i++){
      hours.push(
        <div className
      )
    }

  }
// render all the cells
  renderCells() {

  }

  nextDay = () => {

  }

  prevDay = () => {

  }

  render() {
    return (

    )
  }


}

export default DayCalendar;
