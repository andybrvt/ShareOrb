import React from 'react';
import { connect } from 'react-redux';
import {  Modal } from 'antd';
import * as socialCalActions  from '../store/actions/socialCalendar';


class SocialCalCellInfo extends React.Component{


  render(){

    console.log(this.props)
    return (
      <Modal
      visible = {this.props.showSocialModal}
      onCancel = {() => this.props.closeSocialModal()}
      >
        <div>
        Hi
        </div>
      </Modal>
    )
  }

}


const mapStateToProps = state => {
  return {
    socialObject: state.socialCal.socialObject,
    showSocialModal: state.socialCal.showSocialModal

  }
}

const mapDispatchToProps = dispatch => {
  return {
    openSocialModal: socialObject => dispatch(socialCalActions.openSocialModal(socialObject)),
    closeSocialModal: () => dispatch(socialCalActions.closeSocialModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCalCellInfo);
