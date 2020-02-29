import React from 'react';
import Article from '../components/Article';
import axios from 'axios';

class ArticleList extends React.Component {

	state={
		//the state are the objects specific to a class
		//this object holds all 
		profileList:[],
	}

	componentDidMount(){
		console.log("MADE IT!!!")
		axios.get('http://127.0.0.1:8000/api/profiles')
		.then(res=> {
			console.log('res')
			console.log('res.data');
			this.setState({
				profileList:res.data,
			});

		});
	}


	render() {
		return (

			<Article data={this.state.profileList}/>
		)

	}


}

export default ArticleList;
