import React from 'react';
import './NewChat.css';
import NewSidePanel from './NewSidePanel';
import NewChatContent from './NewChatContent';
import NewChatHeader from './NewChatHeader';
import { authAxios } from '../../components/util';
import NewChatWebSocketInstance from '../../newChatWebsocket';
import ChatSidePanelWebSocketInstance from '../../newChatSidePanelWebsocket';
import { connect } from 'react-redux';
import * as dateFns from 'date-fns';
import ManageChatHeader from './ManageChatHeader';
import NoChatsScreen from './NoChatsScreen';
import AddNewChatContent from './AddNewChatContent';
import CurChatManager from './CurChatManager';
import NoSAddNewChatContent from './NoSAddNewChatContent';
import * as calendarActions from '../../store/actions/calendars';
import * as messageActions from '../../store/actions/messages';
import { notification } from 'antd';

// This file will be holding all the components of the chat such as
// sidepanel, content, title, etc.

class NewChat extends React.Component{


  // This component will receiveprops will pull all the current chats that you
  // have
  state = {
    // The messgaes will be specific to the chat
    // Friend list is used to search for friend to find or make a new chat
    friendList:[],
    eventList: []
  }

  initialiseChat(){
    console.log(this.props)
    this.waitForSocketConnection(() => {

      NewChatWebSocketInstance.fetchMessages(
        this.props.parameter.id
      )
    })
    if(this.props.parameter.id === 'newchat' || this.props.parameter.id === "0"
    || this.props.parameter.id === "nosnewchat"
    ){
        NewChatWebSocketInstance.connect(null)
    } else{
      ChatSidePanelWebSocketInstance.sendSeen(
        this.props.parameter.id,
        this.props.curId
      )
      NewChatWebSocketInstance.connect(this.props.parameter.id)
    }

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
    authAxios.get(`${global.API_ENDPOINT}/mycalendar/avaliEvents`)
    .then(res => {
      this.setState({
        eventList: res.data
      })
    })
  }


  componentWillReceiveProps(newProps){
    console.log("new props")

    console.log(this.props)
    console.log(newProps)
    // When ever a new message is sent or you open up a new chat
    // it should send out an update of the seen
    if(this.props.parameter.id !== newProps.parameter.id
      && newProps.parameter.id !== "newchat"
      && newProps.parameter.id !== "0"
      && newProps.parameter.id !== "nosnewchat"
    ){
      NewChatWebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        NewChatWebSocketInstance.fetchMessages(
          newProps.parameter.id
        )
      })

      ChatSidePanelWebSocketInstance.sendSeen(
        newProps.parameter.id,
        newProps.curId
      )
      NewChatWebSocketInstance.connect(newProps.parameter.id)

    }


  }

  submitShareEvent = (eventId, participants, eventObj) => {
    // This function will share an event with everyon inside the chat
    // and then send a message in the chat to tell everyone that
    // someone shared and event to everyone

    // First get a list of ids, or names of everyone in the group and then
    // send that list into the backend, the mycalendar views and then
    // send a message in the chat. When they click on the chat it will direct
    // them to the event

    this.openNotification("bottomRight")

    console.log(eventId, participants, eventObj)

    // Now you will call a authaxios call inorder to add users in


    // This axios call is to just share the event with the person
    // no message sending
    authAxios.post(`${global.API_ENDPOINT}/mycalendar/shareEvent`, {
      eventId: eventId,
      participants: participants,
      curId: this.props.curId
    }).then(res => {
      console.log(res.data)
      this.setState({
        eventList: res.data
      })
    })


    // Now we got to make it suitable for chats that you are searching up

    if(this.props.parameter.id === "newchat" || this.props.parameter.id === "nosnewchat"){
      // Pretty much the same as creating an event but now you are just
      // sharing the event
      if(this.props.curChat.id){
        // This function will be for when the chat already exist
        const chatId = this.props.curChat.id
        const senderId = this.props.curId

        // First you will update the side panel
        ChatSidePanelWebSocketInstance.updateRecentChatEvent(
          chatId,
          senderId
        )


        // Case where you share an event when you are searching up a person that
        // already exist
        authAxios.post(`${global.API_ENDPOINT}/newChat/createChatEventMessage`,{
          chatId: this.props.curChat.id,
          senderId: senderId,
          eventObj: eventObj
        })
        .then(
          res => {
            this.props.history.push("/chat/"+res.data)
          }
        )

        // Now you will have to make an axios call to acutally

      } else {
        // thi else will be for when the chat doesnt exsit and you
        // need to make a new one

        const senderId = this.props.curId

        console.log("does it hit here")
        // Case where you share an even thwne you are searching up a peson that
         // does not exist
        authAxios.post(`${global.API_ENDPOINT}/newChat/createNewChatEventMessage`,{
          senderId: senderId,
          chatParticipants: [...participants, this.props.curId],
          eventObj: eventObj
        })
        .then(
          res => {
            console.log(res.data)
            ChatSidePanelWebSocketInstance.updateRecentChatEvent(
              res.data,
              senderId
            )
            this.props.history.push("/chat/"+res.data)

          }

        )


      }



    } else {
      // This is for when you are not trying to search someone up
      // and you are on their chat already
    const chatId = this.props.parameter.id
    const senderId = this.props.curId

    NewChatWebSocketInstance.sendSharedEventMessage(
      chatId,
      senderId,
      eventObj
    )

    ChatSidePanelWebSocketInstance.updateRecentChatEvent(
      chatId,
      senderId
    )


    }





  }

  componentWillUnmount(){
    NewChatWebSocketInstance.disconnect();

  }


  timeConvert = (time) => {
    // This function will take in a time and then covert the time to
    // a 1-24 hour hour so that it cna be used to add into the
    // date and be submited
    let hour = parseInt(time.substring(0,2))
    let minutes = parseInt(time.substring(3,5))
    let ampm = time.substring(5,8)

    let convertedTime = ''

    if (time.includes('PM')){
      if (hour !==  12){
        hour = hour + 12
      }
    } else if (time.includes('AM')){
      if(hour === 12){
        hour = 0
      }
    }

    const timeBundle = {
      firstHour: hour,
      firstMin: minutes
    }

    return timeBundle

  }


  submitCreateEvent = (eventObj, participants) => {
    // This function will be used to create an shared event with everyone in
    // the group. and then send out to everyone in the chat that an event has been
    // shared with them
    console.log(eventObj, participants)

    this.openNotification("bottomRight")

    let start_date = dateFns.startOfDay(new Date(eventObj.start_date))
    let end_date = dateFns.startOfDay(new Date(eventObj.end_date))


    const start_time  = this.timeConvert(eventObj.start_time)
    const end_time = this.timeConvert(eventObj.end_time)

    start_date = dateFns.addHours(start_date, start_time.firstHour)
    start_date = dateFns.addMinutes(start_date, start_time.firstMin)

    end_date = dateFns.addHours(end_date, end_time.firstHour)
    end_date = dateFns.addMinutes(end_date, end_time.firstMin)

    const eventObjNew = {
      title: eventObj.title,
      content: eventObj.content,
      start_time: start_date,
      end_time: end_date,
      location: eventObj.location,
      eventColor: eventObj.event_color,
      repeatCondition: eventObj.repeatCondition,
      person: [this.props.curId]

    }
    // You have to process the start date and time so that it is one adherence
    // date time to be used in the models

    let sharedEventObj = {}

    // This just creates the share event in the calendar
    authAxios.post(`${global.API_ENDPOINT}/mycalendar/createChatEvent`, {
      eventObj: eventObjNew,
      participants: participants,
      curId: this.props.curId
    }).then(res => {

      // You would probally need to get the event object here so you are
      // able to get the event id

      console.log(res.data)
      sharedEventObj = res.data.sharedEvent

      console.log(sharedEventObj)

      this.setState({
        eventList: res.data.eventList
      })


      if(this.props.parameter.id === "newchat" || this.props.parameter.id === "nosnewchat"){
        // For here you will push to the chat page, but before you do that you have
        // to create the event message. You will do this through an axios call


        // Now you have to differentiate whether or not it is a new chat or a
        // old chat so that you know whether or not to create one or just create
        // a message and then pull it.
        if(this.props.curChat.id){
          // This will check if the chat exist or not

          const chatId = this.props.curChat.id
          const senderId = this.props.curId


          // This is just used to update the side panel
          ChatSidePanelWebSocketInstance.updateRecentChatEvent(
            chatId,
            senderId
          )

          // You would make a new message here whne the chat is already created
          // and you are in search
          authAxios.post(`${global.API_ENDPOINT}/newChat/createChatEventMessage`,{
            chatId: this.props.curChat.id,
            senderId: senderId,
            eventObj: sharedEventObj
          })
          .then(
            res => {
              this.props.history.push("/chat/"+res.data)
            }
          )

        } else {

          // This will also take care of the shared event when you are sending to
          // someone new through the mesasge button
          const senderId = this.props.curId


          console.log('does it hit here')
          // now you will create an event for this
          // Same case at the top, create an event messgae when a chat does not
          // exist
          authAxios.post(`${global.API_ENDPOINT}/newChat/createNewChatEventMessage`,{
            senderId: senderId,
            chatParticipants: [...participants, this.props.curId],
            eventObj: sharedEventObj
          })
          .then(
            res => {
              console.log(res.data)
              ChatSidePanelWebSocketInstance.updateRecentChatEvent(
                res.data,
                senderId
              )
              this.props.history.push("/chat/"+res.data)

            }
          )


        }


      } else {

        console.log(sharedEventObj)

        const chatId = this.props.curChat.id
        const senderId = this.props.curId

        // This is used to actually send the message out to the
        // current chat (needs to be on the chat page tho)
        NewChatWebSocketInstance.sendSharedEventMessage(
          chatId,
          senderId,
          sharedEventObj
        )




        // This is just used to update the side panel
        ChatSidePanelWebSocketInstance.updateRecentChatEvent(
          chatId,
          senderId
        )
      }


    })


    console.log(sharedEventObj)


    // Now we need to do one where you are on the search




  }


  openNotification = (placement) => {
  notification.info({
    message: `Event Shared`,
    description:
      'You shared an event to the group',
    placement,
  });
  };




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
        <ManageChatHeader
        history = {this.props.history}
         />

        <NewSidePanel
        chatList = {chats}
        param = {this.props.parameter}
        curId = {this.props.id}
        username = {this.props.username}
        history = {this.props.history}
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

          <div className = "chatRightSide">
            <AddNewChatContent
            followers = {this.props.followers}
            following = {this.props.following}
            curId = {this.props.curId}
            history = {this.props.history}
            setMessages = {this.props.setMessages}
            />
          </div>

          :

          this.props.parameter.id === "nosnewchat" ?

          <div className = "chatRightSide">
            <NoSAddNewChatContent
            curId = {this.props.curId}
            history = {this.props.history}
            setMessages = {this.props.setMessages}
            curChat = {this.props.curChat}
            />
          </div>

          :

          <div className = "chatRightSide">

            <NewChatContent
            messages = {messages}
            curId = {this.props.id}
            parameter = {this.props.parameter}
            history ={this.props.history}
            updateMessage = {this.props.updateMessage}
             />

          </div>





      }


        <div className = "chatFarRightSide">

          <CurChatManager
          curChat = {this.props.curChat}
          curId = {this.props.id}
          eventList = {this.state.eventList}
          parameter = {this.props.parameter}
          submitShareEvent = {this.submitShareEvent}
          history = {this.props.history}
          submitCreateEvent ={this.submitCreateEvent}
           />

        </div>



      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    messages: state.message.messages,
    chats: state.message.chats,
    curChat: state.message.curChat,
    following: state.auth.following,
    followers: state.auth.followers,
    curId: state.auth.id,
    events: state.calendar.events,
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatch => {
  return{
    getEvents: () => dispatch(calendarActions.getUserEvents()),
    setMessages: (messages, curChat) => dispatch(messageActions.setMessages(messages, curChat)),
    updateMessage: (message) => dispatch(messageActions.updateMessage(message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewChat);
