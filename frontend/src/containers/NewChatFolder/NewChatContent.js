import React from 'react';
import './NewChat.css';
import { Input, List, Avatar} from 'antd';



class NewChatContent extends React.Component{
  // This file will contain all the text in the current chat.
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render(){
    console.log(this.props)

    return (
      <div className = "newChatContent">
      <div className = "chatWrapContainer">
        <List
        className = "newChatTextContainer"
        itemLayout = "horizontal"
        dataSource = {this.props.messages}
        renderItem = { item => (

          <div>
          {
            this.props.curId === item.messageUser.id ?

            <div className = "chatTextBoxRight">
            <Avatar size = {45} src = {'http://127.0.0.1:8000' +item.messageUser.profile_picture}  />
            <div className = 'chatNameTimeRight'>
              <div className = 'chatNameRight'>
                {this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
              </div>
              <div>

              </div>
            </div>

            <div className = "chatContentTextRight">
              {item.body}
            </div>

            </div>

            :

            <div className = "chatTextBox">
            <Avatar size = {45} src = {'http://127.0.0.1:8000' +item.messageUser.profile_picture}  />
            <div className = 'chatNameTime'>
              <div className = 'chatName'>
                {this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
              </div>
              <div>

              </div>
            </div>

            <div className = "chatContentText">
              {item.body}
            </div>

            </div>

          }
          </div>


        )

        }

        />
        </div>

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
