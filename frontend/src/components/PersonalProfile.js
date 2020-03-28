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

        onClickDeleteFriend = (e) =>{
          const username = this.props.match.params.username;
          authAxios.post('http://127.0.0.1:8000/userprofile/remove-friend/'+username)
          }

  render(){
    console.log(this.props)

      return(
        <Form>
        <div>
        Username:
        {this.props.username}
        <br />
        First name:
        {this.props.first_name}
        <br />
        Last name:
        {this.props.last_name}
        <br />
        Bio :
        {this.props.bio}
        <br />
        <br />

        <div>
        <Button type="primary" onClick ={this.onClickSend}>Add friend</Button>
        <Button type="primary" onClick = {this.onClickCancel}>Cancel Friend Request</Button>


        <br />
        This will remove USER [{this.props.username}] as your friend
        <br />
        <Button danger style={{ background: "white", color: "red" }} onClick = {this.onClickDeleteFriend}>Remove Friend </Button>
        </div>

        All of USER [{this.props.username}]'s friends: [
        {this.props.friends}
       ]

        </div>
        <br />
        <br />
        </Form>

      )

      }
    };

export default PersonalProfile;
