import React from 'react';
import { Button, Modal, Avatar } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import './PendingEventCard.css';

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


  render(){
    console.log(this.props)
    let title = ""
    let content = ""
    let location = ""
    let date = ""
    let startTime = ""
    let endTime = ""
    let user = ""

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
          <span className = "title"> Title: {title} </span>
          <br />
          <span className = "content"> Content: {content} </span>
          <br />
          <span className = "location">Location: {location} </span>
          <br />
          <span className = "times">{this.timeFormater(startTime)}-{this.timeFormater(endTime)}</span>
          <br />
          <span></span>
        </div>

        <button> Accept </button>
        <button> Decline </button>
      </Modal>

    )
  }
}

export default PendingSocialEventModal;
