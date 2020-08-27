import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../../components/util';
import './UserProfileCard.css';
import ava1 from '../images/avatar.jpg';
import ava2 from '../images/avatar2.jpg';
import defaultPicture from '../images/default.png';
import facebook from '../images/facebook.png';
import instagram from '../images/instagram.png';
import twitter from '../images/twitter.png';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';



const { Meta } = Card;

class UserProfileCard extends React.Component {

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
        profileImage = this.props.data.profile_picture
      }
    }

    console.log(profileImage)
    return (

      <div className = "profileCard">
        <div className = 'image-box'>

        {profileImage === null ?


          <img className = 'profile-image' src = {defaultPicture} alt = 'Avatar'/>

          :

          <img className = 'profile-image' src = {profileImage} alt = 'Avatar'/>


        }



        </div>
        <div className = 'top'>
        <MoreOutlined />
        </div>
        <div className = 'bottom'>
          <div className = 'name'> {this.capitalize(this.props.data.username)} </div>
          <div className = 'designation'> {this.props.data.get_followers.length} followers </div>
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

export default UserProfileCard;
