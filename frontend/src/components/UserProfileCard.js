import React from "react";
import { Card } from 'antd';
import {Button} from 'antd';
import { authAxios } from '../components/util';

const { Meta } = Card;

const UserProfileCover = (props) => {
  console.log(props.data)
  console.log(props.data.username)

  const onClickSend = (e) =>{
    const username = this.props.match.params.username;
    authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
    }
  // let temp="http://127.0.0.1:8000"+props.data.image;
  // this is a card that displays the profile picture and user name
  return (

    <Card
    hoverable
    style={{ width: 240 }}
    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />

  }
  >
    <a href={'/'+props.data.username}>{props.data.username}</a>
    <Button> Hi </Button>
  </Card>

  );
};

export default UserProfileCover;
