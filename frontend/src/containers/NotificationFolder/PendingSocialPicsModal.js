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
      userprofile = "http://127.0.0.1:8000"+this.props.userprofile
    }
    if(this.props.pendingPictures){
      imageList = this.props.pendingPictures

    }




    return (
      <Modal
      visible = {this.props.visible}
      onCancel = {() => this.props.onClose()}
      footer ={null}
      >
      Would you like to allow {this.capitalize(user)} to post these pictures on {date} on your social calendar?
      <PendingPictureCarousel items = {imageList} />

      <div
      className = ""> Decline </div>
      <div
      className = ""> Accept </div>

      </Modal>

    )
  }
}

export default PendingSocialPicsModal;
