import React, {useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";
import { DatePicker } from 'antd';
import * as dateFns from 'date-fns';





const CalendarForm = (props) => {
  // formData = new FormData();
  const {token} = props;
  const[title, setTitle] = useState('');
  const[content, setContent] = useState('');
  const[start_time,setStart] = useState(null);
  const[end_time, setEnd ] = useState(null);
  const[location, setLocation] = useState('');
  console.log(title)
  console.log(content)
  console.log(start_time)
  console.log(end_time)
  console.log(location)

  const make_post=(post) =>{
  	let data = uploadPost(post);
  	console.log(data)
  	console.log(post)
  	return data;
  }

  const uploadPost =(post) =>{
   const data = new FormData();
   console.log(dateFns.format(new Date(post.end_time), 'yyyy-MM-dd hh:mm:ss'))
   console.log(data['title'])
   console.log(data['user'])
   // console.log(dateFns.format(new Date(post.end_time), '%Y-%m-%d %H:%M:%S'))
   data.append("title", post.title);
   data.append("content", post.content);
   data.append("start_time", dateFns.format(new Date(post.start_time), 'yyyy-MM-dd hh:mm:ss'));
   data.append("end_time", dateFns.format(new Date(post.end_time), 'yyyy-MM-dd hh:mm:ss'));
   data.append("location", post.location);
   data.append("person", post.person);
   console.log(data['user'])
   console.log(data['title'])


   fetch('http://127.0.0.1:8000/mycalendar/events/create/',{
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
    const person = [props.id]
    console.log(person)
		if (title && content){
			const post = {
				'title': title,
				'content': content,
        'start_time': start_time,
        'end_time': end_time,
        'location': location,
        'user_id': props.id,
				'person': person,
			};
			make_post(post);
			// window.location.reload(true)
		}
		else{
			// return <Redirect to='/'  />
		}
  }
  // basically all you reall need is an onchange, and value in your input fields
  // and you have to use e btw
  const onChangeTitle = e => setTitle(e.target.value)
  const onChangeContent = e => setContent(e.target.value)
  const onChangeStart = date => setStart(date)
  const onChangeEnd = date => setEnd (date)
  const onChangeLocation = e =>setLocation(e.target.value)

  console.log(props)
  const dateFormat = ''
  return (
	<Container style={{paddingTop: '10',zIndex:'-1'}}>
	  <form onSubmit={onFormSubmit}>
	    <div className="upload-container">
				<h1 className="heading">#New post</h1>
				<div>
        Title
        <input type="text" name="title" onChange= {onChangeTitle} value ={title}/>
        <br />
        Content
				<input type="text" name="content" onChange= {onChangeContent}value={content}
				 style={{width: '300px', height:'100px'}}/>
        <br />
        Start Date
				<DatePicker name = "start" onChange={onChangeStart} value = {start_time} format = {dateFormat}/>
        <br />
        End Date
        <DatePicker name = "end" onChange={onChangeEnd} value = {end_time} format ={dateFormat}/>
        <br />
        Location
        <input type="text" name="location" onChange= {onChangeLocation} value ={location}/>
				<div className="submit">
                <button type="submit" onClick={onFormSubmit}>Post</button>
				</div>
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
