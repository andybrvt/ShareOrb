import React from 'react';
import './NewChat.css';

class NewChatContent extends React.Component{
  // This file will contain all the text in the current chat.

  render(){

    return (
      <div className = "newChatContent">
        Content

        <div className = "bottomBox">
          <form>
            <div className = "">
              <input
              className = "chatInput"
              type = "text" />
              <button />

            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default NewChatContent;
