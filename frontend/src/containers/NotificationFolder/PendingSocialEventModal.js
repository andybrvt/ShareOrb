import React from 'react';
import { Button, Modal, Avatar, notification } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import './PendingEventCard.css';
import { authAxios } from '../../components/util';


// This will be a modal that opens to check the event that someone wants
// to post on your calendar whne you click on the notificaiton

class PendingSocialEventModal extends React.Component{


  confirmCloseEvent = () => {


    this.props.onClose();
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  timeFormater(time){
    // This will change the format of the time properly to the 1-12 hour
    console.log(time)
    const timeList = time.split(':')
    let hour = parseInt(timeList[0])
    let minutes = timeList[1]
    var suffix  = hour >= 12 ? "PM":"AM"

    console.log(11%12)
    hour = ((hour+11)%12+1)+':'+minutes+" "+ suffix
    return hour

  }

  onAcceptEvent = () => {
    // This function will be called when you accep the follower friend to
    // post and event on your page. This function will similar to the
    // onHandleEventSubmit on the socialeventpostmodal. Gotta set up the
    // eventobject and send it into the ExploreWebSocketInstance.sendSocialEvent

    if(this.props.pendingEvent){
      console.log(this.props.pendingEvent)
      const eventObj = {
        title: this.props.pendingEvent.title,
        content: this.props.pendingEvent.content,
        startTime: this.props.pendingEvent.eventStart,
        endTime: this.props.pendingEvent.eventEnd,
        location: this.props.pendingEvent.location,
        curId: this.props.pendingEvent.curId,
        calOwner: this.props.pendingEvent.ownerId,
        date: this.props.pendingEvent.eventDate
      }

      const displayObj = {
        title: this.props.pendingEvent.title,
        content: this.props.pendingEvent.content,
        startTime: this.timeFormater(this.props.pendingEvent.eventStart),
        endTime: this.timeFormater(this.props.pendingEvent.eventEnd),
        location: this.props.pendingEvent.location,
        curId: this.props.pendingEvent.curId,
        date: this.props.pendingEvent.eventDate
      }

      if(this.props.location.pathname.includes("explore")){
        ExploreWebSocketInstance.sendSocialEvent(eventObj)

      } else {
        console.log('authAxios here')
        authAxios.post('http://127.0.0.1:8000/mySocialCal/uploadEvent', {
          title: this.props.pendingEvent.title,
          content: this.props.pendingEvent.content,
          startTime: this.props.pendingEvent.eventStart,
          endTime: this.props.pendingEvent.eventEnd,
          location: this.props.pendingEvent.location,
          curId: this.props.pendingEvent.curId,
          calOwner: this.props.pendingEvent.ownerId,
          date: this.props.pendingEvent.eventDate
        })
      }


      this.openNotification('bottomLeft', displayObj)
      this.props.onClose();

    }

  }

  openNotification = (placement, info) => {
    // The info parameter will be used to add stuff into the descrption

    const title = this.capitalize(info.title)

  notification.info({
    message: `New Social Event Posted`,
    description:
      'You added an public event '+title+' on '+info.startTime+' to '+info.endTime,
    placement,
  });
};


  render(){
    console.log(this.props)

    let title = ""
    let content = ""
    let location = ""
    let date = ""
    let startTime = ""
    let endTime = ""
    let user = ""
    let userprofile = ""

    if(this.props.pendingEvent) {
      if(this.props.pendingEvent.title){
        title = this.props.pendingEvent.title
      }
      if(this.props.pendingEvent.content){
        content = this.props.pendingEvent.content
      }
      if(this.props.pendingEvent.location){
        location = this.props.pendingEvent.location
      }
      if(this.props.pendingEvent.eventStart){
        startTime = this.props.pendingEvent.eventStart
      }
      if(this.props.pendingEvent.eventEnd){
        endTime = this.props.pendingEvent.eventEnd
      }
      if(this.props.pendingEvent.eventDate){
        date = this.props.pendingEvent.eventDate
      }
    }
    if(this.props.selectedUser){
      user = this.props.selectedUser
    }
    if(this.props.userprofile){
      userprofile = "http://127.0.0.1:8000"+this.props.userprofile
    }

    return (
      <Modal
      visible = {this.props.visible}
      onCancel = {() => this.props.onClose()}
      footer = {null}
      >
        <div>
          Would you like to allow {this.capitalize(user)} to post this event on {date} on your social calendar?
        </div>

        <div className = "pendingEventCard">
          <span className = "title"> {this.capitalize(title)} </span>
          <div className = "secondRow">
          <span className = "times"><i class="far fa-clock"></i> {this.timeFormater(startTime)}-{this.timeFormater(endTime)}</span>
          <span className = "hostPic"> Host: <Avatar src = {userprofile} /> </span>
          </div>
          <div className = "location"><i class="fas fa-map-marker-alt"></i> {this.capitalize(location)} </div>
          <br />
          <div className = "content">{this.capitalize(content)} </div>

        </div>
        <div className = "pendingButtons">
        <div
        className = "pendingDeclineButton"> Decline </div>
        <div
        onClick = {() => this.onAcceptEvent()}
        className = "pendingAcceptButton"> Accept </div>

        </div>
      </Modal>

    )
  }
}

export default PendingSocialEventModal;
