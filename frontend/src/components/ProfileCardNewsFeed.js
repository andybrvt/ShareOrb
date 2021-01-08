import React from 'react';
import { EnvironmentOutlined, MoreOutlined } from '@ant-design/icons';
import './ProfileCardNewsFeed.css';
import ava1 from './images/avatar.jpg';
import defaultPic from './images/default.png';
import { connect } from "react-redux";
import FollowList from './UserProfiles/FollowList';
import { Modal, Avatar, Row, Col, Statistic, Divider} from 'antd';





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
      profilePic = `${global.API_ENDPOINT}`+this.props.profilePic
    }


    console.log(profilePic)

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

        <Row gutter={12} style={{marginTop:'50px', marginLeft:'5px'}}>
          <Divider style={{marginTop:'-10px', marginBottom:'-10px', paddign:'10px'}}/>
          <Col
            offset={0.5}
            span={4}
            onClick = {() => this.onFollowerOpen()}
            class="clickable"
          >
           <span class="statsHeader"> Followers
             <br/>
             <span
               class="statsNewsFeed">
               {followers.length}
             </span>
           </span>


          </Col>
          <Col
            onClick = {() => this.onFollowingOpen()}
            offset={8}
            span={4}
            class="clickable"
          >
          <span class="statsHeader"> Following
            <br/>
            <span
              class="statsNewsFeed">
              {following.length}
            </span>
          </span>

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
