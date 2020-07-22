import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../../components/util';
import './UserProfileCard.css';
import ava1 from '../images/avatar.jpg';
import ava2 from '../images/avatar2.jpg';
import facebook from '../images/facebook.png';
import instagram from '../images/instagram.png';
import twitter from '../images/twitter.png';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';



const { Meta } = Card;

class UserProfileCard extends React.Component {
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
  // let temp="http://127.0.0.1:8000"+props.data.image;
  // this is a card that displays the profile picture and user name




// card Demo
  // <Card
  //   hoverable
  //   style={{ width: 240 }}
  //   cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
  //   >
  //     <a href={'/userview/'+this.props.data.username}>{this.props.data.username}</a>
  //     <Button type="primary" onClick ={this.onClickSend} disabled={!this.state.value}>Add friend</Button>
  //
  // </Card>

  render() {

    console.log(this.props)
    return (

      <div className = "profileCard">
        <div className = 'image-box'>
        <img className = 'profile-image' src = {ava2} alt = 'Avatar'/>
        </div>
        <div className = 'top'>
        <MoreOutlined />
        </div>
        <div className = 'bottom'>
          <div className = 'name'> Todd Smith </div>
          <div className = 'designation'> Web Developer </div>
          <div className = 'location'> <EnvironmentOutlined /> Tucson, AZ </div>
        </div>
        <div className = 'social'>
        <div className = 'social-links'>
          <div className = 'btn'> Profile </div>
          <div className = 'btn'> Follow </div>
        </div>
        </div>
      </div>



    );

  }
}

export default UserProfileCard;
