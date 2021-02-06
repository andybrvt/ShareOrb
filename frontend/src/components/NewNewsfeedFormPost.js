import React from 'react';
import { Upload,
   Modal,
   Input,
   Avatar,
   Button,
   Divider,
   Switch,
   Alert,
   message,
   notification
  } from 'antd';
import { PlusOutlined, CameraOutlined} from '@ant-design/icons';
import { connect } from "react-redux";
import { authAxios } from './util';
import WebSocketPostsInstance from '../postWebsocket';


const {TextArea} = Input

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  return file.type === 'image/png';
}



class NewNewsfeedFormPost extends React.Component{

    state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList :[],
      caption: '',
      cameraShow:false,
      socialClip:false,
    }

    handleCancel = () => this.setState({ previewVisible: false });


    handlePreview = async file => {
     if (!file.url && !file.preview) {
       file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };

    conditionUploadBox=()=>{
      this.setState({
        cameraShow:true,
        });
    }

    onChange=()=>{
      this.setState({
        socialClip:!this.state.socialClip,
      });
    }

    handleChange = ({ fileList }) => this.setState({ fileList });

    handleCaptionChange = (e) => {
      this.setState({
        caption: e.target.value
      })
    }

    handleValidation(){
      // This function will handle the validating whether or not you are allowed to post

      // Since we want only post with pictures, so we have to make a conditional
      // where if there is a photo and no caption then post would work, if there is
      // just post and no pictures then it would not work

      let caption = this.state.caption
      let fileList = this.state.fileList
      let buttonDisabled = true

      // Only in the case where there are photos then buttom should not be
      // disabled
      if(caption !== "" && fileList.length > 0){
        buttonDisabled = false
      } else if (caption === "" && fileList.length > 0){
        buttonDisabled = false
      } else {
        buttonDisabled = true
      }

      return buttonDisabled


    }

    onFormSubmit= () => {
      console.log(this.state)

      const ownerId = this.props.curUserId
        // In order to post data into the post modal we would need
        // the username, caption, and maybe the post images
        // And since the post images are ina list and we want a lsit of the
        // originFileObj we will loop through the this.state.file list and
        // append one by one
        const formData = new FormData()
        formData.append('user', this.props.curUserId)
        // if (this.state.caption !== ''){
        formData.append('caption', this.state.caption)
        // }
        if(this.state.fileList.length !== 0){
          for(let i = 0; i<this.state.fileList.length; i++){
            formData.append('image['+i+']', this.state.fileList[i].originFileObj)
          }
        }

        authAxios.post(`${global.API_ENDPOINT}/userprofile/post`,
          formData,
          {headers: {"content-type": "multipart/form-data"}}

        ).then(res => {
          console.log(res.data.postId)

          // Now you will make a websocket that will accept the post Id then
          // send it into the frotn end
          WebSocketPostsInstance.addPost(res.data.postId)
        })
      // Now when you do an axios call to post the pictures, you will then return the
      // post id so that you can send it into the websocket so that it can update teh
      // newsfeed
      if(this.state.socialClip){
        // This will check if the user wanted to post the photos that they are posting
        // right now to the social cal cell as well

        // Since the view for uploading pics on social cal require pics only
        // we have to make a new formdata
        const socialFormData = new FormData()
        if(this.state.fileList.length !== 0){
          for(let i = 0; i<this.state.fileList.length; i++){
            socialFormData.append('image['+i+']', this.state.fileList[i].originFileObj)
          }
        }

        authAxios.post(`${global.API_ENDPOINT}/mySocialCal/uploadPic/`+ownerId,
          socialFormData,
          {headers: {"content-type": "multipart/form-data"}}

        )

        this.openSocialNotification("bottomRight")

      }


      this.setState({
        fileList: [],
        caption: ""
      })

      this.openNotification("bottomRight")
      this.props.onCancel()

    }


    openNotification = placement => {
      notification.info({
        message: `Pictures posted`,
        description:
          'You have posted pictures to newsfeed.',
        placement,
      });
    };

    openSocialNotification = placement => {
      notification.info({
        message: `Pictures posted to social calendar`,
        description:
          'You have posted pictures to social calendar.',
        placement,
      });
    };

    render(){
      let firstName = ''
      let lastName = ''
      let profilePic = ''
      if (this.props.firstName){
        firstName = this.props.firstName
      } if (this.props.lastName){
        lastName = this.props.lastName
      } if (this.props.profilePic){
        profilePic = `${global.IMAGE_ENDPOINT}`+this.props.profilePic
      }
      console.log(this.state)
      console.log(this.props)
      const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
    return (
      <div class="eventCard postModalMain" style={{width:'850px', height:'500px',padding:'25px'}}>
        <div style={{marginTop:'10px', marginLeft:'20px', height:'100px'}} class="outerContainerPeople">
          <div class="innerContainerPeople">
            <Avatar
              style={{ top:'5%'}}
              size = {100} shape = 'circle'
              src = {profilePic} >

            </Avatar>
            <span style={{marginLeft:"20px", fontSize:'20px'}}>
              {firstName+" "+lastName}
            </span>

              <Switch style={{float:'right', marginRight:'50px', marginRight:'25px'}} onChange={this.onChange} />
              {
                (this.state.socialClip)?

                  <span style={{float:'right', marginRight:'25px'}}>
                    <Alert
                      message="Clip directly while posting"
                      description="Clip images from the post to your social calendar"
                      type="info"
                      showIcon
                    />
                  </span>
                :
                <span style={{float:'right', marginRight:'25px'}}>
                  <Alert
                    message="Post on NewsFeed"
                    description="Post photos and caption on the newsfeed"
                    type="info"
                    showIcon
                  />
                </span>
              }
        </div>
        </div>
        <Divider />

            <div>

              <TextArea
                rows = {3}
                allowClear
                size="large"
                maxLength={300}
                bordered={false}
                showCount
                type = 'text'
                placeholder="Write a Post"
                name = 'caption'
                onChange = {this.handleCaptionChange}
                value = {this.state.caption} />
              <Divider style={{top:'-10px'}}/>
              </div>


        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onPreview={this.handlePreview}
            onChange={this.handleChange}

            name = 'image'
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>

          <div>

              <Button
              disabled = {this.handleValidation()}
              style={{fontSize:'24px', }} shape="round" type="primary"
                style={{float:'right', marginRight:'25px'}}
                onClick={this.onFormSubmit}>Post</Button>
          </div>

    </div>
    );
    }
}

const mapStateToProps = state => {

  return {
    firstName: state.auth.firstName,
    lastName: state.auth.lastName,
    profilePic: state.auth.profilePic,
    curUserId: state.auth.id
  }
}

export default connect(mapStateToProps)(NewNewsfeedFormPost);
