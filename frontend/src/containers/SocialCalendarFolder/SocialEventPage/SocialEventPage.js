import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import SocialEventInfo from "./SocialEventInfo";
import SocialEventGroupChat from "./SocialEventGroupChat";
import SocialEventPageWebSocketInstance from '../../../socialEventPageWebsocket';

import "./SocialEventPage.css"

class SocialEventPage extends React.Component{
  // This will retrive the values of the invidual evnets and reutrns them
  constructor(props){
    super(props)
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
  }

  componentWillUnmount(){
    SocialEventPageWebSocketInstance.disconnect();

  }

  render(){

    console.log(this.props)
    return (
      <div className = "socialEventPageContainer">

      <SocialEventInfo
      info = {this.props.socialEventInfo}
      userId = {this.props.id}
       />


      <SocialEventGroupChat
      messages = {this.props.socialEventMessages}
      id = {this.props.id}
      eventId = {this.props.socialEventInfo.id}
       />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    socialEventInfo: state.socialCal.selectedSocialEvent,
    socialEventMessages: state.socialCal.socialEventMessages,
    id: state.auth.id
  }
}

export default connect(mapStateToProps)(SocialEventPage);
