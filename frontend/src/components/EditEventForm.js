import React, {useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";
import { DatePicker } from 'antd';
import * as dateFns from 'date-fns';
import * as navActions from '../store/actions/nav';
import * as calendarEventActions from '../store/actions/calendarEvent'
import moment from 'moment';




class EditEventForm extends React.Component{
  constructor(props){
    super(props)
  }
  state = {
    title: '',
    content: '',
    start_time: null,
    end_time: null,
    location: '',
  }

  make_post = (post) =>{
  	let data = uploadPost(post)
    this.setState({
      title: '',
      content: '',
      start_time: null,
      end_time: null,
      location: ''
    })
  	return data;
  }

  uploadPost =(post) =>{
   const data = new FormData();
   // console.log(dateFns.format(new Date(post.end_time), '%Y-%m-%d %H:%M:%S'))
   data.append("title", post.title);
   data.append("content", post.content);
   data.append("start_time", dateFns.format(new Date(post.start_time), 'yyyy-MM-dd hh:mm:ss'));
   data.append("end_time", dateFns.format(new Date(post.end_time), 'yyyy-MM-dd hh:mm:ss'));
   data.append("location", post.location);
   data.append("person", post.person);


   fetch('http://127.0.0.1:8000/mycalendar/events/create/',{
  	method: 'POST',
      headers: {
  	    Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body:data
  })
   .then (res =>res.json())
   .then(json =>{
     this.props.closePopup()
  	 return json
   })
  }

  onFormSubmit = (e) =>{
    e.preventDefault()
    console.log(e.err)
    const person = [this.props.id]
    if (this.props.title && this.props.content){
      const post = {
        'title': this.props.title,
        'content': this.props.content,
        'start_time': this.props.start_time,
        'end_time': this.props.end_time,
        'location': this.props.location,
        'user_id': this.props.id,
        // 'person': person,
      };
      console.log(post)
      // this.make_post(post);

    }
  }

  onChange = e => {
    console.log(e._isAMomentObject)
    if (e._isAMomentObject){
      console.log('yea')
    } else{
      this.props.changeEvent(e)
    }

  }


    // you cannot use on change with the states anymore because your value is now
    // in redux so you have to do change states in redux
  render (){
    console.log(this.props.start_time)
    console.log(this.props.end_time.toString())
    const dateFormat = 'YYYY-MM-DD'
    // const date = new Date(this.props.start_time)
    // const start_date = dateFns.format(date, dateFormat).substr(0,10)
    // console.log(start_date)
    return (
      <Container style={{paddingTop: '10',zIndex:'-1'}}>
    	  <form onSubmit={this.onFormSubmit}>
    	    <div className="upload-container">
    				<div>
            Title
            <input type="text" name="title" onChange= {this.onChange} value ={this.props.title}/>
            <br />
            Content
    				<input type="text" name="content" onChange= {this.onChange} value={this.props.content}
    				 style={{width: '300px', height:'100px'}}/>
            <br />
            Start Date
    				<DatePicker name = "start" onChange={this.onChange} value = {moment(this.props.start_time, dateFormat)} format ={dateFormat}/>
            <br />
            End Date
            <DatePicker name = "end" onChange={this.onChange} value = {moment(this.props.end_time, dateFormat)} format = {dateFormat}/>
            <br />
            Location
            <input type="text" name="location" onChange= {this.onChange} value ={this.props.location}/>
    				<div className="submit">
                    <button type="submit" onClick={this.onFormSubmit}>Post</button>
    				</div>
    				</div>
            </div>
                </form>
    	</Container>
    )
  }

}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    title: state.calendarEvent.title,
    content: state.calendarEvent.content,
    start_time: state.calendarEvent.start_time,
    end_time: state.calendarEvent.end_time,
    location: state.calendarEvent.location

  };
};

const mapDispatchToProps = dispatch => {
  return {
    closePopup: () => dispatch(navActions.closePopup()),
    changeEvent: (e) => dispatch(calendarEventActions.changeCalendarEvent(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEventForm);
