import React from "react";
import { Button, Card } from 'antd';
import { authAxios } from '../.././../components/util';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import defaultPicture from '../../../components/images/default.png';

import './PickEventSync.css';



const { Meta } = Card;

class PickEventSyncUserProfileCard extends React.Component {
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  constructor(props) {
    super(props);
    this.state = {
      value: true,
      active: false
    };
  }

  onClickSend = (e) => {
    const username = this.props.data.username;
    console.log(this.props)
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)

    this.setState({value: e.target.value});
    }

  onClickActive = (e) => {
    if (this.state.active === false){
      this.setState({
        active: true
      })
    } else if (this.state.active === true){
      this.setState({
        active: false
      })
    }
  }

  onClickToggle = () =>{
    let btn = document.querySelector('.btn');
    let profileCard = document.querySelector('.profileCard');
    profileCard.classList.toggle('active');
  }

  onProfileClick = () => {
    const user = this.props.data.username
    // this.prop.history.push('userview/'+user)
    window.location.href = 'explore/'+user;

  }







  render() {
    console.log(this.props.data)
    let profileImage = null

    if(this.props.data){
      if(this.props.data.profile_picture){
        profileImage = 'http://127.0.0.1:8000'+this.props.data.profile_picture
      }
    }

    console.log(profileImage)
    return (

      <div className = "EsyncProfileCard">
        <div className = 'image-box'>

        {profileImage === null ?


          <img className = 'profile-image' src = {defaultPicture} alt = 'Avatar'/>

          :

          <img className = 'profile-image' src = {profileImage} alt = 'Avatar'/>


        }



        </div>
        <div className = 'EsyncTop'>
        <MoreOutlined />
        </div>
        <div className = 'bottom'>
          <div className = 'name'> {this.capitalize(this.props.data.first_name)+" "+this.capitalize(this.props.data.last_name)} </div>
          <div className = 'location'> <EnvironmentOutlined /> Tucson, AZ </div>
        </div>
        <div className = 'social'>
        <div className = 'social-links'>
          <div
          onClick = {this.onProfileClick}
          className = 'btn'> Profile </div>
          <div className = 'btn'> Follow </div>
        </div>
        </div>
      </div>



    );

  }
}

export default PickEventSyncUserProfileCard;
