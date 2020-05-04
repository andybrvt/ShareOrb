import React from 'react';
import { Modal } from 'antd';
import CalendarForm from './CalendarForm'
import EditEventForm from './EditEventForm'
import ReduxFormTest from './ReduxFormTest'


class AddEventPopUp extends React.Component {
  //         <EditEventForm  {...this.props}/>
  submit = (values) => {
    console.log(values)
  }

  render () {
    return (
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisible}
          onCancel= {this.props.close}
        >
        <ReduxFormTest {...this.props} />
        </Modal>
      </div>
    );
  }
}

export default AddEventPopUp;
