import React from 'react';
import './NewChat.css';
import NewSidePanel from './NewSidePanel';
import NewChatContent from './NewChatContent';
import NewChatHeader from './NewChatHeader';
import { authAxios } from '../../components/util';
import NewChatWebSocketInstance from '../../newChatWebsocket';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';


// This file will be holding all the components of the chat such as
// sidepanel, content, title, etc.

class NewChat extends React.Component{


  // This component will receiveprops will pull all the current chats that you
  // have
  state = {
    // The messgaes will be specific to the chat
    chatList: [],
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

    authAxios.get('http://127.0.0.1:8000/newChat/?userId='+newProps.id)
    .then( res => {
      console.log(res.data)
      this.setState({
        chatList: res.data
      })
    })


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
    console.log(this.props)
    console.log(this.state)
    let messages = []

    if(this.props.messages){
      messages = this.props.messages
    }

    return(
      <div className = "chatContainer">

      <div className = "chatLeftSide">
        <NewSidePanel
        chatList = {this.state.chatList}
        param = {this.props.parameter}
        />
      </div>


      <div className = "chatRightSide">
        <NewChatHeader />
        <NewChatContent
        messages = {messages}
        curId = {this.props.id}
         />

      </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    messages: state.message.messages
  }
}

export default connect(mapStateToProps)(NewChat);
