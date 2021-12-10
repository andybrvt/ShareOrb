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
  const reader = new FileReader();
  // Filereader lets webapplciations async red the content files stored in the user's
  // computer
  reader.addEventListener('load', () => callback(reader.result));
  // addEventListener sets up a function to be called whenever the specific
  // event is deleived to the target which in this case is the reader.result
  // The load is a case sensative term and it checks if things have finished loading
  reader.readAsDataURL(img);
  // Pretty much reads the data then turn it into a url that represent the file's data

}


const validate = values => {
  // console.log(values.newPassword !== values.comfirmPassword)
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
    selectedFile: "",
    submitFile:"",
    delete:[],
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

  handleChange(event) {
    console.log(event)
    // this.setState({
    //   selectedFile: URL.createObjectURL(event.target.files[0])
    // })
  }



  navHome = () => {
      this.props.history.push('/')
  }

  componentDidMount(){
    authAxios.get(`${global.API_ENDPOINT}/userprofile/current-user/friends`)
    .then(res =>{
      this.setState({
        delete:res.data,
        })
      }
    )
    console.log("DELTE THISSSS")
  }

  submitVid=(values)=>{
    console.log('start of submitted vid')
    console.log(values)
    const formData = new FormData();
    formData.append('email',  values.email)
    formData.append('vid', this.state.selectedFile)
    console.log(formData)
    authAxios.post(`${global.API_ENDPOINT}/portal/UploadBusinessVid`,
      formData,
      {headers: {"content-type": "multipart/form-data"}}
    ).then(res => {
      console.log(res.data)
    })
  }

  onChangeHandler = event => {
    console.log(event.target.files[0])
    console.log(URL.createObjectURL(event.target.files[0]))
    this.setState({
        selectedFile: event.target.files[0],
        submitFile:URL.createObjectURL(event.target.files[0]),
        loaded: 0,
    })

}

  render(){
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
        <div style={{fontSize:14, }}>
          Back to Home

        </div>
      </Button>
      </div>
      <div className = "">



          <div className = "centerContent">
            <div class="uploadBigContainer">
              <div className = "titleFont2"
                > Enter your email and submit a video for 15% off! </div>
            </div>
            <div class="row">
                <img style={{width:200, height:200}} className = "imageFlex" src = {icon2} />

              <div class="col">
                <input onChange={this.onChangeHandler} type="file" name="file" ></input>
              
                  <div>
                    {
                      (this.state.selectedFile) ?

                // uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"

                      // <img class="imageUploaded" src={imageUrl} alt="avatar" />
                      <video width="300" height="300" controls>
                          <source src={this.state.submitFile}/>
                      </video>

                      :
                      ''
                  }
                  </div>

              </div>
            </div>
            <Divider />


            <form
              onSubmit = {handleSubmit(this.submitVid)}
            >

              <div class="enterEmail">

                {/*
                <Field
                name = "newPassword"
                component = {renderField}
                type = "password"
                 />
                 */}



                   <div className = ""> Enter Email </div>
                   <Field
                   name = "email"
                   component = {renderField}
                   type = 'text'
                   placeholder= 'Enter email here...'
                    />
              </div>

              <div style={{paddingTop:'25px'}}>
                <Button
                  // onClick={this.submitVid}
                htmlType="submit"
                type = "primary"
                // disabled = {this.handleSubmitButton()}
                // disabled = {pristine || invalid}
                > Submit </Button>
              </div>

            </form>


          </div>





      </div>

      {/*
        <Upload

          showUploadList={false}
          onChange={this.onChangeHandler}
        >
          <div>
            {
              (this.state.selectedFile) ?

        // uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"

              // <img class="imageUploaded" src={imageUrl} alt="avatar" />
              <video width="300" height="300" controls>
                  <source src={this.state.submitFile}/>
              </video>

              :
              <div class="uploadBackGround2">
                    <i style={{fontSize:'80px', color:'#bfbfbf'}} class="fas fa-upload"></i>
              </div>
          }
          </div>
        </Upload>

        */}
      </div>
    )
  }
}

// Now you will need to create the redux form
UploadVideoDemo = reduxForm({
  form: "Video Demo",  // give the form a name
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
