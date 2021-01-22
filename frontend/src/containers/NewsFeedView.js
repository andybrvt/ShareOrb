import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import NewNewsfeedFormPost from '../components/NewNewsfeedFormPost';
import NewsFeedEventModal from '../components/NewsFeedEventModal.js';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';
import ExploreWebSocketInstance from '../exploreWebsocket';
import ProfileCardNewsFeed from '../components/ProfileCardNewsFeed';
import TodayEvents from './todayEvents';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Upload, Divider, Modal, Checkbox,
	 Avatar, Statistic, Button} from 'antd';
import { InboxOutlined, UserOutlined } from '@ant-design/icons';
import * as dateFns from 'date-fns';
import NoFoundPage from './403.jsx';
import './NewsFeedView.css'
// Function: Holds Forms3 and the Infinite scroll
class NewsFeedView extends React.Component {

	state={
		username: '',
		id: '',
		postShow:false,
		eventShow:false,
	}

	constructor(props){
		super(props)
	}

	postCondition = () => {
    this.setState({
      postShow: !(this.state.postShow),
    });
  };


	eventCondition = () => {
    this.setState({
			eventShow:true,
    });
  };

	onAddEvent = () => {
		this.props.openDrawer()
	}

	closeProfileEdit = () => {
    // You wanna check if the person open and opening is the current user

      this.setState({
        postShow: false,
				eventShow:false,
      })

  }


	componentWillReceiveProps(newProps){
		// this.props.grabUserCredentials();
	}

	onViewAlbum = () => {
		// This function will be used to open up the current day cal cell modal
		console.log('this props')
	}

	render() {
		const { Dragger } = Upload;
		const isLoggedIn = this.props.isAuthenticated;
		console.log(this.props)
		const curDate = new Date()

		let username = ""
		const cellYear = dateFns.getYear(curDate)
		const cellMonth = dateFns.getMonth(curDate)+1
		const cellDay = dateFns.getDate(curDate)
		if(this.props.username){
			username = this.props.username
		}

		console.log(cellYear, cellMonth, cellDay)
		const location = this.props.location.pathname;

		return (
			<div className = "newsfeedParentParenet">


			{isLoggedIn ?


				<div className = "newsfeedParent">
					<div className = "profileCardContainer">
						<ProfileCardNewsFeed
							profile = {this.props.currentProfile}
							location = {this.props.location}
							 />
					</div>


					<div className = "newsfeedMidContainer">


						<div className = "newsfeedItself">

						<div className = "newsfeedActionButtons">
							<div onClick ={this.postCondition} class="topCard">
								<i class="far fa-edit share"></i>
								 <p style={{ color:'#1890ff',}} class="cardAlign"> Write a post</p>
							</div>

							<div onClick = {this.onAddEvent} class="topCard" onClick ={this.eventCondition}>
								<i class="fas fa-plus share" style={{fontSize:'25px', color:'#1890ff'}}></i>
								 <p style={{ color:'#1890ff'}} class="cardAlign"> Create event  </p>
							</div>

							<Link to = {{
								pathname:"/socialcal/"+username+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
								state:{pathname:location}
							}}
							className = "topCard"
							 >
								<div >
									<i class="far fa-image share" style={{fontSize:'25px', color:'#1890ff'}}></i>
									 <p  class="cardAlign"> View album </p>
								</div>
							</Link>
						</div>
							<InfiniteList data={this.props} />
						</div>
					</div>


					<div className = "suggestedFriendsContainer">
						<div className = "suggestedFriendsCard">
							<div class="headers">
									<div>
											<div class="morePeopleHeader">
													More People
											</div>
											<SuggestedFriends {...this.props}/>
									</div>
							</div>
						</div>
					</div>

					<Modal
						visible = {this.state.postShow}
						onCancel = {() => this.closeProfileEdit()}
						footer = {null}
						width={900}
						bodyStyle={{padding:'50px'}}
						centered
					>
								<NewNewsfeedFormPost
								onCancel = {this.closeProfileEdit}
								profile = {this.props.currentProfile}/>
					</Modal>

					<Modal
						visible = {this.state.eventShow}
						onCancel = {() => this.closeProfileEdit()}
						footer = {null}
						width={900}
						bodyStyle={{padding:'50px'}}
						centered
						>

						<NewsFeedEventModal
							friendList = {this.props.friendList}
			        onSubmit = {this.submit}
			        following = {this.props.following}
			        followers = {this.props.followers}
							{...this.props}/>

					</Modal>

				</div>

			:


			<div>
					< NoFoundPage />
			</div>
				}


    </div>
		)
	}
}

{/*
<div class="shadowBox suggestFriendsCSS" style = {{

	height: '250px',
	width: '400px',

	// postion: 'fixed',
	// overflow: 'hidden',

	marginTop:120,
}}>



	<span  style={{textAlign:'center', fontSize:'18px',marginTop:'200px'}}>
		Today's events

	</span>

	<Divider/>
	<TodayEvents {...this.props}/>

</div>
*/}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
		currentUser: state.auth.username,
		currentProfile: state.explore.profile,
		following: state.auth.following,
		sentRequestList: state.auth.sentRequestList,
		requestList: state.auth.requestList
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
		updateFollowing: (followingList) => dispatch(actions.updateFollowing(followingList)),
		updateSentRequestList: (sentRequestList) => dispatch(actions.updateSentRequestList(sentRequestList))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
