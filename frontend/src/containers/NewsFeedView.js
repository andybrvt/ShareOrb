import React from 'react';
import InfiniteScroll from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import SocialNewsfeedFormPost from '../components/SocialNewsfeedFormPost';
import NewNewsfeedFormPost from '../components/NewNewsfeedFormPost';
import NewsFeedEventModal from '../components/NewsFeedEventModal.js';
import NewsfeedButtonContainer from './NewsfeedButtonContainer';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';
import SuggestedEvents from './Layouts/SuggestedEvents.js';
import ExploreWebSocketInstance from '../exploreWebsocket';
import WebSocketSocialNewsfeedInstance from '../socialNewsfeedWebsocket';
import ProfileCardNewsFeed from '../components/ProfileCardNewsFeed';
import TodayEvents from './todayEvents';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Upload, Divider, Checkbox,
	 Avatar, Statistic, Button, Modal, Timeline, Input} from 'antd';
import * as dateFns from 'date-fns';
import NoFoundPage from './403.jsx';
import './NewsFeedView.css'
import Spinner from './Spinner.js';
import FirstTimeUser from './FirstTimeUser.js';

import {
  CalendarOutlined,
  HeartTwoTone,
  HomeOutlined,
	HomeTwoTone,
  InboxOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SettingOutlined,
  SmileOutlined,
  UploadOutlined,
  NotificationOutlined,
  UserOutlined,
  VideoCameraOutlined,
	PlusOutlined
} from '@ant-design/icons';
import { authAxios } from '../components/util';

// Function: Holds Forms3 and the Infinite scroll
class NewsFeedView extends React.Component {

	state={
		username: '',
		id: '',
		postShow:false,
		eventShow:false,

		upperStart: 6
	}

	constructor(props){
		super(props)

		this.initialiseSocialNewsfeed()

	}

	updateStart = (start) =>{
		// This function will act as a path to the infinite scroll so that
		// when the page re renders we wont start at the beginning again
		console.log('start')
		this.setState({
			upperStart: start
		})
	}




	initialiseSocialNewsfeed(){

		console.log(dateFns.format(new Date(), "yyyy-MM-dd"))
		const curDate = dateFns.format(new Date(), "yyyy-MM-dd")
		// use to initialize the social newsfeed
		this.waitForSocialNewsfeedSocketConnection(() => {
			// You will fetch the social cotnent type here
			WebSocketSocialNewsfeedInstance.fetchSocialPost(
				this.props.id,
				curDate,
				this.state.upperStart
			)
		})
		WebSocketSocialNewsfeedInstance.connect()

	}

	waitForSocialNewsfeedSocketConnection(callback){
		const component = this
		setTimeout(
			function(){
				if(WebSocketSocialNewsfeedInstance.state() === 1){
					callback()
					return;
				} else {
					component.waitForSocialNewsfeedSocketConnection(callback);
				}
			}, 100)
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

		console.log(newProps)
		console.log(new Date())
		console.log(dateFns.format(new Date(), "yyyy-MM-dd"))
		const curDate = dateFns.format(new Date(), "yyyy-MM-dd")
		WebSocketSocialNewsfeedInstance.disconnect()
		this.waitForSocialNewsfeedSocketConnection(() => {
			// Fetch stuff here
			WebSocketSocialNewsfeedInstance.fetchSocialPost(
				newProps.id,
				curDate,
				this.state.upperStart)

		})
		WebSocketSocialNewsfeedInstance.connect()
	}

	componentWillUnmount(){
		WebSocketSocialNewsfeedInstance.disconnect()

	}

	onViewAlbum = () => {
		// This function will be used to open up the current day cal cell modal
		console.log('this props')
	}

	render() {

		console.log(this.state)
		const { Dragger } = Upload;
		const isLoggedIn = this.props.isAuthenticated;
		console.log(this.props)
		const curDate = new Date()

		let username = ""
		let firstName=""

		const cellYear = dateFns.getYear(curDate)
		const cellMonth = dateFns.getMonth(curDate)+1
		const cellDay = dateFns.getDate(curDate)
		if(this.props.username){
			username = this.props.username
		}
		if (this.props.firstName){
			firstName = this.props.firstName
		}
		const location = this.props.location.pathname;




		const uploadButton = (
		 <div>
			 <PlusOutlined />
			 <div style={{ marginTop: 8 }}>Upload</div>
		 </div>
	 );



		return (
			<div className = "newsfeedParentParenet">


			{isLoggedIn ?


				<div className = "newsfeedParent">


					{/*

					<div className = "profileCardContainer">
						<ProfileCardNewsFeed
							profile = {this.props.currentProfile}
							location = {this.props.location}

							 />
					</div>
					*/}

					<div className = "newsfeedMidContainer">
						<div className = "newsfeedItself">


{/*
						<div className = "newsfeedActionButtons">
							<div onClick ={this.postCondition} class="writePostCard">
							  <div class="writePostCardLeftPart">
							    <i class="far fa-edit share" style={{fontSize:'20px', color:'white'}}></i>
							  </div>
							  <div class="writePostCardRightPart">
							       <p style={{ color:'#1890ff',}} class="topCardHeader writePostCardAlign"> Update Day</p>
							  </div>
							</div>


							<div onClick = {this.onAddEvent} class="topCard" onClick ={this.eventCondition}>
								<i class="fas fa-plus share" style={{fontSize:'20px', color:'#1890ff'}}></i>
								 <p style={{ color:'#1890ff'}} class="topCardHeader cardAlign"> Create event  </p>
							</div>

							<Link to = {{
								pathname:"/socialcal/"+username+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
								state:{pathname:location}
							}}
							className = "topCard"
							 >
								<div >
									<i class="far fa-image share" style={{fontSize:'20px', color:'#1890ff'}}></i>
									 <p  class="topCardHeader cardAlign"> View Today</p>
								</div>
							</Link>
						</div>
*/}

						<FirstTimeUser {...this.props}/>

						<NewsfeedButtonContainer
							postCondition = {this.postCondition}
							profilePic = {this.props.profilePic}
							username = {this.props.username}
							location = {this.props.location}
							profile = {this.props.currentProfile}
							openEvent = {this.eventCondition}
							 />



							<InfiniteScroll
								updateStart = {this.updateStart}
								data={this.props} />

					</div>
					</div>


					<div className = "suggestedFriendsContainer">

						<div class="newsFeedRightEvents">
								<div>
										<div class="morePeopleHeader">
											<b>
												Suggested Events
											</b>
										</div>
										<SuggestedEvents {...this.props}/>
								</div>
						</div>

							<div class="testFriends">
									<div>
											<div class="morePeopleHeader">
												<b>
													Suggested People
												</b>
											</div>
											<SuggestedFriends {...this.props}/>
									</div>
							</div>



					</div>

					<Modal
						visible = {this.state.postShow}
						onCancel = {() => this.closeProfileEdit()}
						footer = {null}
						width={900}
						bodyStyle={{padding:'25px'}}
						centered
					>
								<SocialNewsfeedFormPost
								onCancel = {this.closeProfileEdit}
								profile = {this.props.currentProfile}/>
					</Modal>

					<Modal
						visible = {this.state.eventShow}
						onCancel = {() => this.closeProfileEdit()}
						footer = {null}
						width={900}
						bodyStyle={{padding:'20px', height:'525px'}}
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


const mapStateToProps = state => {
  return {
		firstName: state.auth.firstName,
		currentUser: state.auth.username,
    token: state.auth.token,
		curId: state.auth.id,
		profilePic: state.auth.profilePic,
		currentProfile: state.explore.profile,
		following: state.auth.following,
		sentRequestList: state.auth.sentRequestList,
		requestList: state.auth.requestList,
		showIntialInstructions: state.auth.showIntialInstructions
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
		updateFollowing: (followingList) => dispatch(actions.updateFollowing(followingList)),
		updateSentRequestList: (sentRequestList) => dispatch(actions.updateSentRequestList(sentRequestList)),
		unShowIntialInstructions: (bool) => dispatch(actions.unShowIntialInstructions(bool))
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
