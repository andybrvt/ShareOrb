import React from 'react';
import './EventPage.css';
import {Button, Progress, Divider, Avatar, Modal, message, notification, Statistic, List, Skeleton} from 'antd';
import {PictureOutlined, CheckSquareTwoTone, EyeOutlined, DownloadOutlined, UserOutlined} from '@ant-design/icons';
import DetailEditEventForm from './DetailEditEventForm';
import EventPageWebSocketInstance from '../../../eventPageWebsocket';
import CalendarEventWebSocketInstance from '../../../calendarEventWebsocket';
import NotificationWebSocketInstance from '../../../notificationWebsocket'
import * as dateFns from 'date-fns';
import { connect } from "react-redux";
import moment from 'moment';
import AcceptShareModal from './AcceptShareModal';
import * as calendarActions from '../../../store/actions/calendars';
import * as calendarEventActions from '../../../store/actions/calendarEvent';
import RemoveEventModal from '../EditCalEventForms/RemoveEventModal';
import background from '../../../components/images/background1.jpg';
import ChangeBackgroundModal from "./ChangeBackgroundModal";
import { authAxios } from '../../../components/util';
import Liking from '../../NewsfeedItems/Liking';
import { ReactBingmaps } from 'react-bingmaps';
import {Link, withRouter} from 'react-router-dom';
import {browserHistory} from 'react-router';








class EventInfo extends React.Component{

  constructor(props){
    super(props);


  }

  state = {
    edit: false,
    changeBackgroundView: false,
    list: [],

  }

  componentDidMount() {
    this.getData(res => {
      this.setState({
        list: res.data,
      });
    });
  }


  getData = callback => {
    authAxios.get(`${global.API_ENDPOINT}/userprofile/inviteList`)
        .then(res=> {

          this.setState({
            list:res.data,
         });
       });
       console.log(this.state.list)

  };



  getInitialValue = () => {
    console.log("hi")
    // This will pull the information form the event info so that it can be
    // displayed on the event when you wanna edit it
    // This will be presented somewhat similar to the getInitialValue in the
    // EditEventPopUp
    console.log(this.props.info)
    if(this.props.info){
      let title = "";
      let content = "";
      let friends = [];
      let start_time = ""
      let end_time = ""
      if(this.props.info.start_time){
        start_time = dateFns.format(new Date(this.props.info.start_time), "hh:mm a")
      }

      if(this.props.info.end_time){
        end_time = dateFns.format(new Date(this.props.info.end_time), "hh:mm a")

      }
      // const date_start = dateFns.format(new Date(this.props.info.start_time), "yyyy-MM-dd")
      // const date_end = new Date(this.props.info.end_time)
      // const end_time = dateFns.format(new Date(this.props.info.end_time), "hh:mm a")
      // console.log(date_start, end_time)
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
        repeatCondition: this.props.info.repeatCondition,
        visibleModal:this.state.edit,
      }
    }


  }


  capitalize (str) {
    if(str){
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

  }

  onEditClick = () => {
    // This will activate the edit so that you can start editing events
    this.setState({
      edit: true
    })
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






  onAcceptUnShareEdit = () => {
    // This is mostly for submitting events for when you are unsharing events for
    // other people
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

  console.log(sharedList)


    if(difference.length === 0){
      // This if statment is for when you change events and you are not unsharing
      // with anyone
      const editEventObj = {
        eventId: this.props.info.id,
        title: values.title,
        person: personList,  //Remember that person is the people that the event will show up to
        invited: inviteList, //Invited is everyone but the host
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
      this.eventEditNotification("bottomLeft");

      // This will be sneding a notification to indicate to the other users that
      // the host edited some stuff
      const notificationObject = {
        command: 'send_edited_event_notification',
        actor: this.props.id,
        recipient: inviteList,
        eventId: this.props.info.id,
        eventDate: start_date
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)

    } else {
      // This if statment is whne you are unsharing with someone, it will open up
      // a modal asking if you are sure you want to unshare with everyone
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

  onCloseSureModal = () => {
    this.setState({
      showSureModal: false
    })
  }

  onChangeBackgroundOpen = () => {
    // This is to open the modal for changing the background picture
    this.setState({
      changeBackgroundView: true,
    })
  }


  onChangeBackgroundClose = () => {
    // This is to close the modal for changing the background picture
    this.setState({
      changeBackgroundView: false,
    })
  }




  eventEditMessage = () => {
    message.success("Event edit successful", 2);
  }

  eventEditNotification = placement => {
    notification.info({
      message: `Event edit successful`,
      placement
    });
  };


// THIS IS THE SHIT HERE
  onDeleteEvent = (eventId, eventType) => {
    console.log(eventId)
    // Maybe try to disconnect after you delete event

    if (eventType === 'shared'){
      this.props.openEventDeleteModal(eventId);

    }
    if (eventType === 'single'){

      const week = dateFns.startOfWeek(new Date())
      const year = dateFns.getYear(week)
      const month = dateFns.getMonth(week)+1
      const day = dateFns.getDate(week)
      // THIS STILL NEEDS WORK XXX
      CalendarEventWebSocketInstance.deleteEvent(eventId, this.props.id)
      // Might just keep this for now (unless i can think of something else)

      // this.props.deleteEvent(eventId)
      this.openNotification('bottomLeft', "Event deleted")
      if(this.props.history){
        this.props.history.push('/personalcalendar/w/'+year+'/'+month+'/'+day)

      }

    }
  }

  openNotification = (placement, message) => {
  notification.info({
    message: message,
    placement,
    });
  };

  handleBackgroundPictureChange = value => {
    console.log(value)

    const eventId = this.props.info.id
    var data = new FormData();
    data.append('backgroundImg', value)
    //This will handle the changing the information in the backend of the event
    // I guess you will have to do a put method to change it. But I mean a post
    // should be alright too

    authAxios.put(`${global.API_ENDPOINT}/mycalendar/events/updatebackground/`+eventId,
    data
  ).then (res => {
    // Now you will run the redux to replace the pic, you just have to change the one
    // in the page
    console.log(res.data)
    this.props.updateEventBackground(res.data.backgroundImg.substring(21,))
  })


  this.setState({
    changeBackgroundView: false,
  })

  this.openNotification("bottomLeft", "Event picture changed.")

  var invitedList = []
  for (let i = 0; i<this.props.info.invited.length; i++){
    invitedList.push(
      this.props.info.invited[i].username
    )
  }

  const notificationObject = {
    command: 'send_edited_event_notification',
    actor: this.props.id,
    recipient: invitedList,
    eventId: this.props.info.id,
    eventDate: this.props.info.start_time
  }

  NotificationWebSocketInstance.sendNotification(notificationObject)


  }

  render(){
    const currentDay = new Date()
    const selectYear = dateFns.getYear(currentDay).toString()
    const selectMonth = (dateFns.getMonth(currentDay)+1).toString()
    const selectDay = dateFns.getDate(currentDay).toString()
    console.log(this.state)
    console.log(this.props)
    const list=this.state.list;
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
    let repeat="";
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
        start_time = dateFns.format(new Date(this.props.info.start_time),'h:mm a')
        date = dateFns.format(new Date(this.props.info.start_time), 'iii, MMMM dd, yyyy ')
        console.log(dateFns.format(new Date(this.props.info.start_time), 'HH:mm'))
        month = dateFns.format(new Date(this.props.info.start_time), 'MMM')
        day = dateFns.format(new Date(this.props.info.start_time), 'dd')

      }
      if(this.props.info.end_time){
        end_time = dateFns.format(new Date(this.props.info.end_time), 'h:mm a')
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
      if(this.props.info.repeatCondition){
        repeat = this.props.info.repeatCondition
        console.log(repeat)
      }
      if(this.props.info.host){
        host = this.props.info.host
      }
      if(this.props.info.backgroundImg){
        eventBackgroundPic = this.props.info.backgroundImg

      }

    }

    return(

        <div className = 'eventInfoView'>
          <div class="eventTopEntire">
          <div className = 'topSectContainerLeft'>
            {
              eventBackgroundPic === "" ?
              <div
                onClick = {() => this.onChangeBackgroundOpen()}
                className = 'eventBackgroundPic hoverPic'>
                <div className = "pictureFrame">
                    <PictureOutlined />
                    <br />
                    <span> No background </span>
                </div>
              </div>
              :
              <div
                onClick = {() => this.onChangeBackgroundOpen()}
                className = 'eventBackgroundWPic hoverPic'>
                <img
                src = {`${global.IMAGE_ENDPOINT}`+eventBackgroundPic}
                 />
              </div>
            }
          </div>

          <div className = 'topSectContainerRight'>
            <div className = "menuButtonHolder">
              <div className = 'closeEvent'>
                <Link to={"/personalcalendar/w/"+selectYear+'/'+selectMonth+'/'+selectDay} >
                <i class="far fa-times-circle">  </i>
                </Link>
              </div>

              <div className = 'editEvent'>
                {
                  eventHostId === this.props.userId ?
                  <div>
                    <div onClick={() => this.onEditClick()}>
                      <i class="fas fa-pen" ></i>
                    </div>
                  </div>

                  :

                  <div></div>
                  }
                </div>
              </div>
            <div
              className = "dateCircle"
              style = {{
                backgroundColor: color,
              }}
              >
              <div clasName = "month" > {month}</div>
              <div className = "day"> {day} </div>
            </div>

            <div class="titleCard">

              <div
                className = 'eventTitle'>
                {this.capitalize(title)}
              </div>
            <div class="hostHolder">

              <div className = "attendees">
                Host
                <br/>
                <span>
                  <Avatar
                  src = {`${global.IMAGE_ENDPOINT}`+host.profile_picture}
                  />
                <span class="highlightWord" > {this.capitalize(host.first_name)} {this.capitalize(host.last_name)} </span>
                </span>
              </div>
            </div>


          </div>
        </div>
      </div>


      <div className = "middleCardContainer">
        <div class="middleInviteCard">

          <div className = "goingHolder">
            <div className="goingTitle"> Going</div>
            <div className="goingInviteNumber">{accepted.length}</div>
              <div className = "">
                {/*
                  <Liking
                  history = {this.props.history}
                  style={{display:'inline-block'}}
                  num={5}
                  like_people={accepted}/>
                  */}

              </div>
        </div>

        <div className = "invitedHolder">
          <div className="inviteTitle"> Invited</div>
          <div className="goingInviteNumber">{invited.length}</div>
          <div className = "">
            {/*
              <Liking
              num={5}
              history = {this.props.history}
              style={{display:'inline-block'}}
              like_people={invited}/>
              */}

          </div>
        </div>



          <div class="buttonHolder">
            <div className = "buttonsHolder">
              <Button
                 type="primary" shape="round"
                 icon={<i  style={{marginRight:'10px'}} class="far fa-share-square"></i>}
                 size={'large'}
                 style={{marginRight:'1%'}}
                 >

                Invite
              </Button>
              {
             (accepted.includes(this.props.username))?
                <Button
                   shape="round"
                   icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                  size={'large'}
                  style={{marginRight:'1%'}}
                  >
                  Going
                </Button>

                :
                <Button
                   shape="round" type="primary"
                   icon={<i  style={{marginRight:'10px'}} class="fas fa-user-check"></i>}
                    size={'large'}
                    style={{marginRight:'1%'}}
                    >
                  Going
                </Button>
              }
            <Button
               shape="round"
               icon={<i  style={{marginRight:'10px'}} class="fas fa-user-times"></i>}

               style = {{marginRight: '3%'}}
                size={'large'} danger>
               Delete
            </Button>
            </div>
          </div>
      </div>


      </div>
      {/* Middle invite card*/}


    <div className = "eventBottomEntire">
      <div className = "eventBottomLeft">
        <div class="eventDetailCard">
          Event Details
          <Divider/>
          <div class="eventDetails">
          <i style={{marginRight:'10px', color:'#1890ff'}} class="fas fa-globe"></i>
            Public Event
          <br/>
          <i style={{marginRight:'10px', color:'#1890ff'}} class="far fa-calendar-alt"></i>
            {date} at {start_time} - {end_time}
          <br/>
          <div>
            {
              (repeat=="daily")?
              <span>
               <i class="fas fa-redo-alt" style={{marginRight:'10px', color:'#1890ff'}}></i>
                 Occurs every day
              </span>
                :
              <div>
                {
                  (repeat=="monthly")?
                  <span>
                    <i class="fas fa-redo-alt" style={{marginRight:'10px', color:'#1890ff'}}></i>
                           Occurs every month
                  </span>
                      :
                   <div>
                      {
                      (repeat=="weekly") ?
                       <span>
                         <i class="fas fa-redo-alt" style={{marginRight:'10px', color:'#1890ff'}}></i>
                         Occurs weekly
                       </span>

                       :
                      <span></span>
                      }
                  </div>
                }
              </div>
            }
          </div>

            <i class="fas fa-user-friends" style={{marginRight:'10px', color:'#1890ff'}}></i>
            {invited.length+1} people

            <div className = "contentEvent"> {content} </div>
            </div>
          </div>

      </div>



      <div className = "eventBottomRight">
        {/* Invite friends */}
        <div className = "inviteFriendsEventCard">
            Invite Friends
            <Divider/>
              <List
                className="demo-loadmore-list scrollableFeature"
                style={{marginTop:'-10px'}}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={item => (

                  <List.Item>

                    <Skeleton avatar title={false} loading={item.loading} active>

                    <List.Item.Meta

                      avatar={
                        <Avatar
                          style = {{
                            cursor: "pointer"
                          }}
                          onClick = {() => this.profileDirect(item.username)}
                           src={item.profile_picture} />
                      }
                      title={<span
                        style = {{cursor: "pointer"}}
                         onClick = {() => this.profileDirect(item.username)}> {item.first_name} {item.last_name}</span>}
                      description={
                        <span class="followerFollowingStat"> {item.get_followers.length +" followers"}</span>
                        }
                    />



                    </Skeleton>
                  </List.Item>
                )}
              />
        </div>

        {/* The Map card*/}
        <div class="mapEventCard">
          Location
          <span>
            <Divider style={{marginTop:'-1px'}}/>
            <ReactBingmaps
              bingmapKey = "AggkvHunW4I76E1LfWo-wnjlK9SS6yVeRWyeKu3ueSfgb1_wZqOfD1R87EJPAOqD"
              center = {[32.2226, 110.9747]}
              boundary = {
              {
                "search":"Fremont, CA",
                "option":{
                  entityType: 'PopulatedPlace'
                },
                "polygonStyle" :{
                  fillColor: 'rgba(161,224,255,0.4)',
                  strokeColor: '#a495b2',
                  strokeThickness: 2
                }
              }
            }
              >
            </ReactBingmaps>

             {/*Saving api calls don't worry about maps*/}
            <Divider/>
              <i style={{marginRight:'15px', color:'#1890ff',
                fontSize:'16px'}} class="fas fa-map-marker-alt"></i>
              <p style={{fontSize:'16px', color:'black',  display:'inline-block'}}>
                Tucson, Arizona
              </p>
          </span>
        </div>


        {/* Statistic card */}
        <div className = "statEventCard">
           <span> Statistics </span>
          <Divider/>
          <div className =  "percentagesBars">
            <div className = "percentage">
              <Progress
                type = "circle"
                percent={Math.floor(100*(((accepted.length-1)+decline.length)/invited.length))}
                 size="small"
                 status="active"
                 width={80}
                 gap
              />
              <div className = "percentageTerm"> Responded </div>
            </div>
          <div className = 'percentage'>
            <Progress
              type = "circle"
              percent={Math.floor(100*((accepted.length-1)/(invited.length)))}
              width={80}
            />
            <div className = "percentageTerm"> Accepted </div>
            </div>

            <div className = "percentage">
            {
              (Math.floor(100*(decline.length/invited.length))<100)?
               <Progress
                 type = "circle" percent={Math.floor(100*(decline.length/invited.length))}
                 width={80}
               />
              :
              <Progress
                type ="circle" percent={Math.floor(100*(decline.length/invited.length))}
                width={80}
               />
            }
            <div className = "percentageTerm" > Declined </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    {/* Event details card*/}






    <DetailEditEventForm
    {...this.props}

    info = {this.props.info}
    initialValues = {this.getInitialValue()}
    onSubmit = {this.onSaveEdit}
    visible={this.state.edit}
    friendList = {this.props.friendList}
    onDelete = {this.onDeleteEvent}
     />
    <AcceptShareModal
    info = {this.props.tempEventForModal}
    tempDifference ={this.props.tempDifference}
    onCancel = {this.props.closeAcceptUnshareModal}
    visible = {this.props.showAcceptUnshareModal}
    onSubmit = {this.onAcceptUnShareEdit}
     />

    <RemoveEventModal
      visible = {this.props.showDeleteModal}
      close = {this.props.closeEventDeleteModal}
      history = {this.props.history}
      item = {this.props.deleteEventId}
      user = {this.props.id}
    />

    <ChangeBackgroundModal
      hostPic={host.profile_picture}
      pic={eventBackgroundPic}
      visible = {this.state.changeBackgroundView}
      close = {this.onChangeBackgroundClose}
      onSubmit = {this.handleBackgroundPictureChange}
    />

    </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    id: state.auth.id,
    friendList: state.auth.friends,
    showAcceptUnshareModal: state.calendar.showAcceptUnshareModal,
    tempEventForModal: state.calendar.tempEventForModal,
    tempDifference: state.calendar.tempDifference,
    deleteEventId: state.calendarEvent.deleteEventId,
    showDeleteModal: state.calendarEvent.showDeleteModal

  }
}

const mapDispatchToProps = dispatch => {
  return {
    openAcceptUnshareModal: (eventObj, tempDifference) => dispatch(calendarActions.openAcceptUnshareModal(eventObj, tempDifference)),
    closeAcceptUnshareModal: () => dispatch(calendarActions.closeAcceptUnshareModal()),
    openEventDeleteModal: eventId => dispatch(calendarEventActions.openEventDeleteModal(eventId)),
    closeEventDeleteModal: () => dispatch(calendarEventActions.closeEventDeleteModal()),
    deleteEvent: (eventId) => dispatch(calendarActions.deleteEvents(eventId)),
    updateEventBackground: (backgroundPic) => dispatch(calendarActions.updateEventBackground(backgroundPic))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventInfo);
