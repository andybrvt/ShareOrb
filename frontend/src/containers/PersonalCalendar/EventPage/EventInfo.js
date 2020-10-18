import React from 'react';
import './EventPage.css';
import {Button, Progress, Avatar, Modal} from 'antd';
import {PictureOutlined} from '@ant-design/icons';
import ReduxEditEventForm from '../EditCalEventForms/ReduxEditEventForm';
import DetailEditEventForm from './DetailEditEventForm';
import EventPageWebSocketInstance from '../../../eventPageWebsocket';
import * as dateFns from 'date-fns';
import { connect } from "react-redux";
import moment from 'moment';
import AcceptShareModal from './AcceptShareModal';
import * as calendarActions from '../../../store/actions/calendars';



class EventInfo extends React.Component{

  constructor(props){
    super(props);


  }

  state = {
    edit: false,
  }

  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  timeConvert = (time) => {
    // This function will take in a time and then covert the time to
    // a 1-24 hour hour so that it cna be used to add into the
    // date and be submited

    console.log(time)
    let hour = parseInt(time.substring(0,2))
    let minutes = parseInt(time.substring(3,5))
    let ampm = time.substring(5,8)

    console.log(minutes)
    console.log(hour)

    let convertedTime = ''

    if (time.includes('PM')){
      if (hour !==  12){
        hour = hour + 12
      }
    } else if (time.includes('AM')){
      if(hour === 12){
        hour = 0
      }
    }

    const timeBundle = {
      firstHour: hour,
      firstMin: minutes
    }

    return timeBundle

  }


  onEditClick = () => {
    // This will activate the edit so that you can start editing events
    this.setState({
      edit: true
    })
  }

  onCancelEventClick = () => {
    this.setState({
      edit: false
    })
  }

  timeConvertFunction = (time) => {
    // This fucntion will take in a 1-24 hour time
    // and then returna  1-12 am/pm time
    // This fucntion will take in the time as a string in the 1-24 hour
    // time format

    console.log(time)
    if (time !== null){
      let hour = time.substring(0, 2)
      let min = time.substring(3, 5)
      let final_time = ''
      if (hour > 12 ){
        hour = hour - 12
        if (hour < 10){
            final_time = "0"+hour + ':'+min+' PM'
        } else {
            final_time = hour + ':'+min+' PM'
        }
      } else if(hour <= 12 ){
        if (hour == 0){
          final_time = '12:' + min + ' AM'
        } else if (hour == 12) {
          final_time = '12:' + min + ' PM'
        } else {
          final_time = hour +':'+ min+' AM'
        }
      }
      console.log(final_time)
      // MIGHT HAVE TO TAKE INTO CONSIDERATION THE 12AM AND 12 PM
      return final_time
    }


  }


  getInitialValue = () => {
    // This will pull the information form the event info so that it can be
    // displayed on the event when you wanna edit it
    // This will be presented somewhat similar to the getInitialValue in the
    // EditEventPopUp
    console.log(this.props.info)
    if(this.props.info){
      let title = "";
      let content = "";
      let friends = [];
      const date_start = dateFns.format(new Date(this.props.info.start_time), "yyyy-MM-dd")
      const date_end = new Date(this.props.info.end_time)
      const start_time = dateFns.format(new Date(this.props.info.start_time), "hh:mm a")
      const end_time = dateFns.format(new Date(this.props.info.end_time), "hh:mm a")
      console.log(date_start, end_time)
      if(this.props.info.title){
        title = this.props.info.title
      }
      if(this.props.info.content){
        content = this.props.info.content
      }
      if(this.props.info.invited){
        for(let i= 0; i < this.props.info.invited.length; i++){
          if(this.props.info.invited[i].username !== this.props.username)
          friends.push(this.props.info.invited[i].username)
        }
      }

      console.log(friends)

// Remember that for start date you have to use a momment object, only that will work

      return{
        title: this.capitalize(title),
        content: this.capitalize(content),
        startTime: start_time,
        endTime: end_time,
        eventColor: this.props.info.color,
        location: this.props.info.location,
        startDate: moment(this.props.info.start_time, "YYYY-MM-DD"),
        endDate: moment(this.props.info.end_time, "YYYY-MM-DD"),
        friends: friends,
        repeatCondition: this.props.info.repeatCondition
      }
    }


  }



  onAcceptUnShareEdit = () => {
    EventPageWebSocketInstance.sendEditEvent(this.props.tempEventForModal)
    this.props.closeAcceptUnshareModal()
    this.setState({
      edit: false
    })
  }

  onSaveEdit = (values) => {
    // This function will be called when you want to save the new inofmriaton
    // about the event in the detailEventEditForm
    // The way this is gonna go, if the function is a single function (not shared
  // with anyone) then it will probally just run a normal axios and then change all
  // the redux. For events that has many people, then you prpbally have to do editing
  // through channels and then notifiy everyone

  // To get this working you gotta  manipulate your data that is passed in and
  // bundle them up and send it to the right place

  // Also include notifications (mini one and big ones as well)
  let oldInvitedList = [];

  for (let i = 0; i<this.props.info.invited.length; i++ ){
    oldInvitedList.push(this.props.info.invited[i].username)
  }



  let sharedList  = values.friends
  // remember that when doing this you still gotta include yourself in stuff

  var difference = oldInvitedList.filter(x => !sharedList.includes(x));


  console.log(sharedList, oldInvitedList, difference)
  let start_date = values.startDate.toDate()
  let end_date = values.endDate.toDate()

  // The start and end time are dicts that hold the hour and mins into two
  // seperate keys
  const start_time = this.timeConvert(values.startTime)
  const end_time = this.timeConvert(values.endTime)

  console.log(start_time, end_time)

  start_date = dateFns.addHours(start_date, start_time.firstHour)
  start_date = dateFns.addMinutes(start_date, start_time.firstMin)
  // Now you have to convert the date into the right format to be sent into the back
  // end... the format is this "yyyy-MM-dd HH:mm:ss"
  const instance_start_date = dateFns.format(start_date, 'yyyy-MM-dd HH:mm:ss')

  end_date = dateFns.addHours(end_date, end_time.firstHour)
  end_date = dateFns.addMinutes(end_date, end_time.firstMin)
  const instance_end_date = dateFns.format(end_date, 'yyyy-MM-dd HH:mm:ss')


  const inviteList = values.friends.slice()

  let personList = values.friends
  personList.push(this.props.username)
  console.log(instance_start_date, instance_end_date)
  console.log(start_date, end_date)
  console.log(values)


  console.log(inviteList, personList)

  let content = ""
  let location = ""
  if(values.content){
    content = values.content
  }
  if(values.location){
    location = values.location
  }

  // SENARIO 1: If the event is not getting shared with more people
  if(sharedList.length === 0){
      // this will be the one that you will run with axios then redux

  }
  // SENARIO 2: If the event is getting shaed with more people
  else if(sharedList.length !== 0){

    if(difference.length === 0){
      const editEventObj = {
        eventId: this.props.info.id,
        title: values.title,
        person: personList,  //Remember that person is the people that the event will show up to
        invited: inviteList, //everyone but you
        content: content,
        location: location,
        eventColor: values.eventColor,
        startDate: start_date,
        endDate: end_date,
        repeatCondition: values.repeatCondition,
        host: this.props.id
      }

      EventPageWebSocketInstance.sendEditEvent(editEventObj);
      this.setState({
        edit: false,
      })

    } else {
      const editEventObj = {
        eventId: this.props.info.id,
        title: values.title,
        person: personList,  //Remember that person is the people that the event will show up to
        invited: inviteList, //everyone but you
        content: content,
        location: location,
        eventColor: values.eventColor,
        startDate: start_date,
        endDate: end_date,
        repeatCondition: values.repeatCondition,
        host: this.props.id
      }

      var unSharedList = "";
      for (let i = 0; i<difference.length; i++){
        unSharedList = unSharedList + this.capitalize(difference[i]) + ", "
      };

      console.log(unSharedList)
      this.props.openAcceptUnshareModal(editEventObj, unSharedList);
    }


    // DO A CONDTION WHERE IF YOU ARE UNSHARING WITH PEOPLE, YOU ASK IF
    // THEY ARE SURE THEY WANNA UNSURE WITH ALL THESE PEOPLE

   }
  }

  onCloseSureModal = () => {
    this.setState({
      showSureModal: false
    })
  }



  render(){
    console.log(this.state)
    console.log(this.props)
    let show = this.state.showSureModal

    let username = ''
    let eventHostId = ''
    let title = ''
    let content = ''
    let start_time = ''
    let end_time = ''
    let color = ''
    let date = ''
    let location = ''
    let accepted = []
    let decline = []
    let invited = []
    let eventBackgroundPic = ""
    let month = "";
    let day = "";
    let host = "";
    if(this.props.info){
      if(this.props.info.host){
        username = this.props.info.host.username
        eventHostId = this.props.info.host.id
      }
      if(this.props.info.title){
        title = this.props.info.title
      }
      if(this.props.info.content){
        content = this.props.info.content
      }
      if(this.props.info.start_time){
        start_time = dateFns.format(new Date(this.props.info.start_time),'HH:mm aaaa')
        date = dateFns.format(new Date(this.props.info.start_time), 'iii, MMMM dd, yyyy ')
        console.log(dateFns.format(new Date(this.props.info.start_time), 'HH:mm'))
        month = dateFns.format(new Date(this.props.info.start_time), 'MMM')
        day = dateFns.format(new Date(this.props.info.start_time), 'dd')

      }
      if(this.props.info.end_time){
        end_time = dateFns.format(new Date(this.props.info.end_time), 'HH:mm aaaa')
      }
      if(this.props.info.color){
        color = this.props.info.color
      }
      if(this.props.info.location){
        location = this.props.info.location
      }
      if(this.props.info.accepted){
        accepted = this.props.info.accepted
      }
      if(this.props.info.decline){
        decline = this.props.info.decline
      }
      if(this.props.info.invited){
        invited = this.props.info.invited
      }
      if(this.props.info.host){
        host = this.props.info.host
      }

    }

    return(
      <div className = 'eventInfoContainer'>
      {
        this.state.edit ?
        <div>
        <DetailEditEventForm
        {...this.props}
        initialValues = {this.getInitialValue()}
        onSubmit = {this.onSaveEdit}
        friendList = {this.props.friendList}
         />

          <div
          className = "editEventBackButtonContainer "
          onClick = {() => this.onCancelEventClick()}>

          <i class="fas fa-arrow-left"></i>

          </div>
        </div>
        :

        <div className = 'eventInfoView' >
          <div className = 'topSectContainier'>


            {
              eventBackgroundPic !== "" ?
              <div
              className = 'eventBackgroundPic'>
              <div className = "pictureFrame">
                <PictureOutlined />
                <br />
                <span> No background </span>
              </div>
              </div>

              :

              <div
              className = 'eventBackgroundPic'>
              <div className ="pictureFrame">
                <PictureOutlined />
                <br />
                <span> No background </span>
              </div>
              </div>

            }

            <div className = 'eventTopSide'>
            <div
            className = "dateCircle"
            style = {{
              backgroundColor: color
            }}
            >
              <div
              style = {{
                color: "white",
                fontSize: "20px"
              }}
              clasName = "month" > {month}</div>
              <div className = "day"> {day} </div>
            </div>


            <div className = 'eventTitle'> {this.capitalize(title)} </div>
            <div className = "eventDate"> {date} </div>
            <div className = "eventTime">{start_time}-{end_time}</div>

            <div className = "eventHost">
              <Avatar
              src = {"http://127.0.0.1:8000"+host.profile_picture}
              />
              <span> {this.capitalize(host.first_name)} {this.capitalize(host.last_name)} </span>
            </div>


            <div className = "invitedNum"> {invited.length} Invited </div>
            </div>





          </div>


          <div className = 'eventInfo'>

            <div className = "aboutEvent"> About the Event </div>

            {
              content === "" ?

              <div className = "contentEventEmpty"> No info... </div>
              :
              <div className = "contentEvent"> {content} </div>


            }

            <div className = "locationEventWord">Location</div>
            {
              location === "" ?
              <div className = "contentEventEmpty"> No info... </div>
              :
              <div> {this.capitalize(location)} </div>
            }


            <div className = "eventPeopleWord"> People </div>


          <div className =  "percentagesBars">

          <div className = "percentage">

          <Progress type = "circle" percent={Math.floor(100*(((accepted.length-1)+decline.length)/invited.length))} size="small" status="active" gap/>
          <div className = "percentageTerm"> Responded </div>
          </div>

          <div className = 'percentage'>
          <Progress
          type = "circle"
          status = "success"
          percent={Math.floor(100*((accepted.length-1)/(invited.length)))} size="small" />

          <div className = "percentageTerm"> Accepted </div>
          </div>

          <div className = "percentage">
          {
            (Math.floor(100*(decline.length/invited.length))<100)?

             <Progress
             status="exception"
             type = "circle" percent={Math.floor(100*(decline.length/invited.length))} size="small"/>
            :
            <Progress
            status="exception"
            type ="circle" percent={Math.floor(100*(decline.length/invited.length))} size="small" status="exception" />
          }

          <div className = "percentageTerm" > Declined </div>
          </div>



          </div>





          </div>
          <div className = 'editEventButtonContainer'>
          {
            eventHostId === this.props.userId ?

            <div
            className = 'editEventButton'
            onClick= {() => this.onEditClick()}
            >
            <i class="fas fa-pen" ></i>
            <div style = {{fontSize: "15px"}}>
            Edit Event
            </div>
            <div>
            <i class="fas fa-chevron-down"></i>
            </div>
            </div>

            :

            <div></div>

          }

          </div>

        </div>


      }


      <AcceptShareModal
      info = {this.props.tempEventForModal}
      tempDifference ={this.props.tempDifference}
      onCancel = {this.props.closeAcceptUnshareModal}
      visible = {this.props.showAcceptUnshareModal}
      onSubmit = {this.onAcceptUnShareEdit}
       />


      </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    friendList: state.auth.friends,
    showAcceptUnshareModal: state.calendar.showAcceptUnshareModal,
    tempEventForModal: state.calendar.tempEventForModal,
    tempDifference: state.calendar.tempDifference
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openAcceptUnshareModal: (eventObj, tempDifference) => dispatch(calendarActions.openAcceptUnshareModal(eventObj, tempDifference)),
    closeAcceptUnshareModal: () => dispatch(calendarActions.closeAcceptUnshareModal()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
