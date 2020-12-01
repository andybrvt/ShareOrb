import React from 'react';
import { Button, Modal, Avatar } from 'antd';
import ExploreWebSocketInstance from '../../exploreWebsocket';


// This will be a modal that opens to check the event that someone wants
// to post on your calendar whne you click on the notificaiton

class PendingSocialEventModal extends React.Component{


  confirmCloseEvent = () => {


    this.props.onClose();
  }

  render(){
    console.log(this.props)
    return (
      <Modal
      visible = {this.props.visible}
      onCancel = {() => this.props.onClose()}
      footer = {null}
      >
        <div>
          Hi
        </div>
      </Modal>

    )
  }
}

export default PendingSocialEventModal;
