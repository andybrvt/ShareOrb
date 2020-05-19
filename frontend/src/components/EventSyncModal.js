import React from 'react';
import { Modal } from 'antd';

class EventSyncModal extends React.Component{

  render() {
    console.log(this.props)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
          
        </Modal>
      </div>
    )
  }
}

export default EventSyncModal;
