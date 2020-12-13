import React from 'react';
import { List, Avatar } from 'antd';
import { NavLink } from 'react-router-dom';



class NewSidePanel extends React.Component{
  // This file will hold the side panel of the chats. It will include
  // a list of people that you are chatting with. It will also inlude a way
  // to make a new chat. and search for people
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

  chatDescription (str){
    // This fucntion will take in a string and check how long it is, if it is
    // passed a certain lenght you would just put ... at the end of it
    let finalStr = str
    console.log(str)
    if(str.length > 30){
      finalStr = finalStr.substring(0,30)
      finalStr = finalStr+"..."
    }
    return this.capitalize(finalStr)
  }

  render(){

    console.log(this.props)

    let chatList = []

    if(this.props.chatList){
      chatList = this.props.chatList
    }

    const data = [
      {
        title: 'Ant Design Title 1',
      },
      {
        title: 'Ant Design Title 2',
      },
      {
        title: 'Ant Design Title 3',
      },
      {
        title: 'Ant Design Title 4',
      },
    ];

    return(
      <div className = "newSidePanel">
      <List
        itemLayout="horizontal"
        dataSource={chatList}
        renderItem={item => (

          item.participants.length === 2 ?
          <NavLink
          to = {''+item.id}
          >
          <List className = {`chatItem ${item.id === parseInt(this.props.param.id) ? "current": ""}`}>
            <div className = "chatWrap">
            <Avatar size = {50}
            className = "chatAva"
             src = {'http://127.0.0.1:8000'+this.getChatUserProfile(item.participants)} />
            <div className = "chatText">
              <div className = "chatName">{this.getChatUserName(item.participants)}</div>
              <div className = "chatDescription"> {this.chatDescription(item.recentMessage)}</div>
            </div>

            </div>
          </List>
          </NavLink>

          :

          <div>

          </div>
        )}
      />
      </div>
    )

  }
}

export default NewSidePanel;
