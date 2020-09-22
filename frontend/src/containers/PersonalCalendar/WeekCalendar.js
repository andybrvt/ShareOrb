import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { Input, Drawer, List, Avatar, Divider, Col, Row, Tag, Button, Tooltip, Progress, DatePicker, AvatarGroup, Popover } from 'antd';
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
import './PersonalCalCSS/NewCalendar.css';
import 'antd/dist/antd.css';



const { Group } = Avatar

class WeekCalendar extends React.Component{
  // So when ever you do calendars, for states  you always want
  // to set the currentWeek as the current day because, you can use
  // get current week to get the firstday
  state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    events: [],
    activeX: null,
    activeY: null,
  }

  onProfileClick = (username) => {
    console.log(username)
    if (username === this.props.currentUser){
      window.location.href = 'current-user/'
    } else {
      window.location.href = 'explore/'+username
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
    if (this.state.activeX==positionX &&this.state.activeY === positionY){
      return '#91d5ff';
    }
    return '';
  }
  componentDidMount(){
    //I will be pulling the first day of the week to set the week
    const selectedYear = this.props.match.params.year;
    const selectedMonth = this.props.match.params.month;
    // This will pretty much be the first day of the week
    const startWeekDay = this.props.match.params.day;
    // this is just to put things in a format so we can get the date working
    const newWeek = [selectedYear, selectedMonth, startWeekDay]
    const newSelectedDate = new Date(newWeek)
    this.props.getSelectedDate(newSelectedDate)
    // you want to call the events from the redux instead of the states
    this.props.getEvents()

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
    const dateFormat = 'MMMM, yyyy'
    const startWeek = dateFns.startOfWeek(this.props.currentDate)
    const endWeek = dateFns.endOfWeek(this.props.currentDate)
    return(
      <div className = 'header row flex-middle'>
        <div className = 'col col-start'>
          <div className = 'icon' onClick = {this.prevWeek}>
            <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = 'col col-center'>
          <span>
            {dateFns.format(startWeek, dateFormat)}
          </span>
        </div>
        <div className = 'col col-end' onClick = {this.nextWeek}>
          <div className = 'icon'>
            <i className = 'arrow arrow-right'></i>
          </div>
        </div>
      </div>
    )
  }



  // This is to render the days on top (like Mon, tuesday etc)
  renderDays(){
    // so iiii format actually renders the name of the day
    const dateFormat = 'iiii'
    const dayFormat = 'd'
    const days = []

    let startDate = dateFns.startOfWeek(this.props.currentDate)
    let cloneStartDate = dateFns.startOfWeek(this.props.currentDate)
    for (let i = 0; i<7; i++){
      const cloneCloneStartDate = cloneStartDate
      days.push(
        <div
        className = {`weekcol col-center
          ${dateFns.isSameDay(cloneCloneStartDate, new Date()) ? 'cellBorder' : ''} `}
        key = {i}
        onClick = {() => this.onDateClick(cloneCloneStartDate)}
        >
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
          <br />
          {dateFns.format(dateFns.addDays(startDate, i), dayFormat)}
        </div>
      )
      cloneStartDate = dateFns.addDays(cloneStartDate, 1)
    };

    return (
      <div className = 'weekDays row'>
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
    }
    return <div className= 'body'> {hour} </div>
  }


  // USE THIS
  renderWeekCell(events){
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
        const dayDay = date
        const hourHour = hour
        const clonedayIndex = dayIndex
        const clonehourIndex = hourIndex
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

          days.push(

            toDoStuff.map(item => (

              <Popover placement="right"  content={
                <div style={{padding:15}}>
                  <p style={{display:'inline-block'}}>

                  </p>

                   <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> event</Tag>

                  <span style={{fontSize:'20px', color:'black'}}>
                  {
                    (item.title.length>25)?
                    <p style={{display:'inline-block'}}>{item.title.substring(0,25)}...</p>

                    :
                    <p style={{display:'inline-block'}}>
                      {item.title.substring(0,25)}
                    </p>
                  }


                  </span>








                  <p style={{marginTop:'5px', fontSize:'14px'}}>
                    <i style={{marginRight:'10px'}} class="far fa-calendar-alt"></i>
                    {dateFns.format(new Date(item.start_time), 'M')}/

                    {dateFns.format(new Date(item.start_time), 'd')}
                    <span>
                      &nbsp;
                      {dateFns.format(cloneDay, 'iiii')}
                      &nbsp;
                    </span>
                    <span >
                      @
                      &nbsp;
                    </span>
                    <span>
                      {dateFns.format(new Date(item.start_time),'h:mm a')}
                      -
                      {dateFns.format(new Date(item.end_time),'h:mm a')}
                    </span>
                  </p>


                  <Divider style={{marginTop:'-1px', marginBottom:'-1px'}}/>
                   <Avatar
                     shape="square"
                     size={45}
                     src={'http://127.0.0.1:8000'+item.person[0].profile_picture}
                     style={{display:'inline-block'}}
                    />

                  <p class="highlightWord" style={{marginLeft:'15px', fontSize:'14px', display:'inline-block'}}
                    onClick = {() => this.onProfileClick(item.person[0].username)}
                  >
                    {item.person[0].first_name} {item.person[0].last_name}
                  </p>
                    <Tooltip title="People going">
                      <Progress  style={{marginLeft:'50px', marginTop:'15px', marginRight:'10px'}}
                        width={50}
                        type="circle"
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068',
                        }}

                        percent={66}
                      />
                    going
                     </Tooltip>
                    <br/>
                    <br/>

                  <Avatar.Group style={{marginTop:'-10px'}}>

                      <Button shape="circle" type="primary">
                         <i class="fas fa-eye"></i>
                      </Button>
                    <Button type="primary" shape="circle" style={{marginLeft:'10px'}}>
                       <i class="fas fa-check"></i>
                    </Button>
                    <Button  shape="circle" type="primary" danger style={{marginLeft:'10px', marginRight:'75px'}}>
                       <i class="fas fa-times"></i>
                    </Button>



                      <Avatar size="medium" style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                      <Tooltip size="medium" title="Ant User" placement="top">
                        <Avatar size="medium" style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                      </Tooltip>
                      <Avatar size="medium" style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
                    </Avatar.Group>
                  <span>


                    </span>
                </div>



              } trigger="click">
              <div
                 key= {item.title}
                  onClick = {() => this.onClickItem(item)}
                   className ="weekEvent"
                   style = {{
                    gridColumn: this.dayEventIndex(item.start_time, item.end_time, date, dayIndex) ,
                    // gridRow: 15/17,
                    gridRow: this.hourEventIndex(item.start_time, item.end_time, clonehourIndex),

                    backgroundColor: item.color
                  }}>


                      <span className="pointerEvent">
                        <span className = 'pointerEvent' > {item.title} </span>
                        <br/>
                        <span style={{float:'left'}} className = 'pointerEvent'>
                          {dateFns.format(new Date(item.start_time),'h:mm a')}
                          -
                          {dateFns.format(new Date(item.end_time),'h:mm a')}

                        </span>

                      </span>


              </div>
              </Popover>
            ))

          )
        }
        border.push(
          <Popover trigger="click"  placement="rightTop" onClick = {() => this.addEventClick(dayDay, hourHour)}  content={<div>
            <EditEventPopUp
            isVisible = {this.props.showModal}
            close = {() => this.props.closeModal()}
            />
            </div>}>


            <div
              style={{background: this.color(dayIndex, hourIndex)}}
              onClick = {(e) => this.onDayHourClick(dayIndex, hourIndex)}
            className = {`col ${hourIndex % 2 === 0 ? 'hourcellT' : 'hourcellB' }

            ` }
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
    const specificHour = dateFns.getHours(hour)
    const specificMinute = dateFns.getMinutes(hour)
    const startDate = dateFns.addHours (day, specificHour)
    const newStartDate = dateFns.addMinutes(startDate, specificMinute)
    const endDate = dateFns.addMinutes(newStartDate , 30)
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
      color: '#01D4F4',
      calendarId: ''
    }
    console.log(subInEvent)
    this.props.openModal(subInEvent)

  }


  dayEventIndex = (start_time, end_time, day, start_index) => {
    // day index you will get the start and end days and also the start_index by getting the
    // index of the loops
    // You will need the day here so that you can extend the event to multiple weeks
    // The day index --> 3 senarios
    // *** The event range falls on the same day
    // *** The event range falls on different day but the same week
    // *** The event range falls on different weeks (This senarios has other senarios too)
        // The start day is in the week but not the end day
        // The start nor end day is in the week (gotta make preperations for this up on the place where the events gets filtered out)
        // The end day is in the week but not the start day
    const start = new Date(start_time)
    const end = new Date(end_time)
    const eventDay = new Date(day)
    const index = start_index + 1

    if (dateFns.isSameWeek(start, end)){
      const sameWeekDifference = Math.abs(dateFns.differenceInDays(start, end))+1
      const ratio = index + '/' + (index+sameWeekDifference)
      return ratio
    } else {
       if(dateFns.isSameWeek(start, eventDay)){
         const ratio = index+ '/'+8
         return ratio
       } else if (dateFns.isSameWeek(end, eventDay)){
         const differentWeekDifference = Math.abs(dateFns.differenceInDays(eventDay, end))+2
         return '1/'+differentWeekDifference
       } else {
         return '1/8'
       }
    }

  }

  hourEventIndex = (start_time, end_time, start_index ) => {
    // This is to set the event in the right rows
    console.log(start_time, end_time, start_index)
    let bottomIndex = ''
    const start = new Date(start_time)
    const end = new Date(end_time)
    const actualStartIndex = (start_index)+1
    const startHour = dateFns.getHours(start)
    const endHour = dateFns.getHours(end)
    const startMin = dateFns.getMinutes(start)
    const endMin = dateFns.getMinutes(end)
    const topIndex = (actualStartIndex)
    // +(startMin/30)
    console.log(startMin)
    console.log(endHour, startHour, endMin, startMin)
    // for the numberator of the index you want to go from the starting index
    // and then decide if you add 1 or not depending if there is a 30 mins
    console.log(Math.abs(endMin-startMin)/30)
    if (startMin === 30 && endMin === 0){
         if (endHour === startHour+1){
           bottomIndex = topIndex +(Math.abs(endMin-startMin)/30)

         }
         else {
           bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
         }
    } else {
         bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin-startMin)/30)
    }



    // For the denominator you have to start from the starting index and then add
    // the number of indexes depending on the hour and then add one if there is a
    // 30 min mark
    const ratio = topIndex + '/' + bottomIndex
    console.log(ratio)

    return ratio
    // return '1/3'
  }



  // this is a onclick function that goes to the next week
  nextWeek =() =>{
    this.props.nextWeek()
  }


  // onClick function that goes to the prvious week
  prevWeek = () => {
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

  onClickItem = oneEvent => {
    console.log(oneEvent)
    // The one event you put in here will just be data on one event
    // it will be passed into the redux to calendarEvent openmodal and then
    // be sent to the intital state where it will then open the Edit event popup
    const eventObject = {
      addEvent: false,
      title: oneEvent.title,
      content: oneEvent.content,
      start_time: oneEvent.start_time,
      end_time: oneEvent.end_time,
      location: oneEvent.location,
      color: oneEvent.color,
      id: oneEvent.id
    }


    // this.props.openModal(eventObject)

  }

  onAddEvent = () => {
    this.props.openDrawer()
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }


  render() {
    console.log(this.props)
    console.log(Avatar)
    return (
    <div className = 'calendarContainer'>
        <EventSyncModal
          {...this.props}
          isVisble = {this.props.showEventSyncModal}
          close = {() => this.props.closeEventSyncModal()}
        />

        <div className = 'mainCalContainer'>
          <div className = 'weekCalendar'>
          <EventModal visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
            {this.renderHeader()}
            {this.renderDays()}
          </div>

          <div className = 'testBox'>
          <div className = 'weekDayFlex-Container'>
            <div className = 'timecol'>
              {this.renderSide()}
            </div>
            <div className = 'calendar'>
            {this.renderWeekCell(this.props.events)}
            </div>
          </div>
          </div>



          </div>
          <div className = 'miniCalContainer'>
            <Button
            type="primary"
            className = 'miniEventSyncButton'
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
            <div className = 'timeLayerCon'>
              <Button
               type="primary"
               // shape="round"
               className = 'yearButton'
               onClick = {this.onYearClick}>
              Year
              </Button>
              <Button
              type="primary"
              // shape="round"
              className = 'monthButton'
              onClick = {this.onMonthClick}>
              Month
              </Button>

              <CalendarViewDropDown
              calType = "week"
              history = {this.props.history}
              match = {this.props.match}
              />

            </div>
          </div>



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
    showEventSyncModal: state.eventSync.showEventSyncModal

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
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal())

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WeekCalendar);
