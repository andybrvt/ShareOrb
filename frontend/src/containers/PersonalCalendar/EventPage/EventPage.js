import React from 'react';
import axios from 'axios';
import {Card, Button, Row, Col, Input} from 'antd';
import { Link, } from 'react-router-dom';
import { connect } from 'react-redux';
import EventGroupChat from './EventGroupChat';
import EventInfo from './EventInfo';
import EventPageWebSocketInstance from '../../../eventPageWebsocket';

class EventPage extends React.Component{
//this takes each of the value of the individual profiles and
//returns them

//states are specific objects of a class
	state={
		profileInfo:{},
	}

	initialiseChat() {
		this.waitForSocketConnection(()=> {
			EventPageWebSocketInstance.fetchMessages(
				this.props.match.params.eventId
			)
		})
		if(this.props.match.params.eventId){
			EventPageWebSocketInstance.connect(this.props.match.params.eventId)

		}

	}

	constructor(props){
		// Initialise the event page
		super(props)

		console.log('hit here too')
	}

	componentDidMount (){
		this.initialiseChat()
	}

	waitForSocketConnection(callback){
		// This is pretty much a recursion that tries to reconnect to the websocket
		// if it does not connect
		const component = this;
		setTimeout(
			function(){
				console.log(EventPageWebSocketInstance.state())
				if (EventPageWebSocketInstance.state() === 1){
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
		console.log(newProps)

		if(this.props.match.params.eventId !== newProps.match.params.eventId){
			EventPageWebSocketInstance.disconnect();
			this.waitForSocketConnection(()=>{
				EventPageWebSocketInstance.fetchMessages(
					newProps.match.params.eventId
				)
			})
			EventPageWebSocketInstance.connect(newProps.match.params.eventId)

		}

	}

	componentWillUnmount(){
		EventPageWebSocketInstance.disconnect();

	}

	render() {

		console.log(this.props)

		return (
      <div className = 'eventPageContainer'>

				<EventInfo
				info = {this.props.eventInfo}
				userId = {this.props.id}
				history = {this.props.history}
				 />


				<EventGroupChat
				messages = {this.props.eventMessages}
				eventId = {this.props.eventInfo.id}
				inviteList = {this.props.eventInfo.invited}
				 />


    </div>

		)
	 }
 }

 const mapStateToProps = state => {
   return {
     token: state.auth.token,
		 eventInfo: state.calendar.selectedEvent,
		 eventMessages: state.calendar.eventMessages,
		 id: state.auth.id
   }
 }

export default connect(mapStateToProps)(EventPage);
