import React from 'react';
import moment from 'moment';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import { SendOutlined  } from '@ant-design/icons';
import { connect } from 'react-redux'
import './EventPage.css';
import Liking from '../../NewsfeedItems/Liking';
import EventPageWebSocketInstance from '../../../eventPageWebsocket';

class EventGroupChat extends React.Component{
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

  renderTimeDiff = timestamp => {
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    if(timeDiff > 20){
      return true;
    } else {
      return false;
    }
  }

  handleChange = e => {
    console.log(e.target.value)
    this.setState({
      message: e.target.value
    })
  }

  handleSubmit = e => {
    // This will handle sending information into the backend end then through
    // channels
    if(this.state.message !== ''){
      EventPageWebSocketInstance.sendEventMessage(
        this.state.message,
        this.props.id,
        this.props.eventId

      )

      this.setState({message: ''})
    }
  }

  scrollToBottom = () => {
    if(this.messagesEnd){
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });

    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }


  render(){
    const { TextArea } = Input;
    console.log(this.props)
    let messages = []
    if (this.props.messages){
      messages = this.props.messages
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

  let inviteList = [];
  if(this.props.inviteList){
    inviteList = this.props.inviteList
  }
  let eventHostId="";
  if(this.props.info.host){
    eventHostId = this.props.info.host.id
  }

    return(


      <div className = "eventGCContainer">


      {/*item.host.id==this.props.id
         (this.props.id==this.props.info.host.id)
        */}
    { ((inviteList.length > 0)||(eventHostId==this.props.id)) ?

      <div className = "notDisabledChatContainer">
        <div className = "messageCardContainer">
          <div class="eventGroupChatCard">


            <div className = "eventChatHeaderMiddle">
              <Liking
              num={4}
              history = {this.props.history}
              like_people={inviteList}/>
              <div class="chatHeader">
                You and {inviteList.length} others
              </div>
            </div>



          </div>
        </div>


      <div className = 'messageList'>
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
              <span className = "eventTextMessageHolder">
                <div className = 'userName'>{this.capitalize(item.messageUser.first_name)} {this.capitalize(item.messageUser.last_name)}</div>
                <div className = "eventMessage">{item.body}</div>

                {
                  this.renderTimeDiff(item.created_on) ?

                  <div className = 'eventTimeStamp'> {this.renderTimestamp(item.created_on)}</div>
                  :

                  <div></div>

                }
              </span>

              </div>
                :

                <div>
                  <div>{item.body}</div>

                </div>
              }



            </div>


          )}
        >
        <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
       </div>
        </List>
        </div>


      <div className = 'eventMessageInputForm'>

        <Form className = "eventInputForm">
          <Input
          className = 'eventChatInput'
          onChange = {this.handleChange}
          value = {this.state.message}
          onPressEnter = {this.handleSubmit}
          placeholder = "Send a message"
          rows={1}
          />

        <div className = "eventInputButtons">
          <div
            class="roundButton"
            onClick = {this.handleSubmit}
            type="primary"> Send
          </div>
        </div>
        </Form>


      </div>


      </div>

      :

      <div
      className = "chatDisabledPage"
      >
      <i
      style = {{
        fontSize: "25px"
      }}
      class="fas fa-exclamation-circle"></i>
      <div> Chats disabled because event is not shared </div>
      </div>

    }
    </div>

    )
  }
}

const mapStateToProps = state => {
  return{
    id: state.auth.id
  }
}

export default connect(mapStateToProps)(EventGroupChat);
