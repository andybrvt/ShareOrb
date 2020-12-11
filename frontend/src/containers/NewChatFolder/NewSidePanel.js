import React from 'react';
import { List, Avatar } from 'antd';



class NewSidePanel extends React.Component{
  // This file will hold the side panel of the chats. It will include
  // a list of people that you are chatting with. It will also inlude a way
  // to make a new chat. and search for people
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  chatDescription (str){
    // This fucntion will take in a string and check how long it is, if it is
    // passed a certain lenght you would just put ... at the end of it
    let finalStr = str
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
          <List className = {`chatItem ${item.id === parseInt(this.props.param.id) ? "current": ""}`}>
            <div className = "chatWrap">
            <Avatar size = {50}
            className = "chatAva"
             src = {'http://127.0.0.1:8000'+item.participants[1].profile_picture} />
            <div className = "chatText">
              <div className = "chatName">{this.capitalize(item.participants[1].first_name)} {this.capitalize(item.participants[1].last_name)}</div>
              <div className = "chatDescription">{this.chatDescription(item.get_messages[item.get_messages.length-1].body)}</div>
            </div>

            </div>
          </List>

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
