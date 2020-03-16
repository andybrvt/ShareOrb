import React from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';

class PostUpload extends React.Component{
 formData = new FormData();
 state = {
	 image:null,
	 caption:'',
	 user_id:'',
	 image_filter:null,
	 id:null,
	 username:'',
   testVar:'',
 }


 handleFetchUserID = () => {
    authAxios
      .get("current_user")
      .then(res => {
        this.setState({ testVar: res.data});
        this.setState({ id: res.data.id });
        this.setState({username:res.data.username});
      })
      .catch(err => {
        this.setState({ error: err });
      });
  };

	componentDidMount () {
    this.handleFetchUserID();
	// 	fetch("http://127.0.0.1:8000/userprofile/current_user/", {
	// 		headers: {
  //         Authorization: `Token ${localStorage.getItem('token')}`
  //       }
	// 		})
	// 	        .then(res => res.json())
	// 	        .then(json => {
	// 			 return json;
	// 		 })
  //
  //
	// axios.get("http://127.0.0.1:8000/userprofile/user-id")
	// 		.then(res=> {
	// 			this.setState({
	// 				id: res.data.id,
	// 				username: res.data.currentUser,
	// 		 });
	// 		});
	// 		console.log(this.props.id)
	//     console.log(this.state.caption)
	}




make_post = (post) =>{
	let data = this.uploadPost(post);
	console.log(data)
	console.log(post)
	return data;
}

uploadPost = (post) =>{
 const data = new FormData();
 console.log('right here')
 console.log(data)
 data.append("caption", post.caption);
 data.append("user", post.user_id);
 data.append("image", post.image);
 // data.append("image_filter", post.image_filter);
 console.log('right here')
 console.log(data)
 fetch('http://127.0.0.1:8000/userprofile/list/', {
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

	onFormSubmit = (e) =>{
		e.preventDefault()
		console.log(this.state)
		if (this.state.id && this.state.caption){
      console.log('it got summited')
			const post = {
				'image': this.state.image,
				'caption': this.state.caption,
				'user_id': this.state.id,
				'image_filter': this.state.image_filter,
				'username': this.state.username,
			};
			console.log(post)
			this.make_post(post);
			window.location.reload(true)
		}
		else{
			return <Redirect to='/'  />
		}

    }
    onChange = e => {
		const type = e.target.name;
		const value = e.target.value;
		if (type === "caption"){
			this.setState({
				caption: value
			});
		}
		else if (type === "image"){
			this.setState({
				image_blob: URL.createObjectURL(e.target.files[0]),
				image:e.target.files[0],
				stage: "image",
			});
			//render the
		}
	}

	selectFilter = e =>{
		console.log(e)
		this.setState({
			image_filter: e
		})

	}

	render(){

	return (
	<Container style={{paddingTop: '10%',zIndex:'-1'}}>
	  <form onSubmit={this.onFormSubmit}>
	    <div className="upload-container">
				<h1 className="heading">#New post</h1>
				{ this.state.stage !== "image" ?
				<div  className= "uploadImage upload" >
                <input type="file" name="image" onChange= {this.onChange} />
				</div> :
				<div  className= "uploadImage upload " >
                <img src={this.state.image_blob} className={this.state.image_filter}
				style={{height:'250px'}}/>
				</div>}
				<div className= "message caption-text">
				<input type="text" name="caption" onChange= {this.onChange}value={this.state.caption}
				 style={{width: '300px', height:'100px'}}/>
				 </div>
				 <div className="filters">
				{ this.state.stage === "image" ?
					<div>
						<img src={this.state.image_blob}  className=" filter" onClick={(e) => this.selectFilter("")}/>
						<img src={this.state.image_blob}  className=" filter blur-filter"  onClick={(e) => this.selectFilter("blur-filter")}/>
						<img src={this.state.image_blob}  className=" filter bng-filter" onClick={(e) => this.selectFilter("bng-filter")}/>
						<img src={this.state.image_blob}  className=" filter bright-filter"  onClick={(e) => this.selectFilter("bright-filter")}/>
						<img src={this.state.image_blob}  className=" filter saturate-filter"  onClick={(e) => this.selectFilter("saturate-filter")}/>
						<img src={this.state.image_blob}  className=" filter sepia-filter"  onClick={(e) => this.selectFilter("sepia-filter")}/>
					</div>
					:
					<div></div>}
				</div>
				<div className="submit">
                <button type="submit" onClick={this.onFormSubmit}>Post</button>
				</div>
				</div>
            </form>
	</Container>
	)

}
}

export default PostUpload;
