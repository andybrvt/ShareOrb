import React from 'react';
import './EditProfile.css';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Avatar, Divider, DatePicker, TimePicker, Button, Input, Select, Radio, Drawer } from 'antd';
import { connect } from "react-redux";
import ChangeBackgroundModal from '../../../containers/PersonalCalendar/EventPage/ChangeBackgroundModal.js';
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
      placeholder = {"Insert Bio"}

      style={{}}
      />
      {field.meta.touched &&
        ((field.meta.error && <span>{field.meta.error}</span>) ||
          (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
  )
}

const renderTextArea = (field) => {


  const { TextArea } = Input

  return (
    <TextArea
    {...field.input}
    rows = {3}
    showCount
    maxLength={100}
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
      authAxios.put(`${global.API_ENDPOINT}/userprofile/profile/update/`+userId,
        data
      ).then(res => {
        console.log(res)
        this.props.changeProfilePic(res.data.profile_picture.substring(21,))
        this.props.changeProfilePicAuth(res.data.profile_picture.substring(21,))
      })

  // PROBALLY ADD IN THE REDUX LIKE EVENT PAGE
      this.onCloseChangeProfilePic();

    }


    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

  render(){
    console.log(this.props)
    let profilePic = ""
    let firstName=""
    let lastName=""

    if(this.props.profilePic){
      profilePic =`${global.IMAGE_ENDPOINT}`+ this.props.profilePic
    }
    if(this.props.first_name){
      firstName = this.props.profile.first_name
    }
    if(this.props.last_name){
      lastName = this.props.profile.last_name
    }






    const { TextArea } = Input


    const {handleSubmit, pristine, invalid, reset} = this.props;


    return(
      <div className = "eventCard" style={{padding:'50px'}}>

        <div
        onClick = {() => this.onOpenChangeProfilePic()} >
          <Avatar
           size = {100}
           src = {profilePic}/>

           <span style={{marginLeft:'40px'}} className = 'profileName'>
               {this.capitalize(firstName)} {this.capitalize(lastName)}
                <br/>
                <span  class="profileEditUserName">
                 {"@"+this.props.username}
                </span>


          </span>

        </div>




        {/*
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

        */}
        <Divider/>
        <div style={{marginTop:'10px'}}>
          Bio
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

        <ChangeBackgroundModal
          pic={this.props.profilePic}
          visible = {this.state.showUploadModal}
          close = {this.onCloseChangeProfilePic}
          onSubmit = {this.handleProfilePicChange}
        />


        <Button

          type = "primary"
          onClick = {handleSubmit}
          disabled = {pristine || invalid}
          style={{marginTop:'25px', float:'right'}}
          htmlType = "submit">
          Submit
        </Button>
        </div>



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
