import React from 'react';
import axios from 'axios';
import {Card, Button} from 'antd';
import ProfilePost from '../components/Form'
import { Link, } from 'react-router-dom';
class ArticleDetail extends React.Component

//test
//this takes each of the value of the individual profiles and
//returns them

//states are specific objects of a class
	state={
		profileInfo:{},
	}

	// changeURL=()=> {
	// 	console.log("reached!");
	// 	this.props.history.push('/');
	// }

//componentDidMount will be mounted the first thing as a class get run
//const articleID will take id values

//axios will then get the specific profiles from the backend using the
//url

//when getting each profile by the appropriate id, set state will then
//update the state with res.data (this is where all the profile data inspect
// is stored)
	componentDidMount(){
    const articleID = this.props.match.params.id;

		axios.get('http://127.0.0.1:8000/api/profiles/'+articleID)
		.then(res=> {
			this.setState({
				profileInfo:res.data,
		 });
		});

	}

	handleDelete= (event) => {
		event.preventDefault();
		const articleID = this.props.match.params.id;
		console.log("This is deleted article ID: "+ articleID);



	  // ADD AXIOS IN HERE DIRECTLY IN THE COMPONENT DID MOUTN METHOD
	}



	// promise and event listener

//this will return a card with the card title being the profile first name
//the paragraph inside will be the last time (these are taken from viewsets)
	render() {
		console.log("BUTTON!!!	")
		var temp=document.getElementById('buttonPush');
		if(temp){
			temp.addEventListener('click', function(){
			console.log("tewst");

			document.location.href = '/';


			})
			const articleID = this.props.match.params.id;
			axios.delete('http://127.0.0.1:8000/api/profiles/'+articleID);
		}


		return (
			<div>
	      <Card title = { this.state.profileInfo.first_name } >
	        <p> { this.state.profileInfo.last_name } </p>
					<ProfilePost
						requestType = "put"
						articleID = {this.props.match.params.id}
						btnText = 'Update'
					/>



					<form name="buttonDelete" onSubmit={this.handleDelete}>
							<Button
							 type= "danger"
							 htmlType="submit"
							 id="buttonPush"
							 >
							 Delete
							 </Button>
					</form>



	      </Card>

			</div>
		)
	 }
 }

export default ArticleDetail ;
