import React from 'react';
import axios from 'axios';
import {Card,} from 'antd';

class ArticleDetail extends React.Component {
//this takes each of the value of the indiviudal profiles and
//returns them

//states are specific objects of a class
	state={
		profileInfo:{},
	}

//componentDidMount will be mounted the first thing as a class get run
//const articleID will take id values

//axios will then get the specific profiles from the backend using the
//url

//when getting each profile by the appropriate id, set state will then
//update the state with res.data (this is where all the profile data inspect
// is stored)
	componentDidMount(){
    const articleID = this.props.match.params.id;
		console.log(articleID);
		axios.get('http://127.0.0.1:8000/api/profiles/'+articleID)
		.then(res=> {
			console.log('res')
			console.log('res.data');
			this.setState({
				profileInfo:res.data,
		 });
		});
	}

//this will return a card with the card title being the profile first name
//the paragraph inside will be the last time (these are taken from viewsets)
	render() {
		return (
      <Card title = { this.state.profileInfo.first_name } >
        <p> { this.state.profileInfo.last_name } </p>
      </Card>
		)
	 }
 }

export default ArticleDetail ;
