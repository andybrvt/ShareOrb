import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import InfiniteScroll from './InfiniteScroll';
import PostUpload from '../components/Forms2';

class ArticleList extends React.Component {

	state={
		//the state are the objects specific to a class
		//this object holds all the profiles that we put in
		// the viewsets
		profileList:[],
		username: '',
		id: '',
	}

	//
	// componentWillReceiveProps(nextProps){
	// 	console.log('TESTETSETSSTESTSTSESTSTESTST');
	// 	const state2 = this.props.location.state
	// 	console.log(state2);
	  // if (nextProps.location.state === 'desiredState') {
	  //   console.log("ONE TIME ONLY");
  // }


	componentWillReceiveProps(newProps){
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



		// if (prevState.profileList !== this.state.profileList) {

			// window.location.reload()
		// }

	// }

//this will return all the profiles on to one page
// In article, the data will gives Article a children to be called in ArticleDetailView
//Article takes in the props data then the props will be presented in
//the Article.js and then renedered here
//ProfilePost will then be the form and will take in parameters for the
//handlesubmit and will do a post function

// <ProfilePost
// 	requestType ="post"
// 	articleID = {null}
// 	btnText = 'Create'
// />


// {
// 		this.props.isAuthenticated ?
//	<PostUpload />
// <InfiniteScroll />
// 		:

// <div> NOT LOGGED IN </div>
// 	}

//
// function showInfo(props) {
//   const isLoggedIn = props.isLoggedIn;
//   if (isLoggedIn) {
//     return <UserGreeting />;
//   }
//   return <GuestGreeting />;
// }


	render() {
		console.log("HIHIHHIIHIh")
		console.log(this.props)
		console.log(this.props.isAuthenticated)
		const isLoggedIn = this.props.isAuthenticated;
		return (


			<div>
			{isLoggedIn ?
				<div>
				 		<PostUpload data = {this.props}/>
						<InfiniteScroll />
				 </div>
				 : <div> Not logged in! </div>}
    </div>








		)
	}
}

const mapStateToProps = state => {
  return {
    token: state.token
  }
}
// // {isLoggedIn
// //   ?
// : <div> Not logged in! </div>
// }
export default connect(mapStateToProps)(ArticleList);
