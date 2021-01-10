import React from 'react';
import "./SocialEventPage.css";
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import SocialEventPageWebSocketInstance from '../../../socialEventPageWebsocket';
import * as dateFns from 'date-fns';


class SocialEventGroupChat extends React.Component{
// This class is to hold the information for the group chats in
// the socialEventgroupchat


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  state = {
    message: ''
  }


  renderTimestamp = timestamp =>{
    let prefix = '';
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    if (timeDiff <= 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  handleChange = e => {
    console.log(e.target.value)
    this.setState({
      message: e.target.value
    })
  }

  handleSubmit = e => {
    // handle sending information into the backend then to channels
    if(this.state.message !== ''){
      SocialEventPageWebSocketInstance.sendSocialEventMessage(
        this.state.message,
        this.props.id,
        this.props.eventId
      )

      this.setState({message: ''})

    }
  }

  scrollToBottom = () => {
    //This function along with the componentDidMount and componentDidUpdate will
    // let the chat keep scrolling down as you type more text
    if(this.messagesEnd){
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    }
  }


  checkDay = (eventDay, eventTime) =>{
      // Checks if the event day and time has passed the current event date and
      // time. If it is then it will return true if it is not the it will retunr
      // false

    console.log(eventDay, eventTime)
    let eventDate = dateFns.addHours(new Date(eventDay), 7)
    const timeList = eventTime.split(":")
    eventDate = dateFns.addHours(eventDate, timeList[0])
    eventDate = dateFns.addMinutes(eventDate, timeList[1])
    console.log(eventDate)
    return dateFns.isAfter(eventDate, new Date())

  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(){

    let messages = []
    if(this.props.messages){
      messages = this.props.messages
    }

  console.log(this.props)

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
    return (
      <div className = {`socialEventGroupChat ${this.props.active ? "" : "active"}`}>
         <div className = "socialMessageList">
         <List
             itemLayout="horizontal"
             dataSource={messages}
             renderItem={item => (
               <div className = {`${this.props.id === item.messageUser.id ?
                 "eventMessageItemUser" : "eventMessageItemNotUser"}`}>

                 {this.props.id !== item.messageUser.id ?
                   <div>
                   <Avatar
                   className = 'eventMessageAvatar'
                   size = {30} src = {`${global.IMAGE_ENDPOINT}`+item.messageUser.profile_picture} />
                   </div>
                   :

                   <div></div>
                 }
                 <div className = 'messageP'>
                 {this.props.id !== item.messageUser.id ?
                   <span className = 'userName'>{this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}
                   </span>
                   :
                   <span></span>

                 }


               <div>{item.body}</div>
               <div className = 'eventTimeStamp'> {this.renderTimestamp(item.created_on)}</div>
               </div>
               </div>
             )}
           >
           <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
          </div>
           </List>
        </div>


        <div className = "inputForm">
        {
          this.checkDay(this.props.date, this.props.endTime) ?
          <div>
            <Form>
              <Input
              className = "eventChatInput"
              onChange = {this.handleChange}
              value = {this.state.message}
              onPressEnter = {this.handleSubmit}
              placeholder = "Write a message..."
              />
            </Form>
            <Button
              style={{float:'right', marginTop:'10px', marginRight:'20px'}}
              class="roundButton"
              onClick = {this.handleSubmit} type="primary"> Chat </Button>
            </div>


          :

          <div className = 'eventEndText' >
            Event has ended. You can no long send messages.
          </div>
        }


        </div>

      </div>
    )
  }
}


export default SocialEventGroupChat;
