import React from 'react';
import axios from 'axios';
import {Button, Form} from 'antd';
import { authAxios } from '../components/util';


class PersonalProfile extends React.Component{
  constructor(props) {
    super(props);
  }
      onClickSend = (e) =>{
        const username = this.props.match.params.username;
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
        }


      onClickCancel = (e) =>{
        const username = this.props.match.params.username;
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/cancel/'+username)
        }

  render(){
    console.log(this.props)

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
