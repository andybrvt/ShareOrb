import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';


import { Row, Col, Card, Upload, Divider, Checkbox, Avatar, Statistic, Button} from 'antd';
import { InboxOutlined, UserOutlined } from '@ant-design/icons';

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
					marginLeft: '250px'
				}}>


				<div>

					<div class="createEventCSS" style = {{
						backgroundColor: 'white',
						height: '300px',
						width: '300px',
						// postion: 'fixed',
						position: 'relative',
						marginRight:40,
					}}>



					<div style={{background:'#bae7ff'}}>
						<img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Avatar" class="avatar"/>
						</div>
							<div  style={{textAlign:'center', fontSize:'25px', color:'#181818'}}>
						{this.props.username}

						</div>
						<div style={{textAlign:'center'}}>

						<Statistic title="Followers" value={102} precision={0} style={{marginTop:'10px'}} />
						<br>
						</br>

						<Button style={{backgroundColor:'#2f54eb'}} type="primary">My Profile </Button>
						</div>
					</div>


					<div class="createEventCSS" style = {{
						background: 'white',
						height: '400px',
						width: '300px',

						// postion: 'fixed',
						position: 'relative',
						marginRight:40,
						marginTop:40,
					}}>


					<div  style={{textAlign:'center', fontSize:'20px', color:'black'}}>
				Today's Events

				</div>



						<div style={{backgroundColor:'#bae7ff', height: '300px',
						width: '200px', marginTop:30, marginLeft:60}}>



						<Checkbox>Share with Public </Checkbox>

						</div>


					</div>


				</div>

				<Col span={11}>



				<div>

					<div>


						<div style={{ padding:20}}>
						<Row gutter={16}>
							<Col span={8}>
				        <Card title="Card title" bordered={false}>
				          Card content
				        </Card>
				      </Col>
				      <Col span={8}>
				        <Card title="Card title" bordered={false}>
				          Card content
				        </Card>
				      </Col>
				      <Col span={8}>
				        <Card title="Card title" bordered={false}>
				          Card content
				        </Card>
				      </Col>

							<div >






							 <div>
	{/*
 <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10}}>
 <div  style={{marginTop:20, marginLeft:30, marginRight:10}}>
 	<div>
	 <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

				 <span class="personName">
					 Jon Chen
				 </span>

				</div>


			 <span class="fb-group-date"> 110 followers</span>
			 <span style={{marginRight:10, marginTop:80}}>
			 <span class="fb-group-date" style={{marginLeft:350}}> Yesterday 5:20pm</span>
			 </span>
 <Divider />
 <p style={{padding:20, color:'black'}}>
	 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
	 probare, quae sunt a te dicta? Refert tamen, quo modo.
 </p>

 <Divider />

 Coments blah blah blah

 	</div>

 </div>

 */}



 <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10}}>
 <div  style={{marginTop:20, marginLeft:30, marginRight:10}}>
 	<div>
	 <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

				 <span class="personName">
					 Jon Chen
				 </span>

				</div>


			 <span class="fb-group-date"> 110 followers</span>
			 <span style={{marginRight:10, marginTop:80}}>
			 <span class="fb-group-date" style={{marginLeft:350}}> Yesterday 5:20pm</span>
			 </span>
 <Divider />
 <p style={{padding:20, color:'black'}}>
	 Wednesday -> Thursday
	 <br/>
	 3:00PM to 4:00PM
	 <br/>
	 <Avatar icon={<UserOutlined />} />
		 <Avatar>U</Avatar>
		 <Avatar size={40}>USER</Avatar>
		 <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
		 <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
		 <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />

 </p>


 	</div>

 </div>


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


			<div class="circle" >
	<svg class="circle-icon" viewBox="0 0 24 24" width="10" height="10">

		<line x1="2" x2="22" y1="12" y2="12" stroke-width="3" stroke-linecap="round"/>
		<line x1="12" x2="12" y1="1" y2="39" stroke-width="3" stroke-linecap="round"/>
	</svg>
</div>

			<div style = {{
				background:'white',
				height: '500px',
				width: '380px',
				// postion: 'fixed',
				position: 'relative',
				left:'20px'
			}}

			class="suggestFriendsCSS"

			>





			<div  style={{textAlign:'center', fontSize:'20px'}}>
			More People

		</div>


			<Divider plain></Divider>
				<div class="appearBefore" style={{background:'white'}}>
				<SuggestedFriends/>
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
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
