import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';


import { Row, Col, Card, Upload} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import NoFoundPage from './403.jsx';
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
			<div style={{background:'white', padding:60}}>
			{isLoggedIn ?



					<div>


						<div className = 'newsfeedTop' style={{marginBottom:30}}>
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
