import React from 'react';
import './Settings.css';
import { Menu, Form, Input, Button, notification } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from "react-redux";
import { authAxios } from '../../components/util';
import * as authActions from '../../store/actions/auth';


const { SubMenu } = Menu;

const renderField = (field) => {
  // Typical input field, most use for the title
  console.log(field.meta)
  return (
    <div>
    <Input style={{width:'50%', height:'30px', fontSize:'15px'}}
    {...field.input}
    type = {field.type}
    placeholder= {field.placeholder}
    style={{display:'inline-block'}}
    maxLength = "80"
    className = 'box'/>

    {field.meta.touched &&
      ((field.meta.error && <span>{field.meta.error}</span>) ||
        (field.meta.warning && <span>{field.meta.warning}</span>))}
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
        errors.first_name = "Required"
    }
    if(!values.last_name){
      errors.last_name = "Required"
    }

    return errors
  }

  // function submit(values) {
  //   console.log(values)
  // }



class UserInfoSettings extends React.Component{
  // This setting will be used for mostly usersetttings, changing like basic user
  // information like name, username, phone number, etc

  submit =(values) => {
    console.log(values)

    // since you are not changing anything in real time, you can just use an axios
    // call

    const editProfileObj = {
      username: values.username,
      first_name: values.firstName,
      last_name: values.lastName,
      dob: values.dob,
      phone_number: values.phone_number,
      email: values.email,
    }

    authAxios.post("http://127.0.0.1:8000/userprofile/editUserInfo",{
      curId: this.props.curId,
      editProfileObj
    })
    .then(res => {
      console.log(res.data)
      // Now you will update the information on redux. Pretty much call an
      // axios call, addUserCredentails
      this.props.updateCredentials(res.data)
    })

    this.openNotification('bottomRight')

  }

  openNotification = placement => {
  notification.info({
    message: `Notification ${placement}`,
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    placement,
  });
};

  render(){
    console.log(this.props)


    const {handleSubmit, pristine, invalid, reset} = this.props;

    return(
      <div className = "settingsBackGround">

        <Menu
          selectedKeys = {["1"]}
          // onClick={this.handleClick}
          style={{ width: 256 }}
          mode="inline"
          className ="sideMenu"
        >
          <Menu.Item
          key = "1"
          onClick = {() => this.props.history.push("/settings")}
          > User Information </Menu.Item>
          <Menu.Item
          key = "2"
          onClick = {() => this.props.history.push("/settings/calPref")}
          > Calendar Preference </Menu.Item>
          <Menu.Item
          key = "3"
          onClick = {() => this.props.history.push("/settings/privacy")}
          > Privacy </Menu.Item>
        </Menu>

        <div className = "rightInfo">

        <form onSubmit = {handleSubmit(this.submit)}>

          <div>
            <span> Username </span>
            <Field
            name = 'username'
            component = {renderField}
            type = "text"
            />

          </div>

          <div>
            <span> First Name </span>
            <Field
            name = 'firstName'
            component = {renderField}
            type = 'text'
            />
          </div>

          <div>
            <span> Last Name </span>
            <Field
            name = "lastName"
            component = {renderField}
            type = "text"
            />
          </div>

          <div>
            <span> Date of Birth </span>
            <Field
            name = "dob"
            component = {renderField}
            type = "text"
            />
          </div>

          <div>
          <span> Phone number </span>
            <Field
            name = "phone_number"
            component = {renderField}
            type = "text"
            validate={phoneNumber}

            />
          </div>


          <div>
            <span> Email </span>
            <Field
            name = "email"
            component = {renderField}
            type = "text"
            validate={email}

            />
          </div>

          <Button
          type = "primary"
          // handleSubmit = {}
          disabled = {pristine || invalid}
          htmlType = "submit"
          > Save </Button>


        </form>

        </div>


      </div>
    )
  }
}

// Now you will need to create the redux form
UserInfoSettings = reduxForm({
  form: "user info settings",  // give the form a name
  enableReinitialize: true,
  validate
}) (UserInfoSettings)

const selector = formValueSelector("user info settings")
// For descrption go to ReduxEditEventForm.js

const mapStateToProps = state => {
  return{
    initialValues: {
      username: state.auth.username,
      firstName: state.auth.firstName,
      lastName: state.auth.lastName,
      email: state.auth.email,
      dob: state.auth.dob,
      phone_number: state.auth.phone_number
    },
    username: selector(state, 'username'),
    firstName: selector(state, 'firstName'),
    lastName: selector(state, 'lastName'),
    email: selector(state, 'email'),
    dob: selector(state, 'dob'),
    phone_number: selector(state, 'phone_number'),
    curId: state.auth.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateCredentials: (updatedUserObj) => dispatch(authActions.updateCredentials(updatedUserObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoSettings);
