import React from 'react';
import './UploadVideoDemo.css';
import { Upload, Menu, Form, Input, Button, Switch, message, Divider } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Field, reduxForm, formValueSelector, SubmissionError } from 'redux-form';
import { connect } from "react-redux";
import { authAxios } from './components/util';
import * as authActions from './store/actions/auth';
import { UploadOutlined } from '@ant-design/icons';
import icon2 from './uploadVid.svg';

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

function getBase64(img, callback) {

  // Pretty much read the image into a url so that it can be sent properly into
  // backend

  // The callback function is the function that gets passed in, this this case the
  // call back would be the setState fucntion taht adds in the imageurl into the
  // setstate
  console.log(img)
  const reader = new FileReader();
  // Filereader lets webapplciations async red the content files stored in the user's
  // computer
  console.log(reader)
  reader.addEventListener('load', () => callback(reader.result));
  // addEventListener sets up a function to be called whenever the specific
  // event is deleived to the target which in this case is the reader.result
  // The load is a case sensative term and it checks if things have finished loading
  reader.readAsDataURL(img);
  // Pretty much reads the data then turn it into a url that represent the file's data

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

class UploadVideoDemo extends React.Component{
  // This setting will be used for mostly usersetttings, changing like basic user
  // information like name, username, phone number, etc
  state = {
    confirmPublic: false,
    imageFile: "",
  }


  submit = (values) => {
    console.log(values)
    // Now you will send it into the backend through views
  return authAxios.post(`${global.API_ENDPOINT}/rest-auth/password/change/`,{
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

  openConfirmPublic = () => {
    // This function will be used to open the modal that will confirm that you
    // are sure you want to switch your account ot public
    this.setState({
      confirmPublic: true
    })
  }

  closeConfirmPublic = () => {
    this.setState({
      confirmPublic: false
    })
  }

  handleChange = info => {

    console.log(info)
    // Handle the change of the picture
    // if(info.file.status === "uploading"){
    //   this.setState({loading: true});
    //   return;
    // }
    // if(info.file.status  === "done"){
      // Whne uploading is done, you will upload it
      this.setState({
        imageFile: info.file.originFileObj
      })
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false
        })
      )
    // }

  }


  onChange =(checked) => {
    console.log(`switch to ${checked}`);
    // This will be in charge of switching the true and false of the
    if(checked === false){
      console.log('hit here')
      this.openConfirmPublic()
    } else {
      authAxios.post(`${global.API_ENDPOINT}/userprofile/privateChange`, {
        privatePro: checked,
        curId: this.props.curId
      })
      .then(res =>{
        // Now you will put a redux call here ot change the backend
        this.props.changePrivate(res.data)
      })
    }

  }

  navHome = () => {
      this.props.history.push('/')
  }

  render(){
    console.log(this.props)
    console.log(this.state)
    const {handleSubmit, pristine, invalid, reset, error} = this.props;

    const { imageUrl } = this.state;
    return(
      <div style={{background:'white'}}>
      {/*
      <div class="headerTop">
        <div class="row">
          <div class="col"> Wallet</div>
          <div class="col"> My Profile</div>
          <div class="col"> Wallet</div>
          <div class="col"> My Profile</div>
        </div>
      </div>
      */}
      <div style={{paddingTop:40, paddingLeft:75}}>
      <Button type="primary" shape="round"
        onClick ={() =>this.navHome()}
         style={{width:150, height:32.5}}
        class="buttonInSubmitVideo"
        >
        <div style={{fontSize:15, }}>
          Back to Home

        </div>
      </Button>
      </div>
      <div className = "settingsBackGround2">



          <div className = "centerContent">
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <img style={{width:'30%', height:'30%'}} className = "image" src = {icon2} />
            </div>
            <Divider />
            <div class="uploadBigContainer">
              <div
                className = "titleFont2"
                > Submit a video below for 15% discount on your next purchase </div>
              <form
              // onChange = {this.onChange}
              onSubmit = {handleSubmit(this.submit)}
              >



                <div className = "submitVidForm">

                  {/*
                  <Field
                  name = "newPassword"
                  component = {renderField}
                  type = "password"
                   />
                   */}
                   <Upload

                     name="avatar"
                     listType="picture-card"


                     showUploadList={false}
                     // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                     // beforeUpload={beforeUpload}
                     onChange={this.handleChange}
                   >
                     <div

                       >
                       {
                         (imageUrl) ?
                         <img class="changeProfilePic" src={imageUrl} alt="avatar" />
                         :
                         <div style={{background:'#f0f0f0', height:200, width:200}}>
                             <div class="fitUploadAvatar">
                               <i style={{fontSize:'80px'}} class="fas fa-upload"></i>
                             </div>
                         </div>
                     }
                     </div>

                   </Upload>

                   <div className = "">
                     <div className = ""> Email </div>
                     <Field
                     name = "oldPassword"
                     component = {renderField}
                     type = "password"
                      />
                   </div>
                </div>


                {error && <strong>{error}</strong>}
                <Button
                type = "primary"
                // disabled = {this.handleSubmitButton()}
                disabled = {pristine || invalid}
                htmlType = "submit"
                > Submit </Button>


              </form>
            </div>




          </div>





      </div>

      </div>
    )
  }
}

// Now you will need to create the redux form
UploadVideoDemo = reduxForm({
  form: "Privacy settings",  // give the form a name
  // enableReinitialize: true,
  validate
}) (UploadVideoDemo)

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

export default connect(mapStateToProps, mapDispatchToProps)(UploadVideoDemo);
