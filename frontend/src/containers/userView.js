import React from 'react';
import axios from 'axios';
import ProfilePost from '../components/Form';
import {connect} from 'react-redux';
class UserView extends React.Component {

  state={
		profileList:{
      first_name:'ping',
      last_name:'hsu',



    },
	}

  componentDidMount() {
    axios.get('http://127.0.0.1:8000/api/newsfeed/1')
      .then(res=> {
        this.setState({
          profileList:res.data,
       });
      });

  }


	render() {
    console.log("THIS IS THE USER VIEW");
    console.log(this.state.profileList);
		return (
			  <div>
          Initial test
				</div>
		)
	}
}


export default UserView;
