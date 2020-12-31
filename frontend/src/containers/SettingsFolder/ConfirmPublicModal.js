import React from 'react';
import { Modal } from 'antd';

class ConfirmPublicModal extends React.Component{

  render(){
    console.log(this.props)
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      >
        this is for confirm
      </Modal>
    )
  }
}

export default ConfirmPublicModal;
