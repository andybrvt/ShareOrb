import React from 'react';
import { Modal } from 'antd';
import EventSyncForm from './EventSyncForm'


class EventSyncModal extends React.Component{

  submit = (values) => {
    console.log(values)
  }

  render() {
    console.log(this.props)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
          <EventSyncForm
          onSubmit = {this.submit}
          />
        </Modal>
      </div>
    )
  }
}

export default EventSyncModal;
