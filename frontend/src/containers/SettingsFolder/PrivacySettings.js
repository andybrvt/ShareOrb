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

    </span>
  )
}

class PrivacySettings extends React.Component{
  // This setting will be used for mostly usersetttings, changing like basic user
  // information like name, username, phone number, etc

  state = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  }

  onChange = (values) => {
    this.setState({ [values.target.name]: values.target.value})
  }

  onHandleSubmit = e => {
    // This function will be used to handle the submit for the change in paasword
    // it will send into the backend and then check if the older password matches
    // the new one and then change it

    // You will use the states so no need to use the e in this case

    const passwordObj = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      confirmPassword: this.state.confirmPassword
    }

    // send into the views and then redux (probally don't event need redux)
  }

  handleSubmitButton = () => {
    // this function will handle the disabling of the change password button
    // All the fields must be filled in order for the button to be pressable


    // You will also put some validation in the front end as well

    let disabled = true

    if(this.state.oldPassword.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.confirmPassword.length > 0
    ) {
      disabled = false
    }

    return disabled;
  }

  render(){
    console.log(this.props)
    console.log(this.state)

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
        onChange = {this.onChange}
        >

          <div>
            <span> Old Password </span>
            <Input.Password
            name = "oldPassword"
            onChange = {this.onOldChange}
             />
          </div>

          <div>
            <span> New Password </span>
            <Input.Password
            name = "newPassword"
            onChange = {this.onNewChange}
             />
          </div>

          <div>
            <span> Comfirm New Password </span>
            <Input.Password
            name = "confirmPassword"
            onChange = {this.onConfirmChange}
            />
          </div>

          <Button
          type = "primary"
          disabled = {this.handleSubmitButton()}
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
  enableReinitialize: true,
}) (PrivacySettings)

// const selector = formValueSelector("user info settings")
// For descrption go to ReduxEditEventForm.js


export default PrivacySettings;
