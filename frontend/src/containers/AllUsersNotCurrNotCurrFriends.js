import React from 'react';
import ProfilePost from '../components/Form';
import UserProfileCard from '../components/UserProfiles/UserProfileCard.js'
import { Image } from 'react-bootstrap';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';


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

// the map((j,index) => {}) will loop through all the objects
	render() {
    const {profileList} = this.state
    console.log(this.state.profileList)
		return (







      <div>

      <Row gutter={[40, 48]}>
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
      </Row>
      <Row gutter={[40, 48]}>
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
        <Col span={3} />
      </Row>




        {profileList.map((j,index) => {
          return <UserProfileCard data = {j} key ={index} />
        })}
			</div>
		)
	}
}


export default AllUsersNotCurrNotCurrFriends;
