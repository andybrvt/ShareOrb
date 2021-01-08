import React from 'react';
import { Button, Modal, Avatar, notification } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';
import './PendingEventCard.css';
import { authAxios } from '../../components/util';
import PictureCarousel from '../SocialCalendarFolder/PictureCarousel';
import PendingPictureCarousel from './PendingPictureCarousel';
// This will be the modal taht opens up ot check the pictures that the person
// wnats to post on the calendar when you click on the notificaiton

class PendingSocialPicsModal extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  onAcceptPics = () => {
    // This function will be called when you accept the followerfriend to post pics on
    // on your calendar. This function will be similar to the handle picture upload in
    // the social calendar. Like that, it will make an http call for all the pics
    // and then return an object that contains all the pics into the weboscket


    // OwnerId will just be the current user who is approving the notification
    let ownerId = ""
    let notificationId = ""
    let date = ""
    let curId = ""
    let pictureLen = ""
    if(this.props.ownerId){
      ownerId = this.props.ownerId
    }
    if(this.props.notificationId){
      notificationId = this.props.notificationId
    }
    if(this.props.eventDate){
      date = this.props.eventDate
    }

    // curId will be the person that owns the pending pictures
    if(this.props.curId){
      curId = this.props.curId
    }
    if(this.props.pendingPictures){
      pictureLen = this.props.pendingPictures.length
    }


    if(this.props.pendingPictures){
      if(this.props.location.pathname.includes("explore")){
        //  put the websocket path here becuase if you are on an explore
        // you are on one of the explore websocket and the explore weboskcet shold
        // work. Put another condition wher eit has to be your ussername as well
        ExploreWebSocketInstance.sendAcceptedSocialPics(notificationId, ownerId, date, curId)


      } else {
        // This will be where we just put the http call because you are not
        // on your profile calendar. So you do not need to see things in real
        // time
        authAxios.post(`${global.API_ENDPOINT}/mySocialCal/uploadPicture`, {
            notificationId: notificationId,
            ownerId: ownerId,
            date: date,
            curId: curId
        })
      }




    }

    if(this.props.notificationId){
      this.props.deleteNotification(this.props.notificationId)
    }
    this.openNotification("bottomRight", date, pictureLen)
    this.props.onClose()

  }

  onDeclinePics = () => {
    // This function is called when you decline the pending pic
    // it will mostly just close the modal. Decline the event
    // and then delete the notification

    if(this.props.notificationId){
      this.props.deleteNotification(this.props.notificationId)
    }
    this.openDeclineNotification("bottomRight")
    this.props.onClose()


  }

  openNotification = (placement, date, picLen) => {
    // The info parameter will be used to add stuff into the descrption


  notification.info({
    message: `New Social Picture Posted`,
    description:
      "You added "+picLen+" to your social calendar on "+date,
    placement,
  });
};

openDeclineNotification = (placement) => {
  // This will show a small notificaiton to show that you decline a requestion


  notification.info({
    message: `Decline Social Picture Request`,
    description:
      "You decline a social picture request." ,
    placement,
  });
}

  render(){

    console.log(this.props)
    let user = ""
    let date = ""
    let userprofile = ""
    let imageList = []

    if(this.props.selectedUser){
      user = this.props.selectedUser
    }
    if(this.props.userprofile){
      userprofile = `${global.API_ENDPOINT}`+this.props.userprofile
    }
    if(this.props.pendingPictures){
      imageList = this.props.pendingPictures
    }
    if(this.props.eventDate){
      date = this.props.eventDate
    }

    console.log(date)



    return (
      <Modal
      visible = {this.props.visible}
      onCancel = {() => this.props.onClose()}
      footer ={null}
      >
      Would you like to allow {this.capitalize(user)} to post these pictures on {date} on your social calendar?
      <PendingPictureCarousel items = {imageList} />

      <div className = "pendingButtons">
      <div
      onClick = {() => this.onDeclinePics()}
      className = "pendingDeclineButton"> Decline </div>
      <div
      onClick = {() => this.onAcceptPics()}
      className = "pendingAcceptButton"> Accept </div>
      </div>

      </Modal>

    )
  }
}

export default PendingSocialPicsModal;
