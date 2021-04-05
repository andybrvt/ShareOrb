import React from 'react';
import 'antd/dist/antd.css';
import axios from "axios";

import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, DatePicker, Select} from 'antd';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { LockOutlined, MailOutlined, QuestionCircleOutlined,
   UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';
import './Home.css';
import worldPic from './LoginPage/world.svg';


const { Option } = Select;

const renderPersonal = (field) => {
  // Typical input field, most use for the title
  console.log(field.meta)
  return (
    <div style = {{
      position: "relative",
      height: "52px",
      width:'90%',
  }}>
    <Input

    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    maxLength = "80"
    prefix = {field.prefix}
    />

    {field.meta.touched &&
      ((field.meta.error && <span style = {{
        color: 'red'
      }}>{field.meta.error}</span>) ||
        (field.meta.warning && <span
          style = {{
            color: 'red'
          }}
          >{field.meta.warning}</span>))}
    </div>
  )
}

const renderField = (field) => {
  // Typical input field, most use for the title
  console.log(field.meta)
  return (
    <div style = {{
      position: "relative",
      height: "50px",
  }}>
    <Input

    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    // maxLength = "20"
    prefix = {field.prefix}
    />

    {field.meta.touched &&
      ((field.meta.error && <span style = {{
        color: 'red'
      }}>{field.meta.error}</span>) ||
        (field.meta.warning && <span
          style = {{
            color: 'red'
          }}
          >{field.meta.warning}</span>))}
    </div>
  )
}

const renderBirthDay = (field) => {

  return (

      <DatePicker
        prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }}/>}
        placeholder= "Date of Birth"
        onChange = {field.input.onChange}
        value = {field.input.value}
        suffixIcon = {<div></div>}
        allowClear = {true}
        format = {"MM/DD/YYYY"}
        />


  )
}

const renderPhoneNumber = (field) => {
  // Typical input field, most use for the title
  console.log(field)
  console.log(field.meta)
  return (
    <div style = {{
      position: "relative",
      height: "50px",
  }}>
    <Input

    type = {field.type}
    value = {normalizeInput(field.input.value)}
    onChange = {field.input.onChange}
    placeholder= {field.placeholder}
    // maxLength = "20"
    prefix = {field.prefix}
    />

    {field.meta.touched &&
      ((field.meta.error && <span style = {{
        color: 'red'
      }}>{field.meta.error}</span>) ||
        (field.meta.warning && <span
          style = {{
            color: 'red'
          }}
          >{field.meta.warning}</span>))}
    </div>
  )
}




const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined



export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined


const validateNumber = value =>
  value && value.length!== 14 ?
  "Invalid phone format"
  : undefined


const normalizeInput = (value) => {
  // convert phone number input
  console.log(value)
  if(!value) return value;

  // only allows 0-9 digits
  let currentValue = value.replace(/[^\d]/g, "");
  let cvLength = currentValue.length;

  if( value){
    // returns "x", "xx", "xxx"

    if(cvLength < 4){
      return currentValue;
    }

    else if(cvLength< 7){
      return `(${currentValue.slice(0,3)}) ${currentValue.slice(3)}`
    } else {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }


  }
}



const validate = values => {
  const errors = {}
    // This will validate certain fields tos ee if they are good
  if(!values.first_name){
      errors.first_name = "Please input your first name."
  }
  if(!values.last_name){
    errors.last_name = "Please input your last name."
  }
  if(!values.username){
    errors.username = "Please input your username."
  }
  if(values.username){
    if(values.username.includes("@")){
        errors.username = "You cannot have an @ in your username."
    }

  }
  if(!values.password){
    errors.password = "Please input a password."
  }
  if(!values.confirm){
    errors.confirm = "Please confirm your password."
  }
  if(!values.dob){
    errors.dob = "Please enter a date of birth."
  }
  if(!values.email){
    errors.email = "Please enter an email."
  }
  if(!values.phone_number){
    errors.phone_number = "Please enter a number."
  }

  if(values.password !== values.confirm){
    // Check if the new password is the sme as the confirm password
    errors.confirm = "Passwords do not match"
  }
  if(!values.email){
    errors.email = "Please input your email."
  }

  if(values.password){
    if(values.password.length < 9){
      // validate if the password is longer than 8 characters
      errors.password = "New password must be at least 10 characters long."
    } else if(values.password.search(/[A-Z]/)< 0){
      // Validates if it has an uppercase
      errors.password = "New password must have an upper case letter."
    } else if(values.password.search(/[0-9]/)< 0){
      // Validate if it has a number
      errors.password = 'New password must have at least one number.'
    }
  }

  return errors
}




class Signup extends React.Component {
  constructor(props) {
    super(props);
  }


  renderMonth = () => {
    // Typical input field, most use for the title
    console.log('hi')
    const numList=[]
    console.log(numList)
    let monthList=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for(let i = 0; i< 12; i++){
        numList.push(
        <Option key= {i}> {monthList[i]} </Option>
        )
      }
    return numList;

  }
  renderDay = () => {
    // Typical input field, most use for the title
    console.log('hi')
    const numList=[]
    console.log(numList)

      for(let i = 0; i< 32; i++){
        numList.push(
        <Option key= {i}> {i} </Option>
        )
      }
    return numList;

  }

  handlePhoneNumChange = (event, value) => {

    console.log(event)
    const { change } = this.props

    console.log(normalizeInput(value))

  }

  numberConverter = (number) => {
    // This function will conver the number back to the right form
    // it will conver this form (xxx) xxx-xxxx to this form xxxxxxxxxx
    let phoneNumber = ""
    phoneNumber = number.slice(1,4)+number.slice(6,9)+number.slice(10, 14)
    return phoneNumber;
  }

    handleSubmit = (values) => {

      console.log(values)

      // const number = this.numberConverter(values.phone_number)
    console.log(values.dob.format("YYYY-MM-DD"))
     this.props.onAuth(
            values.username,
            values.first_name,
            values.last_name,
            values.dob.format("YYYY-MM-DD"),
            values.email,
            values.password,
            values.confirm,
      )
    return axios.post(`${global.API_ENDPOINT}/rest-auth/registration/`, {
      username: values.username,
      first_name: values.first_name,
      last_name: values.last_name,
      dob: values.dob.format("YYYY-MM-DD"),
      email: values.email,
      password1: values.password,
      password2: values.confirm
    }).then( res => {
      console.log(res)
      const token = res.data.key;
      const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
      localStorage.setItem("token", token);
      localStorage.setItem("expirationDate", expirationDate);
      this.props.authSuccess(token);

      window.location.reload();

      return axios.get(`${global.API_ENDPOINT}/userprofile/current-user`)

    }) .then(res => {
      const username1 = res.data.username;
      const id = res.data.id;
      const friends = res.data.friends;

      localStorage.setItem("username", username1);
      localStorage.setItem("id", id);
      localStorage.setItem('friends', friends);

      this.props.addCredentials(
         res.data.username,
         res.data.id,
         res.data.friends,
         res.data.get_posts,
         res.data.first_name,
         res.data.last_name,
         res.data.profile_picture,
         res.data.get_following,
         res.data.get_followers
       );
      this.props.checkAuthTimeout(3600);

    }).catch( err => {
      console.log(err)
      console.log(err.response)
      if(err.response){
        // if(err.response.data === 500){
        //   throw new SubmissionError({username: "User name already exist"})
        //
        // } else {
          this.props.authFail(err.response.data)
          throw new SubmissionError(err.response.data)
        // }
      } else {
        this.props.history.push('/home')
        window.location.reload();
      }


    })





    }


  render() {
    const {handleSubmit, pristine, invalid, reset} = this.props;
    const { token } = this.props;
    const monthSelect = this.renderMonth();
    const daySelect = this.renderDay();
    if(token){
      return <Redirect to = '/home' />
    }

    console.log(this.props)
      return (
      <div class="parentContainer" style={{background:'lightblue'}}>

        <div class="one">
          {/* color is #68BFFD*/}
          <div class="oneSignupImage">
          <img src={worldPic} width="100%"/>
          </div>
        </div>

        <div class="two">
          <div class="rightSignupForm">
          <div class="eventCard allStyle"
            style={{
              position:'relative', width:'500px',
               height:'50%',padding:'50px'}}>

            <span style={{fontSize:'20px'}}> Sign Up</span>

            <form
            onSubmit = {handleSubmit(this.handleSubmit)}
            style={{marginTop:'25px', position: 'relative'}}>

              <div >
                <Field
                name = 'username'
                component = {renderField}
                type = 'text'
                placeholder= 'Username'
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
              </div>
              {/*

                <Field
                name = 'first_name'
                component = {renderPersonal}
                type = 'text'
                placeholder = "First Name"
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />

                <Field
                name = 'last_name'
                component = {renderPersonal}
                type = 'text'
                placeholder = "Last Name"
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                */}
              <div class="FirstLastNameContainer">
                  <div class="frontFirstLastName">
                    <Field
                    name = 'first_name'
                    component = {renderPersonal}
                    type = 'text'
                    placeholder = "First Name"
                    />


                  </div>
                  <div class="backFirstLastName">

                    <Field
                    name = 'last_name'
                    component = {renderPersonal}
                    type = 'text'
                    placeholder = "Last Name"
                    />
                  </div>
              </div>


              <Field
              name = 'email'
              component = {renderField}
              type = 'text'
              placeholder = "Email"
              validate = {email}
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              />


              {/* Gonna change this to see if there are specfic inputs to handle
                date of birth
                */}


              <div className = "middleSignUpHolder">
                  {/*
                    <i
                      style={{
                          fontSize:'15px',
                          color: 'rgba(0,0,0,.25)',
                          marginRight:'3px',
                          position: "relative",
                          top: "50%",
                          transform: "translateY(-50%)"
                         }}
                      class="fas fa-birthday-cake"></i>
                    */}
                  <div className = "frontFirstLastName">
                    <Field
                    name = 'dob'
                    component = {renderBirthDay}
                    type = 'date'

                    />

                  </div>






                <div className = "backFirstLastName">
                  {/*
                    <div>
                      <i style={{
                          fontSize:'15px',
                          color: 'rgba(0,0,0,.25)',
                          marginRight:'3px',
                          position: "relative",
                          top: "50%",
                          transform: "translateY(-50%)"
                         }} class="fas fa-map-marker-alt"></i>
                    </div>
                    */}
                    {/*
                    <Field
                    name = 'phone_number'
                    component = {renderPhoneNumber}
                    type = 'text'
                    placeholder = "Phone Number"
                    onChange = {this.handlePhoneNumChange}
                    validate = {validateNumber}
                    prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    />
                    */}
                </div>

              </div>



              <div>

                <br/>
                  <Field
                  name = 'password'
                  component = {renderField}
                  type = 'password'
                  placeholder = "Password"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
                  <Field
                  name = 'confirm'
                  component = {renderField}
                  type = 'password'
                  placeholder = "Confirm your Password"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
                <Button
                type="primary"
                htmlType="submit"
                style={{marginRight: '10px'}}>
                    Sign Up
                </Button>
                Or
                <NavLink
                    style={{marginRight: '10px'}}
                    to='/'> login
                </NavLink>
              </div>

            </form>

          </div>
          </div>
          </div>

      </div>
      );
  }
}





Signup = reduxForm({
  form: 'user sign up', // give the form a name
  validate
})(Signup)

const selector = formValueSelector('user sign up')



const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        errorMessage: state.auth.error,
        token: state.auth.token,
        phone_number: selector(state, "phone_number")
    }
}

const mapDispatchToProps = dispatch => {
  // this is where the actual sign up fucntion is called
    return {
        onAuth: (username,first_name, last_name, dob, email, phone_number, password1, password2) =>
        dispatch(actions.authSignup(username, first_name, last_name, dob, email, phone_number, password1, password2)),
        authSuccess: (token) => dispatch(actions.authSuccess(token)),
        addCredentials: (
          username,
          id,
          friends,
          posts,
          first_name,
          last_name,
          profile_picture,
          following,
          followers
        ) => dispatch(actions.addCredentials(
          username,
          id,
          friends,
          posts,
          first_name,
          last_name,
          profile_picture,
          following,
          followers
        )),
        checkAuthTimeout: (time) => dispatch(actions.checkAuthTimeout(time)),
        authFail: (err) => dispatch(actions.authFail(err))

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Signup);
