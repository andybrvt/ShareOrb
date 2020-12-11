import React from 'react';
import './NewChat.css';
import NewSidePanel from './NewSidePanel';
import NewChatContent from './NewChatContent';
import NewChatHeader from './NewChatHeader';
import { authAxios } from '../../components/util';


// This file will be holding all the components of the chat such as
// sidepanel, content, title, etc.

class NewChat extends React.Component{


  // This component will receiveprops will pull all the current chats that you
  // have
  state = {
    chatList: []
  }


  componentWillReceiveProps(newProps){
    console.log("new props")
    authAxios.get('http://127.0.0.1:8000/newChat/?userId='+newProps.id)
    .then( res => {
      console.log(res.data)
      this.setState({
        chatList: res.data
      })
    })

  }

  render(){
    console.log(this.props)
    console.log(this.state)
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
        <NewChatContent />

      </div>

      </div>
    )
  }
}

export default NewChat;
