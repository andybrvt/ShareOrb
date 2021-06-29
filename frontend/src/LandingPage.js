import React from 'react';
import  { authAxios } from './components/util';
import axios from "axios";


class LandingPage extends React.Component{
  constructor(props){

    super(props)
  }


  state = {
    email: '',
    errors: {},
  }

  handleEmailChange = e => {
    console.log(e.target.value)
    this.setState({
      email: e.target.value
    })
  }


  handleEmailValidation(){
    let {email} = this.state;
    let errors = {};
    let emailIsTrue = true;

    if(email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)){
      emailIsTrue = false;
      errors['email'] = "Enter a valid email"
    }

    this.setState({
      errors: errors
    })

    return emailIsTrue;

  }

  handleEmailSubmit = e => {
    e.preventDefault()
    const { email } = this.state;

    if(this.handleEmailValidation()){
      axios.post(`${global.API_ENDPOINT}/userprofile/onWaitListAdd`,{
        email: email
      })
    } else {
      alert("email is not valid")
    }

    // Now just do an axios call here
  }

  render(){
    return(
      <div>
        <div>
          <form onSubmit = {this.handleEmailSubmit}>
            <label>
              Email:
              <input
                type ="text"
                placeholder = "example@mail.com"
                onChange = {this.handleEmailChange}
                value = {this.state.email}
                />
              <button type = "submit"> Join </button>
            </label>

          </form>

          <button> Check place in line </button>

        </div>

      </div>
    )
  }

}

export default LandingPage;
