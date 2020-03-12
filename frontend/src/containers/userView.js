import React from 'react';
import axios from 'axios';
import ProfilePost from '../components/Form';
import {connect} from 'react-redux';

import nature1 from '../imgFold/nature1.jpeg';

import { Image } from 'react-bootstrap';


class UserView extends React.Component {

  state={
		profileList:{
      first_name:'Ping',
      last_name:'Hsu',
      email: 'pinghsu520@gmail.com',
      favorite_food: 'ice cream',



    },
	}

  // componentDidMount() {
  //   axios.get('http://127.0.0.1:8000/api/newsfeed/1')
  //     .then(res=> {
  //       this.setState({
  //         profileList:res.data,
  //      });
  //     });
  //
  // }

  // image below is using bootstrap for now


	render() {
    console.log("THIS IS THE USER VIEW");
    console.log(this.state.profileList);


      // <img class="ui medium circular image" src={nature1}>
      // <div> Initial test </div>


		return (


        <div>
  				<h1>{this.state.profileList.first_name} {this.state.profileList.last_name}</h1>
          <img class="ui medium circular image" src={nature1} />
  				<p>Description of user </p>

			</div>
		)
	}
}


export default UserView;
