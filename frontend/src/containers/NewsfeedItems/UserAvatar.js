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

  profileDirect = (username) => {
      // This will direct the user to a person's profile page when they
      // click on a person's avatar

      console.log(username)
    this.props.history.push('/explore/'+username)
  }

  render(){
    console.log(this.props)
    let like_people = this.props.like_people
    console.log(like_people)
    var num=0;
    const avatarColor=['#bfbfbf']
    const textColor=['#FFFFFF']
    console.log(this.props.data)
    console.log(like_people)
    return (
      <span>

        <Avatar.Group
        maxStyle={{ color: textColor[num], backgroundColor: avatarColor[num] }}
        maxCount={3}
        >

        {this.props.like_people.map((user) => (
          <Tooltip placement="topLeft" title={`${user.first_name} ${user.last_name} `}>
        <Avatar
        onClick = {() => this.profileDirect(user.username)}
        src={'http://127.0.0.1:8000'+user.profile_picture}/>
        </Tooltip>
      ))}


        </Avatar.Group>
      </span>
    )
  }
}



export default UserAvatar;
