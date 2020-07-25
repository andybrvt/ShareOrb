import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';
import PersonalProfile from '../components/PersonalProfile';
import {Button, Form} from 'antd';
import UserFriendsList from './UserFriendsList';
import NotificationWebSocketInstance from '../notificationWebsocket';
import ExploreWebSocketInstance from '../exploreWebsocket';



// Function: This view is to hold all the profiles of others that is not the current
// user (its just teh container tho)
class UserProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.initialiseExplore()
  }

  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
  }

  initialiseExplore(){
    // This will pretty much be for loading up the users following status, because
    // later we are gonna have a search function, so you want to throw this in one
    // of the very first things
    this.waitForSocketConnection(()=> {
      ExploreWebSocketInstance.fetchFollowerFollowing()
    })
  }

  waitForSocketConnection (callback) {
    const component = this;
    setTimeout(
      function(){

        if (ExploreWebSocketInstance.state() === 1){

          callback();
          return;
        } else{

            component.waitForSocketConnection(callback);
        }
      }, 100)

  }

  componentWillReceiveProps(newProps){
    const username = this.props.match.params.username;
    if (this.props.match.params.username){
      console.log('hi there')
      // NotificationWebSocketInstance.disconnect()
      // NotificationWebSocketInstance.connect(this.props.match.params.username)
    }
    if(newProps.isAuthenticated){
       authAxios.get('http://127.0.0.1:8000/userprofile/'+username+'/')
        .then(res=> {
          this.setState({
            id:res.data.id,
            username: res.data.username,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            bio: res.data.bio,
            friends: res.data.friends,
         });
       });
     }
   }


	render() {
    console.log(this.props)
    console.log("blah blah blah")
		return (
			<div>
        <PersonalProfile {...this.state} {...this.props}/>
        <UserFriendsList {...this.state} />
      </div>

		)
	}
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    profiles: state.explore.profiles
  }
}
export default connect(mapStateToProps)(UserProfileView);
