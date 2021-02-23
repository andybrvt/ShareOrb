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
		checked:false,
		firstTimeModal:true,
	}

	constructor(props){
		super(props)

		this.initialiseSocialNewsfeed()

	}


	toggleChecked = () => {
    this.setState({ checked: !this.state.checked });
  };

	onChange = e => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
    });
  };


	showModal = () => {
    this.setState({
      firstTimeModal: true,
    });
  };

  hideModal = () => {

		let curId = ""
		if(this.props.curId){
			curId = this.props.curId
		}

		authAxios.post(`${global.API_ENDPOINT}/userprofile/unShowIntialInstructions/`+curId)
		.then(res => {
			// Now just change the showIntialInstructions to false
			this.props.unShowIntialInstructions(res.data)

		})





  };

	initialiseSocialNewsfeed(){
		// use to initialize the social newsfeed
		this.waitForSocialNewsfeedSocketConnection(() => {
			// You will fetch the social cotnent type here
			WebSocketSocialNewsfeedInstance.fetchSocialPost(this.props.id)
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
		WebSocketSocialNewsfeedInstance.disconnect()
		this.waitForSocialNewsfeedSocketConnection(() => {
			// Fetch stuff here
			WebSocketSocialNewsfeedInstance.fetchSocialPost(newProps.id)

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


		let showIntialInstructions = false;
		if(this.props.showIntialInstructions){
			showIntialInstructions = this.props.showIntialInstructions
		}

		const uploadButton = (
		 <div>
			 <PlusOutlined />
			 <div style={{ marginTop: 8 }}>Upload</div>
		 </div>
	 );

	 const fileList= [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-2',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-3',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-4',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-xxx',
        percent: 50,
        name: 'image.png',
        status: 'uploading',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: '-5',
        name: 'image.png',
        status: 'error',
      },
    ]

		return (
			<div className = "newsfeedParentParenet">


			{isLoggedIn ?


				<div className = "newsfeedParent">
					<Modal
						 title="Welcome to ShareOrb!"
						 visible={showIntialInstructions}
						 onOk={this.hideModal}
						 okText="Let's Go!"
						 width={625}
						 centered
						 closable={false}
          	// cancelText="取消"
							okButtonProps={{ disabled: !this.state.checked }}
						cancelButtonProps={{ style: { display: 'none' } }}
						 >
	        <div class="firstTimeModalText">
						We believe every day is special. Create a unique album each day to save memories in your life!
						Let's dive into some of the features:
						<br/>
						<br/>

							<Timeline style={{marginLeft:'25px'}}>
								<Timeline.Item>
									<i style={{color:'#1890ff', marginRight:'5px'}}
										class="fas fa-home"></i>
									Home: Every album on the newsfeed is from a person's social calendar.
									 Post or clip photos from your newsfeed to add to your daily album.

								</Timeline.Item>
								<Timeline.Item>
									<i style={{color:'#1890ff', marginRight:'5px'}}
										class="far fa-comment"></i>
									Chats: Message and schedule events together
								</Timeline.Item>
								<Timeline.Item>
									<i style={{color:'#1890ff', marginRight:'5px'}}
										class="far fa-calendar-alt"></i>
									Personal Calendar: Your private calendar, sync with friends and plan your day
								</Timeline.Item>
								<Timeline.Item>
									<i style={{color:'#1890ff', marginRight:'5px'}}
										class="fas fa-user-friends"></i>
									Social Calendar: Your public calendar, creating a unique, single album per day.
								</Timeline.Item>
							</Timeline>
						<Checkbox
	            checked={this.state.checked}
	            onChange={this.onChange}>
	            Cool, I got it!
	          </Checkbox>
					</div>


	      </Modal>



					<div className = "profileCardContainer">
						<ProfileCardNewsFeed
							profile = {this.props.currentProfile}
							location = {this.props.location}

							 />
					</div>


					<div className = "newsfeedMidContainer">
						<div className = "newsfeedItself">


						<NewsfeedButtonContainer
							postCondition = {this.postCondition}
							profilePic = {this.props.profilePic}
							username = {this.props.username}
							location = {this.props.location}
							profile = {this.props.currentProfile}
							 />


						 {/*
							 <div className = "newsfeedActionButtons">
	 							<div onClick ={this.postCondition} class="topCard">
	 								<i class="far fa-edit share" style={{fontSize:'20px', color:'#1890ff'}}></i>
	 								 <p style={{ color:'#1890ff',}} class="topCardHeader cardAlign"> Update Day</p>
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
	 									 <p  class="topCardHeader cardAlign"> View album </p>
	 								</div>
	 							</Link>
	 						</div>


							 */}


							<InfiniteScroll data={this.props} />

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
    token: state.auth.token,
		curId: state.auth.id,
		currentUser: state.auth.username,
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
