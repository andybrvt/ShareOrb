import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import NewNewsfeedFormPost from '../components/NewNewsfeedFormPost';
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
		picShow:false,
	}

	constructor(props){
		super(props)
	}

	postCondition = () => {
    this.setState({
			picShow:false,
      postShow: !(this.state.postShow),
    });
  };


	picCondition = () => {
    this.setState({
			postShow:false,
      picShow: !(this.state.picShow),
    });
  };

	closeProfileEdit = () => {
    // You wanna check if the person open and opening is the current user

      this.setState({
        postShow: false,
      })

  }


	componentWillReceiveProps(newProps){
		this.props.grabUserCredentials();
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
			<div>


			{isLoggedIn ?




				<Row style = {{
					display: 'flex',
					position: 'relative',
					marginTop:'10px',
					marginLeft: '350px',
				}}>


				<div>
					<div class="headers">
					<Col
						style={{
						marginLeft:'-125px', marginRight:'125px'}}
						span={5}
						class="scroller"
						>



					<ProfileCardNewsFeed
						profile = {this.props.currentProfile}
						 />



					</Col>
					</div>
				</div>
				<Col style={{}} span={11}>
				<div>
					<div>
						<div>
						<Row gutter={20}>


							<Col span={8}>


								<div onClick ={this.postCondition} class="topCard">


									<i class="far fa-edit share" style={{fontSize:'25px', color:'#1890ff'}}></i>
									 <p style={{ color:'#1890ff'}} class="cardAlign"> Write a post </p>

								</div>


				      </Col>

							<Col span={8}>


								<div class="topCard" onClick ={this.picCondition}>

									<i class="fas fa-plus share" style={{fontSize:'25px', color:'#1890ff'}}></i>

									 <p style={{ color:'#1890ff'}} class="cardAlign"> Create event  </p>

								</div>


				      </Col>


							<Col span={8}>

							<Link to = {{
								pathname:"/socialcal/"+username+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
								state:{pathname:location}
							}}
							 >
								<div class="topCard">

									<i class="far fa-image share" style={{fontSize:'25px', color:'#1890ff'}}></i>

									 <p  class="cardAlign"> View album </p>

								</div>
							</Link>

				      </Col>

							<div >



	<div>

		<Modal
		visible = {this.state.postShow}
		onCancel = {() => this.closeProfileEdit()}
		footer = {null}
		width={900}
		bodyStyle={{padding:'50px'}}
		centered

		>
	<NewNewsfeedFormPost profile = {this.props.currentProfile}/>
	</Modal>
	</div>


							 <div>



									<div className = 'newsfeed' >
										<InfiniteList data={this.props} />
									</div>
										{/*
										<div class="rightBox">
										 <Layouts/>
									 </div>
									 */
									}
							 </div>
							 </div>


							 </Row>
							 </div>
					 </div>



				</div>

				Loading...
			</Col>
			<div style={{marginLeft:'125px'}}>
				<div class="headers">
					<Col style={{}}  span={6}
						class="scroller"
					>
						<div
							style = {{

							width: '400px',
							background:'white',
							// postion: 'fixed',
							position: 'relative',
						}}
						class="morePeopleBox"

						>


						<div
							 class="morePeopleHeader"
							>
								More People
						</div>


								<div>

								<SuggestedFriends  style={{position:'fixed'}}{...this.props}/>

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
							</div>
						</div>

					</Col>
				</div>
			</div>
			</Row>

					 :


					 <div>
					 		< NoFoundPage />

						</div>}


    </div>
		)
	}
}



const mapStateToProps = state => {
  return {
    token: state.auth.token,
		currentUser: state.auth.username,
		currentProfile: state.explore.profile
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
