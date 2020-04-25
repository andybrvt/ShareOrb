import React from 'react';
import { Modal } from 'antd';

class AddEventPopUp extends React.Component {
  render () {
    return (
      <div>
        <Modal
          centered
          footer = {null}
          visible = true
        >
        </Modal>
      </div>
    );
  }
}

export default AddEventPopUp;
