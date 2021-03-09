import React from 'react';
import './NewChat.css';
import { Button } from 'antd';


class NoChatsScreen extends React.Component{

  onClickAddChats =() => {
    // This fucntion will redirect to the create chat view
    this.props.history.push('/chat/newchat')
  }

  render(){
    console.log(this.props)
    return (
      <div className= "noChatsScreen">
      <div className = "noChatsWord">
        <i class="fas fa-comments"></i> &nbsp;
        No chats available
      </div>
      <br/>
        <div className = "createChatButtonContainer">
        <Button
        onClick = {() => this.onClickAddChats()}
         type = "primary">
          Create Chat
        </Button>
        </div>
      </div>

    )
  }
}

export default NoChatsScreen;
