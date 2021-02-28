import React from 'react';
import './NewChat.css';
import { Input, List, Avatar, Spin, Divider, Button, Tooltip} from 'antd';
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

  onProfileClick = (username) => {
    // This will redirec to the user profile page
    this.props.history.push("/explore/"+username)
  }

  onViewEvent = (eventId) => {
    // This function will be use to redirect to the selected event page
    this.props.history.push('/personalcal/event/'+ eventId)
  }


  renderMessages = (messageItem) => {

    // SEE IF THIS WORKS, IF IT DOES NOT THEN TRY JUST DOING A DIV AND THEN
    // LOOPING THROUGH ALL THE MESSAGES INTO A [] AND THEN REDNER IN INOT A
    // DIV --> SIMILAR TO THE CALENDAR

    // This function will render the correct message and messsage type
    const curUser = this.props.curId
    const messageUser = messageItem.messageUser.id
    console.log(messageItem)
    if(curUser === messageUser){
      // This message will take care of the case when you are the current user
        if(messageItem.type === "event"){
          // This conditional will take care of the event
          const eventDate = dateFns.format(new Date(messageItem.attachedEvent.start_time), "MMM dd,  yyyy")
          const eventStartTime = dateFns.format(new Date(messageItem.attachedEvent.start_time), 'hh:mm aaaa')
          const eventEndTime = dateFns.format(new Date(messageItem.attachedEvent.end_time), 'hh:mm aaaa')
          const personLength=messageItem.attachedEvent.person.length
          const eventId = messageItem.attachedEvent.id


          return (
            <div className = "chatListItemR">
              <div className= "messageEventContainerR eventCard">
                <div className = "messageEventTitleText">
                  {this.capitalize(messageItem.body)}
                </div>
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
                {personLength} people
                <br/>


                  <Tooltip placement="bottomLeft" title="View event">
                    <Button
                      onClick = {() => this.onViewEvent(eventId)}
                      type="primary" shape="circle" style={{float:'right', marginTop:"5px"}}>
                      <i class="fas fa-eye"></i>
                    </Button>
                  </Tooltip>



              </div>

            </div>

          )
        } else if (messageItem.type === "text"){
          // you are getting hte text
          // This will take care of the case where the message is just the chat
          return (
            <div className = "chatListItemR">
              <div className = "textMessageRight">
                <Tooltip placement="left" title={"8:00PM"}>
                  <div className = "messageRight">
                    {messageItem.body}
                  </div>
                </Tooltip>
              </div>
            </div>


          )
        }

    } else{
      if(messageItem.type === "event"){
        // This conditional will take care of the event

        const eventDate = dateFns.format(new Date(messageItem.attachedEvent.start_time), "MMM dd,  yyyy")
        const eventStartTime = dateFns.format(new Date(messageItem.attachedEvent.start_time), 'hh:mm aaaa')
        const eventEndTime = dateFns.format(new Date(messageItem.attachedEvent.end_time), 'hh:mm aaaa')
        const personLength=messageItem.attachedEvent.person.length
        const eventId = messageItem.attachedEvent.id

        return (
          <div className = "chatListItemL">

            <div className = "messageEventContainerL">
              <div className = "insideMessasgeHolder">
                <div className = "messageEventAvatarHolder">
                  <Avatar
                    onClick = {() => this.onProfileClick(messageItem.messageUser.username)}
                    className = 'messageAvatar'
                    size = {30} src = {`${global.IMAGE_ENDPOINT}`+messageItem.messageUser.profile_picture}  />
                </div>

                <div className = "messageEventTextHolder">
                  <div className = "messageEventTitleText">
                    {this.capitalize(messageItem.body)}
                  </div>
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
                  {personLength} people
                  <br/>
                    <Tooltip placement="bottomLeft" title="Accept Invite">
                      <Button
                      type="primary"
                      shape="circle"
                      danger
                      style={{
                        float:'right',
                        marginLeft:'10px',
                        marginTop:"5px"
                      }}
                      >
                      <i class="fas fa-user-times"></i>
                      </Button>
                    </Tooltip>
                    <Tooltip placement="bottomLeft" title="Decline Invite">
                      <Button
                      shape="circle"
                      type="primary"
                      style={{
                        float:'right',
                        marginLeft:'10px',
                        marginTop:"5px"
                      }}
                      >
                      <i  class="fas fa-user-check"></i>

                      </Button>
                    </Tooltip>

                    <Tooltip placement="bottomLeft" title="View event">
                      <Button
                        onClick = {() => this.onViewEvent(eventId)}
                         type="primary" shape="circle" style={{float:'right', marginTop:"5px"}}>
                        <i class="fas fa-eye"></i>
                      </Button>
                    </Tooltip>

                </div>

              </div>
            </div>
          </div>


        )
      } else if (messageItem.type === "text"){
        // user is getting text from someone else
        // This will take care of the case where the message is just the chat
        return (
          <div className = "chatListItemL">

            <div className = "textMessageLeft">

              <div className = "insideMessasgeHolder">
                <div className = "messageAvatarHolder">
                  <Avatar
                    onClick = {() => this.onProfileClick(messageItem.messageUser.username)}
                    className = 'messageAvatar'
                    size = {30} src = {`${global.IMAGE_ENDPOINT}`+messageItem.messageUser.profile_picture}  />
                </div>

                <div className = "messageTextHolder">
                  <Tooltip placement="right" title={"8:00PM"}>
                    <span className = "messageText">
                      <div
                        onClick = {() => this.onProfileClick(messageItem.messageUser.username)}
                        className = 'userName'>{this.capitalize(messageItem.messageUser.first_name)} {this.capitalize(messageItem.messageUser.last_name)}</div>
                      <div className = "eventMessage">
                        {messageItem.body}
                      </div>
                    </span>
                  </Tooltip>
                </div>
              </div>


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

        <div className = "searchChatInput">
          <form>
            <div className = "searchChatInputBox">
              <Input
              onChange = {this.handleChange}
              value = {this.state.message}
              className = "chatInput"
              type = "text"
              placeholder = "Write your message..."
              onPressEnter = {this.handleMessageSubmit}
              />
            </div>

          </form>
        </div>
      </div>
    )
  }
}

export default NewChatContent;
