import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';


import { Row, Col, Card, Upload, Divider, Checkbox} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import NoFoundPage from './403.jsx';
import './NewsFeedView.css'
// Function: Holds Forms3 and the Infinite scroll
class NewsFeedView extends React.Component {

	state={
		profileList:[],
		username: '',
		id: '',
	}

	componentWillReceiveProps(newProps){
		this.props.grabUserCredentials();
		console.log(newProps);
		if(newProps.token){
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: newProps.token,
			}
			axios.get('http://127.0.0.1:8000/userprofile/list/')
			.then(res=> {
				this.setState({
					profileList:res.data,
				});
			});
		}

	}

	render() {
		const { Dragger } = Upload;
		const isLoggedIn = this.props.isAuthenticated;
		return (
			<div>
			{/*
			<Row>
			<Col span={4}>col-4</Col>


      <Col span={32}>col-8</Col>


			<div  style={{marginBottom:30}}>
				<Row gutter={32}>
					<Col span={8}>
						<Card title="Write a Post" bordered={false}>
							Write a Post
						</Card>
					</Col>
					<Col span={8}>
						<Card title="Upload a picture" bordered={false}>
							<	Dragger >
								<p className="ant-upload-drag-icon" style={{ height: "20px" }}>
									<InboxOutlined />
								</p>

									Browse or drag file


							</Dragger>,
						</Card>
					</Col>
					<Col span={8}>
						<Card title="Create Event" bordered={false}>
							Invite a friend
						</Card>
					</Col>
				</Row>




			</div>

			</Row>
			*/}


			{isLoggedIn ?




				<Row style = {{
					display: 'flex',
					// backgroundColor: 'blue',
					position: 'relative',
					marginLeft: '125px'
				}}>

				<div class="createEventCSS" style = {{
					backgroundColor: 'white',
					height: '400px',
					width: '300px',
					// postion: 'fixed',
					position: 'relative',
					marginRight:40,
				}}>


				Create an Event


				<Checkbox>Share with Public </Checkbox>
				</div>
		<Col span={30}>



				<div>

					<div>


						<div style={{background:'white', padding:60}}>
						<Row>
							<Col span={8}>col-8</Col>

							<Col span={8}>col-8</Col>
							<Col span={8}>col-8</Col>

							<div >






							 <div>
									<NewsFeedFormPost data = {this.props}/>
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

				col-8
			</Col>

			<div style = {{
				backgroundColor: 'white',

				height: '500px',
				width: '350px',
				// postion: 'fixed',
				position: 'relative',
				left:'20px'
			}}

			class="suggestFriendsCSS"

			>
			Suggested Friends
			<Divider plain></Divider>
			<SuggestedFriends/>
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
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
