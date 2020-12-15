import React from 'react';
import './NewChat.css';
import NewSidePanel from './NewSidePanel';
import NewChatContent from './NewChatContent';
import NewChatHeader from './NewChatHeader';
import { authAxios } from '../../components/util';
import NewChatWebSocketInstance from '../../newChatWebsocket';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import ManageChatHeader from './ManageChatHeader';
import NoChatsScreen from './NoChatsScreen';

// This file will be holding all the components of the chat such as
// sidepanel, content, title, etc.

class NewChat extends React.Component{


  // This component will receiveprops will pull all the current chats that you
  // have
  state = {
    // The messgaes will be specific to the chat
    // Friend list is used to search for friend to find or make a new chat
    friendList:[]
  }

  initialiseChat(){
    this.waitForSocketConnection(() => {

      NewChatWebSocketInstance.fetchMessages(
        this.props.parameter.id
      )
    })
    NewChatWebSocketInstance.connect(this.props.parameter.id)
  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){
        console.log(NewChatWebSocketInstance.state())
        if (NewChatWebSocketInstance.state() === 1){
          console.log('connection is secure');
          callback();
          return;
        } else{
            console.log('waiting for connection...')
            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  constructor(props){
    super(props)
    this.initialiseChat()
  }


  componentWillReceiveProps(newProps){
    console.log("new props")
    if(this.props.parameter.id !== newProps.parameter.id){
      NewChatWebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        NewChatWebSocketInstance.fetchMessages(
          newProps.parameter.id
        )
      })
      NewChatWebSocketInstance.connect(newProps.parameter.id)
    }




  }




  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }

  render(){
    console.log(this.props.parameter.id)
    console.log(this.state)
    let messages = []
    let chats = []

    if(this.props.messages){
      messages = this.props.messages
    }

    if(this.props.chats){
      chats = this.props.chats
    }

    return(
      <div className = "chatContainer">

      <div className = "chatLeftSide">
        <ManageChatHeader />

        <NewSidePanel
        chatList = {chats}
        param = {this.props.parameter}
        curId = {this.props.id}
        />
      </div>

      {
        parseInt(this.props.parameter.id) === 0 ?

        <div className = "chatRightSide">
          <NoChatsScreen
          history = {this.props.history}
          />
        </div>

        :


          this.props.parameter.id === "newchat" ?

          <div>
            New chat
          </div>

          :

          <div className = "chatRightSide">
            <NewChatHeader
            curChat = {this.props.curChat}
            curId = {this.props.id}
            />
            <NewChatContent
            messages = {messages}
            curId = {this.props.id}
            parameter = {this.props.parameter}
             />

          </div>





      }


      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    messages: state.message.messages,
    chats: state.message.chats,
    curChat: state.message.curChat
  }
}

export default connect(mapStateToProps)(NewChat);
