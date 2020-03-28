import React from 'react';
import axios from 'axios';
import ProfilePost from '../components/Form';
import {connect} from 'react-redux';
import FriendProfileCard from '../components/FriendsProfileCard'
import { Image } from 'react-bootstrap';
import { authAxios } from '../components/util';

// hods the profile cards in a list
class UserFriendsList extends React.Component {
  constructor(props) {
    super(props);
  }
// state as a list to just hold a list of the profiles (probally just show names and profile picture)

// the profileList.map will loop through all the objects
	render() {
    console.log(this.props.friends)
    const {friendList} = this.props.friends
      // <img class="ui medium circular image" src={nature1}>
      // <div> Initial test </div>
		return (
      <div>
        {this.props.friends.map((j, index) => {
          // console.log(j)
          return <FriendProfileCard data = {j} key = {index} />
        })}
			</div>
		)
	}
}


export default UserFriendsList;
