import React from 'react';
import { Modal } from 'antd';

class PickEventSyncModal extends React.Component{
  render () {
    console.log(this.props)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
        Hello Pick Event Sync
        </Modal>
      </div>
    )
  }
}


export default PickEventSyncModal;
