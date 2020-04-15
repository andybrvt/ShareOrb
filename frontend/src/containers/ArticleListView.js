import React from 'react';
import InfiniteScroll from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import Form3 from '../components/Forms3';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';

import NoFoundPage from './404.jsx';
// Function: Holds Forms3 and the Infinite scroll
class ArticleList extends React.Component {

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

		// // start of notification fetching
		// if(this.props.match.params.id !== newProps.match.params.id){
		// 	WebSocketInstance.disconnect();
		// 	this.waitForSocketConnection(()=> {
		// 		WebSocketInstance.fetchMessages(
		// 			this.props.username,
		// 			newProps.match.params.id
		// 		)
		// 	})
		// 	WebSocketInstance.connect(newProps.match.params.id)
		// }
		// const username = newProps.username
		// if(newProps.isAuthenticated){
		// axios.all([
		// 	authAxios.get('http://127.0.0.1:8000/userprofile/current-user'),
		// 	authAxios.get('http://127.0.0.1:8000/chat/?username='+username)
		// ])
		// .then(axios.spread((get1, get2)=> {
		// 			this.setState({
		// 				friendList:get1.data.friends,
		// 				chatList:get2.data,
		// 		 });
		// 	 }));
		// }




	}

	render() {
		const isLoggedIn = this.props.isAuthenticated;
		return (
			<div>
			{isLoggedIn ?


				<div>
				 		<Form3 data = {this.props}/>
						<InfiniteScroll />
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
export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
