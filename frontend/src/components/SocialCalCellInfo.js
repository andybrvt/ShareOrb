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
import AvatarGroups from './AvatarGroups';
import ExploreWebSocketInstance from '../../src/exploreWebsocket';


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

  onSocialLike = (curDate, personLike, owner) => {
    // send out a like to the websocket, the curDate will be the current date and
    // The person like will be the perosn who like the post
    console.log(personLike, owner)
    ExploreWebSocketInstance.sendSocialLike(curDate, personLike, owner)

  }


  render(){
    console.log(this.props)
    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []
    let socialCalUsername = ''
    let socialCalUserId = ''
    let socialCalProfilePic = ''
    let socialCalDate = ''
    let peopleLike = []
    let curDate = ''


    if(this.props.socialObject[0]){
      if(this.props.socialObject[0].get_socialCalItems){
        socialCalItems = this.props.socialObject[0].get_socialCalItems
      }
      if(this.props.socialObject[0].get_socialCalEvent){
        socialCalEvents = this.props.socialObject[0].get_socialCalEvent
      }
      if(this.props.socialObject[0].get_socialCalComment){
        socialCalComments = this.props.socialObject[0].get_socialCalComment
      }
      socialCalUsername = this.props.socialObject[0].socialCalUser.username
      socialCalUserId = this.props.socialObject[0].socialCalUser.id
      socialCalProfilePic = 'http://127.0.0.1:8000'+this.props.socialObject[0].socialCalUser.profile_picture
      if(this.props.socialObject[0].socialCaldate){
        socialCalDate = this.props.socialObject[0].socialCaldate
      }
      if(this.props.socialObject[0].people_like){
        peopleLike = this.props.socialObject[0].people_like
      }
      if(this.props.curSocialDate){
        curDate = dateFns.format(this.props.curSocialDate, 'yyyy-MM-dd')
      }

    }

    console.log(this.props)


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
        <div className = 'socialLikeCommentNum'>
        <div className = 'socialLikeCircle'>
        <i class="fab fa-gratipay" style={{marginRight:'5px', color:'red'}}></i>
        </div>
        <span className = 'socialLikeCommentText'> {peopleLike.length} Likes . {socialCalComments.length} comments </span>
        <div className = 'socialLikeAvatar'>
          <AvatarGroups />
        </div>
        </div>

        <div className = 'socialLikeComment'>

          <div
          onClick = {() => this.onSocialLike(curDate, this.props.curId, socialCalUserId)}
          className ='socialLike'>
          <i
            style={{ marginRight:'10px', color:'red'}}
            class="fa fa-heart">
          </i>
          Like </div>
          <div className  = 'socialComment'>
          <i style={{ marginRight:'10px'}} class="far fa-comments fa-lg"></i>
           Comment </div>
        </div>
          <SocialComments items = {socialCalComments} profilePic = {this.props.curProfilePic}/>
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
    curSocialDate: state.socialCal.curSocialDate,
    curProfilePic: state.auth.profilePic,
    curId: state.auth.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openSocialModal: socialObject => dispatch(socialCalActions.openSocialModal(socialObject)),
    closeSocialModal: () => dispatch(socialCalActions.closeSocialModal())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCalCellInfo);
