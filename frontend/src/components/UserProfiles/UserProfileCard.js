import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../../components/util';
import './UserProfileCard.css';
const { Meta } = Card;

class UserProfileCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: true};
  }

  onClickSend = (e) => {
    const username = this.props.data.username;
    console.log(this.props)
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
    this.setState({value: e.target.value});
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
    return (


      <div>
        <div class="card h-100">
          <div class="card-body">
            <div class="myback-img ">
              <img src="https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&h=350" class=""/>
            </div>

            <div class="myoverlay"></div>
              <div class="profile-img">
                 <div class="borders avatar-profile">
                    <img src="https://images.pexels.com/photos/1036628/pexels-photo-1036628.jpeg?auto=compress&cs=tinysrgb&h=350"/>
                 </div>
              </div>
              <div class="profile-title">
              <a href={'/userview/'+this.props.data.username}>{this.props.data.username}</a>
                 <Button type="primary" onClick ={this.onClickSend} disabled={!this.state.value}>Add friend</Button>
              </div>
           </div>
        </div>





    </div>

    );

  }
}

export default UserProfileCard;
