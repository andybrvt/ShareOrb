import React from 'react';
import { Modal } from 'antd';
import CalendarForm from './CalendarForm'


class AddEventPopUp extends React.Component {
  render () {
    console.log(this.props)
    return (
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          onCancel= {this.props.close}
        >
        Edit the event and change stuff here
        Back and stuff, probally gonna be using the put method
        </Modal>
      </div>
    );
  }
}

export default AddEventPopUp;
