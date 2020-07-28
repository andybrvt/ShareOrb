import React from 'react';
import InfiniteList from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import NewsFeedFormPost from '../components/NewsFeedFormPost';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';
import Layouts from './Layouts/Layouts.js';
import SuggestedFriends from './Layouts/SuggestedFriends.js';
import ExploreWebSocketInstance from '../exploreWebsocket';
import ProfileCardNewsFeed from '../components/ProfileCardNewsFeed';


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
		picShow:false,
	}

	constructor(props){
		super(props)
		this.initialiseExplore()
	}

	initialiseExplore(){
    // This will pretty much be for loading up the users following status, because
    // later we are gonna have a search function, so you want to throw this in one
    // of the very first things
    this.waitForSocketConnection(()=> {
      ExploreWebSocketInstance.fetchFollowerFollowing()
    })
  }

	waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){

        if (ExploreWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForSocketConnection(callback);
        }
      }, 100)

  }


	postCondition = () => {
    this.setState({
      postShow: !(this.state.postShow),
    });
  };

	uploadPicCondition = () => {
    this.setState({
      picShow: !(this.state.picShow),
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
		console.log(this.props)
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
						// backgroundColor: 'white',
						height: '300px',
						width: '300px',
						// postion: 'fixed',
						position: 'relative',
						marginRight:40,
					}}>



				<ProfileCardNewsFeed />
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


									<i style={{background:'#5cdbd3'}} nClick ={this.uploadPicCondition} class="fa fa-picture-o share"></i>
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
		profile: state.explore.profiles
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewsFeedView);
