import React from 'react';
import { Input, List, Avatar, Spin, Select} from 'antd';
import './NewChat.css';
import { connect } from 'react-redux';
import { authAxios } from '../../components/util';
import ChatSidePanelWebSocketInstance from '../../newChatSidePanelWebsocket';


// This fucntion will be the search function and add function
// when you are trying to add new chats or make new chats
const { Option } = Select;



class AddNewChatContent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      person: [],
      messages: [],
      message: '',
      curChatId: ''
    }
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


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleInputChange = e => {
    // This is the handle change for the input
    this.setState({
      message: e.target.value
    })
  }

  handleMessageSubmit = e => {
    e.preventDefault()
    // This will handle the submission of the chats. What is gonna happend
    // is that you are gonna send it by the chats websocket. You will
    // find the right chat, get out the messages and then send out the
    // chat list, you don't need to send the message because you will make it
    // in the backend before the chat renders so it would get it

    // You have to handle the case where a chat does exist and a chant doesnot exist

    if(this.state.curChatId !== ""){
      // This would mean that there is a chat that exist, so you would just send
      // a message.
      // The updateRecentChat should work for this part
      ChatSidePanelWebSocketInstance.updateRecentChatMessage(
        this.state.curChatId,
        this.props.curId,
        this.state.message
      )

      this.setState({
        person: [],
        messages: [],
        message: '',
        curChatId: ''
      })

      this.props.history.push("/chat/"+this.state.curChatId)


    } else{
      // If there is no curChatId then you gotta make it so that the chat creates
      // and then direct to the new chat page

      console.log('create new chat here')
      authAxios.post("http://127.0.0.1:8000/newChat/createChat",{
        senderId: this.props.curId,
        chatParticipants: [...this.state.person, this.props.curId],
        message: this.state.message
      })
      .then(
        res=> {
          console.log(res.data)
          // Now that you created the chat you can redirect to the new page
          // Now you would wnat to throw in the websocket for chatList her
          ChatSidePanelWebSocketInstance.sendNewCreatedChat(res.data)

          this.setState({
            person: [],
            messages: [],
            message: '',
            curChatId: ''
          })
          this.props.history.push("/chat/"+res.data)
        }
      )
      // ChatSidePanelWebSocketInstance.createNewChatMessage(
      //   this.props.curId,
      //   this.state.person,
      //   this.state.message
      // )

    }
  }

  renderPeopleSearch = () => {
    // This part will consit of all your followers and following
    // let followers = this.props.followers
    // let following = this.props.following
    // const newList = followers.concat(following)
    let followers = []
    let following = []
    let searchList = []
    if(this.props.followers){
      followers = this.props.followers
    }
    if(this.props.following){
      following = this.props.following
    }
    // To pick who you want to serach just change the list here


    // Do it with just following for now

    let chatOptions = []

    for(let i = 0; i<following.length; i++){
      // This will make all the select child
      chatOptions.push(
        <Option value = {following[i].id}
        label = {this.capitalize(following[i].username)}>
          {this.capitalize(following[i].username)}
        </Option>

      )
    }

    return chatOptions

  }

  handleChange = (value) =>{
    this.setState({
      person: value
    })

    if(value.length > 0){
      authAxios.post("http://127.0.0.1:8000/newChat/getChat",
        {
          person: [...value, this.props.curId]
        }
      ).then(
        res => {
          console.log(res.data)
          this.setState({
            messages:res.data.messages,
            curChatId: res.data.chatId
          })
        }
      )
    } else {
      this.setState({
        messages: []
      })
    }




  }


  render(){

    console.log(this.props)
    console.log(this.state)


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


    return(
      <div className ="addNewChatContainer">
        <div className = "searchFormBox">
          <form className = "searchForm">
          <div className = 'toText'>
          To:
          </div>
          <Select
            mode="multiple"
            // style={{ width: '100%' }}
            placeholder="Search users"
            onChange={this.handleChange}
            value = {this.state.person}
            optionLabelProp="label"
            className = "searchBox"
          >
            {this.renderPeopleSearch()}
            </Select>
          </form>
        </div>

      <div className = "searchChatContent">


      <List
      className = "newChatTextContainer"
      itemLayout = "horizontal"
      dataSource = {this.state.messages}
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

      {
        this.state.person.length > 0 ?
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

        :

        <div></div>

      }




      </div>

    )

  }
}

export default AddNewChatContent;
