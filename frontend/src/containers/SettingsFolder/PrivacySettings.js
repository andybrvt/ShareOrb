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
            <Input
            name = "oldPassword"
            onChange = {this.onOldChange}
             />
          </div>

          <div>
            <span> New Password </span>
            <Input
            name = "newPassword"
            onChange = {this.onNewChange}
             />
          </div>

          <div>
            <span> Comfirm New Password </span>
            <Input
            name = "confirmPassword"
            onChange = {this.onConfirmChange}
            />
          </div>

          <Button> Save </Button>


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
