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
  // on click add friend starts here
      onClickSend = (e) =>{
        e.preventDefault()
        const username = this.props.match.params.username;
        // axios.default.headers = {
        //   "Content-type": "application/json",
        //   Authorization: `Token ${this.props.token}`
        // }
        authAxios.post('http://127.0.0.1:8000/userprofile/friend-request/send/'+username)
        const notificationObject  = {
          command: 'send_friend_notification',
          actor: this.props.currentUser,
          recipient: this.props.match.params.username,
        }
        // NotificationWebSocketInstance.disconnect()
        // NotificationWebSocketInstance.connect(this.props.match.params.username)
        NotificationWebSocketInstance.sendNotification(notificationObject)
        // NotificationWebSocketInstance.connect(this.props.currentUser)

        }


      onClickCancel = (e) =>{
        // const username = this.props.match.params.username;
        // authAxios.post('http://127.0.0.1:8000/friends/friend-request/cancel/'+username)
        }

      onClickDeleteFriend = (e) =>{
          // const username = this.props.match.params.username;
          // authAxios.post('http://127.0.0.1:8000/friends/remove-friend/'+username)
        }

      onRenderProfile(){
        // For the following and the follwers, the get_followers will be the people
        // that you are following(so you are the follower) and the people that are in
        // get following are the people taht are following you, so they would be your
        // followers
        let username = ''
        let firstName = ''
        let lastName = ''
        let bio = ''
        let followers = ''
        let following = ''

        if (this.props.data){
          username = this.props.data.username
          firstName = this.props.data.first_name
          lastName = this.props.data.last_name
          bio = this.props.data.bio
          followers = this.props.data.get_following
          following = this.props.data.get_followers
        }
        console.log(firstName)
        console.log(following)

        return (
          <div>
          <div>
          Username:
          {username}
          <br />
          First name:
          {firstName}
          <br />
          Last name:
          {lastName}
          <br />
          Bio :
          {bio}
          <br />
          Followers:
          {followers.length}
          <br />
          Following:
          {following.length}
          <div>
          <Button type="primary" onClick ={this.onClickSend}>Add friend</Button>
          <Button type="primary" onClick = {this.onClickCancel}>Cancel Friend Request</Button>


          <br />
          This will remove USER [{this.props.username}] as your friend
          <br />
          <Button danger style={{ background: "white", color: "red" }} onClick = {this.onClickDeleteFriend}>Remove Friend </Button>
          </div>

          {this.props.friends}


          </div>
          <br />
          <br />
          </div>

        )

      }

  render(){

      console.log(this.props)

      return(
        <div>
        {this.onRenderProfile()}
        </div>
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
