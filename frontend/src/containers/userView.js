import React from 'react';
import axios from 'axios';
import ProfilePost from '../components/Form';
import {connect} from 'react-redux';
import UserProfileCover from '../components/UserProfileCard.js'
import { Image } from 'react-bootstrap';

// hods the profile cards in a list
class UserView extends React.Component {
// state as a list to just hold a list of the profiles (probally just show names and profile picture)
  state={
		profileList:[],
	}

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/userprofile/userlist/')
      .then(res=> {
        this.setState({
          profileList:res.data,
       });
      });
  }

// the profileList.map will loop through all the objects
	render() {

    console.log("THIS IS THE USER VIEW");
    console.log(this.state.profileList);
    const {profileList} = this.state
      // <img class="ui medium circular image" src={nature1}>
      // <div> Initial test </div>
		return (
      <div>
        {profileList.map((j,index) => {
          // console.log(j)
          return <UserProfileCover data = {j} key ={index} />
        })}
			</div>
		)
	}
}


export default UserView;
