import React from 'react';
import './Settings.css';
import { Menu, Form, Input } from 'antd';
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

//

  render(){
    console.log(this.props)

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

        <form>


          <button> Save </button>


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
