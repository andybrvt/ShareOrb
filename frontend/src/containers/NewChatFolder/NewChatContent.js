import React from 'react';
import './NewChat.css';
import { Input, List, Avatar, Spin, Divider, Button} from 'antd';
import NewChatWebSocketInstance from '../../newChatWebsocket';
import ChatSidePanelWebSocketInstance from '../../newChatSidePanelWebsocket';
import { LoadingOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';



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

      // Send one to the chat list as well to update it
      // This where you will be adding people to seen here
      ChatSidePanelWebSocketInstance.updateRecentChat(
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
    if(this.messagesEnd){
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }

  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  renderMessages = (messageItem) => {

    // SEE IF THIS WORKS, IF IT DOES NOT THEN TRY JUST DOING A DIV AND THEN
    // LOOPING THROUGH ALL THE MESSAGES INTO A [] AND THEN REDNER IN INOT A
    // DIV --> SIMILAR TO THE CALENDAR

    // This function will render the correct message and messsage type
    const curUser = this.props.curId
    const messageUser = messageItem.messageUser.id

    if(curUser === messageUser){
      // This message will take care of the case when you are the current user
        if(messageItem.type === "event"){
          // This conditional will take care of the event
          const eventDate = dateFns.format(new Date(messageItem.eventStartTime), "MMM dd,  yyyy")
          const eventStartTime = dateFns.format(new Date(messageItem.eventStartTime), 'hh:mm aaaa')
          const eventEndTime = dateFns.format(new Date(messageItem.eventEndTime), 'hh:mm aaaa')
          const test=messageItem.eventPersons
          return (
            <div className = "chatTextBoxRight">
            <Avatar size = {30}
            // PICTURE URL
            src = {`${global.API_ENDPOINT}`+messageItem.messageUser.profile_picture}  />
            {/*
            <div className = 'chatNameTimeRight'>
              <div className = 'chatNameRight'>
                {this.capitalize(messageItem.messageUser.first_name)}
                 {this.capitalize(messageItem.messageUser.last_name)}
              </div>
              <div>

              </div>
            </div>
            */}
            <div className = "chatContentTextRight eventCard" style={{fontSize:'16px'}}>
              <span style={{float:'left', fontSize:'14px'}}>
                {this.capitalize(messageItem.body)}
              </span>
              <Divider/>
              {messageItem.eventTitle}
              <br />
              <i style={{color:"#1890ff",  marginRight:'10px', marginTop:'15px'}} class="far fa-calendar-alt"></i>
                 {eventDate}
              <br />
              <i class="fas fa-clock" style={{color:"#1890ff",  marginRight:'10px'}}></i>
              {eventStartTime} - {eventEndTime}
              <br />
              <i class="fas fa-user-friends" style={{color:"#1890ff", marginRight:'5px'}}></i>
              {test} people
              <br/>
              <Button type="primary" shape="round" style={{float:'right'}}>
                View Event
              </Button>
            </div>

            </div>
          )
        } else if (messageItem.type === "text"){
          // you are getting hte text
          // This will take care of the case where the message is just the chat
          return (
            <div className = "chatTextBoxRight">
            <div className = 'chatNameTimeRight'>

              <div>

              </div>
            </div>

            <div className = "messageToUser">
              {messageItem.body}
            </div>

            </div>

          )
        }

    } else{
      if(messageItem.type === "event"){
        // This conditional will take care of the event

        const eventDate = dateFns.format(new Date(messageItem.eventStartTime), "MMM dd,  yyyy")
        const eventStartTime = dateFns.format(new Date(messageItem.eventStartTime), 'hh:mm aaaa')
        const eventEndTime = dateFns.format(new Date(messageItem.eventEndTime), 'hh:mm aaaa')

        return (
          <div className= "chatTextBox">
          <Avatar size = {45}
          // PICTURE URL
          src = {`${global.API_ENDPOINT}`+messageItem.messageUser.profile_picture}  />
          <div className = 'chatNameTime'>
            <div className = 'chatName'>
              {this.capitalize(messageItem.messageUser.first_name)} {this.capitalize(messageItem.messageUser.last_name)}
            </div>
            <div>

            </div>
          </div>

          <div className = "chatContentText">
            {this.capitalize(messageItem.body)}
            <br />
            Title: {messageItem.eventTitle}
            <br />
            <i class="far fa-calendar"></i>
            {eventDate}
            <br />
            <i class="far fa-clock"></i>
            {eventStartTime} - {eventEndTime}
            <br />
            Click to check it out.
          </div>

          </div>
        )
      } else if (messageItem.type === "text"){
        // user is getting text from someone else
        // This will take care of the case where the message is just the chat
        return (
          <div className = "chatTextBox">

          <div className = 'chatNameTime'>

            <div>

            </div>
          </div>
          <Avatar size = {30} src = {`${global.API_ENDPOINT}` +messageItem.messageUser.profile_picture}  />
          <div className = "messageReceived">
            {messageItem.body}
          </div>

          </div>

        )
      }



    }



  }



  render(){
    console.log(this.props)
    console.log(this.state.message)
    let message = []
    if(this.props.messages){
      message = this.props.messages
    }
    console.log(message)
    return (
      <div className = "newChatContent">
      <div className = "chatWrapContainer">
        {
          !this.props.messages ?

          <LoadingOutlined style={{ fontSize: 24 }} spin />

          :

          <List
          className = "newChatTextContainer"
          itemLayout = "horizontal"
          dataSource = {message}
          renderItem = { item => (

            <div>
            {this.renderMessages(item)}
            </div>

          )

          }

          >
          <div style={{ float:"left", clear: "both" }}
              ref={(el) => { this.messagesEnd = el; }}>
         </div>
          </List>


        }





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



            <i style={{color:'#1890ff', float:'right'}} class="sendButton fas fa-paper-plane"></i>
            </div>

          </form>
        </div>
      </div>
    )
  }
}

export default NewChatContent;
