import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Switch, notification, Button } from 'antd';
import SocialEventInfo from "./SocialEventInfo";
import SocialEventGroupChat from "./SocialEventGroupChat";
import SocialEventPageWebSocketInstance from '../../../socialEventPageWebsocket';

import "./SocialEventPage.css"


class SocialEventPage extends React.Component{
  // This will retrive the values of the invidual evnets and reutrns them
  constructor(props){
    super(props)

  }

  state = {
    showChats: false,
  }

  initialiseSocialEvent(){
    this.waitForSocketConnection(() => {
      SocialEventPageWebSocketInstance.fetchSocialMessages(
          this.props.match.params.socialEventId
      )
    })
    if(this.props.match.params.socialEventId){
      SocialEventPageWebSocketInstance.connect(this.props.match.params.socialEventId)
    }

  }

  componentDidMount(){
    this.initialiseSocialEvent()
  }


  waitForSocketConnection(callback){
    // This is pretty much a recursion that tries to reconnect to the websocket
    // if it does not connect
    const component = this;
    setTimeout(
      function(){
        console.log(SocialEventPageWebSocketInstance.state())
        if (SocialEventPageWebSocketInstance.state() === 1){
          console.log('connection is secure');
          callback();
          return;
        } else {
          console.log('waiting for connection...')
          component.waitForSocketConnection(callback)
        }
      }, 100)
  }


  componentWillReceiveProps(newProps){
    // This pretty much checks if the socialevent page has change, to know that if
    // it chaned or not you will look at the soicaleventid
    if(this.props.match.params.socialEventId !== newProps.match.params.socialEventId){
      SocialEventPageWebSocketInstance.disconnect();
      this.waitForSocketConnection(()=>{
				SocialEventPageWebSocketInstance.fetchMessages(
					newProps.match.params.socialEventId
				)
			})
			SocialEventPageWebSocketInstance.connect(newProps.match.params.eventId)


    }

    if(newProps.showDeleted){
      this.openNotification();
    }


  }

  componentWillUnmount(){
    SocialEventPageWebSocketInstance.disconnect();

  }

  // onShowViewChat = () => {
  //   this.setState({
  //     showChats: true
  //   })
  // }
  //
  // onCloseViewChat = () => {
  //   this.setState({
  //     showChats: false
  //   })
  // }

  onShowChatChange = (checked) => {
    console.log(checked)
    this.setState({
      showChats: checked
    })
  }


  openNotification = () => {
    const key = `open${Date.now()}`;
    const username = this.props.socialEventInfo.host.username

      const btn = (
        <Button type="primary" size="small" onClick={() => {
            this.props.history.push("/explore/"+username)
            notification.close(key)

        }}>
          Return
        </Button>
      );


    // This is used to indicate that the event has been deleted and exist
    // out of the event
  notification.open({
    message: 'Event Deleted',
    description:
      'This event has been deleted by the host. Chats will not work anymore. Please click to return to user profile page',
    onClick: (key) => {
      this.onProfileReturn(key);
    },
    btn,
    key,
    duration: 0,

  });
};

  render(){

    let backgroundImage = ""
    if(this.props.socialEventInfo.backgroundImg){
      backgroundImage = this.props.socialEventInfo.backgroundImg
    }

    console.log(this.props)
    return (
      <div>
      {
        this.props.socialEventInfo.title ?

        <div className ={`socialEventPageContainer ${this.state.showChats ? "" : "active"}` }>

        <img
        className = "socialEventBackgroundPic"
        src = {'http://127.0.0.1:8000'+backgroundImage} />

        <div className = "showChatWords"> Show chats </div>
        <Switch
        className = "showChatSwitch"

        defaultChecked checked = {this.state.showChats} onChange={this.onShowChatChange} />


        <SocialEventInfo
        info = {this.props.socialEventInfo}
        userId = {this.props.id}
        active = {this.state.showChats}
        history = {this.props.history}
         />


        <SocialEventGroupChat
        messages = {this.props.socialEventMessages}
        id = {this.props.id}
        eventId = {this.props.socialEventInfo.id}
        active = {this.state.showChats}
         />

        </div>


        :

        <div className = "socialEventDoesNotPage">
          <i class="fas fa-exclamation-circle"></i>
          <div>
          Event page does not exist anymore.
          </div>
        </div>


      }

      </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    socialEventInfo: state.socialCal.selectedSocialEvent,
    socialEventMessages: state.socialCal.socialEventMessages,
    id: state.auth.id,
    showDeleted: state.socialCal.showDeleted
  }
}

export default connect(mapStateToProps)(SocialEventPage);
