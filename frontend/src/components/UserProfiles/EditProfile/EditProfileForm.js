import React from 'react';
import './EditProfile.css';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Avatar, DatePicker, TimePicker, Button, Input, Select, Radio, Drawer } from 'antd';
import { connect } from "react-redux";
import ChangeProfilePic from '../../../containers/CurrUser/ChangeProfilePic';
import { authAxios } from '../../util';



const { TextArea } = Input


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

const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

export const phoneNumber = value =>
  value && !/^(0|[1-9][0-9]{9})$/i.test(value)
    ? 'Invalid phone number, must be 10 digits'
    : undefined

const renderInput = (field) => {
  console.log(field)
  return (
    <div>
      <Input
      {...field.input}
      type = {field.type}
      placeholder = {field.placeholder}
      maxLength = "125"
      style={{}}
      />
      {field.meta.touched &&
        ((field.meta.error && <span>{field.meta.error}</span>) ||
          (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
  )
}

const renderTextArea = (field) => {
  return (
    <TextArea
    {...field.input}
    rows = {4}
    type = {field.type}
    placeholder = {field.placeholder}
    />
  )
}

class EditProfileForm extends React.Component{

  state = {
    showUploadModal: false
  }

  onOpenChangeProfilePic = () => {
    this.setState({
      showUploadModal: true
    })
  }

  onCloseChangeProfilePic = () => {
    this.setState({
      showUploadModal: false
    })
  }


    handleProfilePicChange = (values) => {
      // This is used to changing the profile pic, for submiting.
      console.log(values)
      const userId = this.props.curId
      var data  = new FormData()
      data.append('profile_picture', values)
      // To edit information, you usually do put instead of post
      authAxios.put('http://127.0.0.1:8000/userprofile/profile/update/'+userId,
        data
      ).then(res => {
        this.props.changeProfilePic(res.data.profile_picture.substring(21,))
        this.props.changeProfilePicAuth(res.data.profile_picture.substring(21,))
      })

  // PROBALLY ADD IN THE REDUX LIKE EVENT PAGE
      this.onCloseChangeProfilePic();

    }

  render(){
    console.log(this.props)
    let profilePic = ""
    if(this.props.profilePic){
      profilePic = 'http://127.0.0.1:8000'+this.props.profilePic
    }

    const {handleSubmit, pristine, invalid, reset} = this.props;


    return(
      <div className = "">
        {/*
        <div style={{background:'red'}}
        onClick = {() => this.onOpenChangeProfilePic()} >
          <Avatar
           size = {100}
           src = {profilePic}/>
        </div>
        */}




        <div>
        First name
        <Field
        name = 'first_name'
        component = {renderInput}
        type = 'text'
        />
        </div>

        <div>
        Last name
        <Field
        name = 'last_name'
        component = {renderInput}
        type = "text"
        />
        </div>

        <div>
        Bio:
        <Field
        name = 'bio'
        component = {renderTextArea}
        type = 'text'
        />
        </div>
        {/*
        <div>
        Phone number:
        <Field
        name = 'phone_number'
        component = {renderInput}
        type  = "text"
        validate={phoneNumber}

        />
        </div>

        <div>
        Email:
        <Field
        name = "email"
        component= {renderInput}
        type = 'text'
        validate={email}

        />
        </div>

        */}


        <div>
        <Button
        type = "primary"
        onClick = {handleSubmit}
        disabled = {pristine || invalid}
        htmlType = "submit">
          Submit
        </Button>
        </div>


        <ChangeProfilePic
          visible = {this.state.showUploadModal}
          onCancel = {this.onCloseChangeProfilePic}
          onSubmit = {this.handleProfilePicChange}
         />

      </div>
    )
  }
}

EditProfileForm = reduxForm({
  form: 'editProfileForm',
  enableReinitialize:  true,
  validate
}) (EditProfileForm)

const selector = formValueSelector("editProfileForm");



export default connect(state => ({
  first_name:  selector(state, 'first_name'),
  last_name: selector(state, 'last_name'),
  bio: selector(state, 'bio'),
  phone_number: selector(state, "phone_number"),
  email: selector(state, 'email')
})) (EditProfileForm);
