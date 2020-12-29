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

class UserInfoSettings extends React.Component{
  // This setting will be used for mostly usersetttings, changing like basic user
  // information like name, username, phone number, etc

//

  render(){
    console.log(this.props)

    return(
      <div className = "settingsBackGround">

        <Menu
          onClick={this.handleClick}
          style={{ width: 256 }}
          mode="inline"
          className ="sideMenu"
        >
          <Menu.Item> User Information </Menu.Item>
          <Menu.Item> Calendar Preference </Menu.Item>
          <Menu.Item> Privacy </Menu.Item>
        </Menu>

        <div className = "rightInfo">

        <form>

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
            />
          </div>


          <div>
            <span> Email </span>
            <Field
            name = "email"
            component = {renderField}
            type = "text"
            />
          </div>

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
}) (UserInfoSettings)

// const selector = formValueSelector("user info settings")
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
    }
  }
}

export default connect(mapStateToProps)(UserInfoSettings);
