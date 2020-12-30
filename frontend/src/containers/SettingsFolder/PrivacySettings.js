import React from 'react';
import './Settings.css';
import { Menu, Form, Input, Button } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { connect } from "react-redux";


const { SubMenu } = Menu;

const renderField = (field) => {
  // Typical input field, most use for the title
  console.log(field.meta)
  return (
    <span>
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

    </span>
  )
}


const validate = values => {
  const errors = {}
    // This will validate certain fields tos ee if they are good
  if(!values.oldPassword){
      errors.oldPassword = "Required"
  }
  if(!values.newPassword){
    errors.newPassword = "Required"
  }
  if(!values.confirmPassword){
    errors.confirmPassword = "Required"
  }

  if(values.newPassword !== values.oldPassword){
    // Check if the new password is the sme as the confirm password
    errors.confirmPassword = "Passwords do not match"
  }

  if(values.newPassword){
    if(values.newPassword.length < 8){
      // validate if the password is longer than 8 characters
      errors.newPassword = "New password must be at least 9 characters long."
    } else if(values.newPassword.search(/[A-Z]/)< 0){
      // Validates if it has an uppercase
      errors.newPassword = "New password must have an upper case letter."
    } else if(values.newPassword.search(/[0-9]/)< 0){
      // Validate if it has a number
      errors.newPassword = 'New password must have at least one number.'
    }
  }

  return errors
}

class PrivacySettings extends React.Component{
  // This setting will be used for mostly usersetttings, changing like basic user
  // information like name, username, phone number, etc

  submit = (values) => {
    console.log(values)

  }

  render(){
    console.log(this.props)
    console.log(this.state)
    const {handleSubmit, pristine, invalid, reset} = this.props;


    return(
      <div className = "settingsBackGround">

        <Menu
          selectedKeys = {["3"]}
          onClick={this.handleClick}
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

        <form
        // onChange = {this.onChange}
        >

          <div>
            <span> Old Password </span>
            <Field
            name = "oldPassword"
            component = {renderField}
            type = "password"
             />
          </div>

          <div>
            <span> New Password </span>
            <Field
            name = "newPassword"
            component = {renderField}
            type = "password"
             />
          </div>

          <div>
            <span> Comfirm New Password </span>
            <Field
            name = "confirmPassword"
            component = {renderField}
            type = "password"
             />
          </div>

          <Button
          type = "primary"
          // disabled = {this.handleSubmitButton()}
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
PrivacySettings = reduxForm({
  form: "Privacy settings",  // give the form a name
  // enableReinitialize: true,
  validate
}) (PrivacySettings)

// const selector = formValueSelector("user info settings")
// For descrption go to ReduxEditEventForm.js


export default PrivacySettings;
