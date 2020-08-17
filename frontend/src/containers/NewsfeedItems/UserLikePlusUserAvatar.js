import React from 'react';
import { Avatar, Tooltip } from "antd";
import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";
import doggy from '../../components/images/doggy.jpeg'
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
    var num=Math.floor(Math.random() * 4);

    const avatarColor=['#fde3cf', '#b5f5ec', '#d3f261', '#b37feb', '#1890ff']
    const textColor=['#f56a00', '#13c2c2', '#7cb305', '	#FFFFFF', '#FFFFFF']
    return (
      <div>

        <Avatar.Group
        maxStyle={{ color: textColor[num], backgroundColor: avatarColor[num] }}
        maxCount={3}
        >

        <Tooltip placement="topLeft" title={this.props.data.user.username}>
        <Avatar
        onClick = {() => this.onProfileClick(this.props.data.user.username)}

        style = {{
          cursor: 'pointer',
        }}
        src={doggy} alt="avatar" />
        </Tooltip>

        <Tooltip placement="topLeft" title="Allen Johnson">
          <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
        </Tooltip>

        <Tooltip placement="topLeft" title="Joyce Jacob">
          <Avatar src="https://images.unsplash.com/photo-1570697755619-fa7874c6c062?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
        </Tooltip>

        <Tooltip placement="topLeft" title="Royce Camala">
            <Avatar src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
        </Tooltip>





        </Avatar.Group>
      </div>
    )
  }
}



export default UserAvatar;
