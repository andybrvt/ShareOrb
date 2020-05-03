import React from 'react';
import { Modal } from 'antd';
import CalendarForm from './CalendarForm'
import EditEventForm from './EditEventForm'


class AddEventPopUp extends React.Component {
  render () {
    return (
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          onCancel= {this.props.close}
        >
        <EditEventForm  {...this.props}/>
        </Modal>
      </div>
    );
  }
}

export default AddEventPopUp;
