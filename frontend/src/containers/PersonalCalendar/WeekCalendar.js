import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { Input,
   Drawer,
    message,
    List,
    Avatar,
    Divider,
    Col,
    Row,
    Tag,
    Button,
    Tooltip,
    Progress,
    DatePicker,
    AvatarGroup,
    notification,
    Popover } from 'antd';
import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import * as navActions from '../../store/actions/nav';
import * as calendarEventActions from '../../store/actions/calendarEvent';
import * as calendarActions from '../../store/actions/calendars';
import * as eventSyncActions from '../../store/actions/eventSync';
import EditEventPopUp from './EditCalEventForms/EditEventPopUp';
import MiniCalendar from './MiniCalendar';
import EventSyncModal from './EventSyncForms/EventSyncModal';
import EventModal from './AddCalEventForms/EventModal';
import CalendarViewDropDown from './CalendarViewDropDown';
import CalendarEventWebSocketInstance from '../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../notificationWebsocket';
import './PersonalCalCSS/NewCalendar.css';
import 'antd/dist/antd.css';
import Liking from '../NewsfeedItems/Liking';
import RemoveEventModal from './EditCalEventForms/RemoveEventModal';
import DetailEditEventForm from './EventPage/DetailEditEventForm';
import CalendarPopOver from './CalendarPopOver.js';
import Animate from 'rc-animate';
import '../SocialCalendarFolder/SocialCalCSS/SocialCalAnim.css';
const { Group } = Avatar

class WeekCalendar extends React.Component{
  // So when ever you do calendars, for states  you always want
  // to set the currentWeek as the current day because, you can use
  // get current week to get the firstday
  constructor(props) {
        super(props)
        this.myRef = React.createRef()
    }
  state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    events: [],
    activeX: null,
    activeY: null,
    showAddEventModal: false,
    animate:true,
  }
  scrollToMyRef = (ref) => {
    if(ref){
    ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }






  onDayHourClick = (positionX, positionY) => {

    if (this.state.activeX==positionX && this.state.activeY === positionY){
      this.setState({
        activeX: null,
        activeY: null,
        selectedDate: null
      })
    } else {
      this.setState({
        activeX: positionX,
        activeY: positionY,

      })
    }

  }

  color = (positionX, positionY) => {
    // Just the color of the selected time on the pick event sync calendar
    if (this.state.activeX === positionX &&this.state.activeY === positionY){
      return '#91d5ff';
    }
    if(this.state.activeX === positionX && this.state.activeY === positionY-1){
      return '#91d5ff';
    }
    return '';
  }
  componentDidMount(){
    //I will be pulling the first day of the week to set the week
    const selectedYear = this.props.parameter.year;
    const selectedMonth = this.props.parameter.month;
    // This will pretty much be the first day of the week
    const startWeekDay = this.props.parameter.day;
    // this is just to put things in a format so we can get the date working
    const newWeek = [selectedYear, selectedMonth, startWeekDay]
    const newSelectedDate = new Date(newWeek)
    this.props.getSelectedDate(newSelectedDate)
    // you want to call the events from the redux instead of the states
    this.props.getEvents()
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    console.log("hello")
    if(this.messagesEnd){
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    }
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }


  componentWillReceiveProps(newProps){
    console.log(this.props.currentDate, newProps.currentDate)
    // you bascially want to check if the date in props and the date in
    // the url is the safe, if they are not --> you gotta change it
    // We would use new props here is because when you go to the nextWeek
    // or previous week the props changes
    if (this.props.currentDate !== newProps.currentDate) {
      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      const day = dateFns.getDate(newProps.currentDate)
      this.props.history.push('/personalcalendar/w/'+year+'/'+(month+1)+'/'+day)
    }
  }



  // This will be rending the header of the view, for weekly view, it will be
  // the start week to the end of the start week and start of the week
  renderHeader() {
    const dateFormat = 'MMMM yyyy'
    const startWeek = dateFns.startOfWeek(this.props.currentDate)
    const endWeek = dateFns.endOfWeek(this.props.currentDate)
    return(

      <div className = 'header'>
        <div className = 'arrowLeft'>
          <div className = 'icon' onClick = {this.prevWeek}>
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-left"></i>
          </div>
        </div>
        <div className = 'midText'>
          <span>
            {dateFns.format(startWeek, dateFormat)}
          </span>
        </div>
        <div className = 'arrowRight' onClick = {this.nextWeek}>
          <div className = 'icon'>
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-right"></i>
          </div>
        </div>
      </div>
    )
  }



  // This is to render the days on top (like Mon, tuesday etc)
  renderDays(){
    // so iiii format actually renders the name of the day
    const dateFormat = 'iii'
    const dayFormat = 'd'
    const days = []

    let startDate = dateFns.startOfWeek(this.props.currentDate)
    let cloneStartDate = dateFns.startOfWeek(this.props.currentDate)
    for (let i = 0; i<7; i++){
      const cloneCloneStartDate = cloneStartDate
      days.push(
        <div
        className = {`weekcol
          ${dateFns.isSameDay(cloneCloneStartDate, new Date()) ? 'cellBorder' : ''} `}
        key = {i}

        >
          <span class="weekShortDay">
            {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          </span>
          <br />
          <span className="weekDayNum">
            <span class="weekDayHover" onClick = {() => this.onDateClick(cloneCloneStartDate)}>
              {dateFns.format(dateFns.addDays(startDate, i), dayFormat)}
            </span>
          </span>
        </div>
      )
      cloneStartDate = dateFns.addDays(cloneStartDate, 1)
    };

    return (
      <div className = 'weekDays'>
      {days}
      </div>
      )
  }

  // This is to show the time on the side instead of in each box
  // It is too cluttered

  renderSide() {
    const dateFormat = 'h a'
    const hour = []
    let startHour = dateFns.addHours(dateFns.startOfDay(this.props.currentDate),1)
    for (let i = 0; i<23; i++){
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
      {
        (i==7)?
        <div>
          <div style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        :
          <div></div>
      }
    }
    return <div className= 'sideTime'> {hour} </div>
  }


  // USE THIS
  renderWeekCell(events){
    console.log(events)
    // To explain the grid --> there is a big container that holds many rows and each
    // row is split into 7 columns and 2 rows and there is 24 rows and you will place the
    // information
    // So what you wanted to do for this is that you will make a list of lsit
    // so the first list is the list of the same hour for multiple day so it
    // will be a list of 7 items of all the same time, and the big list will have
    // 24 items
    const currentWeek = this.state.currentWeek;
    const selectedDate = this.props.currentDate;
    // this will give you the first day of the week
    const weekStart = dateFns.startOfWeek(selectedDate);
    const weekEnd = dateFns.endOfWeek(selectedDate);

    const hourFormat = 'h a'
    const dayFormat = 'd MMMM'
    // So this list will hold 24 items, each list for each hour
    const hours = []
    const borderHolder = []
    let border = []
    // this list will hold all the events
    let toDoStuff = []
    // This will be the list of events that will render in the weekBody
    // And then you can sort it out in the weekBody using the index
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
    // Day difference is to see how long the week days are
    const dayDifference = dateFns.differenceInDays(weekEnd, weekStart)+1
  // So the plan for the week is to make one big container that is 7x24
  // and to loop through each day by doing a while loop that runs through each day
  // and in each day it will run through each hour, basically what we do is that if the events fit in
  // to the range of time then we put the events into that one container and then use index to just figure out
  // where to place them
  // The way I will track the event is by having a time "index" running as the loop is running

  for (let dayIndex = 0; dayIndex < 7; dayIndex++){

    for (let hourIndex = 0; hourIndex< 48; hourIndex++){


        const clonedayIndex = dayIndex
        const cloneHourIndex = hourIndex
        const cloneDay = date
        const cloneHour = hour
      for(let item = 0; item < events.length;item ++){

        // Each event will be added in if it falls within the certain time or hour that
        // is looped through, and when you loop through, there will be an index that will be
        // associated with that area so then you would use that index to place where the item is
        const startDate = new Date(events[item].start_time)
        const endDate = new Date(events[item].end_time)

        // DONT NEED TO USE THIS
        // const utcStart = dateFns.addHours(startDate, startDate.getTimezoneOffset()/60)
        // const utcEnd = dateFns.addHours(endDate, endDate.getTimezoneOffset()/60)

        // This will be for the reoccuring events that happens weekly, monthly and yearly
        // and since from now on each event will have a assocated occurancd type, we can use
        // that to decided where the event can go. We will be using the format day to get out
        // the day of the week of the current day and of the event and then try to just match it but
        // this time, any days that have similar day of the week, you will just add that day in,
        // it is like you are repeating it

        if (events[item].repeatCondition === 'weekly'){
          // This will be the day of the week (0-6)
          const eventDayWeek = dateFns.getDay(startDate);
          const cloneDayWeek = dateFns.getDay(cloneDay);
          const eventDayHour = dateFns.getHours(startDate);
          const cloneDayHour = dateFns.getHours(cloneHour);
          const eventDayMinute = dateFns.getMinutes(startDate);
          const cloneDayMinute = dateFns.getMinutes(cloneHour);

          console.log(eventDayWeek)

          if (eventDayWeek === cloneDayWeek
          && eventDayHour === cloneDayHour
          && eventDayMinute === cloneDayMinute
        ){
          console.log(eventDayWeek, cloneDayWeek)
          // This if statement has to do more with events that span ususally one day or within
          // one week

            // So unlike the previous week calendar, we do not need to have a box on every grid
            // we just need to have all the events that fall into that week on that week and then with the
            // index we can start rearragning the events in that week calendar
            toDoStuff.push(
              events[item]
            )
          }
        //   if(dateFns.isAfter(cloneDay, startDate) && dateFns.isBefore(cloneDay, endDate)
        //   && dateFns.isSameDay(cloneDay, dateFns.startOfWeek(cloneDay))
        //   && dateFns.getHours(startDate) === dateFns.getHours(cloneHour)
        //   && dateFns.getMinutes(startDate) === dateFns.getMinutes(cloneHour)
        // ){
        //   console.log(cloneHour, endDate)
        //
        //   // This if statement has more to do with the events that span multiple days
        //     toDoStuff.push(
        //       events[item]
        //     )
        //   }


      } else if (events[item].repeatCondition === 'daily'){
        const eventDayHour = dateFns.getHours(startDate);
        const cloneDayHour = dateFns.getHours(cloneHour);
        const eventDayMinute = dateFns.getMinutes(startDate);
        const cloneDayMinute = dateFns.getMinutes(cloneHour);

      if (eventDayHour === cloneDayHour
        && eventDayMinute === cloneDayMinute
      ) {
        toDoStuff.push(
          events[item]
        )
      }



      } else if(events[item].repeatCondition === 'none'){
              if (dateFns.isSameDay(startDate,cloneDay) && dateFns.isSameHour(startDate,cloneHour)
              && dateFns.isSameMinute(startDate, cloneHour)
            ){
              // This if statement has to do more with events that span ususally one day or within
              // one week

                // So unlike the previous week calendar, we do not need to have a box on every grid
                // we just need to have all the events that fall into that week on that week and then with the
                // index we can start rearragning the events in that week calendar
                toDoStuff.push(
                  events[item]
                )
              }if(dateFns.isAfter(cloneDay, startDate) && dateFns.isBefore(cloneDay, endDate)
              && dateFns.isSameDay(cloneDay, dateFns.startOfWeek(cloneDay))
              && dateFns.getHours(startDate) === dateFns.getHours(cloneHour)
              && dateFns.getMinutes(startDate) === dateFns.getMinutes(cloneHour)
            ){
              console.log(cloneHour, endDate)

              // This if statement has more to do with the events that span multiple days
                toDoStuff.push(
                  events[item]
                )
              }

        }



      }

        if (toDoStuff.length > 0){
          // This one is to render each of the events (like the event boxes)
          // So since this is a "list" for a grid--> so you would sort the events
          // out in the weekBody

          // The day index represents the start column and the hour index represent the start row
          let startDate = dateFns.startOfWeek(this.props.currentDate)
          console.log(toDoStuff)
          const text = "You're host"
          days.push(

            toDoStuff.map(item =>  (

              <CalendarPopOver
                orientation="right"
                item={item}
                date={date}
                dayIndex={dayIndex}
                cloneHourIndex={cloneHourIndex}
                cloneDay={cloneDay} {...this.props}/>
            ))


          )
        }

      console.log(days)


        border.push(
          <Popover trigger="click"  placement="right" onClick = {() => this.addEventClick(cloneDay, cloneHour)}  content={<div>
            <EditEventPopUp
            isVisible = {this.props.showModal}
            close = {() => this.props.closeModal()}
            dayNum={dateFns.format(cloneDay, 'd')}

            />
            </div>}>


            <div
            style={{background: this.color(dayIndex, hourIndex)}}
            onClick = {(e) => this.onDayHourClick(dayIndex, hourIndex)}
            className = {`backWeekCol ${hourIndex % 2 === 0 ? 'hourcellT' : 'hourcellB' }` }
            >
            </div>


              </Popover>

        )
        toDoStuff =[]
        hour = dateFns.addMinutes(hour, 30)

      }
      // borderHolder.push(
      //   <div className = ''>
      //   {border}
      //   </div>
      // )
      // border = []
      date = dateFns.addDays(date, 1)

    }

    return(
      <div className = 'scrollBody'>
      <div className = 'backWeekBody'>
      {border}
      </div>
      <div className= 'weekBody'>
          {days}
      </div>
      </div>
    )


  }

  addEventClick = (day, hour) => {
    console.log(day, hour)
    // So we will be using the edit modal to add a new event in
    // but because it requres certain objects we need to have a
    // dicitonary that holds those specitic attribute so that we can
    //  meet those requirements
    // We only need the start and end time tho so all the other fields can
    // be empty
    let endDate = ''
    const specificHour = dateFns.getHours(hour)
    const specificMinute = dateFns.getMinutes(hour)
    const startDate = dateFns.addHours (day, specificHour)
    const newStartDate = dateFns.addMinutes(startDate, specificMinute)
    console.log(dateFns.getHours(newStartDate));
    if (dateFns.getHours(newStartDate) === 23 && dateFns.getMinutes(newStartDate) === 30){
      endDate = dateFns.addMinutes(newStartDate, 30);
    } else {
      endDate = dateFns.addHours(newStartDate, 1);
    }

    const finalStart = dateFns.format(newStartDate, 'yyyy-MM-dd HH:mm:ss')
    const finalEnd = dateFns.format(endDate, 'yyyy-MM-dd HH:mm:ss')
    console.log(specificHour, specificMinute)
    if(specificMinute==0){
      console.log("made it")
      this.setState({
        selectCondition:true,
      });
    }
    console.log(this.state.selectCondition)
    const subInEvent = {
      addEvent: true,
      title: '',
      content: '',
      start_time: finalStart,
      end_time: finalEnd,
      location: '',
      color: '#1890ff',
      calendarId: ''
    }
    console.log(subInEvent)
    this.props.openModal(subInEvent)

  }







  // this is a onclick function that goes to the next week
  nextWeek =() =>{
    this.setState({
      animate: !this.state.animate,
    });
    this.props.nextWeek()
  }


  // onClick function that goes to the prvious week
  prevWeek = () => {
    this.setState({
      animate: !this.state.animate,
    });
    console.log(this.state.animate)
    this.props.prevWeek()
  }

  onYearClick = () => {
    const selectYear = dateFns.getYear(this.props.currentDate).toString()
    this.props.history.push('/personalcalendar/'+selectYear)
  }

  onMonthClick = () => {
    const selectYear = dateFns.getYear(this.props.currentDate).toString()
    const selectMonth = (dateFns.getMonth(this.props.currentDate)+1).toString()
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onDateClick = day => {
    const selectYear = dateFns.getYear(day).toString()
    const selectMonth = (dateFns.getMonth(day)+1).toString()
    const selectDay = dateFns.getDate(day).toString()
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onAddEvent = () => {
    this.props.openDrawer()
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }








  render() {
    console.log(this.props)
    console.log(this.props.id)
    console.log(Avatar)

    return (
    <div className = 'calendarContainer'>

      <div className = 'mainCalContainer'>
          <div className = 'weekCalendar'>

            <div className = "topHeaderCal">
              {this.renderHeader()}
              <CalendarViewDropDown
                calType = "week"
                history = {this.props.history}
                matchPara = {this.props.parameter} />
            </div>

            {this.renderDays()}


          </div>

          <div className = "scrollCalContent">
            {/*window.scrollTo(0, 800)*/}
          <div className = 'weekDayFlex-Container'>
            <div className = 'timecol'>

              {this.renderSide()}
            </div>
            <Animate
              className = 'calendar'
              showProp="show"
              transitionName="fade"
            >
              <div >
                {this.renderWeekCell(this.props.events)}
              </div>
            </Animate>

          </div>
          </div>

          <EventModal visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />

      </div>


      <div className = 'miniCalContainer'>
            <Button
              type="primary"
              className = 'weekCreateEvent'
              onClick = {this.onAddEvent}>
              Create Event
            </Button>
            <MiniCalendar {...this.props}/>
            <Button
              style={{marginTop:'40px'}}
              type = 'primary'
              className = 'miniEventSyncButton'
              onClick = {this.openEventSyncModal}>
                Event Sync
            </Button>
      </div>


          <EventSyncModal
          {...this.props}
          isVisble = {this.props.showEventSyncModal}
          close = {() => this.props.closeEventSyncModal()}
          />

          <RemoveEventModal
          visible = {this.props.showDeleteModal}
          close = {this.props.closeEventDeleteModal}
          item = {this.props.deleteEventId}
          user = {this.props.id}
          />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return{
    showDrawer: state.nav.showPopup,
    showModal: state.calendarEvent.showModal,
    currentDate: state.calendar.date,
    events: state.calendar.events,
    showEventSyncModal: state.eventSync.showEventSyncModal,
    id: state.auth.id,
    showDeleteModal: state.calendarEvent.showDeleteModal,
    deleteEventId: state.calendarEvent.deleteEventId,

  }
}

// The get selected date action will get the date based on the url
const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextWeek: () => dispatch(calendarActions.nextWeek()),
    prevWeek: () => dispatch(calendarActions.prevWeek()),
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    openEventSyncModal: () => dispatch(eventSyncActions.openEventSyncModal()),
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal()),
    openEventDeleteModal: (eventId) => dispatch(calendarEventActions.openEventDeleteModal(eventId)),
    closeEventDeleteModal: () => dispatch(calendarEventActions.closeEventDeleteModal()),
    deleteEvent: (eventId) => dispatch(calendarActions.deleteEvents(eventId))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekCalendar);
