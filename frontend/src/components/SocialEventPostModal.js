import React from 'react';
import {  Modal, Avatar } from 'antd';


class SocialEventPostModal extends React.Component{

  state = {

  }

  render() {
    console.log(this.props)
    return(
      <Modal
      onCancel = {this.props.close}
      visible = {this.props.view}
      >
        <div>
          Hi
        </div>
      </Modal>
    )
  }

}

export default SocialEventPostModal;
