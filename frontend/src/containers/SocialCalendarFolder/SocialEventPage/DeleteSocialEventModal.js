import React from 'react';
import { Modal, notification } from 'antd';
import * as dateFns from 'date-fns';


class DeleteSocialEventModal extends React.Component{




  render(){
    console.log(this.props)
      return(
        <Modal
        visible = {this.props.visible}
        onCancel = {this.props.onCancel}
        onOk = {this.props.onDelete}
        >

        Deleting this event will remove everyone who is interested in going. Are
        you sure you want to delete the event?

        </Modal>
      )
  }
}

export default DeleteSocialEventModal;
