import React from 'react';
import Article from '../components/Article';
import axios from 'axios';


class ArticleList extends React.Component {
	state={
		//the state are the objects specific to a class
		//this object holds all the profiles that we put in
		// the viewsets
		profileList:[],
	}

	componentDidMount(){
		//this componentDidMount will pull all the profiles from viewsets and
		// put all of them into profileList
		axios.get('http://127.0.0.1:8000/api/profiles')
		.then(res=> {
			console.log('res')
			console.log('res.data');
			this.setState({
				profileList:res.data,
			});
		});
	}

//this will return all the profiles on to one page
	render() {
		return (
			<Article data={this.state.profileList}/>
			//this gives Article a children to be called in ArticleDetailView 
		)
	}
}

export default ArticleList;
