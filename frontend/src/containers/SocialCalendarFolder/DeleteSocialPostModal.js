import React from 'react';
import { Modal } from 'antd'

class DeleteSocialPostModal extends React.Component{

  render(){
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      footer = {null}
      >
        Are you sure you want to delete this picture?

        <div> Delete </div>
        <div> Cancel </div>
      </Modal>
    )
  }
}

export default DeleteSocialPostModal;
