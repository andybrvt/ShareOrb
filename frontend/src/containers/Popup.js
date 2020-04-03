import React from 'react';
import { Modal } from 'antd';

class AddChatModal extends React.Component {

  render() {
    return (
      <div>
        <Modal
          centered
          footer={null}
          visible={this.props.isVisible}
          onCancel={this.props.close}
        >
        some dummy text
        </Modal>

      </div>
    );
  }
}

export default AddChatModal;
