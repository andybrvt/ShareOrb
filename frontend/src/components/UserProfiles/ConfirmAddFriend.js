import React from 'react';
import { Button, Modal, Avatar } from 'antd';

// This will be the modal that will confirm whether or not
// you will wnat to add someone as a close friend

class ConfirmAddFriend extends React.Component{


  render() {


    return (
      <Modal
      visible = {this.props.visible}
      onClose = {() => this.props.onClose()}
      >
        <div>
          Do you accept them as a friend?

        </div>
      </Modal>

    )
  }

}

export default ConfirmAddFriend;
