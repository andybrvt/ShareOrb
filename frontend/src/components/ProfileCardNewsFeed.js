import React from 'react';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import './ProfileCardNewsFeed.css';
import ava1 from './images/avatar.jpg';
import defaultPic from './images/default.png';
import { connect } from "react-redux";




class ProfileCardNewsFeed extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }



  render(){
    console.log(this.props)
    let firstName = ''
    let lastName = ''
    let followers = []
    let following = []
    let profilePic = ''

    if (this.props.firstName){
      firstName = this.props.firstName
    } if (this.props.lastName){
      lastName = this.props.lastName
    } if (this.props.followers){
      followers = this.props.followers
    } if (this.props.following){
      following = this.props.following
    } if (this.props.profilePic){
      profilePic = 'http://127.0.0.1:8000'+this.props.profilePic
    }



    return (
      <div className = "profileCard-NF">
        <div className = 'image-box-NF'>
        {
          profilePic != '' ?
          <img className = 'profile-image-NF' src = {profilePic}  alt = 'Avatar'/>

          :

          <img className = 'default-profile-image-NF' src = {defaultPic}  alt = 'Avatar'/>


        }

        </div>
        <div className = 'top-NF'>
        <MoreOutlined />
        </div>
        <div className = 'bottom-NF'>
          <div className = 'name-NF'> {this.capitalize(firstName)} {this.capitalize(lastName)}</div>

        </div>
        <div className = 'social-NF'>
        <div className = 'social-links-NF'>
          <div
          // onClick = {this.onProfileClick}
          className = 'btn-NF'> Followers </div>
          <div className = 'btn-NF'> Following </div>
        </div>
        <div className = 'social-links-NF'>
        <div className = 'num-NF'> {followers.length} </div>
        <div className = 'num-NF'> {following.length} </div>
        </div>
        </div>
      </div>
    )
  }
}

export const mapStateToProps = state => {
  return {
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    profilePic: state.auth.profilePic,
    following: state.auth.following,
    followers: state.auth.followers
  }
}

export default connect(mapStateToProps)(ProfileCardNewsFeed);
