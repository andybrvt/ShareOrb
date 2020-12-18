import React from 'react';
import "./NewChat.css";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Liking from "../NewsfeedItems/Liking";


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

  getGroupChatName(participantList){
    // This function will show the correct name of the group chats
    var names = ""
    let noCurUserList = []
    for(let i = 0; i < participantList.length; i++){
      console.log(participantList[i].first_name)
      if(participantList[i].id !== this.props.curId){
        const name = this.capitalize(participantList[i].first_name)+ ' '
        +this.capitalize(participantList[i].last_name)
        noCurUserList.push(name)
      }
    }

    if(noCurUserList.length <= 3){
      for (let i = 0; i < noCurUserList.length; i++){
        if(i === 0){
          names = names+noCurUserList[i]
        } else if(i === noCurUserList.length-1){
          if(noCurUserList.length === 2){
              names = names+" and "+noCurUserList[i]
          } else {
            names = names+" ,and "+noCurUserList[i]
          }
        } else {
          names = names + ", "+ noCurUserList[i]
        }

      }


    } else {
      for (let i = 0; i < 2; i++){
        if(i === 0){
          names = names+noCurUserList[i]
        } else {
          names = names + ", "+ noCurUserList[i]
        }

      }

      names = names +", and "+(noCurUserList.length-2)+ " others"

    }



    console.log(noCurUserList)


    return names;
  }


  render(){
    console.log(this.props)
    let profilePic = ""
    let name = ""
    let chatLen = 0
    if(this.props.curChat){

      if(this.props.curChat.participants){
        chatLen = this.props.curChat.participants.length
        if(this.props.curChat.participants.length > 2){
          name = this.getGroupChatName(this.props.curChat.participants)
          profilePic = this.props.curChat.participants
        } else{
          name = this.getChatUserName(this.props.curChat.participants)
          profilePic = this.getChatUserProfile(this.props.curChat.participants)

        }

      }

    }

    return(
      <div className = 'newChatHeader'>
      {
        chatLen > 2 ?
        <div className = "groupsHeader">
          <Liking like_people ={profilePic} />
          <span
          className = "nameHeader"
          >{name}</span>

        </div>
        :

        <div>
          <Avatar
          className = "avaHeader"
           size={50}
           src = {'http://127.0.0.1:8000'+profilePic}
            />
          <span
            className = "nameHeader"
          >{name}</span>
        </div>

      }


      </div>
    )
  }

}

export default NewChatHeader;
