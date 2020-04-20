import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import { authAxios } from '../components/util';
import PersonalProfile from '../components/PersonalProfile';
import {Button, Form} from 'antd';
import UserFriendsList from './UserFriendsList';
import NotificationWebSocketInstance from '../notificationWebsocket';



// Function: This view is to hold all the profiles of others that is not the current
// user (its just teh container tho)
class UserProfileView extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
  }

  componentWillReceiveProps(newProps){
    const username = this.props.match.params.username;
    if (this.props.match.params.username){
      console.log('hi there')
      // NotificationWebSocketInstance.disconnect()
      NotificationWebSocketInstance.connect(this.props.match.params.username)
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
    token: state.auth.token
  }
}
export default connect(mapStateToProps)(UserProfileView);
