import React from 'react';
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";

class UserAvatar extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      avatarColor: "",
    }
  }

  componentDidMount(){
    this.setState({
      avatarColor:'red',
    });
  }



  render(){
    var num=Math.floor(Math.random() * 5);
    const avatarColor=['#fde3cf', '#1890ff', '#13c2c2','#722ed1']
    const textColor=['#f56a00', '#ffffff', '#ffffff', '#ffffff']
    return (
      <div>

        <Avatar.Group
        maxStyle={{ color: textColor[num], backgroundColor: avatarColor[num] }}
        maxCount={3}
        >

          <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
          <Avatar src="https://images.unsplash.com/photo-1570697755619-fa7874c6c062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
          <Avatar src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
          <Avatar
          src="https://images.unsplash.com/photo-1597019558926-3eef445fdf60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>


        </Avatar.Group>
      </div>
    )
  }
}



export default UserAvatar;
