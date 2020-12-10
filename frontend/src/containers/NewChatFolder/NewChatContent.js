import React from 'react';
import './NewChat.css';
import { Input } from 'antd';



class NewChatContent extends React.Component{
  // This file will contain all the text in the current chat.

  render(){

    return (
      <div className = "newChatContent">
        Content

        <div className = "bottomBox">
          <form>
            <div className = "formInputs">
              <Input
              className = "chatInput"
              type = "text"
              placeholder = "Write your message..."
              />

              <span className = "sendButton">
              <i class="far fa-paper-plane"></i>
              </span>


            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default NewChatContent;
