import React from 'react';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import './ProfileCardNewsFeed.css';
import ava1 from './images/avatar.jpg';
import defaultPic from './images/default.png';



class ProfileCardNewsFeed extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }



  render(){
    console.log(this.props)
    let firstName = ''
    let lastName = ''
    if(this.props.profile){
      firstName = this.props.profile.first_name
      lastName = this.props.profile.last_name
    }


    return (
      <div className = "profileCard-NF">
        <div className = 'image-box-NF'>
        <img className = 'profile-image-NF' src = {defaultPic}  alt = 'Avatar'/>
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
        <div className = 'num-NF'> 152 </div>
        <div className = 'num-NF'> 165 </div>
        </div>
        </div>
      </div>
    )
  }
}

export default ProfileCardNewsFeed;
