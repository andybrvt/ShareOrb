import React from 'react';
import { Modal } from 'antd';
import Form from  './AddFriends'


class AddChatModal extends React.Component {
  render() {
    console.log(this.props.close)

    return (
      <div>
        <Modal
          centered
          footer={null}
          visible={this.props.isVisible}
          onCancel={this.props.close}
        >
        <Form />
        // change the form to whatever form you like
        </Modal>

      </div>
    );
  }
}


export default AddChatModal;
