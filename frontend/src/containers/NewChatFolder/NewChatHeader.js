import React from 'react';
import "./NewChat.css";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';


class NewChatHeader extends React.Component{

  // This class will take care of the header for the chat, including names
  // and such
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  getChatUserProfile(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var profilePic = ""
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        profilePic = participantList[i].profile_picture
      }
    }

    return profilePic;

  }

  getChatUserName(participantList){
    // This function will show the correct name of the user that you are chatting
    // with

    var name = ""
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        name = this.capitalize(participantList[i].first_name)+ ' '
        +this.capitalize(participantList[i].last_name)
      }
    }

    return name;

  }

  render(){
    console.log(this.props)
    let profilePic = ""
    let name = ""
    if(this.props.curChat){
      if(this.props.curChat.participants){
        profilePic = this.getChatUserProfile(this.props.curChat.participants)
        name = this.getChatUserName(this.props.curChat.participants)
      }

    }

    return(
      <div className = 'newChatHeader'>
      <Avatar
      className = "avaHeader"
       size={50}
       src = {'http://127.0.0.1:8000'+profilePic}
        />

       <span
       className = "nameHeader"
       >{name}</span>

      </div>
    )
  }

}

export default NewChatHeader;
