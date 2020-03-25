import React from 'react';
import axios from 'axios';
import {Button, Form} from 'antd';
import { authAxios } from '../components/util';

class PersonalProfile extends React.Component{
  // state = {
  //   id:'',
	// 	username:'',
	// 	first_name: '',
	// 	last_name: '',
	// 	bio: '',
  //   friends: [],
  //   currentUserId: '',
  // }
  //
  // async componentDidMount(){
  //   console.log('here')
  //   const username = this.props.match.params.username;
  //   const userID = this.props.match.params.id;
  //   console.log(this.props.match.params)
  //   console.log(username)


    // await authAxios.get('http://127.0.0.1:8000/userprofile/'+username+'/')
    //   .then(res=> {
    //     console.log(res.data)
    //     console.log(res.data.id)
    //     this.setState({
    //       id:res.data.id,
    //       username: res.data.username,
    //       first_name: res.data.first_name,
    //       last_name: res.data.last_name,
    //       bio: res.data.bio,
    //       friends: res.data.friends,
    //
    //    });
    //  });

   // }

      onClickSend = (e) =>{
        const username = this.props.match.params.username;
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
        }


      onClickCancel = (e) =>{
        const username = this.props.match.params.username;
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/cancel/'+username)
        }





  render(){

      return(
        <Form>
        <div>
        {this.props.username}
        <br></br>
        {this.props.first_name}
        <br></br>
        {this.props.last_name}
        <br></br>
        {this.props.bio}
        <br></br>
        {this.props.friends}
        <br></br>
        <div>
        <Button type="primary" onClick ={this.onClickSend}>Add friend</Button>
        <Button type="primary" onClick = {this.onClickCancel}>Cancel Friend Request</Button>
        </div>

        </div>
        </Form>

      )

      }
    };

export default PersonalProfile;
