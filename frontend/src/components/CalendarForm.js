import React, {useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";
import { DatePicker } from 'antd';




const CalendarForm = (props) => {
  // formData = new FormData();

  const make_post=(post) =>{
  	let data = uploadPost(post);
  	console.log(data)
  	console.log(post)
  	return data;
  }

  const uploadPost =(post) =>{
   const data = new FormData();
   data.append("title", post.title);
   data.append("content", post.content);
   data.append("start_time", post.start_time);
   data.append("end_time", post.end_time);
   data.append("location", post.location);
   data.append("user", post.user_id);
   fetch('http://127.0.0.1:8000/mycalendar/events/create',{
  	method: 'POST',
      headers: {
  	    Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body:data
  })
   .then (res =>res.json())
   .then(json =>{
  	 return json
   })
  }

  const  onFormSubmit = (e) =>{
		e.preventDefault()
		if (props.data.id && content){
			const post = {
				'title': title,
				'content': content,
        'start_time': start_time,
        'end_time': end_time,
        'location': location,
        'user_id': props.data.id,
				'person': props.data.username,
			};
			make_post(post);
			window.location.reload(true)
		}
		else{
			return <Redirect to='/'  />
		}
  }

  const onChange = (e)=> {
		const type = e.target.name;
		const value = e.target.value;
		if (type === "caption"){
			setCaption(value)
		}
		 if (type === "image") {
				setImageblob(URL.createObjectURL(e.target.files[0]))
				setImage(e.target.files[0])
				setStage("image")
      }
			//render the
	}

  return (
	<Container style={{paddingTop: '10',zIndex:'-1'}}>
	  <form onSubmit={onFormSubmit}>
	    <div className="upload-container">
				<h1 className="heading">#New post</h1>
				<div>
        <input type="text" name="title" onChange= {onChange} value ={title}/>
        <br />
				<input type="text" name="content" onChange= {onChange}value={content}
				 style={{width: '300px', height:'100px'}}/>
        <br />
				<DatePicker onChange={onChange} value = {start_time} />
        <br />
        <DatePicker onChange={onChange} value = {end_time}/>
        <br />
        <input type="text" name="location" onChange= {onChange} value ={location}/>
				<div className="submit">
                <button type="submit" onClick={onFormSubmit}>Post</button>
				</div>
				</div>
            </form>
	</Container>
  );
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,

  };
};

export default connect(mapStateToProps)(CalendarForm);
