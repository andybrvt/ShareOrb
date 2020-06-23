import React, {useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";
import { Input } from 'antd';
import {Button} from 'antd';

const NewsFeedFormPost = (props) => {
  // formData = new FormData();
  const {token} = props;
  const[image, setImage] = useState(null);
  const[caption, setCaption] = useState('');
  const[id, setID] = useState(null);
  const[username, setUsername] = useState('');
  const[stage, setStage] = useState('empty');
  const[imageblob, setImageblob] = useState("");

  const { TextArea } = Input;


  useEffect(() => {
    console.log('hit')
    authAxios.get("current-user")
    .then(res => {
      console.log(res.data.id)
      setID(res.data.id);
      setUsername(res.data.username);
      });
  }, [token])

  const make_post=(post) =>{

    let data = uploadPost(post);

  	return data;
  }

  const uploadPost =(post) =>{
    console.log(props.token)
   var data = new FormData();
   console.log('right here')
   console.log(data)
   console.log(post)
   data.append("caption", post.caption);
   data.append("user", post.user_id);
   console.log(post.caption)
   console.log(post.user_id)
   console.log('hellooo')
   console.log(data)
   if (post.image !== null){
     data.append("image", post.image)
   }
   for (var pair of data.entries()) {
    console.log(pair[0]+ ', ' + pair[1]);
}
  console.log(localStorage.getItem('token'))
   // data.append("image", post.image);
   // data.append("image_filter", post.image_filter);

   fetch('http://127.0.0.1:8000/userprofile/list/',{
  	method: 'POST',
      headers: {
  	    Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body:data
  })
   .then (res =>res.json())
   .then(json =>{
  	 console.log(json)
  	 return json
   })
  }

  const  onFormSubmit = (e) =>{
    e.preventDefault()
		if (props.data.id && caption){
      console.log('it got summited')
			const post = {
				'image': image,
				'caption': caption,
				'user_id': props.data.id,
				'username': props.data.username,
			};
			make_post(post);
			// window.location.reload(true)
		}
		else{
			return <Redirect to='/'  />
		}
  }

  const onChange = (e)=> {

		const type = e.target.name;
		const value = e.target.value;
    console.log(e)
    console.log(type)
    console.log(value)
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
	  <form>
	    <div className="upload-container">
				{ stage !== "image" ?
				<div  className= "uploadImage upload" >
                <input type="file" name="image" onChange= {onChange} />
				</div> :
				<div  className= "uploadImage upload " >

				</div>}
        <TextArea rows={4} type="text" name="caption" onChange= {onChange}value={caption}
        style={{width: '600px'}}/>


				<div className="submit">
                <Button onClick={onFormSubmit}>Post</Button>
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

export default connect(mapStateToProps)(NewsFeedFormPost);
