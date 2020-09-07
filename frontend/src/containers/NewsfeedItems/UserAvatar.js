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
    console.log(this.props)
    let like_people = this.props.data.people_like
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


          <Tooltip placement="topLeft" title={`${like_people[0].first_name} ${like_people[0].last_name} `}>
                <Avatar src={'http://127.0.0.1:8000'+like_people[0].profile_picture}/>
          </Tooltip>

          <Tooltip placement="topLeft" title={`${like_people[1].first_name} ${like_people[1].last_name} `}>
                <Avatar src={'http://127.0.0.1:8000'+like_people[1].profile_picture}/>
          </Tooltip>


          <Tooltip placement="topLeft" title={`${like_people[2].first_name} ${like_people[2].last_name} `}>
          <Avatar
          src={'http://127.0.0.1:8000'+like_people[2].profile_picture}/>
         </Tooltip>

         <Tooltip placement="topLeft" title={`${like_people[3].first_name} ${like_people[3].last_name} `}>
         <Avatar
         src={'http://127.0.0.1:8000'+like_people[3].profile_picture}/>
        </Tooltip>


        </Avatar.Group>
      </span>
    )
  }
}



export default UserAvatar;
