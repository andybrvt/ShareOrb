import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../components/util';

const { Meta } = Card;

class UserProfileCover extends React.Component {
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
  render() {
    return (

    <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <a href={'/userview/'+this.props.data.username}>{this.props.data.username}</a>
      <Button type="primary" onClick ={this.onClickSend} disabled={!this.state.value}>Add friend</Button>
    </Card>


    );

  }
}

export default UserProfileCover;
