import React from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";


// Function: Version 2 of our forms with states
class PostUpload extends React.Component{
  constructor(props) {
    super(props);
  }
 formData = new FormData();
 state = {
	 image:null,
	 caption:'',
	 user_id:'',
	 image_filter:null,
	 id:null,
	 username:'',
   testVar:'',
   login: false,
   loading:false,
 }

	async componentDidMount () {
    await authAxios
      .get("current-user")
      .then(res => {
        this.setState({ testVar: res.data});
        this.setState({ id: res.data.id });
        this.setState({username:res.data.username});
      })
      .catch(err => {
        this.setState({ error: err });
      });
    };

    make_post = (post) =>{
    	let data = this.uploadPost(post);
    	return data;
    }

    uploadPost = (post) =>{
     const data = new FormData();
     data.append("caption", post.caption);
     data.append("user", post.user_id);
     if (post.image !== null){
       data.append("image", post.image)
     }
     // data.append("image", post.image);
     // data.append("image_filter", post.image_filter);
     fetch('http://127.0.0.1:8000/userprofile/list/', {
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

	onFormSubmit = (e) =>{
		e.preventDefault()
		if (this.state.id && this.state.caption){
			const post = {
				'image': this.state.image,
				'caption': this.state.caption,
				'user_id': this.state.id,
				'image_filter': this.state.image_filter,
				'username': this.state.username,
			};
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
		}
	}

	selectFilter = e =>{
    	this.setState({
			image_filter: e
		})

	}

	render(){
  	return (
  	<Container style={{paddingTop: '10',zIndex:'-1'}}>
  	  <form onSubmit={this.onFormSubmit}>
  	    <div className="upload-container">
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
};

const mapStateToProps = state => {

  return {
    token: state.auth.token,
  };
};

export default connect(
  mapStateToProps,
)(PostUpload);
