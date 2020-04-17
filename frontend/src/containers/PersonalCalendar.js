import React from 'react';
import * as dateFns from 'date-fns';
import './Container_CSS/NewCalendar.css';
import axios from 'axios';
import { authAxios } from '../components/util';
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import EventDrawer from '../containers/EventDrawer.js';
import * as navActions from '../store/actions/nav'
import { connect } from 'react-redux';
import  { Redirect } from 'react-router-dom';


class PersonalCalendar extends React.Component{
// new Date is form DateFns and it give you the current date and month
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


  componentWillReceiveProps(newProps){
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
           {dateFns.format(this.state.currentMonth, dateFormat)}
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
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
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

  renderCells(events) {

    // startOfMonth() will give you the date of the first day of the current month
    // endOfMonth() will give you the date of the last day of the current month
    // the const start date is to fill in the days of the week of the previous month
    // similarly as the end date
    const {currentMonth, selectedDate} = this.state
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    console.log(startDate)
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
              : dateFns.isSameDay(day, selectedDate) ?
            "selected": ""
              }`}
              key = {day}
              onClick = { () =>
            this.onDateClick(cloneDay)}
            >
            <span className = "number">{formattedDate}</span>
            <span className = "bg"> {formattedDate}</span>
            <ul>
              {toDoStuff.map(item => (
                <li key={item.content}>
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        )} else {days.push(
          <div
            className ={`col cell ${!dateFns.isSameMonth(day,monthStart) ? "disabled"
            : dateFns.isSameDay(day, selectedDate) ?
          "selected": ""
            }`}
            key = {day}
            onClick = { () =>
          this.onDateClick(cloneDay)}
          >
          <span className = "number">{formattedDate}</span>
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
    this.setState(
      {
        selectedDate:day
      }
    )
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }


  // You can use the addMonths function to add one month to the
  // current month
  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  }

  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    })
  }


  render(){
    // className is to determine the style

    return(
      <div>
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

      <div className = 'calendar'>
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells(this.state.events)}
      </div>

      </div>
    )
  }
}


const mapStateToProps = state => {
  return{
    showDrawer: state.nav.showPopup,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup())
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(PersonalCalendar);
