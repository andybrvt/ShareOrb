import React from 'react';
import * as dateFns from 'date-fns';
import moment from 'moment';
import axios from 'axios';
import { authAxios } from '../../components/util';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {
  Drawer,
  List,
  Avatar,
  Divider,
  Col,
  Row,
  Tag,
  Button,
  Modal } from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EyeOutlined,
  CalendarOutlined } from '@ant-design/icons';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory,
    useLocation,
    useParams
  } from "react-router-dom";
import * as navActions from '../../store/actions/nav';
import * as calendarActions from '../../store/actions/calendars';
import * as socialCalActions  from '../../store/actions/socialCalendar';
import ava1 from '../../components/images/avatar.jpg'
import SocialUploadPicModal from './SocialUploadPicModal';
import SocialEventPostModal from './SocialEventPostModal';
import SocialCellCoverEvents from './SocialCellCoverEvents';
import './SocialCalCSS/SocialCal.css';



class SocialCalendar extends React.Component{

  constructor(props){
    super(props)
  }

  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    events: [],
  }



  componentWillReceiveProps(newProps){
    // you bascially want to check if the date in props and the date in
    // the url is the safe, if they are not --> you gotta change it
    // if (this.props.currentDate !== newProps.currentDate){
    //
    //   const year = dateFns.getYear(newProps.currentDate)
    //   const month = dateFns.getMonth(newProps.currentDate)
    //   this.props.history.push('/personalcalendar/'+year+'/'+(month+1))
    // }
    // Instead of reloading the data everytime, the editing of the events is done in the
    // redux
  }


  renderHeader() {
    // This will be used to render the header (the month and year in the calendar)

    const dateFormat = "MMMM yyyy"

    return (
      <div className= "header row flex-middle">
        <div className = "col col-start">
          <div className = "icon" onClick ={this.prevMonth}>
            <i className= 'arrow arrow-left'></i>
          </div>
        </div>
        <div className = "col col-center">
          <span>
           {dateFns.format(this.props.currentDate, dateFormat)}
          </span>
        </div>
        <div className= "col col-end" onClick = {this.nextMonth}>
          <div className = "icon">
          <i className = 'arrow arrow-right'></i>
          </div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "iiii"
    const days = []
    // this will get the date of the first week given the date of the current month
    let startDate = dateFns.startOfWeek(this.props.currentDate);
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
    console.log(events)

    // This will provide the id so that you cna check whether or not they friends
    // so they can edit or not
    let friendListId = []
    let calendarOwnerId = ""
    let calendarOwnerUsername = ''
    if(this.props.profile){
      if(this.props.profile.friends){
        for (let i = 0; i< this.props.profile.friends.length; i++){
          friendListId.push(this.props.profile.friends[i].id)
        }
      }

      if (this.props.profile.id){
        calendarOwnerId = this.props.profile.id
      }

    }


    const location = this.props.location.pathname;
    console.log(location)



    // startOfMonth() will give you the date of the first day of the current month
    // endOfMonth() will give you the date of the last day of the current month
    // the const start date is to fill in the days of the week of the previous month
    // similarly as the end date
    const currentMonth = this.state.currentMonth;
    const selectedDate = this.props.currentDate;
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
          // So the time we put in is the UTC time (universal time ) but when you
          // put moment or new Date it gives you your time zome date so that is why you
          // have to convert it
          const date = new Date(events[item].socialCaldate)
          console.log(events[item])
          const utc = dateFns.addHours(date, date.getTimezoneOffset()/60)
          if (dateFns.isSameDay(utc, day)){
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
        if (toDoStuff.length > 0){
          // The socialEvents should only have 1 item because it holds just the single
          // social cell

          // Everything down here to the else are for cal cells that have a social
          // cal that exist within it
          const socialEvents = toDoStuff
          console.log(socialEvents)
          const calUsername = this.props.profile.username
          const cellYear = dateFns.getYear(day)
          const cellMonth = dateFns.getMonth(day)+1
          const cellDay = dateFns.getDate(day)
          days.push(
            <div
              className ={`col cell ${dateFns.isSameDay(day, currentMonth) ?
            "selected": ""
              }`}
              key = {day}
            >

            {
              toDoStuff[0].coverPic ?
              <div
              // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
              className = 'hoverCell'
              >
              {/*
                This items in the turnary operator is the eyes, calendar addition,
                event addition for event calendar cells that have a cover picture
                */}

              {
                friendListId.includes(this.props.curId) ||  calendarOwnerId === this.props.curId ?

                <div>
                {/*
                  This is to check if cells that have social cell in them allow
                  for the owern and friends to edit and add stuff to it that has
                  a cover cell and the user either is owner or friend
                  */}

              {
                dateFns.isSameDay(day, currentMonth) ?
                <div>
                <PlusOutlined
                onClick = {() => this.onOpenSocialCalPicModal(cloneDay, socialEvents)}
                className = 'plusButton'/>
                <CalendarOutlined
                onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                className = 'eventButton'
                 />
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                <EyeOutlined
                // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButton'/>
                </Link>
                </div>

                : dateFns.isAfter( day, currentMonth) ?
                <div>
                {/*
                  This is for the add event, eye that have a social cell in the
                  cell that are after the current date that has a cover cell
                  when the user is friend or owner
                  */}
                <CalendarOutlined
                onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                className = 'eventButtonAfter'
                 />
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                 <EyeOutlined
                 // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                 className = 'eyeButtonAfter'/>
                 </Link>
                 </div>

                 :
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                 {/*
                   This is for the days that have already passed that has a cover cell
                   and when the user is either friend or calendar owner
                   */}
                <EyeOutlined
                // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButtonPass'/>
                </Link>
              }
                </div>

                :
                <Link to = {{
                  pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                  state:{pathname: location}
                }} >
                {/*
                  This is for viewing the event when there is a cover picture on teh cell
                  and the user is not a friend or calendar owner
                  */}
                <EyeOutlined
                // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButtonPass'/>
                </Link>

              }
              <Avatar
              className = 'imgCover'
              size = {250}
              shape= 'square'
              src = {'http://127.0.0.1:8000'+toDoStuff[0].coverPic} />
              <span className = "bgD"> {formattedDate}</span>
              </div>

              : toDoStuff[0].get_socialCalEvent.length !== 0 ?

              <div>
              {/*
                These are for when there is no cover photo but there is are events
                that we want to show.
                */}
                <div
                className = 'eventBoxListHeader'
                >
                <span className = "bg"> {formattedDate}</span>
                {
                  friendListId.includes(this.props.curId) ||  calendarOwnerId === this.props.curId ?

                  <div>
                  {/*
                    This is for when the user is a friend or the owenr of the
                    social calendar
                    */}

                {
                  dateFns.isSameDay(day, currentMonth) ?
                  <div
                  className = 'buttonHolder'
                  >

                  {/*
                    This will be the button at the top of the cell list of the current
                    day
                    */}
                  <PlusOutlined
                  onClick = {() => this.onOpenSocialCalPicModal(cloneDay, socialEvents)}
                  className = 'plusButton'/>
                  <CalendarOutlined
                  onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                  className = 'eventButton'
                   />
                   <Link to = {{
                     pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                     state:{pathname: location}
                   }} >
                  <EyeOutlined
                  // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                  className = 'eyeButton'/>
                  </Link>
                  </div>

                  : dateFns.isAfter( day, currentMonth) ?
                  <div>
                  {/*
                    This will be the buttons on top of the eventList for the days
                    after the current day
                    */}
                  <CalendarOutlined
                  onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                  className = 'eventButtonAfter'
                   />

                   <Link to = {{
                     pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                     state:{pathname: location}
                   }} >
                   <EyeOutlined
                   // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                   className = 'eyeButtonAfter'/>
                   </Link>
                   </div>

                   :

                   <Link to = {{
                     pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                     state:{pathname: location}
                   }} >
                   {/*
                     This is for the buttons on top of the event list for days before
                     the current
                     */}
                  <EyeOutlined
                  // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                  className = 'eyeButtonPass'/>
                  </Link>
                }
                  </div>

                  :

                    <Link to = {{
                      pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                      state:{pathname: location}
                    }} >
                    {/*
                      For the eye above the event cell for people who are not friends
                      or the owner of the calendar
                      */}
                  <EyeOutlined
                  // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                  className = 'eyeButtonPass'/>
                  </Link>

                }
                </div>

              <SocialCellCoverEvents
              curId = {this.props.curId}
              cellId = {toDoStuff[0].id}
              cellDay = {cloneDay}
              events = {toDoStuff[0].get_socialCalEvent}
              history = {this.props.history}
              />
              </div>

              :

              <div
              className = 'hoverCell'
              >
              {/*
                This is for when the cal cell object is there but there is no
                cover cell and there are no event list
                */}
              {
                friendListId.includes(this.props.curId) ||  calendarOwnerId === this.props.curId ?

                <div>

              {
                dateFns.isSameDay(day, currentMonth) ?
                <div>
                {/*
                  When there is a social cell object but no cover cell and event
                  list. This will be for the current day
                  */}

                <PlusOutlined
                onClick = {() => this.onOpenSocialCalPicModal(cloneDay, socialEvents)}
                className = 'plusButton'/>
                <CalendarOutlined
                onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                className = 'eventButton'
                 />
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                <EyeOutlined
                // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButton'/>
                </Link>
                </div>

                : dateFns.isAfter( day, currentMonth) ?
                <div>
                {/*
                  For days after the social cell and there is a social cal cell object
                  but not cover picture or events
                  */}
                <CalendarOutlined
                onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
                className = 'eventButtonAfter'
                 />
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                 <EyeOutlined
                 // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                 className = 'eyeButtonAfter'/>
                 </Link>
                 </div>

                 :
                 <Link to = {{
                   pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                   state:{pathname: location}
                 }} >
                 {/*
                   For days before the current day with a social cal cell object
                   but no cover photo or events
                   */}
                <EyeOutlined
                // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButtonPass'/>
                </Link>
              }
                </div>

                :
                <Link to = {{
                  pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
                  state:{pathname: location}
                }} >
                {/*
                  This is for viewing the event cell when there is a social cell object
                  but you are not a friend or ower
                  */}
                <EyeOutlined
                // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
                className = 'eyeButtonPass'/>
                </Link>
              }
              <span className = "bg"> {formattedDate}</span>
              </div>
            }


          </div>
        )} else {
          //This is used for the current user page
          //Everything from here down is for all the cells that do not have a
          // social cell in it
          const socialEvents = [
            {
              socialCalUser: this.props.profile
            }
          ]
          const calUsername = this.props.profile.username
          const cellYear = dateFns.getYear(day)
          const cellMonth = dateFns.getMonth(day)+1
          const cellDay = dateFns.getDate(day)
          days.push(
          <div
            className ={`col cell  ${ dateFns.isSameDay(day, currentMonth) ?
          "selected": ""
            }`}
            key = {day}
            // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
          >
          <div
          className = 'hoverCell'
          >


          {
            friendListId.includes(this.props.curId) ||  calendarOwnerId === this.props.curId ?

            <div>

          {
            dateFns.isSameDay(day, currentMonth) ?
            <div>
            {/* This is for the eye, calendar, event post for the current day without
              a picture in it and no cell created
              */}
            <PlusOutlined
            onClick = {() => this.onOpenSocialCalPicModal(cloneDay, socialEvents)}
            className = 'plusButton'/>
            <CalendarOutlined
            onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
            className = 'eventButton'
             />
            <Link to = {{
              pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
              state:{pathname: location}
            }} >
            <EyeOutlined
            // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
            className = 'eyeButton'/>
            </Link>
            </div>

            : dateFns.isAfter( day, currentMonth) ?

            <div>
            {/*
              This is for the eye, calendar for all the cells that are after teh
              current day and does not have a cover picture and no cell created
              */}
            <CalendarOutlined
            onClick ={() => this.onOpenSocialCalEventModal(cloneDay)}
            className = 'eventButtonAfter'
             />

             <Link to = {{
               pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
               state:{pathname: location}
             }} >
             <EyeOutlined
             // onClick ={() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
             className = 'eyeButtonAfter'/>
             </Link>
             </div>

             :
             <Link to = {{
               pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
               state:{pathname: location}
             }} >
             {/*
               This is for the the eye that is before the current day for cells that
               do not have the cell object created
               */}
            <EyeOutlined
            // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
            className = 'eyeButtonPass'/>
            </Link>
          }
            </div>

            :

            <Link to = {{
              pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
              state:{pathname: location}
            }} >
            {/*
              This is for the eye on the social calendar where the calendar is not
              not of a friend or of the own and so it is just viewing. This is for
              cells that do not have an existing social cell in it
              */}
            <EyeOutlined
            // onClick = {() => this.onOpenSocialCalModal(cloneDay, socialEvents)}
            className = 'eyeButtonPass'/>
            </Link>

          }
          <span className = "bg"> {formattedDate}</span>
          </div>
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

    return <div className = "socialCalBody"> {rows} </div>
  }


  // so we need function to deal with cell click to change the date
  // Then you need function to show previous and next monthly
  onDateClick = day => {
    const selectYear = dateFns.getYear(day).toString()
    const selectMonth = (dateFns.getMonth(day)+1).toString()
    const selectDay = dateFns.getDate(day).toString()
  this.props.history.push('/personalcalendar/'+selectYear+'/'+selectMonth+'/'+selectDay)
  }





  // You can use the addMonths function to add one month to the
  // current month
  nextMonth = () => {
    this.props.nextMonth();
  }

  prevMonth = () => {
    this.props.prevMonth()
  }


  onClickItem = oneEvent =>{
    console.log(oneEvent)
    this.props.openModal(oneEvent)
  }

  onOpenSocialCalModal = (day, socialCalInfo) => {
    // this will open up the modal with all the information and date
    console.log(socialCalInfo)
  }

  onOpenSocialCalPicModal = () => {
    this.props.openSocialPictureModal()
  }

  onOpenSocialCalEventModal = (date) => {
    this.props.openSocialEventModal(date)
  }

  handlePictureUpload = (values) => {
    // This is used to upload pictures into the calendar cell

    // So when you want to upload a file into the backend you need to
    // add it into a form data in order for the file to be actually sent as a file
    // if not it will send as a json or not send at all. On top of that you have to add
    //  a header with a content-type of a multipart/form-data

    console.log(values)
    if(values.length !== 0){
      const formData = new FormData()
      if(values.length !== 0){
        for(let i = 0; i < values.length; i++) {
          formData.append('image['+ i + ']', values[i].originFileObj)
        }
      }

      const curId = this.props.profile.id
      // formData.append('imgList',fileList)

      authAxios.post('http://127.0.0.1:8000/mySocialCal/uploadPic/'+curId,
        formData,
        {headers: {"content-type": "multipart/form-data"}}

      )
      .then((response)=> {console.log(response)})
      // maybe change this when we have channels working
      // window.location.reload(true)
    }


  }




  render(){
    // className is to determine the style
    console.log(this.props)
    let socialCalCell = []
    if (this.props.profile){
      if (this.props.profile.get_socialCal){
        socialCalCell = this.props.profile.get_socialCal
      }
    }


    return(
      <div className = 'socialCalContainer'>

          <div className = 'socialCalendar'>
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells(socialCalCell)}
          </div>



            <SocialUploadPicModal
            close = {this.props.closeSocialPictureModal}
            view = {this.props.showSocialPicModal}
            onSubmit = {this.handlePictureUpload}
             />
            <SocialEventPostModal
            close = {this.props.closeSocialEventModal}
            view = {this.props.showSocialEventModal}
            curDate = {this.props.curSocialEventDate}
            />

        </div>
    )
  }
}


const mapStateToProps = state => {
  return{
    currentDate: state.socialCal.socialDate,
    events: state.socialCal.socialEvents,
    showSocialModal: state.socialCal.showSocialModal,
    showSocialPicModal: state.socialCal.showSocialPicModal,
    showSocialEventModal: state.socialCal.showSocialEventModal,
    curSocialEventDate: state.socialCal.curSocialEventDate,
    curId: state.auth.id
  }
}

// getSelectedDate will get the date from the url
// it will help with the lagging of the state so when we put it in
const mapDispatchToProps = dispatch => {
  return {
    getSelectedDate: selectedDate => dispatch(calendarActions.getDate(selectedDate)),
    nextMonth: () => dispatch(socialCalActions.nextMonthSocial()),
    prevMonth: () => dispatch(socialCalActions.prevMonthSocial()),
    openSocialPictureModal: () => dispatch(socialCalActions.openSocialPictureModal()),
    closeSocialPictureModal: () => dispatch(socialCalActions.closeSocialPictureModal()),
    openSocialEventModal: (date) => dispatch(socialCalActions.openSocialEventModal(date)),
    closeSocialEventModal: () => dispatch(socialCalActions.closeSocialEventModal()),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SocialCalendar);
