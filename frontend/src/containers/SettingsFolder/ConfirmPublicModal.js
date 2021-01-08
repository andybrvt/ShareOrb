import React from 'react';
import { Modal } from 'antd';
import { authAxios } from '../../components/util';


class ConfirmPublicModal extends React.Component{

  onCancel = () => {
    this.props.onClose()
  }

  onAcceptPublic = () => {
    // this function will change the account to public again
    authAxios.post(`${global.API_ENDPOINT}/userprofile/privateChange`, {
      privatePro: false,
      curId: this.props.curId
    })
    .then(res =>{
      // Now you will put a redux call here ot change the backend
      this.props.changePrivate(res.data)
    })
    this.props.onClose()
  }

  render(){
    console.log(this.props)
    return(
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onClose}
      footer = {null}
      >
      Are you sure you want to make your account public?

      <div className = "pendingButtons">
        <div
        onClick ={() => this.onCancel()}
        className = "pendingDeclineButton">
          Cancel
        </div>

        <div
        onClick = {() =>this.onAcceptPublic()}
        className = "pendingAcceptButton">
          Accept
        </div>
      </div>
      </Modal>
    )
  }
}

export default ConfirmPublicModal;
