import React from 'react';
import { Modal, notification } from 'antd';

class AddDayCaptionModal extends React.Component{

  render(){
    return(


        <Modal
        visible = {this.props.visible}
        onCancel= {this.props.onClose}
        footer = {null}
        >
          Add caption
        </Modal>
    )
  }
}

export default AddDayCaptionModal;
