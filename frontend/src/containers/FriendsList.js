import React from 'react';
import ProfilePost from '../components/Form';
import {connect} from 'react-redux';
import FriendProfileCard from '../components/FriendsProfileCard'
import axios from 'axios';
import { Image } from 'react-bootstrap';
import { authAxios } from '../components/util';

// Function: holds the profile cards all the friends of the current user
class FriendsList extends React.Component {
  constructor(props) {
    super(props);
  }
  state={
		friendList:[],
	}
  componentWillReceiveProps(newProps) {
    console.log(newProps)
    if(newProps.isAuthenticated){
      authAxios.get('http://127.0.0.1:8000/userprofile/current-user')
        .then(res=> {
          console.log(res.data)
          this.setState({
            friendList:res.data.friends,
         });
        });
    }
  }

// the map((j,index) => {}) will loop through all the objects
	render() {
    const {friendList} = this.state
		return (
      <div>
        {friendList.map((j,index) => {
          return <FriendProfileCard data = {j} key ={index} />
        })}
			</div>
		)
	}
}


export default FriendsList;
