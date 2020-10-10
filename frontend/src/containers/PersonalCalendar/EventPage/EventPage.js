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

		EventPageWebSocketInstance.connect(this.props.match.params.eventId)

	}

	constructor(props){
		// Initialise the event page
		super(props)
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
		// New props will be the props after any of the props change

		// This will be re run everytime you access a different event page is loadup
		// so what you have to do is check if the old event id is the same as the new newprops
		// eventId.
		if(this.props.match.params.eventId !== newProps.match.params.eventId){
			// So before you can connect to other channels, you have to make sure that you
			// disconnect the previous channel or else things are gonna get sent in
			// duplicates
			EventPageWebSocketInstance.disconnect()
			this.waitForSocketConnection(()=> {
				EventPageWebSocketInstance.fetchMessages(
					newProps.match.params.eventId
				)
			})
			EventPageWebSocketInstance.connect(newProps.match.params.id)
		}

	}

	render() {

		console.log(this.props)

		return (
      <div className = 'eventPageContainer'>

				<EventInfo
				info = {this.props.eventInfo}
				 />


				<EventGroupChat
				messages = {this.props.eventMessages}
				 />


    </div>

		)
	 }
 }

 const mapStateToProps = state => {
   return {
     token: state.auth.token,
		 eventInfo: state.calendar.selectedEvent,
		 eventMessages: state.calendar.eventMessages
   }
 }

export default connect(mapStateToProps)(EventPage);
