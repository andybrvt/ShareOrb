import React from 'react';
import { Modal,  notification } from 'antd';

class ChangeCoverPicModal extends React.Component{

  render(){

    return (

      <Modal
      onCancel = {this.props.onClose}
      visible = {this.props.visible}
      footer = {null}
      >
        This will be the modal for the change cover pic
      </Modal>
    )
  }
}

export default ChangeCoverPicModal;
