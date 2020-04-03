import React from 'react';
import InfiniteScroll from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import Form3 from '../components/Forms3';
import axios from 'axios';
import {connect} from 'react-redux';
import * as actions from '../store/actions/auth';


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
	}

	render() {
		const isLoggedIn = this.props.isAuthenticated;
		return (
			<div>
			{isLoggedIn ?


				<div>
						<button type="button">Testing notification</button>
				 		<Form3 data = {this.props}/>
						<InfiniteScroll />
				 </div>
				 : <div> Not logged in! </div>}
    </div>
		)
	}
}



const mapStateToProps = state => {
  return {
    token: state.token,
  }
}
const mapDispatchToProps = dispatch => {
	// function: grab user ID and username to put into forms
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
