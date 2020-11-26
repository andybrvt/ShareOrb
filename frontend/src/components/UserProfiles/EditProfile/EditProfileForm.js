import React from 'react';
import './EditProfile.css';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Avatar, DatePicker, TimePicker, Button, Input, Select, Radio, Drawer } from 'antd';



const { TextArea } = Input

const renderInput = (field) => {

  return (
      <Input
      placeholder = {field.placeholder}
      maxLength = "125"
      />
  )
}

const renderTextArea = (field) => {
  return (
    <TextArea
    rows = {4}
    type = {field.type}
    placeholder = {field.placeholder}
    />
  )
}

class EditProfileForm extends React.Component{



  render(){


    return(
      <div className = "">

        <div>
        <Field
        name = 'first_name'
        component = {renderInput}
        type = 'text'
        />
        </div>

        <div>
        <Field
        name = 'last_name'
        component = {renderInput}
        type = "text"
        />
        </div>

        <div>
        <Field
        name = 'bio'
        component = {renderTextArea}
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


export default EditProfileForm;
