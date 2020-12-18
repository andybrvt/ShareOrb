import React from 'react';
import { Avatar, Button } from 'antd';


// This will be the far right side of the chats that holds the
// user profile pic and actions such as event sync, event invite,
// share events etc
class CurChatManager extends React.Component{

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

    console.log(name)
    return name;

  }



  render(){

    console.log(this.props)
    let profilePic = ""
    let partiLen = 0
    let chatUserName = ""
    if(this.props.curChat){
      if(this.props.curChat.participants){
        partiLen =this.props.curChat.participants.length
        if(this.props.curChat.participants.length > 2){
          // This is for group chats
        } else {
          profilePic = this.getChatUserProfile(this.props.curChat.participants)
          chatUserName = this.getChatUserName(this.props.curChat.participants)
        }
      }
    }


    return(
      <div className = "chatManagerContainer">
        {
          partiLen > 2 ?
          <div>
          </div>

          :

          <div>
          <Avatar
          size = {200}
          src = {"http://127.0.0.1:8000"+profilePic}
          />
          <div>{chatUserName}</div>
          </div>
        }

        <div>
        <Button> Event Sync </Button>
        <Button> Share Event </Button>
        </div>
      </div>
    )
  }
}

export default CurChatManager;
