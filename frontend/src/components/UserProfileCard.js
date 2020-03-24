import React from "react";
import { Card } from 'antd';

const { Meta } = Card;

const UserProfileCover = (props) => {
  console.log(props.data)
  console.log(props.data.username)
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
  </Card>

  );
};

export default UserProfileCover;
