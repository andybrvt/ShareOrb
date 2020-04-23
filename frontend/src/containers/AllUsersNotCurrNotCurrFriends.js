import React from 'react';
import ProfilePost from '../components/Form';
import UserProfileCover from '../components/UserProfiles/UserProfileCard.js'
import { Image } from 'react-bootstrap';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';


// Function: Gives a list of all users that are not the current user and current user friends
class UserView extends React.Component {
  constructor(props) {
    super(props);
  }

  state={
		profileList:[],
	}

  componentWillReceiveProps(newProps) {
    if(newProps.isAuthenticated){
      authAxios.get('http://127.0.0.1:8000/userprofile/exclude-user')
        .then(res=> {
          this.setState({
            profileList:res.data,
         });
        });
    }
  }

// the map((j,index) => {}) will loop through all the objects
	render() {
    const {profileList} = this.state
		return (







      <div>
        {profileList.map((j,index) => {
          return <UserProfileCover data = {j} key ={index} />
        })}
			</div>
		)
	}
}


export default UserView;
