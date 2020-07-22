import React from 'react';
import ProfilePost from '../components/Form';
import UserProfileCard from '../components/UserProfiles/UserProfileCard.js'
import { Image } from 'react-bootstrap';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';
import './Container_CSS/Explore.css';
import ava1 from '../components/images/avatar.jpg';
import ava2 from '../components/images/avatar2.jpg';
import ava3 from '../components/images/avatar3.jpg';
import ava4 from '../components/images/avatar4.jpg';
import ava5 from '../components/images/avatar5.jpg';
import ava6 from '../components/images/avatar6.jpg';
import ava7 from '../components/images/avatar7.jpg';
import ava8 from '../components/images/avatar8.jpg';




import { Row, Col, Divider } from 'antd';
// Function: Gives a list of all users that are not the current user and current user friends
class AllUsersNotCurrNotCurrFriends extends React.Component {
  constructor(props) {
    super(props);
  }

  state={
		profileList:[],
	}

  componentDidMount(){
    authAxios.get('http://127.0.0.1:8000/userprofile/explore')
      .then(res=> {
        console.log(res)
        this.setState({
          profileList:res.data,
       });
      });
  }

  componentWillReceiveProps(newProps) {
    if(newProps.isAuthenticated){
      authAxios.get('http://127.0.0.1:8000/userprofile/explore')
        .then(res=> {
          console.log(res)
          this.setState({
            profileList:res.data,
         });
        });
    }
  }

  renderFriendList () {
    const {profileList} = this.state
    let peopleList = []
    const images = [ava1, ava2, ava3, ava4, ava5, ava6, ava7, ava8]
    {profileList.map((j,index) => {
      console.log(index)
      peopleList.push(
        <UserProfileCard data = {j} key ={index} img = {images[index]} />
      )
    })}
    return peopleList
  }

// the map((j,index) => {}) will loop through all the objects
	render() {
    const {profileList} = this.state
    console.log(this.state.profileList)
		return (
      <div className = 'explore-grid'>
        {this.renderFriendList()}
			</div>
		)
	}
}


export default AllUsersNotCurrNotCurrFriends;
