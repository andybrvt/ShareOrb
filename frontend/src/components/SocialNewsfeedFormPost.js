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
import WebSocketSocialNewsfeedInstance from '../socialNewsfeedWebsocket';

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



class SocialNewsfeedFormPost extends React.Component{

    state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList :[],
      caption: '',
      cameraShow:false,
      socialClip:false,
    }



    componentDidMount(){
      // This will try to set the state if there are stuff in the states so that
      // it can be fill
      let caption = "";
      let fileList = [];

      if(this.props.curSocialCalCell){
        if(this.props.curSocialCalCell.dayCaption){
          // If there is a day caption then you will just add it in to the
          // states
          caption = this.props.curSocialCalCell.dayCaption
        }

        // Now you will set the pictures in
        if(this.props.curSocialCalCell.get_socialCalItems){
          for(let i = 0; i<this.props.curSocialCalCell.get_socialCalItems.length; i++ ){
            fileList.push(

              {
                uid: i,
                name: 'image.png',
                status: 'done',
                url: `${global.IMAGE_ENDPOINT}`+this.props.curSocialCalCell.get_socialCalItems[i].itemImage,
              }
            )
          }

        }


      }


      this.setState({
        caption: caption,
        fileList: fileList
      })
    }


    componentWillReceiveProps(newProps){
      // this will update the caption and stuff when there is a caption change
      console.log(newProps)
      let caption = "";
      let fileList = []

      if(newProps.curSocialCalCell){
        if(newProps.curSocialCalCell.dayCaption){
          // If there is a day caption then you will just add it in to the
          // states
          caption = newProps.curSocialCalCell.dayCaption
        }

        if(newProps.curSocialCalCell.get_socialCalItems){
          for(let i = 0; i<newProps.curSocialCalCell.get_socialCalItems.length; i++ ){
            fileList.push(

              {
                uid: i,
                name: 'image.png',
                status: 'done',
                url: `${global.IMAGE_ENDPOINT}`+newProps.curSocialCalCell.get_socialCalItems[i].itemImage,
              }
            )
          }

        }


      }


      this.setState({
        caption: caption,
        fileList: fileList
      })


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
      // This is where you will be use to update your social cal cell
      // So prett much you will grab the social cal cell. You will model
      // it similarly to that of the post on social cal where if there isnt a
      // social cal then you make one, the only difference is that you will do
      // this in consumer and you will update the news feed

      // Probally gonna have to make a new one, you probally gonna have to make
      // this one in the consumers. But since you are sending pictures
      // you probally gonna have to make an axios call and then send it through
      // consumers

      console.log(this.state)
      const ownerId = this.props.curUserId;
      const caption = this.state.caption;
      const fileList = this.state.fileList;

      // So you have to check if it has originFileObj
      const formData = new FormData()
      // first append the day caption
      formData.append("dayCaption", caption);

      if(fileList.length !== 0){
        // Now append the length of the file list so you know how much you
        // will need to loop through
        formData.append("fileListLength", fileList.length);
        // Now you will loop through
        for(let i = 0; i<fileList.length; i++){
          if(fileList[i].originFileObj){
            // If this is a new uploaded file
            formData.append("image[" + i +']', fileList[i].originFileObj)
          } else {
            // If this is just an old one picture
            formData.append("image[" + i +']', fileList[i].url.replace(global.IMAGE_ENDPOINT, ""))
          }
        }
      }

      // Now you have all the caption and pictures uploaded

      authAxios.post(`${global.API_ENDPOINT}/mySocialCal/updateCurSocialCell/`+ownerId,
        formData,
        {headers: {"content-type": "multipart/form-data"}}
      )
      .then(res => {


        // Have a condiation where if there are not social cal items you will
        // delete and remove the content type post
        if(res.data.cell.get_socialCalItems === 0) {
          // If there are no exisiting social cal cell you want to remove it and no need
          // to update teh coverpic

          // this one you removed the content type already

          // Put a consumer function here


        } else {
          // This is if there are socialcalcellitems to post
          if( res.data.coverPicChange){
            const coverPicForm = new FormData()
            // Put the id of the cell in first so you can find it later
            coverPicForm.append("cellId", res.data.cell.id)
            // Now add the cover pic
            if(fileList[0].originFileObj){
              // If this is a new uploaded file
              coverPicForm.append("coverImage", fileList[0].originFileObj)
            } else {
              // If this is just an old one picture
              coverPicForm.append("coverImage", fileList[0].url.replace(global.IMAGE_ENDPOINT, ""))
            }

            // Now change the cover picture here
            authAxios.post(`${global.API_ENDPOINT}/mySocialCal/updateCoverPic/`+ownerId,
              coverPicForm,
              {headers: {"content-type": "multipart/form-data"}}
            )

          }





          WebSocketSocialNewsfeedInstance.addUpdateSocialPost(
            ownerId,
            res.data.cell.id,
            res.data.created
          )

          message.success('You updated your day album.', 7);




        }



        // Now you will update the cover pic and then send a websocket
        // that updates the newsfeed


        // update the cover pic here


      })

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
            <span class="WritePostNameContainer" style={{marginLeft:"20px", fontSize:'20px'}}>
              {firstName+" "+lastName}
            </span>

                <span style={{float:'right', marginRight:'25px'}}>
                  <Alert
                    message="Update current day"
                    description="Update your current day album."
                    type="info"
                    showIcon
                  />
                </span>

        </div>
        </div>
        <Divider />

            <div>

              <TextArea
                rows = {3}
                allowClear
                size="large"
                maxLength={250}
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
    curUserId: state.auth.id,
    curSocialCalCell: state.socialNewsfeed.curSocialCell

  }
}

export default connect(mapStateToProps)(SocialNewsfeedFormPost);
