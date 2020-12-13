import React from 'react';
import './NewChat.css';
import { Input, List, Avatar} from 'antd';
import NewChatWebSocketInstance from '../../newChatWebsocket';



class NewChatContent extends React.Component{
  // This file will contain all the text in the current chat.

  state = {
    message: ""
  }

  handleChange = e => {
    console.log(e.target.value)
    this.setState({
      message: e.target.value
    })
  }

  // This will handle the submiting of the chats. You will need to submit
  // the chatid, current person sending the chat id, and the message
  handleMessageSubmit = e => {
    e.preventDefault()
    if(this.state.message !== ""){
      NewChatWebSocketInstance.sendNewChatCreatedMessage(
        this.props.parameter.id,
        this.props.curId,
        this.state.message
      )

      this.setState({
        message: ""
      })
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(){
    console.log(this.props)
    console.log(this.state.message)

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

        >
        <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
       </div>
        </List>
        </div>

        <div className = "bottomBox">
          <form>
            <div className = "formInputs">
              <Input
              onChange = {this.handleChange}
              value = {this.state.message}
              className = "chatInput"
              type = "text"
              placeholder = "Write your message..."
              onPressEnter = {this.handleMessageSubmit}
              />

              <span className = "sendButton">
              </span>


            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default NewChatContent;
