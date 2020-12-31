import React from 'react';
import './Settings.css';
import { Menu, Form, Input, Button, Switch, message } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import { connect } from "react-redux";
import { authAxios } from '../../components/util';
import * as authActions from '../../store/actions/auth';



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
  console.log(values.newPassword !== values.comfirmPassword)
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

  if(values.newPassword !== values.confirmPassword){
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
    // Now you will send it into the backend through views
  return authAxios.post("http://127.0.0.1:8000/rest-auth/password/change/",{
      new_password1: values.newPassword,
      new_password2: values.confirmPassword,
      old_password: values.oldPassword
    }) .then(res => {
      console.log(res)
      this.success()
      this.props.reset()
    }).catch(err => {
      // this is use to catch the erros in the password change call
      console.log(err)
      if(err.response){
        this.error()
        throw new SubmissionError({oldPassword: err.response.data.old_password[0]})
      }

    })
    // then you call an axios call here to change it

  }

  success = () => {
    message.success('Password changed successfully.');
  };

  error = () => {
    message.error('Password inputed was incorrect.');
  };


  onChange =(checked) => {
    console.log(`switch to ${checked}`);
    // This will be in charge of switching the true and false of the
    if(checked === false){

    } else {
      authAxios.post("http://127.0.0.1:8000/userprofile/privateChange", {
        privatePro: checked,
        curId: this.props.curId
      })
      .then(res =>{
        // Now you will put a redux call here ot change the backend
        this.props.changePrivate(res.data)
      }) 
    }

  }

  render(){
    console.log(this.props)
    console.log(this.state)
    const {handleSubmit, pristine, invalid, reset, error} = this.props;


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


        <div>
          <div> Change password </div>
          <form
          // onChange = {this.onChange}
          onSubmit = {handleSubmit(this.submit)}
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

            {error && <strong>{error}</strong>}
            <Button
            type = "primary"
            // disabled = {this.handleSubmitButton()}
            disabled = {pristine || invalid}
            htmlType = "submit"
            > Save </Button>


          </form>
        </div>

        <div>
          <div> Private Account </div>
          <div>
            <Switch checked ={this.props.privatePro} onChange={this.onChange} />
          </div>
          <div>
            This will make your account private. People who you have not approved
            can see you account.
          </div>


        </div>

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
const mapStateToProps = state => {
  return {
    curId: state.auth.id,
    privatePro: state.auth.private
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changePrivate: (privateCall) => dispatch(authActions.changePrivate(privateCall))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivacySettings);
