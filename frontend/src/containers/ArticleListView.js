import React from 'react';
import Article2 from '../components/Article';
import axios from 'axios';

class ArticleList extends React.Component {

	state={
		profileInfo:[],
	}

	componentDidMount(){
		console.log("MADE IT!!!")
		axios.get('http://127.0.0.1:8000/api/profiles')
		.then(res=> {
			this.setState({
				profileInfo:res.data,
			});
			
		});
	}


	render() { 
		return (

			<Article2 data={this.state.profileInfo}/>
		)

	}


}

export default ArticleList; 