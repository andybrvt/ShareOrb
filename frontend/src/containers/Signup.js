import React from 'react';
import 'antd/dist/antd.css';

// DELETE LATER
import { Form } from '@ant-design/compatible';

import { Field, reduxForm, formValueSelector } from 'redux-form';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as actions from '../store/actions/auth';
import { LockOutlined, MailOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import './Home.css';
import worldPic from './LoginPage/world.svg';



const FormItem = Form.Item;

const renderField = (field) => {
  // Typical input field, most use for the title
  console.log(field.meta)
  return (
    <div style = {{
      position: "relative",
      height: "65px",
  }}>
    <Input

    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    maxLength = "80"
    className = 'box'
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
    errors.username = "Pleast input your username."
  }
  if(!values.password){
    errors.password = "Please input a password."
  }
  if(!values.confirm){
    errors.confirm = "Please confirm your password."
  }

  if(values.password !== values.confirm){
    // Check if the new password is the sme as the confirm password
    errors.confirm = "Passwords do not match"
  }

  if(values.password){
    if(values.password.length < 8){
      // validate if the password is longer than 8 characters
      errors.password = "New password must be at least 9 characters long."
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


    handleSubmit = (value) => {

      console.log(value)

    //   e.preventDefault();
    //   this.props.form.validateFieldsAndScroll((err, values) => {
    //     console.log(values)
    //     if (!err && values.password.length > 8) {
    //       this.props.onAuth(
    //         values.username,
    //         values.first_name,
    //         values.last_name,
    //         values.dob,
    //         values.email,
    //         values.phone_number,
    //         values.password,
    //         values.confirm,
    //       );
    //
    //       if(this.props.error === null){
    //           this.props.history.push('/home');
    //       }
    //     }
    // });
  }



  render() {
    const {handleSubmit, pristine, invalid, reset} = this.props;


      return (
      <div class="parentContainer" style={{background:'lightblue'}}>

        <div class="one">
          {/* color is #68BFFD*/}
          <img src={worldPic} width="100%"
            style={{position:'relative',left:'20%',marginTop:'300px'}}/>
        </div>

        <div class="two">

          <div class="eventCard allStyle" style={{left:'20%',top:'15%',
          width:'500px', height:'700px', padding:'50px'}}>

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

              <div>
                  <Field
                  name = 'first_name'
                  component = {renderField}
                  type = 'text'
                  placeholder = "First Name"
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
                  <Field
                  name = 'last_name'
                  component = {renderField}
                  type = 'text'
                  placeholder = "Last Name"
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
              {/* Gonna change this to see if there are specfic inputs to handle
                date of birth
                */}
                  <Field
                  name = 'dob'
                  component = {renderField}
                  type = 'text'
                  placeholder = "Date of Birth"

                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
                  <Field
                  name = 'email'
                  component = {renderField}
                  type = 'text'
                  placeholder = "Email"
                  validate = {email}
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
                  <Field
                  name = 'phone_number'
                  component = {renderField}
                  type = 'text'
                  placeholder = "Phone Number"
                  validate = {phoneNumber}
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
              </div>

              <div>
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
      );
  }
}




const WrappedSignup = Form.create()(Signup);

Signup = reduxForm({
  form: 'user sign up', // give the form a name
  validate
})(Signup)




const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
  // this is where the actual sign up fucntion is called
    return {
        onAuth: (username,first_name, last_name, dob, email, phone_number, password1, password2) => dispatch(actions.authSignup(username, first_name, last_name, dob, email, phone_number, password1, password2)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Signup);
