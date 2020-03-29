import React from 'react';
import {Button} from 'antd';
import axios from 'axios';
import { authAxios } from '../components/util';

// Function: Profile of the current user

class UserProfile extends React.Component{
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

  async componentDidMount(){
    const username = this.props.match.params.username;
    const userID = this.props.match.params.id;
    await authAxios.get('http://127.0.0.1:8000/userprofile/current-user/')
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

  render(){
      return(
        <div>
        {this.state.username}
        {this.state.first_name}
        {this.state.last_name}
        {this.state.bio}
        
        <div> hey </div>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        <Button type="primary">Primary</Button>
        </div>
      )
    }
  };

export default UserProfile;
