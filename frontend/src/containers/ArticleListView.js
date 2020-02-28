import React from 'react';
import Article2 from '../components/Article';
import axios from 'axios';

class ArticleList extends React.Component {

	state={
		articles:[],

	}

	componentDidMount(){
		axios.get('http://127.0.0.1:8000/api/')
		.then(res=> {
			this.setState({
				articles: res.data,
			});
			console.log(res.data);	
		});
	}

	render() { 
		return (

			<Article2 data={this.state.articles}/>
		)

	}


}

export default ArticleList; 