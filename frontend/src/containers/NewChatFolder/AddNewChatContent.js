import React from 'react';
import { Input, List, Avatar, Spin, Divider, Button, Tooltip, Select} from 'antd';
import './NewChat.css';
import { connect } from 'react-redux';
import { authAxios } from '../../components/util';
import ChatSidePanelWebSocketInstance from '../../newChatSidePanelWebsocket';
import * as dateFns from 'date-fns';


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
    this.props.setMessages([], {})
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
      authAxios.post(`${global.API_ENDPOINT}/newChat/createChat`,{
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

  getChatUserProfile(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var profilePic = ""
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        profilePic = participantList[i].profile_picture
      }
    }

    return profilePic;

  }

  getChatUserUsername(participantList){
    // This function will show the correct userProfile that you are chatting
    // with

    // There should jsut be 2 for here so not too much run time
    var names = []
    for(let i = 0; i<participantList.length; i++){
      if(participantList[i].id !== this.props.curId){
        names.push(
            participantList[i].username
        )

      }
    }

    return names;

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
    console.log(following)
    // To pick who you want to serach just change the list here


    // Do it with just following for now

    let chatOptions = []

    for(let i = 0; i<following.length; i++){
      // This will make all the select child
      chatOptions.push(
        <Option value = {following[i].id}

        label = {this.capitalize(following[i].username)}>
        <Avatar size={20} style={{marginRight:'10px'}}
           src= {`${global.IMAGE_ENDPOINT}`+following[i].profile_picture} />
          {this.capitalize(following[i].first_name)+" "+this.capitalize(following[i].last_name)}
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
      authAxios.post(`${global.API_ENDPOINT}/newChat/getChat`,
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

          this.props.setMessages(res.data.messages, res.data.curChat)

        }
      )
    } else {


      this.setState({
        messages: []
      })

      this.props.setMessages([], {})

    }
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
          const eventDate = dateFns.format(new Date(messageItem.eventStartTime), "MMM dd,  yyyy")
          const eventStartTime = dateFns.format(new Date(messageItem.eventStartTime), 'hh:mm aaaa')
          const eventEndTime = dateFns.format(new Date(messageItem.eventEndTime), 'hh:mm aaaa')
          const test=messageItem.eventPersons
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
                {test} people
                <br/>
                  <Button type="primary" shape="round" style={{float:'right', marginTop:"5px"}}>
                    View Event
                  </Button>

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

        const eventDate = dateFns.format(new Date(messageItem.eventStartTime), "MMM dd,  yyyy")
        const eventStartTime = dateFns.format(new Date(messageItem.eventStartTime), 'hh:mm aaaa')
        const eventEndTime = dateFns.format(new Date(messageItem.eventEndTime), 'hh:mm aaaa')
        const test=messageItem.eventPersons

        return (
          <div className = "chatListItemL">

            <div className = "messageEventContainerL">
              <div className = "insideMessasgeHolder">
                <div className = "messageEventAvatarHolder">
                  <Avatar className = 'messageAvatar'
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
                  {test} people
                  <br/>
                    <Button type="primary" shape="round" style={{float:'right', marginTop:"5px"}}>
                      View Event
                    </Button>
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
                  <Avatar className = 'messageAvatar'
                    size = {30} src = {`${global.IMAGE_ENDPOINT}`+messageItem.messageUser.profile_picture}  />
                </div>

                <div className = "messageTextHolder">
                  <Tooltip placement="right" title={"8:00PM"}>
                    <span className = "messageText">
                      <div className = 'userName'>{this.capitalize(messageItem.messageUser.first_name)} {this.capitalize(messageItem.messageUser.last_name)}</div>
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
            placeholder={<i class="fas fa-user"
              > <span class="newUserSearchChat"> Search Users</span> </i> }
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
          {this.renderMessages(item)}
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
