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
import * as calendarActions from '../../store/actions/calendars';

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
    this.waitForSocketConnection(() => {

      NewChatWebSocketInstance.fetchMessages(
        this.props.parameter.id
      )
    })
    if(this.props.parameter.id === 'newchat'){
        NewChatWebSocketInstance.connect(null)
    } else{
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
    authAxios.get('http://127.0.0.1:8000/mycalendar/avaliEvents')
    .then(res => {
      this.setState({
        eventList: res.data
      })
    })
  }


  componentWillReceiveProps(newProps){
    console.log("new props")
    if(this.props.parameter.id !== newProps.parameter.id && newProps.parameter.id !== "newchat"){
      NewChatWebSocketInstance.disconnect();
      this.waitForSocketConnection(() => {
        NewChatWebSocketInstance.fetchMessages(
          newProps.parameter.id
        )
      })
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

    console.log(eventId, participants, eventObj)

    // Now you will call a authaxios call inorder to add users in


    authAxios.post("http://127.0.0.1:8000/mycalendar/shareEvent", {
      eventId: eventId,
      participants: participants,
      curId: this.props.curId
    }).then(res => {
      console.log(res.data)
      this.setState({
        eventList: res.data
      })
    })
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

    }
    // You have to process the start date and time so that it is one adherence
    // date time to be used in the models


    authAxios.post("http://127.0.0.1:8000/mycalendar/createChatEvent", {
      eventObj: eventObjNew,
      participants: participants,
      curId: this.props.curId
    }).then(res => {
      console.log(res.data)
      this.setState({
        eventList: res.data
      })

    })

    const chatId = this.props.parameter.id
    const senderId = this.props.curId

    NewChatWebSocketInstance.sendSharedEventMessage(
      chatId,
      senderId,
      eventObjNew
    )

    ChatSidePanelWebSocketInstance.updateRecentChatEvent(
      chatId,
      senderId
    )



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

            />
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
    events: state.calendar.events
  }
}

const mapDispatchToProps = dispatch => {
  return{
    getEvents: () => dispatch(calendarActions.getUserEvents()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewChat);
