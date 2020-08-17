import React from 'react';
import { connect } from 'react-redux';
import {  Modal } from 'antd';
import * as socialCalActions  from '../store/actions/socialCalendar';
import PictureCarousel from './PictureCarousel';
import SocialComments from './SocialComments';
import SocialEventList from './SocialEventList';
import './labelCSS/SocialModal.css';
import {
PictureOutlined
} from '@ant-design/icons';


class SocialCalCellInfo extends React.Component{


  render(){
    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []

    if(this.props.socialObject[0]){
      socialCalItems = this.props.socialObject[0].get_socialCalItems
      socialCalEvents = this.props.socialObject[0].get_socialCalEvent
      socialCalComments = this.props.socialObject[0].get_socialCalComment
    }
    console.log(this.props.socialObject[0])


    return (
      <Modal
      visible = {this.props.showSocialModal}
      onCancel = {() => this.props.closeSocialModal()}
      width = {1600}
      footer = {null}
      className = 'socialModal'
      >
      <div className = 'socialHolder'>
      {
        socialCalItems.length === 1 ?

        <div className = 'socialCarouselSingle'>
          <img
          className = 'singlePic'
          src = {'http://127.0.0.1:8000'+ socialCalItems[0].itemImage} />
        </div>

        : socialCalItems.length === 0 ?

        <div className = 'socialCarouselZero'>
        <div className = 'pictureFrame'>
          <PictureOutlined  />
          <br />
          <span> No posts </span>
        </div>
        </div>

        :

        <div className = 'socialCarousel'>
          <PictureCarousel items = {socialCalItems} />
        </div>
      }


        <div>
          <SocialEventList items = {socialCalEvents}/>
          <SocialComments items = {socialCalComments}/>
        </div>
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
