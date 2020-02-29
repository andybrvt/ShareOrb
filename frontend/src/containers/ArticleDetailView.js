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
//const articleID will match the
	componentDidMount(){
		console.log("reached");
		console.log(this.props);
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


	render() {
		return (
        <Card title = { this.state.profileInfo.first_name } >
          <p> { this.state.profileInfo.last_name } </p>

        </Card>

		)

	}


}

export default ArticleDetail ;
