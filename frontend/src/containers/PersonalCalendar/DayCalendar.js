import React from 'react';
import * as dateFns from 'date-fns';
import axios from 'axios';
import { authAxios } from '../../components/util';
import Liking from '../NewsfeedItems/Liking';
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
import { connect } from 'react-redux';
import * as navActions from '../../store/actions/nav'
import * as calendarEventActions from '../../store/actions/calendarEvent';
import * as calendarActions from '../../store/actions/calendars';
import * as eventSyncActions from '../../store/actions/eventSync';
import EventModal from './AddCalEventForms/EventModal';
import MiniCalendar from './MiniCalendar';
import EventSyncModal from './EventSyncForms/EventSyncModal';
import EditEventPopUp from './EditCalEventForms/EditEventPopUp';
import CalendarViewDropDown from './CalendarViewDropDown';
import './PersonalCalCSS/NewCalendar.css';




class DayCalendar extends React.Component{
  state ={
      currentDay: new Date(),
      selectedDate: new Date(),
      events: [],
      activeX: null,
  }

  onDayHourClick = (positionX) => {
    console.log(positionX)
    if(this.state.activeX == positionX){
      this.setState({
        activeX: null,
      })
    } else {
      this.setState({
        activeX: positionX
      })
    }
  }

  color = (positionX) => {
    if(this.state.activeX === positionX){
      return '#91d5ff'
    }
    return '';
  }

  componentDidMount(){
    const selectedYear = this.props.parameter.year;
    const selectedMonth = this.props.parameter.month;
    const selectedDay = this.props.parameter.day;
    const newDate = [selectedYear, selectedMonth, selectedDay]
    const newsSelectedDate = new Date(newDate)
    this.props.getSelectedDate(newsSelectedDate)
    this.props.getEvents()
  }


  componentWillReceiveProps(newProps){
    if (this.props.currentDate !== newProps.currentDate){
      const year = dateFns.getYear(newProps.currentDate)
      const month = dateFns.getMonth(newProps.currentDate)
      const day = dateFns.getDate(newProps.currentDate)
      this.props.history.push('/personalcalendar/'+year+'/'+(month+1)+'/'+day)
    }
  }



// render the date on top
  renderHeader(){
    return (
      <div className = 'header row'>
        <div className = 'col col-start'>
          <div className = "icon" onClick = {this.prevDay}>
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-left"></i>
          </div>
        </div>
        <div className = "col col-center">
          <span>
            {dateFns.format(this.props.currentDate, 'iiii MMMM dd, yyyy')}
          </span>
        </div>
        <div className = "col col-end" onClick = {this.nextDay}>
          <div className = "icon">
            <i style={{fontSize:'20px', color:'#1890ff'}} class="fas fa-chevron-circle-right"></i>
          </div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = 'iiii'
    const dayFormat = 'd'
    const days = []

    let startDate = dateFns.startOfWeek(this.props.currentDate)
    let cloneStartDate = dateFns.startOfWeek(this.props.currentDate)
    for (let i = 0; i<7; i++){
      const cloneCloneStartDate = cloneStartDate

      days.push(
        <div
        className = {`weekcol col-center`}
        key = {i}
        onClick = {() => this.onDateClick(cloneCloneStartDate)}
        >

        </div>
      )
      cloneStartDate = dateFns.addDays(cloneStartDate, 1)
    };

    return (
      <div className = 'dayDays'>
      {days}
      </div>
      )
  }

// render the time on the side
  renderHours() {
    // this format is to render it by hour and am pm
    // the hours will store the divs
    const dateFormat = "h a"
    const hours = []

    // starttime will be the start of the day where the time is 00:00
    // then you will loop loop from 1 am to 11 pm
    let startTime = dateFns.addHours(dateFns.startOfDay(this.props.currentDate),1);
    for(let i = 0; i<23; i++){
      const formattedHour = dateFns.format(startTime, dateFormat)
      hours.push(
        <div className = 'cell' key = {i}>
          <span className = 'number'> {formattedHour}</span>
        </div>
      )
      startTime = dateFns.addHours(startTime, 1)
    }
    // render it our but you have to fix the css
    return <div className = 'body'>{hours}</div>
  }



  renderColor = () => {
    const color = ["green","yellow","red","blue","orange","pink","cyan"]
    const len = color.length
    const randomNum = Math.floor(Math.random()*len)
    const pickcolor = color[randomNum]
    return pickcolor

  }

  onDateClick = (date) => {
    console.log(date)
  }

// render all the hour cell within each day
  renderCells(events) {

    console.log(events)
    const selectedDate = this.props.currentDate
    const startHourDay = dateFns.startOfDay(selectedDate)
    const endHourDay = dateFns.endOfDay(selectedDate)

    // So you have the current day and the selected day
    // The you get the day, and then you get the first hour of that day
     // You will do the same with the endHourDay
     // You will want to loop through all the hours of that day starting with
     // startHourDay and ending with endHourDay
    let border = []
    // The border is to draw the lines for the calendars
    let toDoStuff = []
    const hourFormat = "h a"
    // Since there will only be the hours we wont be need a row list
    let hours = [];
    // Start of the hour and then loop through all the 24 hours
    let hour = startHourDay;
    let formattedHour = "";
    // they are the same time because when you do a new date it goes on the GM time
    const text = "You're host"
    // Hour is in a date format with the day and time and it will go till the
    // Same day(endHourday) but till the last sec of the day
    // Since we are not doing a list of list and there is just days we do not
    // need the while statment, just a list
    for (let hourIndex = 0; hourIndex<48; hourIndex++){
      formattedHour = dateFns.format(hour, hourFormat)

      const cloneHourIndex = hourIndex;
      const cloneHour = hour
      for(let item = 0; item < events.length; item ++){
        // For the if statements and what you put into the calendar depends on
        // if the day is on the day or if the day and time falls between the two days and
        // times
        const startDate = new Date(events[item].start_time)
        const endDate = new Date(events[item].end_time)
        const utcStart = dateFns.addHours(startDate, startDate.getTimezoneOffset()/60)
        const utcEnd = dateFns.addHours(endDate, endDate.getTimezoneOffset()/60)

        if (events[item].repeatCondition === 'weekly'){
          // This will be the day of the week (0-6)
          const startEventDayWeek = dateFns.getDay(startDate)
          const endEventDayWeek = dateFns.getDay(endDate)
          const cloneDayWeek = dateFns.getDay(cloneHour)
          const eventDayHour = dateFns.getHours(startDate)
          const cloneDayHour = dateFns.getHours(cloneHour)
          const eventDayMinute = dateFns.getMinutes(startDate)
          const cloneDayMinute = dateFns.getMinutes(cloneHour)
          console.log('hit here')
          console.log(startEventDayWeek, cloneDayWeek )
          if (
            // startEventDayWeek === cloneDayWeek
            eventDayHour === cloneDayHour
            && eventDayMinute === cloneDayMinute
            && startEventDayWeek <= cloneDayWeek
            && endEventDayWeek >= cloneDayWeek
          ){

            toDoStuff.push(
              events[item]
            )
          }


        } else if (events[item].repeatCondition === 'daily'){
          const eventDayHour = dateFns.getHours(startDate)
          const cloneDayHour = dateFns.getHours(cloneHour)
          const eventDayMinute = dateFns.getMinutes(startDate)
          const cloneDayMinute = dateFns.getMinutes(cloneHour)

          if (
            eventDayHour === cloneDayHour
            && eventDayMinute === cloneDayMinute
          ) {
            toDoStuff.push(
              events[item]
            )
          }
        } else if (events[item].repeatCondition === 'none'){
          if (dateFns.isSameHour(startDate, cloneHour)
              && dateFns.isSameDay(startDate, cloneHour)
              && dateFns.isSameMinute(startDate, cloneHour)
             ){
            toDoStuff.push(
              events[item]
            )
          } if (dateFns.isAfter(cloneHour, startDate)
          && dateFns.isBefore(cloneHour, endDate)
          && dateFns.getHours(startDate) === dateFns.getHours(cloneHour)
          && dateFns.getMinutes(startDate) === dateFns.getMinutes(cloneHour)
        ){
          console.log(cloneHour, endDate)
            toDoStuff.push(
              events[item]
            )
          }
        }

      }

      const cloneToDoStuff = toDoStuff
      console.log(cloneToDoStuff)
      if (toDoStuff.length > 0){
        hours.push(
            toDoStuff.map(item => (

              <Popover content={
                <div style={{padding:20, width:450}}>
                  <p style={{display:'inline-block'}}>

                  </p>

                    {
                      (item.invited.length==0)?
                      <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> private</Tag>

                      :
                      <Tag style={{fontSize:'15px', display:'inline-block'}} color={item.color}> public</Tag>
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
                    <span style={{marginRight:'3px'}}>
                      {dateFns.format(selectedDate, 'iiii')},


                    </span>
                    {dateFns.format(new Date(item.start_time), 'MMMM')}
                    &nbsp;
                    {dateFns.format(new Date(item.start_time), 'd')}



                    <br/>
                    <i style={{marginRight:'10px', marginTop:'10px'}} class="fas fa-clock"></i>
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
                          {dateFns.format(selectedDate, 'iiii')}
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
                      <i class="fas fa-user-friends" style={{marginRight:'5px'}}></i>
                      {
                        (item.invited.length==0)?
                          <span> Just You</span>

                        :
                            <span>   {item.invited.length+1} people</span>

                      }
                    </div>
                  </p>
                  {
                    (item.backgroundImg)?
                    <img
                      style={{display:'inline-block', float:'right'}}
                    src = {`${global.IMAGE_ENDPOINT}`+item.backgroundImg}
                    className = 'popoverPic'
                     />
                     :
                     <div></div>
                  }

                  {/* if person is host*
                    item.host
                    {item.person.length==1 && item.host.username==this.props.username}


                  */}

                    {/* for private events and person is host*/}
                  <div>
                    {



                      (item.invited.length==0 && item.host.id==this.props.id)?

                      <span style={{float:'right', padding:'15px', marginTop:'-45px'}}>

                        <Tooltip placement="bottomLeft" title="View event">
                          <Button
                          onClick = {() => this.onEventPage(item.id)}
                          shape="circle"
                          size="large"
                          type="primary">
                             <i class="fas fa-eye"></i>
                          </Button>
                        </Tooltip>
                        <Tooltip placement="bottomLeft" title="Remove event">
                          <Button
                          onClick ={() => this.onDeleteEvent(item.id, 'single')}
                          shape="circle"
                          size="large"
                          type="primary"
                          style={{marginLeft:'10px'}}>
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

                              src={`${global.IMAGE_ENDPOINT}`+item.host.profile_picture}
                              style={{display:'inline-block'}}
                             />
                           {

                               (item.host.username==this.props.username)?
                                 <p class="highlightWord" style={{marginLeft:'15px', fontSize:'16px', color:'black', display:'inline-block'}}
                                   onClick = {() => this.onProfileClick(item.host.username)}
                                 >

                                   {text}
                                 </p>
                               :


                                 <p class="highlightWord" style={{marginLeft:'15px', fontSize:'16px', color:'black', display:'inline-block'}}
                                   onClick = {() => this.onProfileClick(item.host.username)}
                                 >

                                   {item.host.first_name} {item.host.last_name}
                                 </p>

                           }


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


                              {
                                (item.host.username==this.props.username|| (item.accepted.some(e => e.id == this.props.id))

                                ||(item.host.username==this.props.username))
                                ?
                                <div style={{marginRight:'100px', marginTop:'-10px'}}>
                                  <Tooltip placement="bottomLeft" title="View event">
                                    <Button
                                    onClick = {() => this.onEventPage(item.id)}
                                    shape="circle"
                                    size="large"
                                    type="primary">
                                       <i class="fas fa-eye"></i>
                                    </Button>
                                  </Tooltip>
                                  <Tooltip placement="bottomLeft" title="Remove event">
                                    <Button
                                    onClick ={() => this.onDeleteEvent(item.id, 'shared', item.host)}
                                    shape="circle"
                                    size="large"
                                    type="primary"
                                    style={{marginLeft:'10px'}}>
                                       <i class="fas fa-times"></i>
                                    </Button>
                                  </Tooltip>
                                </div>
                                :
                                <div style={{marginRight:'50px'}}>
                                  <Tooltip placement="bottomLeft" title="View event">
                                    <Button
                                    onClick = {() => this.onEventPage(item.id)}
                                    shape="circle"
                                    size="large"
                                    type="primary">
                                       <i class="fas fa-eye"></i>
                                    </Button>
                                  </Tooltip>
                                  <Tooltip placement="bottomLeft" title="Remove event">
                                    <Button
                                    onClick ={() => this.onDeleteEvent(item.id, 'shared', item.host)}
                                    shape="circle"
                                    size="large"
                                    type="primary"
                                    style={{marginLeft:'10px'}}>
                                       <i class="fas fa-times"></i>
                                    </Button>
                                  </Tooltip>
                                  <span>
                                    <Tooltip placement="bottomLeft" title="Accept Invite">
                                      <Button
                                      type="primary"
                                      shape="circle"
                                      size="large"
                                      style={{marginLeft:'10px'}}
                                      onClick = {() => this.onAcceptShare(item.id, item.host, item.start_time)}
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
                                      onClick = {() => this.onDeclineShare(item.id, item.host, item.start_time)}
                                      >
                                         <i class="fas fa-user-times"></i>
                                      </Button>
                                      </Tooltip>
                                    </span>
                                  </div>

                                }
                            </div>
                            <Liking
                            history = {this.props.history}
                            like_people={item.invited}/>
                          </Avatar.Group>


                        </div>
                      </div>

                    }
                  </div>
                </div>

                }



            >
            {


              (item.accepted.includes(this.props.id)||(item.invited.length === 0)||(item.host.username===this.props.username)) ?

              <div className = "weekEvent"
              style = {{
                gridRow: this.dayEventIndex(item.start_time, item.end_time, cloneHourIndex),
                backgroundColor: item.color
              }}
              onClick = {() => this.onClickItem(item)}>
              <span > {dateFns.format(new Date(item.start_time),'hh:mm a')} - {dateFns.format(new Date(item.end_time),'hh:mm a')}</span>
              <span className = ' ' > {item.content} </span>
              </div>

              :

              <div className = "weekEventAccept testLook"
              style = {{
                gridRow: this.dayEventIndex(item.start_time, item.end_time, cloneHourIndex),
                color:'white',
                backgroundColor: item.color,
              }}
              onClick = {() => this.onClickItem(item)}>
              <span > {dateFns.format(new Date(item.start_time),'hh:mm a')} - {dateFns.format(new Date(item.end_time),'hh:mm a')}</span>
              <span className = ' ' > {item.content} </span>
              </div>




            }




          </Popover>

            ))
        )}


      {/*
        //used to popover for edit form when youre selecting empty
        // for var dayDay
        const selectedDate=this.props.currentDate
        const weekStart = dateFns.startOfWeek(selectedDate);
        date=weekStart
        dayday=date
        // for var hourHour
        const selectedDate=this.props.currentDate
        const weekStart = dateFns.startOfWeek(selectedDate);
        date=weekStart
        const startHourDay = dateFns.startOfDay(date);
        let hour = startHourDay;
        hourHour = hour

        <Popover trigger="click"  placement="right" onClick = {() =>
        this.addEventClick(dayDay, hourHour)}  content={<div>
          <EditEventPopUp
          isVisible = {this.props.showModal}
          close = {() => this.props.closeModal()}
          dayNum={dateFns.format(cloneDay, 'd')}

          />
          </div>}>


        </Popover>
        */}
      border.push(
        <Popover trigger="click" onClick = {() =>
            this.addEventClick(selectedDate, cloneHour)}  content={<div>
          <EditEventPopUp
          isVisible = {this.props.showModal}
          close = {() => this.props.closeModal()}
          dayNum={dateFns.format(selectedDate, 'd')}

          />
          </div>}>

            <div
            style = {{background: this.color(hourIndex)}}
            onClick = {(e)=> this.onDayHourClick(hourIndex)}
            className = {`${(hourIndex%2 === 0)? 'dayCellT' : 'dayCellB'}`}
            // onClick = {() => this.onHourClick(cloneHour)}
            >
            </div>

          </Popover>
      )
      toDoStuff = []
      hour = dateFns.addMinutes(hour, 30);
    }
    return(
      <div className = 'scrollBody'>
      <div className = 'backDayBody'>
      {border}
      </div>
      <div className = 'dayBody'>
      {hours}
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


  dayEventIndex = (start_time, end_time, start_index) =>{
    // This function is used to get the index for the grid values for each of the events
    // you will basically get the differnece between the start and end time and add it to the
    // starting index and then you will then add one for any extra 30 mins (there is more math involved
    // but that is the gist of it)
    console.log(start_time,end_time, start_index)
    let bottomIndex = ''
    const start = new Date(start_time)
    const end = new Date(end_time)
    const actualStartIndex = (start_index)+1
    const startHour = dateFns.getHours(start)
    const endHour = dateFns.getHours(end)
    const startMin = dateFns.getMinutes(start)
    const endMin = dateFns.getMinutes(end)
    // for the numberator of the index you want to go from the starting index
    // and then decide if you add 1 or not depending if there is a 30 mins
    const topIndex = (actualStartIndex)
    // For the denominator you have to start from the starting index and then add
    // the number of indexes depending on the hour and then add one if there is a
    // 30 min mark

    if (startMin === 30 && endMin === 0){
      if (endHour === startHour +1){
        bottomIndex = topIndex+(Math.abs(endMin-startMin)/30)
      }
      else {
        bottomIndex = topIndex + ((endHour - startHour))+(Math.abs(endMin-startMin)/30)
      }
    } else {
        bottomIndex = topIndex + ((endHour - startHour)*2)+(Math.abs(endMin - startMin)/30)
    }

    const ratio = topIndex + '/' + bottomIndex
    console.log(ratio)
    return ratio
  }


  onHourClick = (hour) =>{
    // console.log(day)
    // console.log(events)
    const finalStart = dateFns.format(hour, 'yyyy-MM-dd HH:mm:ss')
    const endDate = dateFns.addHours(hour, 1)
    const finalEnd = dateFns.format(endDate, 'yyyy-MM-dd HH:mm:ss')
    console.log(finalStart, finalEnd)

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

    this.props.openModal(subInEvent)


  }

// Use addDays function to change the day
//This will pretty much push all the render cell and stuff on top by 1 day
  nextDay = () => {
    this.props.nextDay()
  }

  prevDay = () => {
    this.props.prevDay()
  }

  onMonthClick = () => {
    const selectYear = dateFns.getYear(this.props.currentDate).toString()
    const selectMonth = (dateFns.getMonth(this. props.currentDate)+1).toString()
    this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth)
  }

  onWeekClick = () => {
    const week = dateFns.startOfWeek(this.props.currentDate)
    const selectYear = dateFns.getYear(week).toString()
    const selectMonth = (dateFns.getMonth(week)+1).toString()
    const selectDay = dateFns.getDate(week).toString()
    console.log(selectYear, selectMonth, selectDay)
    this.props.history.push('/personalcalendar/w/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }

  onClickItem = oneEvent =>{
    this.props.openModal(oneEvent)
  }

  onOpenEvent = () => {
    this.props.openDrawer()
  }

  onYearClick = () => {
    const selectYear = this.props.parameter.year
    this.props.history.push('/personalcalendar/'+selectYear)
  }

  openEventSyncModal = () => {
    this.props.openEventSyncModal()
  }

  onEventPage = (eventId) => {
    this.props.history.push('/personalcal/event/'+eventId)
  }

  render() {

    console.log(this.props)
    console.log(this.props.currentDate)
    return (
      <div className = 'calendarContainer'>
        <EventSyncModal
          {...this.props}
          isVisble = {this.props.showEventSyncModal}
          close = {() => this.props.closeEventSyncModal()}
        />

        <div className ='mainCalContainer'>
          <EventModal visible={this.props.showDrawer} onClose={this.props.closeDrawer} {...this.props} />
            <div className = 'weekCalendar'>
              <div className = "topHeaderCal">
                {this.renderHeader()}
                <CalendarViewDropDown
                  class="CalendarViewCSS"
                  calType = "day"
                  curDate = {this.props.currentDate}
                  history = {this.props.history}
                  matchPara = {this.props.parameter} />
              </div>

              {this.renderDays()}
            </div>
          <div className = 'scrollCalContent'>
            <div className = 'weekDayFlex-Container'>
              <div className = 'timecol'>
                {this.renderHours()}
              </div>
              <div className = 'calendar'>

                {this.renderCells(this.props.events)}
                </div>
              </div>
              <EditEventPopUp
              isVisible = {this.props.showModal}
              close = {() => this.props.closeModal()}
              />
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
            {/*
            <div className = 'timeLayerCon'>
              list of people to be added!
            </div>
            */}>
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

const mapDispatchToProps = dispatch => {
  return {
    closeDrawer: () => dispatch(navActions.closePopup()),
    openDrawer: () => dispatch(navActions.openPopup()),
    openModal: oneEvent => dispatch(calendarEventActions.openEventModal(oneEvent)),
    closeModal: () => dispatch(calendarEventActions.closeEventModal()),
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextDay: () => dispatch(calendarActions.nextDay()),
    prevDay: () => dispatch(calendarActions.prevDay()),
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    openEventSyncModal: () => dispatch(eventSyncActions.openEventSyncModal()),
    closeEventSyncModal: () => dispatch(eventSyncActions.closeEventSyncModal())
  }
}

export default connect(mapStateToProps,mapDispatchToProps) (DayCalendar);
