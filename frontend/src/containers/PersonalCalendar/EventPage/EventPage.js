import React from 'react';
import axios from 'axios';
import {Card, Button, Row, Col, Input} from 'antd';
import { Link, } from 'react-router-dom';
import { connect } from 'react-redux';
import EventGroupChat from './EventGroupChat';
import EventInfo from './EventInfo';

class EventPage extends React.Component{
//this takes each of the value of the individual profiles and
//returns them

//states are specific objects of a class
	state={
		profileInfo:{},
	}

	render() {


		return (
      <div className = 'eventPageContainer'>

				<EventInfo />


				<EventGroupChat />


    </div>

		)
	 }
 }

 const mapStateToProps = state => {
   return {
     token: state.auth.token
   }
 }

export default EventPage;
