import React from 'react';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import './ProfileCardNewsFeed.css';
import ava1 from './images/avatar.jpg';
import defaultPic from './images/default.png';
import { connect } from "react-redux";
import FollowList from './UserProfiles/FollowList';
import { Modal, Avatar, Row, Col, Statistic} from 'antd';





class ProfileCardNewsFeed extends React.Component{
  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  state = {
    followerShow: false,
    followingShow: false,
  }

  onFollowerOpen = () => {
    // This is used to open up the follower list
    this.setState({
      followerShow: true
    })
  }

  onFollowerCancel = () => {
    // This is used to close the follower list
    this.setState({
      followerShow: false
    })
  }

  onFollowingOpen = () => {
    // This is used to open up the following list
    this.setState({
      followingShow: true
    })
  }

  onFollowingCancel = () => {
    // This is to close the following list
    this.setState({
      followingShow: false
    })
  }



  render(){
    console.log(this.props)
    let firstName = ''
    let lastName = ''
    let followers = []
    let following = []
    let profilePic = ''

    if (this.props.firstName){
      firstName = this.props.firstName
    } if (this.props.lastName){
      lastName = this.props.lastName
    } if (this.props.followers){
      followers = this.props.followers
    } if (this.props.following){
      following = this.props.following
    } if (this.props.profilePic){
      profilePic = 'http://127.0.0.1:8000'+this.props.profilePic
    }



    return (
      <div className = "profileCard-NF">
        <div className = 'image-box-NF'>
          <Avatar
            style={{left:'30%', top:'5%'}}
            size = {125} shape = 'circle'
            src = {profilePic} />

        </div>

        <div className = 'bottom-NF'>
          <div className = 'name-NF'> {this.capitalize(firstName)} {this.capitalize(lastName)}</div>

        </div>
        <Row gutter={12} style={{marginTop:'50px'}}>
          <Col
            offset={3}
            span={10}
            onClick = {() => this.onFollowerOpen()}
            class="clickable"
          >
          <Statistic
            class="statHover"
            valueStyle={{ marginLeft:'25px',fontSize:'18px', color:'black'}}
            title={<span class="statsNewsFeed" style={{fontSize:'16px',}}>Following</span>}
           value={following.length} />

          </Col>
          <Col
            onClick = {() => this.onFollowingOpen()}
            span={10}
            class="clickable"
          >
          <Statistic

            class="statisticTest"
            valueStyle={{ marginLeft:'25px',fontSize:'18px', color:'black'}}
            title={<span class="statsNewsFeed" style={{fontSize:'16px',}}>Followers</span>}
            value={followers.length} />
          </Col>
        </Row>
        <Modal
        visible ={this.state.followerShow}
        onCancel = {this.onFollowerCancel}
        footer = {null}
        >
        <span className ='followWord'> Followers</span>
        <FollowList follow = {followers} />
        </Modal>



        <Modal
        visible = {this.state.followingShow}
        onCancel = {this.onFollowingCancel}
        footer = {null}
        >
        <span className = 'followWord'>Following</span>
        <FollowList follow = {following}/>
        </Modal>
      </div>
    )
  }
}

export const mapStateToProps = state => {
  return {
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    profilePic: state.auth.profilePic,
    following: state.auth.following,
    followers: state.auth.followers
  }
}

export default connect(mapStateToProps)(ProfileCardNewsFeed);
