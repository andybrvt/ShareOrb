import React from 'react';
// import ProfilePost from '../components/Form';
// import FriendProfileCard from '../components/FriendsProfileCard'
import { Image } from 'react-bootstrap';
import axios from 'axios';
import {connect} from 'react-redux';
// import { authAxios } from '../components/util';

//Function: Holds the all the friends of the curretn user
class UserFriendsList extends React.Component {
  constructor(props) {
    super(props);
  }
// the map((j,index) => {}) will loop through all the objects
	render() {
    const {friendList} = this.props.friends
		return (
      <div>
        {this.props.friends.map((j, index) => {
          return <FriendProfileCard data = {j} key = {index} />
        })}
			</div>
		)
	}
}


export default UserFriendsList;
