import React from 'react';
import { Input, List, Avatar, Spin, Select} from 'antd';
import './NewChat.css';
import { connect } from 'react-redux';
import { authAxios } from '../../components/util';
import ChatSidePanelWebSocketInstance from '../../newChatSidePanelWebsocket';

// This file will be used for the empty chat when you are directing to
// the chat of a person that you currently dont have a chat with


// This will pretty much be an empty chat where you just type words in inorder
// to send it to the actual person
class NoSAddNewChatContent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      message: '',
    }
  }

  componentDidMount(){
    // So what you wnat to do is first clear out the curChat and
    // messages
    // this.props.setMessages([], {})

  }

  handleInputChange = e => {
    // This is the handle change for the input
    this.setState({
      message: e.target.value
    })
  }


  handleMessageSubmit = e => {
    e.preventDefault()
    // This function will be used to handle submission of chats but the thing
    // that this is different from that of the handleMessageSubmit in the
    // addNewChatContainer because this is only for new chats only
    // so we will only just have to create the chats

    let participantList = []
    for(let i = 0; i< this.props.curChat.participants.length; i++){
      participantList.push(
        this.props.curChat.participants[i].id
      )
    }


    if(this.state.message != ""){
      authAxios.post(`${global.API_ENDPOINT}/newChat/createChat`, {
        senderId: this.props.curId,
        chatParticipants: participantList,
        message: this.state.message
      })
      .then(
        res => {
          console.log(res.data)
          // Now that you have created the chat now you can just redict to it
          // and then send it through the side panel
          ChatSidePanelWebSocketInstance.sendNewCreatedChat(res.data)

          this.setState({
            message: ""
          })
          this.props.history.push("/chat/"+res.data)

        }
      )
    }


  }




  render() {
    console.log(this.props)
    return(

      <div className = "addNewChatContainer">

        <div className = "searchChatContent">



        </div>


        <div className = "searchChatInput">
          <form>
            <div className = "searchChatInputBox">
            <Input
            onChange = {this.handleInputChange}
            value = {this.state.message}
            placeholder = "Write your message..."
            className = "chatInput"
            onPressEnter = {this.handleMessageSubmit}
             />
            </div>
          </form>
        </div>
      </div>
    )

  }


}

export default NoSAddNewChatContent;
