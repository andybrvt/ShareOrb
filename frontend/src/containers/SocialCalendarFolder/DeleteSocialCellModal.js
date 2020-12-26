import React from 'react';
import { Modal,  notification } from 'antd'
import "./SocialCalCSS/SocialCellPage.css";

class DeleteSocialCellModal extends React.Component{

  // This function will be used ask if the user is sure that they want
  // to delete the social cal cell (day)
    onDeleteSubmit = () => {
      // This function is just to submit the the delete picture
      this.props.onDeleteSubmit()
      this.props.onClose()
    }





  render(){
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      footer = {null}
      >

      <span> Are you sure you want to delete this day album? </span>
      <br />
      <span>**All the the comments, pictures, and events associated with the day will be deleted.**</span>

      <div className = "buttons">
        <div
        className = "cancelDelete"
        onClick = {this.props.onClose}
        > Cancel </div>
        <div
        onClick = {() =>this.onDeleteSubmit()}
        className = "acceptDelete"
        > Delete </div>

      </div>

      </Modal>
    )
  }
}

export default DeleteSocialCellModal;
