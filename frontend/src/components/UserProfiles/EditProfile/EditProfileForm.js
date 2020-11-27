import React from 'react';
import './EditProfile.css';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Avatar, DatePicker, TimePicker, Button, Input, Select, Radio, Drawer } from 'antd';
import { connect } from "react-redux";



const { TextArea } = Input

const renderInput = (field) => {

  return (
      <Input
      {...field.input}
      type = {field.type}
      placeholder = {field.placeholder}
      maxLength = "125"
      />
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


  render(){
    console.log(this.props)

    return(
      <div className = "">

        <div>
        First name:
        <Field
        name = 'first_name'
        component = {renderInput}
        type = 'text'
        />
        </div>

        <div>
        Last name:
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

        <div>
        Phone number:
        <Field
        name = 'phone_number'
        component = {renderInput}
        type  = "text"
        />
        </div>

        <div>
        Email:
        <Field
        name = "email"
        component= {renderInput}
        type = 'text'
        />
        </div>



      </div>
    )
  }
}

EditProfileForm = reduxForm({
  form: 'editProfileForm',
  enableReinitialize:  true,
}) (EditProfileForm)

const selector = formValueSelector("editProfileForm");



export default connect(state => ({
  first_name:  selector(state, 'first_name'),
  last_name: selector(state, 'last_name'),
  bio: selector(state, 'bio'),
  phone_number: selector(state, "phone_number"),
  email: selector(state, 'email')
})) (EditProfileForm);
