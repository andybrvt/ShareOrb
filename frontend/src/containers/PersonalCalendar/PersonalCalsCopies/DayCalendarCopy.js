// import React from 'react';
// import * as dateFns from 'date-fns';
// import axios from 'axios';
// import { authAxios } from '../components/util';
// import { Button, Tooltip } from 'antd';
// import './Container_CSS/NewCalendar.css';
// import { connect } from 'react-redux';
// import EditEventPopUp from '../components/EditEventPopUp';
// import * as navActions from '../store/actions/nav'
// import * as calendarEventActions from '../store/actions/calendarEvent';
// import * as calendarActions from '../store/actions/calendars';

// import MiniCalendar from '../components/MiniCalendar';
//
//
//
//
// class DayCalendar extends React.Component{
//   state ={
//       currentDay: new Date(),
//       selectedDate: new Date(),
//       events: [],
//   }
//
//   componentDidMount(){
//     const selectedYear = this.props.match.params.year;
//     const selectedMonth = this.props.match.params.month;
//     const selectedDay = this.props.match.params.day;
//     const newDate = [selectedYear, selectedMonth, selectedDay]
//     const newsSelectedDate = new Date(newDate)
//     this.props.getSelectedDate(newsSelectedDate)
//     this.props.getEvents()
//   }
//
//
//   componentWillReceiveProps(newProps){
//     if (this.props.currentDate !== newProps.currentDate){
//       const year = dateFns.getYear(newProps.currentDate)
//       const month = dateFns.getMonth(newProps.currentDate)
//       const day = dateFns.getDate(newProps.currentDate)
//       this.props.history.push('/personalcalendar/'+year+'/'+(month+1)+'/'+day)
//     }
//   }
//
// // render the date on top
//   renderHeader(){
//     const dateFormat = 'iiii MMMM dd, yyyy'
//
//     return (
//       <div className = 'header row flex-middle'>
//         <div className = 'col col-start'>
//           <div className = "icon" onClick = {this.prevDay}>
//           <i className= 'arrow arrow-left'></i>
//           </div>
//         </div>
//         <div className = "col col-center">
//           <span>
//             {dateFns.format(this.props.currentDate, dateFormat)}
//           </span>
//         </div>
//         <div className = "col col-end" onClick = {this.nextDay}>
//           <div className = "icon">
//           <i className = 'arrow arrow-right'></i>
//           </div>
//         </div>
//       </div>
//     );
//   }
// // render the time on the side
//   renderHours() {
//     // this format is to render it by hour and am pm
//     // the hours will store the divs
//     const dateFormat = "h a"
//     const hours = []
//
//     // starttime will be the start of the day where the time is 00:00
//     // then you will loop by 0-23 and add hours accordingly
//     let startTime = dateFns.startOfDay(this.props.currentDate);
//     for(let i = 0; i<24; i++){
//       hours.push(
//         <div className = 'sidecell' key = {i}>
//         </div>
//       )
//     }
//     // render it our but you have to fix the css
//     return <div className = 'sidepanel'>{hours}</div>
//   }
//
// // render all the hour cell within each day
//   renderCells(events) {
//     const currentDay = this.state.currentDay
//     const selectedDate = this.props.currentDate
//     const startHourDay = dateFns.startOfDay(selectedDate)
//     const endHourDay = dateFns.endOfDay(selectedDate)
//
//     // So you have the current day and the selected day
//     // The you get the day, and then you get the first hour of that day
//      // You will do the same with the endHourDay
//      // You will want to loop through all the hours of that day starting with
//      // startHourDay and ending with endHourDay
//
//     let toDoStuff = []
//     const hourFormat = "h a"
//     // Since there will only be the hours we wont be need a row list
//     let hours = [];
//     // Start of the hour and then loop through all the 24 hours
//     let hour = startHourDay;
//     let formattedHour = "";
//     // they are the same time because when you do a new date it goes on the GM time
//
//     // Hour is in a date format with the day and time and it will go till the
//     // Same day(endHourday) but till the last sec of the day
//     // Since we are not doing a list of list and there is just days we do not
//     // need the while statment, just a list
//     for (let i = 0; i<24; i++){
//       formattedHour = dateFns.format(hour, hourFormat)
//       for(let item = 0; item < events.length; item ++){
//         const date = new Date(events[item].start_time)
//         const utc = dateFns.addHours(date, date.getTimezoneOffset()/60)
//         if (dateFns.isSameHour(utc, hour)
//             && dateFns.isSameDay(utc, hour) ){
//           toDoStuff.push(
//             events[item]
//           )
//         }
//       }
//
//       const cloneHour = hour
//       const cloneToDoStuff = toDoStuff
//       if (toDoStuff.length > 0){
//         hours.push(
//           <div
//             className = 'daycell'
//             key = {hour}
//           >
//           <div className = 'uppertab'>
//             <span className = 'number'>{formattedHour}</span>
//           </div>
//           <span className = 'bg'> {formattedHour}</span>
//           <ul className = 'monthList'>
//             {toDoStuff.map(item => (
//               <li key={item.content} className = 'monthListItem'>
//               <div onClick = {() => this.onClickItem(item)}>
//               <span className = ''> {dateFns.format(dateFns.addHours(new Date(item.start_time),new Date(item.start_time).getTimezoneOffset()/60),
//                  'ha')}</span>
//               <span className = ' ' > {item.content} </span>
//               </div>
//               </li>
//             ))}
//           </ul>
//           </div>
//         )} else {
//         hours.push(
//           <div
//             className = 'daycell'
//             key = {hour}
//           >
//           <span className = 'number'>{formattedHour}</span>
//           <span className = 'bg'> {formattedHour}</span>
//           </div>
//         )}
//       toDoStuff = []
//       hour = dateFns.addHours(hour, 1);
//     }
//     return <div className = 'body'>{hours}</div>
//   }
//
//   onHourClick = (day,events) =>{
//     console.log(day)
//     console.log(events)
//   }
//
// // Use addDays function to change the day
// //This will pretty much push all the render cell and stuff on top by 1 day
//   nextDay = () => {
//     this.props.nextDay()
//   }
//
//   prevDay = () => {
//     this.props.prevDay()
//   }
//
//   onMonthClick = () => {
//     const selectYear = dateFns.getYear(this.props.currentDate).toString()
//     const selectMonth = (dateFns.getMonth(this.props.currentDate)+1).toString()
//     this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
//   }
//
//   onWeekClick = () => {
//     const week = dateFns.startOfWeek(this.props.currentDate)
//     const selectYear = dateFns.getYear(week).toString()
//     const selectMonth = (dateFns.getMonth(week)+1).toString()
//     const selectDay = dateFns.getDate(week).toString()
//     this.props.history.push('/personalcalendar/w/'+selectYear+'/'+selectMonth+'/'+selectDay)
//   }
//
//   onClickItem = oneEvent =>{
//     this.props.openModal(oneEvent)
//   }
//
//   onOpenEvent = () => {
//     this.props.openDrawer()
//   }
//
//   onYearClick = () => {
//     const selectYear = this.props.match.params.year
//     this.props.history.push('/personalcalendar/'+selectYear)
//   }
//
//   render() {
//     console.log(this.props)
//     return (
//       <div className = 'calendarContainer'>
//         <div className = 'miniCalContainer'>
//           <MiniCalendar {...this.props}/>
//         </div>
//         <div className ='mainCalContainer'>
//           <div className = 'flex-container'>
//             <div className = 'calendar'>
//             <EditEventPopUp
//             isVisible = {this.props.showModal}
//             close = {() => this.props.closeModal()}
//             />
//               <Button type="primary" shape="circle" onClick = {this.onYearClick}>
//               Y
//               </Button>
//               <Button type="primary" shape="circle" onClick = {this.onMonthClick}>
//               M
//               </Button>
//               <Button type="primary" shape="circle" onClick = {this.onWeekClick}>
//               W
//               </Button>
//               <Button type="primary" onClick = {this.onOpenEvent} >
//                 Add event
//               </Button>
//               <EventDrawer visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
//               {this.renderHeader()}
//               {this.renderHours()}
//               {this.renderCells(this.props.events)}
//               </div>
//             </div>
//           </div>
//       </div>
//     )
//   }
// }
//
// const mapStateToProps = state => {
//   return{
//     showDrawer: state.nav.showPopup,
//     showModal: state.calendarEvent.showModal,
//     currentDate: state.calendar.date,
//     events: state.calendar.events
//   }
// }
//
// const mapDispatchToProps = dispatch => {
//   return {
//     closeDrawer: () => dispatch(navActions.closePopup()),
//     openDrawer: () => dispatch(navActions.openPopup()),
//     openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
//     closeModal: () => dispatch(calendarEventActions.closeEventModal()),
//     getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
//     nextDay: () => dispatch(calendarActions.nextDay()),
//     prevDay: () => dispatch(calendarActions.prevDay()),
//     getEvents: () => dispatch(calendarActions.getUserEvents())
//   }
// }
//
// export default connect(mapStateToProps,mapDispatchToProps) (DayCalendar);
