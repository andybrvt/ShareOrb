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
		postShow:false,
	}


	postCondition = () => {
    this.setState({
      postShow: true,
    });
  };

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
		console.log(this.state.postShow)
		return (
			<div>


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


					<div style={{textAlign:'center', fontSize:'20px', color:'black'}}>
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


						<div >
						<Row gutter={24}>


							<Col span={8}>


								<div onClick ={this.postCondition} class="topCard">


									<i  class="fa fa-pencil share"></i>
									 <p  class="cardAlign"> Write a post </p>

								</div>


				      </Col>

							<Col span={8}>


								<div class="topCard">


									<i style={{background:'#5cdbd3'}} class="fa fa-picture-o share"></i>
									 <p  class="cardAlign"> Share a Picture </p>

								</div>


				      </Col>


							<Col span={8}>


								<div class="topCard">


									<i style={{background:'#722ed1'}} class="fa fa-archive share"></i>
									 <p  class="cardAlign"> View today's album </p>

								</div>


				      </Col>

							<div >



{
	!this.state.postShow?
	<div>



	</div>


:

<div style={{marginTop:'150px'}}>


<NewsFeedFormPost data = {this.props}/>


</div>


}




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

	*/}


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
				background:'white',
				height: '500px',
				width: '380px',
				// postion: 'fixed',
				position: 'relative',
				left:'80px'
			}}

			class="suggestFriendsCSS"

			>

			<div class="share">
			<i class="fa fa-plus"></i>
			</div>




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
