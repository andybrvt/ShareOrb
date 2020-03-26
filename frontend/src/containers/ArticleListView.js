import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import InfiniteScroll from './InfiniteScroll';
import PostUpload from '../components/Forms2';
import Form3 from '../components/Forms3';
import * as actions from '../store/actions/auth';

class ArticleList extends React.Component {

	state={
		//the state are the objects specific to a class
		//this object holds all the profiles that we put in
		// the viewsets
		profileList:[],
		username: '',
		id: '',
	}


	// componentDidMount() {
	// 	this.props.grabUserCredentials();
	// }

	componentWillReceiveProps(newProps){
		this.props.grabUserCredentials();
		//this componentDidMount will pull all the profiles from viewsets and
		// put all of them into profileList
		// if(this.state.pageRefresh==true){
		// 	window.location.reload();
		// 	this.setState({
		// 		pageRefesh:true,
		// 	});
		// }
		console.log(newProps);
		if(newProps.token){
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: newProps.token,
			}

			// this will get information from the link and then
			// update the state with the list of post
			axios.get('http://127.0.0.1:8000/userprofile/list/')
			.then(res=> {
				this.setState({
					profileList:res.data,
				});
			});


		}
	}

	render() {
		console.log("HIHIHHIIHIh")
		console.log(this.props)
		const isLoggedIn = this.props.isAuthenticated;
		return (


			<div>
			{isLoggedIn ?
				<div>
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
  return {
    grabUserCredentials: () => dispatch(actions.grabUserCredentials()),
  }
}
// // {isLoggedIn
// //   ?
// : <div> Not logged in! </div>
// }
export default connect(mapStateToProps, mapDispatchToProps)(ArticleList);
