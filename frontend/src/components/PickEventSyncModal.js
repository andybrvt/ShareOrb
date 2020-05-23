import React from 'react';
import { Modal } from 'antd';
import * as eventSyncActions from '../store/actions/eventSync';
import { connect } from 'react-redux';

// Unlike the event sync modal, this is where you would pick the
// time you would like to be good to meet up
// The eventsyncmodal is just to send the request
class PickEventSyncModal extends React.Component{
  render () {
    console.log(this.props)
    return(
      <div>
        <Modal
          centered
          footer = {null}
          visible = {this.props.isVisble}
          onCancel = {this.props.close}>
          {this.props.currentUser}
          <br />
          {this.props.userFriend}
          <br />
          {this.props.minDate}
          <br />
          {this.props.maxDate}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    currentUser: state.auth.username,
    userFriend: state.eventSync.userFriend,
    minDate: state.eventSync.minDate,
    maxDate: state.eventSync.maxDate
  }
}

export default connect(mapStateToProps)(PickEventSyncModal);
