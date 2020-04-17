import React from 'react';
import axios from 'axios';
import {Button, Form} from 'antd';
import { authAxios } from '../components/util';
import NotificationWebSocketInstance from '../../src/notificationWebsocket';
import { connect } from "react-redux";



class PersonalProfile extends React.Component{
  constructor(props) {
    super(props);
  }
      onClickSend = (e) =>{
        e.preventDefault()
        const username = this.props.match.params.username;
        // axios.default.headers = {
        //   "Content-type": "application/json",
        //   Authorization: `Token ${this.props.token}`
        // }
        authAxios.post('http://127.0.0.1:8000/friends/friend-request/send/'+username)
        const notificationObject  = {
          command: 'send_friend_notification',
          actor: this.props.currentUser,
          recipient: this.props.match.params.username,
        }
        NotificationWebSocketInstance.sendNotification(notificationObject)

        }


      onClickCancel = (e) =>{
        const username = this.props.match.params.username;
        authAxios.post('http://127.0.0.1:8000/friends/friend-request/cancel/'+username)
        }

        onClickDeleteFriend = (e) =>{
          const username = this.props.match.params.username;
          authAxios.post('http://127.0.0.1:8000/friends/remove-friend/'+username)
          }

  render(){
    console.log(this.props.match.params.username)

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

        {this.props.friends}
       ]

        </div>
        <br />
        <br />
        </Form>

      )

      }
    };

const mapStateToProps = state => {
    return {
      currentUser: state.auth.username,
      token: state.auth.token
      };
    };

export default connect(mapStateToProps)(PersonalProfile);
