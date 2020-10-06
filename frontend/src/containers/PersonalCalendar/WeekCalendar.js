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
import CalendarEventWebSocketInstance from '../../calendarEventWebsocket';
import './PersonalCalCSS/NewCalendar.css';
import 'antd/dist/antd.css';
import Liking from '../NewsfeedItems/Liking';
import RemoveEventModal from './EditCalEventForms/RemoveEventModal';


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
  }
  scrollToMyRef = (ref) => {
    if(ref){
    ref.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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

            toDoStuff.map(item =>  (

              <Popover placement="right"  content={
                <div style={{padding:30, width:450}}>
                  <p style={{display:'inline-block'}}>

                  </p>

                    {
                      (item.person.length-1>0)?

                      <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> public</Tag>
                      :
                      <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> private</Tag>
                    }




                  <span style={{color:'black', marginBottom:'10px'}}>
                  {
                    (item.title.length>20)?
                    <p style={{fontSize:'24px', display:'inline-block'}}>{item.title.substring(0,20)}...</p>

                    :
                    <p style={{fontSize:'24px', display:'inline-block'}}>
                      {item.title.substring(0,20)}
                    </p>
                  }


                  </span>

                  <p style={{marginTop:'5px', fontSize:'14px'}}>
                    <i style={{marginRight:'10px', marginTop:'15px'}} class="far fa-calendar-alt"></i>
                    {dateFns.format(new Date(item.start_time), 'M')}/

                    {dateFns.format(new Date(item.start_time), 'd')}
                    &nbsp;
                    <span>
                      {dateFns.format(cloneDay, 'iiii')}
                      &nbsp;

                    </span>
                    <span >

                    </span>
                    <span>
                      {dateFns.format(new Date(item.start_time),'h:mm a')}
                      -
                      {dateFns.format(new Date(item.end_time),'h:mm a')}
                    </span>
                  <br/>
                    {
                      (item.repeatCondition=="weekly")?
                      <span>
                        <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                        Occurs every

                        <span>
                          &nbsp;
                          {dateFns.format(cloneDay, 'iiii')}
                          &nbsp;
                        </span>

                      </span>

                      :
                      <div>

                        {
                          (item.repeatCondition=="daily")?
                          <span>
                            <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                            Occurs every day

                          </span>
                          :
                          <div>


                            {
                              (item.repeatCondition=="monthly")?
                              <span>
                                <i class="fas fa-redo-alt" style={{marginRight:'10px'}}></i>
                                Occurs every month

                              </span>
                              :
                              <div></div>
                            }




                          </div>
                        }
                     </div>

                    }

                    <div>
                      <i class="fas fa-user-friends" style={{marginRight:'10px'}}></i>
                      {
                        (item.person.length==1)?
                          <span> Just You</span>

                        :
                            <span>   {item.person.length} people</span>

                      }
                    </div>
                  </p>

                  {/* if person is host*
                    item.host
                    {item.person.length==1 && item.host.username==this.props.username}


                  */}
                  <div>
                    {



                      (item.person.length==1 && item.host.username==this.props.username)?

                      <span style={{float:'right', padding:'10px', marginTop:'-20px'}}>

                        <Tooltip placement="bottomLeft" title="View event">
                          <Button shape="circle" size="large" type="primary">
                             <i class="fas fa-eye"></i>
                          </Button>
                        </Tooltip>
                        <Tooltip placement="bottomLeft" title="Remove event">
                          <Button shape="circle" size="large" type="primary" style={{marginLeft:'10px'}}>
                             <i class="fas fa-times"></i>
                          </Button>
                        </Tooltip>
                      </span>

                      :

                      <div>
                        <Divider style={{marginTop:'-1px', marginBottom:'-1px'}}/>

                        <div style={{marginTop:'50px'}} class="outerContainerPeople">

                          <div class="innerContainerPeople" style={{display:'inline-block'}}>

                            <Avatar
                              shape="circle"
                              size={60}
                              src={'http://127.0.0.1:8000'+item.host.profile_picture}
                              style={{display:'inline-block'}}
                             />
                           <p class="highlightWord" style={{marginLeft:'15px', fontSize:'16px', color:'black', display:'inline-block'}}
                             onClick = {() => this.onProfileClick(item.host.username)}
                           >

                             {item.host.first_name} {item.host.last_name}
                           </p>

                          </div>

                           <span class="innerContainerPeople" style={{ width: 150, display:'inline-block', float:'right', marginRight:'10px'}}>
                             {/* going to need a if condition checking if not 100 then you can make status active:
                                status="exception"
                                <Progress percent={50} size="small" status="active" />
                               */}
                             <Progress percent={Math.floor(100*(((item.accepted.length-1)+item.decline.length)/item.invited.length))} size="small" status="active" gap/>
                             <Progress percent={Math.floor(100*((item.accepted.length-1)/(item.invited.length)))} size="small" />
                             {
                               (Math.floor(100*(item.decline.length/item.invited.length))<100)?

                                <Progress percent={Math.floor(100*(item.decline.length/item.invited.length))} size="small"/>
                               :
                               <Progress percent={Math.floor(100*(item.decline.length/item.invited.length))} size="small" status="exception" />
                             }


                           </span>
                        </div>
                        <div>


                          <Avatar.Group>
                            <div style={{float:'right', marginRight:'50px'}}>
                              <Tooltip placement="bottomLeft" title="View event">
                                <Button shape="circle" size="large" type="primary">
                                   <i class="fas fa-eye"></i>
                                </Button>
                              </Tooltip>
                              <Tooltip placement="bottomLeft" title="Remove event">
                                <Button
                                onClick ={() => this.onDeleteEvent(item.id)}
                                shape="circle"
                                size="large"
                                type="primary"
                                style={{marginLeft:'10px'}}>
                                   <i class="fas fa-times"></i>
                                </Button>
                              </Tooltip>
                              <Tooltip placement="bottomLeft" title="Accept Invite">
                                <Button
                                type="primary"
                                shape="circle"
                                size="large"
                                style={{marginLeft:'10px'}}
                                onClick = {() => this.onAcceptShare(item.id)}
                                >
                                   <i style={{fontSize:'20px'}} class="fas fa-user-check"></i>
                                </Button>
                              </Tooltip>
                              <Tooltip placement="bottomLeft" title="Decline Invite">
                                <Button
                                shape="circle"
                                type="primary"
                                size="large"
                                danger
                                style={{marginLeft:'10px'}}
                                onClick = {() => this.onDeclineShare(item.id)}
                                >
                                   <i class="fas fa-user-times"></i>
                                </Button>
                              </Tooltip>
                            </div>
                            {/*
                            <span style={{ display:'inline-block', fontSize:'10px'}}>Guests  </span>
                            */}
                            <Liking style={{marginTop:'-200px'}} like_people={item.person}/>
                          </Avatar.Group>


                        </div>
                      </div>

                    }
                  </div>



            </div>

            }



        >


              {  item.accepted.includes(this.props.id) ?
                <div
                   key= {item.title}
                    onClick = {() => this.onClickItem(item)}
                     className = "weekEvent"
                     style = {{
                      gridColumn: this.dayEventIndex(item.start_time, item.end_time, date, dayIndex) ,
                      // gridRow: 15/17,
                      gridRow: this.hourEventIndex(item.start_time, item.end_time, clonehourIndex),

                      backgroundColor: item.color
                    }}>


                        <span style={{marginLeft:'10px'}}  className="pointerEvent">
                          <span sclassName = 'pointerEvent' > {item.title.substring(0,25)} </span>
                          <br/>
                          <span style={{marginLeft:'10px'}}  className = 'pointerEvent'>
                            {dateFns.format(new Date(item.start_time),'h:mm a')}
                            -
                            {dateFns.format(new Date(item.end_time),'h:mm a')}

                          </span>

                        </span>


                </div>

                :

                <div
                   key= {item.title}
                    onClick = {() => this.onClickItem(item)}
                     className = "weekEventAccept testLook"
                     style = {{
                      gridColumn: this.dayEventIndex(item.start_time, item.end_time, date, dayIndex) ,
                      // gridRow: 15/17,
                      gridRow: this.hourEventIndex(item.start_time, item.end_time, clonehourIndex),
                      color:'black',
                      backgroundColor: item.color,
                    }}>


                        <span className="pointerEvent">
                          <span className = 'pointerEvent' > {item.title.substring(0,25) } </span>
                          <br/>
                          <span className = 'pointerEvent'>
                            {dateFns.format(new Date(item.start_time),'h:mm a')}
                            -
                            {dateFns.format(new Date(item.end_time),'h:mm a')}

                          </span>

                        </span>


                </div>
              }





              </Popover>
            ))

          )
        }
        border.push(
          <Popover trigger="click"  placement="right" onClick = {() => this.addEventClick(dayDay, hourHour)}  content={<div>
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
    // The grid index start from 1-48 and when you do a grid ratio
    // it will start from the first interval and the denominator is not included
    console.log(start_time, end_time, start_index)
    let bottomIndex = ''
    const start = new Date(start_time)
    const end = new Date(end_time)
    console.log(start, end)
    // When you convert to the time, the time becomes a 0-23 hour time
    const topIndex = start_index+1 //Good up to here
    const startHour = dateFns.getHours(start)
    const endHour = dateFns.getHours(end)
    // So there is obvious gonna be issue with this when we do 11:30 pm to 12:00 AM

    const startMin = dateFns.getMinutes(start)
    const endMin = dateFns.getMinutes(end)



    console.log(endHour, startHour, endMin, startMin)
    // for the numberator of the index you want to go from the starting index
    // and then decide if you add 1 or not depending if there is a 30 mins
    console.log(Math.abs(endMin-startMin)/30)
    // if (startMin === 30 && endMin === 0){
    //      if (endHour === startHour+1){
    //        bottomIndex = topIndex +(Math.abs(endMin-startMin)/30)
    //
    //      }
    //      else {
    //        bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
    //      }
    // } else {
    //      bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin-startMin)/30)
    // }
    if (startHour === 23 && startMin === 30){
      bottomIndex = 49;
    } else if (startHour === 23 && startMin === 0) {
      if (endMin === 30){
        bottomIndex = 48
      } else {
        bottomIndex = 49
      }

    }else {
      bottomIndex = (2*(endHour)+1)+(endMin/30)

    }


    // For the denominator you have to start from the starting index and then add
    // the number of indexes depending on the hour and then add one if there is a
    // 30 min mark
    const ratio = topIndex + '/' + bottomIndex
    console.log(ratio)

    return ratio
    // return '20/49'
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

  onAcceptShare = (eventId) => {
    // This will be used for accepting event shared between you and another
    // person. When accepted this will add you to the accepted list and then
    // send it to the host to as well
    console.log(eventId, this.props.id)
    CalendarEventWebSocketInstance.acceptSharedEvent(eventId, this.props.id);
  }

  onDeclineShare = (eventId) => {
    CalendarEventWebSocketInstance.declineSharedEvent(eventId, this.props.id);
  }


  onDeleteEvent = (eventId) => {
    console.log(eventId)
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
            <div style={{display: 'inline-block'}}>

              {this.renderHeader()}
            </div>

            <div style={{display: 'inline-block', float:'right', padding:'20px', color:'black'}} class="selectView">

              <CalendarViewDropDown
              calType = "week"
              history = {this.props.history}
              match = {this.props.match} />

            </div>
            {this.renderDays()}
          </div>

          <div className = "testBox">
            {/*window.scrollTo(0, 800)*/}
          <div className = 'weekDayFlex-Container'>
            <div className = 'timecol'>
              {this.renderSide()}
            </div>
            <div className = 'calendar'  ref={this.scrollToMyRef} >
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
    showEventSyncModal: state.eventSync.showEventSyncModal,
    id: state.auth.id

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
