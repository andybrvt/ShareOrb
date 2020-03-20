import React from 'react';
import axios from 'axios';

import { authAxios } from '../components/util';

class PersonalProfile extends React.Component{
  state = {
    id:'',
		username:'',
		first_name: '',
		last_name: '',
		bio: '',
    friends: [],
  }

  async componentDidMount(){
    console.log('here')
    const username = this.props.match.params.username;
    console.log(this.props.match.params)


    await authAxios.get('http://127.0.0.1:8000/userprofile/'+username)
      .then(res=> {
        console.log(res.data)
        console.log(res.data.id)
        this.setState({
          id:res.data.id,
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          bio: res.data.bio,

       });
     });

    await authAxios.get('http://127.0.0.1:8000/friends/')
       .then(res=> {
         console.log(res.data)
         console.log(res.data.id)
         this.setState({
           friends: res.data.friends

        });
      });
   }


  render(){
    console.log(this.props)
    console.log(this.state.friends)
      return(
        <div>
        {this.state.username}
        {this.state.first_name}
        {this.state.last_name}
        {this.state.friends}

        </div>
      )

      }
    };

export default PersonalProfile;
