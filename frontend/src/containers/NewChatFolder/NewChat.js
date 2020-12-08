import React from 'react';
import './NewChat.css';
import NewSidePanel from './NewSidePanel';
import NewChatContent from './NewChatContent';
import NewChatHeader from './NewChatHeader';

// This file will be holding all the components of the chat such as
// sidepanel, content, title, etc.

class NewChat extends React.Component{

  render(){
    console.log(this.props)

    return(
      <div className = "chatContainer">

      <div className = "chatLeftSide">
        <NewSidePanel />
      </div>


      <div className = "chatRightSide">
        <NewChatHeader />
        <NewChatContent />

      </div>

      </div>
    )
  }
}

export default NewChat;
