import React from 'react';
import {Button, Progress, Avatar, Modal} from 'antd';
import EventPageWebSocketInstance from '../../../eventPageWebsocket';


class AcceptShareModal extends React.Component{

  

  render(){
    console.log(this.props)
    return(
      <Modal
      onCancel = {this.props.onCancel}
      visible ={this.props.visible}
      onOk = {this.props.onSubmit}
      okText= "Yes"
      >
      Are you sure you want to unshare with: {this.props.tempDifference}
      </Modal>
    )
  }
}

export default AcceptShareModal;
