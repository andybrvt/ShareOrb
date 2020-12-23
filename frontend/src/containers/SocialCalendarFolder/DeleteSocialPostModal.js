import React from 'react';
import { Modal } from 'antd'

class DeleteSocialPostModal extends React.Component{


  onDeleteSubmit = () => {
    // This function is just to submit the the delete picture
    this.props.onDeleteSubmit()
  }

  render(){
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      footer = {null}
      >
        Are you sure you want to delete this picture?


      <div> Cancel </div>
      <div
      onClick = {() =>this.onDeleteSubmit()}
      > Delete </div>
      </Modal>
    )
  }
}

export default DeleteSocialPostModal;
