import React from 'react';
import { Modal,  notification } from 'antd'
import "./SocialCalCSS/SocialCellPage.css";
class DeleteSocialPostModal extends React.Component{


  onDeleteSubmit = () => {
    // This function is just to submit the the delete picture
    this.props.onDeleteSubmit()
    this.openNotification("bottomRight")
    this.props.onClose()
  }

  openNotification = placement => {
  notification.info({
    message: `Picture deleted`,
    description:
      'Picture has been deleted',
    placement,
  });
};

  render(){
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      footer = {null}
      >

      <span>Are you sure you want to delete this picture?</span>

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

export default DeleteSocialPostModal;
