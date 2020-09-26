import React from 'react';
import axios from 'axios';
import {Card, Button, Row, Col, Input} from 'antd';
import { Link, } from 'react-router-dom';
import { connect } from 'react-redux';


class EventSamplePage extends React.Component{
//this takes each of the value of the individual profiles and
//returns them

//states are specific objects of a class
	state={
		profileInfo:{},
	}

	render() {


		return (
      <div>

      <Row>
        <Col span={8}>
          col-8asdfffffffffffffffffffffffffffffffffff
          <Input placeholder="Basic usage" />
        </Col>
        <Col span={8} offset={8}>
          col-8
        </Col>
      </Row>

    </div>

		)
	 }
 }

 const mapStateToProps = state => {
   return {
     token: state.auth.token
   }
 }

export default EventSamplePage;
