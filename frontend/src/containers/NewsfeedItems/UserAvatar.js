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

  render(){
    var num=Math.floor(Math.random() * 4);

    const avatarColor=[]
    const textColor=[]
    return (
      <span>

        <Avatar.Group
        maxStyle={{ color: textColor[num], backgroundColor: avatarColor[num] }}
        maxCount={3}
        >


          <Tooltip placement="topLeft" title="Micahel Taylor">
                <Avatar src="https://images.unsplash.com/photo-1597244359536-862d0fcab3c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1355&q=80"/>
          </Tooltip>

          <Tooltip placement="topLeft" title="Larry Donahue">
                <Avatar src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
          </Tooltip>


          <Tooltip placement="topLeft" title="Vince Curella">
          <Avatar
          src="https://images.unsplash.com/photo-1597019558926-3eef445fdf60?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"/>
         </Tooltip>

         <Tooltip placement="topLeft" title="Sarah Arfsten">
         <Avatar
         src="https://images.unsplash.com/photo-1597346906996-ab57d9b27dda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
        </Tooltip>


        </Avatar.Group>
      </span>
    )
  }
}



export default UserAvatar;
