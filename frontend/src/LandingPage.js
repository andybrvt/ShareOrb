import React from 'react';
import  { authAxios } from './components/util';
import axios from "axios";
import './LandingPage.css';
import logo from './logo.svg';
import landingPic from './containers/landingPic.png'
import pic2 from './containers/LoginPage/calendar.svg';


class LandingPage extends React.Component{
  constructor(props){

    super(props)
  }


  state = {
    email: '',
    errors: {},
    showPosition: false,
    position: 0
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
      .then(res=> {
        console.log(res.data)
        this.setState({
          email: '',
          showPosition: true,
          position: res.data[1]
        })
      })
    } else {
      alert("email is not valid")
    }

    // Now just do an axios call here
  }

  render(){
    return(
      <div class = "mainPage">
        <div class = "circle">
        </div>
        <div class="bigContainer">
          <div class="smallContainer1">

            <div class = "logo">
              <img src = {logo} width = "200"  />
            </div>
          </div>

          <div class="smallContainer2">
            <div class = "text">
              <div class = "bigText">
                Cherish the smaller moments in life
              </div>
              <div class = 'smallText'>
                Shareorb is a social media platform that lets you create one album a day. And... That's it!
              </div>
            </div>
          </div>
        </div>


          <div class = "imageHolder">
            <img className = "image" src = {pic2} />
          </div>



        <div class = "inputHolder">
          {this.state.showPosition ?

            <div class = "lineText" >
              You are <b class = 'boldNum'>{this.state.position}</b> in line
            </div>
            :

            <form onSubmit = {this.handleEmailSubmit}>
                <label style = {{
                    width: '100%',
                  }}>
                  <div class = "inputField">
                    <input
                      class = "inputStyle"
                      type ="text"
                      placeholder = "example@mail.com"
                      onChange = {this.handleEmailChange}
                      value = {this.state.email}
                      />
                   <button type = "submit" class = 'button'> Join </button>

                  </div>

                </label>



            </form>

          }

        </div>



      </div>
    )
  }

}

export default LandingPage;
