import React from 'react';
import { connect } from 'react-redux';
import {  Modal, Avatar } from 'antd';
import * as dateFns from 'date-fns';
import * as socialCalActions  from '../store/actions/socialCalendar';
import PictureCarousel from './PictureCarousel';
import SocialComments from './SocialComments';
import SocialEventList from './SocialEventList';
import './labelCSS/SocialModal.css';
import {PictureOutlined} from '@ant-design/icons';
// import heart from '../containers/Newsfeeditems/heart.svg'

class SocialCalCellInfo extends React.Component{


  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(date)
    let month = ''
    let day = ''
    if (date !== ''){
      month = dateFns.format(new Date(date), 'MMMM d, yyyy')
    }

    console.log(month)
    return (
      <div className = 'socialModalDate'>
      {month}

      </div>
    )
    // const month = dateFns.format(new Date(date), 'MMM')
    // return month
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  render(){
    console.log(this.props)
    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []
    let socialCalUsername = ''
    let socialCalProfilePic = ''
    let socialCalDate = ''


    if(this.props.socialObject[0]){
      socialCalItems = this.props.socialObject[0].get_socialCalItems
      socialCalEvents = this.props.socialObject[0].get_socialCalEvent
      socialCalComments = this.props.socialObject[0].get_socialCalComment
      socialCalUsername = this.props.socialObject[0].socialCalUser.username
      socialCalProfilePic = 'http://127.0.0.1:8000'+this.props.socialObject[0].socialCalUser.profile_picture
      socialCalDate = this.props.socialObject[0].socialCaldate
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


        <div className = 'socialModalRight'>

        <div className = 'socialNameTag'>

        <Avatar size = {50} src = {socialCalProfilePic} className = 'socialProfileImage'/>
        <div>
          <div className = 'socialName'> {this.capitalize(socialCalUsername)}</div>
          <div className = 'socialNameUsername'><b> @{this.capitalize(socialCalUsername)}</b></div>
        </div>
        {this.dateView(this.props.curSocialDate)}
        </div>

        <div className = 'socialLikeComment'>

          <div className ='socialLike'>
          <i
            style={{ marginRight:'10px', color:'red'}}
            class="fa fa-heart">
          </i>
          Like </div>
          <div className  = 'socialComment'>
          <i style={{ marginRight:'10px'}} class="far fa-comments fa-lg"></i>
           Comment </div>
        </div>
          <SocialComments items = {socialCalComments}/>
          <SocialEventList items = {socialCalEvents}/>

        </div>
      </div>
      </Modal>
    )
  }

}


const mapStateToProps = state => {
  return {
    socialObject: state.socialCal.socialObject,
    showSocialModal: state.socialCal.showSocialModal,
    curSocialDate: state.socialCal.curSocialDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openSocialModal: socialObject => dispatch(socialCalActions.openSocialModal(socialObject)),
    closeSocialModal: () => dispatch(socialCalActions.closeSocialModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCalCellInfo);
