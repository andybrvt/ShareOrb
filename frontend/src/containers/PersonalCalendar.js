import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import EventDrawer from '../containers/EventDrawer.js';
import * as navActions from '../store/actions/nav'
import * as calendarEventActions from '../store/actions/calendarEvent'
import { connect } from 'react-redux';
import  { Redirect } from 'react-router-dom';
import AddEventPopUp from '../components/AddEventPopUp';


class PersonalCalendar extends React.Component{
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
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    const newDate = [selectedYear, selectedMonth]
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
    const newDate = [selectedYear, selectedMonth]
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
            chevron_left
          </div>
        </div>
        <div className = "col col-center">
          <span>
           {dateFns.format(this.state.selectedDate, dateFormat)}
          </span>
        </div>
        <div className= "col col-end" onClick = {this.nextMonth}>
          <div className = "icon"> chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "iiii"
    const days = []
    // this will get the date of the first week given the date of the current month
    let startDate = dateFns.startOfWeek(this.state.selectedDate);
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

  renderSide() {
    // So what you want is to get the date of the first day of each week
    // so that you can pass it into the tab so it can open up the selected week
    const {currentMonth, selectedDate} = this.state;
    const startDateMonth = dateFns.startOfMonth(selectedDate);
    const endDateMonth = dateFns.endOfMonth(selectedDate);
    // this will give us the first day of the week fo the month
    const startFirstWeek = dateFns.startOfWeek(startDateMonth);
    // this will give us the first day of the week of the last week in the chart
    const startLastWeek = dateFns.startOfWeek(endDateMonth);
    console.log(startLastWeek);
    // because the strt of first week changes with the loop we have to save it as
    // let
    let date = startFirstWeek;
    let formattedWeek = '';
    const weekFormat = 'dd mmmm yyyy'
    // this is to store all the tabs to click on
    const week = []
    while (date <= startLastWeek){
      formattedWeek = dateFns.format(date, weekFormat)
      const cloneDate = date
      week.push(
        <div className = 'holder'>
        <div
        onClick = {() => this.onWeekClick(cloneDate)}
        className = 'tabs'
        >
          <span></span>
        </div>
        </div>
      )
      date = dateFns.addWeeks(date, 1)
    }
    console.log(week)
    return <div className ='sideBar'> {week} </div>
  }





  renderCells(events) {

    // startOfMonth() will give you the date of the first day of the current month
    // endOfMonth() will give you the date of the last day of the current month
    // the const start date is to fill in the days of the week of the previous month
    // similarly as the end date
    const {currentMonth, selectedDate} = this.state;
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
          if (dateFns.isSameDay(new Date(events[item].start_time), day)){
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
        if (toDoStuff.length > 0){days.push(
            <div
              className ={`col cell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
              : dateFns.isSameDay(day, currentMonth) ?
            "selected": ""
              }`}
              key = {day}
            >
            <div className = 'circle' onClick = { () =>
              this.onDateClick(cloneDay)}>
              <span className = "number">{formattedDate}</span>
            </div>
            <span className = "bg"> {formattedDate}</span>
            <ul>
              {toDoStuff.map(item => (
                <li key={item.content}>
                  <span onClick = {this.onClickItem}> {item.content} </span>
                </li>
              ))}
            </ul>
          </div>
        )} else {days.push(
          <div
            className ={`col cell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
            : dateFns.isSameDay(day, currentMonth) ?
          "selected": ""
            }`}
            key = {day}
          >
          <div className = 'circle' onClick = { () =>
            this.onDateClick(cloneDay)}>
          <span className = "number">{formattedDate}</span>
          </div>
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
    console.log(day)
    const selectYear = dateFns.getYear(day).toString()
    const selectMonth = (dateFns.getMonth(day)+1).toString()
    const selectDay = dateFns.getDate(day).toString()
    console.log(selectYear, selectMonth,selectDay)
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

// So what are going to do with this is get the selected month and get the first day of the
// month and then get the first day of the week and loop through it till you get the first day
// of the week for the end of the month

  onWeekClick = startDayWeek => {
    console.log(startDayWeek)
    const selectedYear = dateFns.getYear(startDayWeek).toString()
    const selectedMonth = (dateFns.getMonth(startDayWeek)+1).toString()
    const selectedDay = dateFns.getDate(startDayWeek).toString()
    console.log(selectedYear, selectedMonth, selectedDay)
    this.setState({
      selectedDate: startDayWeek
    })
    this.props.history.push('/personalcalendar/w/'+selectedYear+'/'+selectedMonth+'/'+selectedDay)
  }



  // You can use the addMonths function to add one month to the
  // current month
  nextMonth = () => {
    this.setState({
      selectedDate: dateFns.addMonths(this.state.selectedDate, 1)
    });
  }

  prevMonth = () => {
    this.setState({
      selectedDate: dateFns.subMonths(this.state.selectedDate, 1)
    })
  }

  onClickItem = () =>{
    this.props.openModal()
  }


  render(){
    // className is to determine the style
    console.log(this.state)
    return(
      <div>
        <AddEventPopUp
        isVisible = {this.props.showModal}
        close = {() => this.props.closeModal()}

        />
            <List
              dataSource={[
                {
                  name: 'Box to add event',
                },

              ]}
              bordered
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <a onClick={() => this.props.openDrawer()} key={`a-${item.id}`}>
                      Add event
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
                    }
                    title={<a href="https://ant.design/index-cn">{item.name}</a>}
                    description="Click on the [Add event] text! "
                  />
                </List.Item>
              )}
            />

          <EventDrawer visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
        <div className = 'flex-container'>
          <div className = 'sidecol'>
          {this.renderSide()}
          </div>
          <div className = 'calendar'>
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells(this.state.events)}
          </div>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return{
    showDrawer: state.nav.showPopup,
    showModal: state.calendarEvent.showModal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: () => dispatch(calendarEventActions.openEventModal()),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonalCalendar);
