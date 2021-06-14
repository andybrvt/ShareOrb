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
import * as dateFns from 'date-fns';
import ImgCrop from 'antd-img-crop';
import "./SocialNewsfeedFormPost.css";
import heic2any from "heic2any";
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
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === "";
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }

  return file.type === 'image/png' || file.type==='image/jpeg' || file.type === "";
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
      confirmationVisible: false,
    }



    componentDidMount(){
      // This will try to set the state if there are stuff in the states so that
      // it can be fill
      let caption = "";
      let fileList = [];


      console.log(this.props.curSocialCalCell)
      if(this.props.curSocialCalCell){
        if(this.props.curSocialCalCell.dayCaption){
          // If there is a day caption then you will just add it in to the
          // states
          caption = this.props.curSocialCalCell.dayCaption
        }

        // Now you will set the pictures in

        // Make sure to check the type better on these ones

        if(this.props.curSocialCalCell.get_socialCalItems){
          for(let i = 0; i<this.props.curSocialCalCell.get_socialCalItems.length; i++ ){
            fileList.push(

              {
                uid: i,
                name: 'image.png',
                status: 'done',
                socialItemType: this.props.curSocialCalCell.get_socialCalItems[i].socialItemType,
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
                socialItemType: newProps.curSocialCalCell.get_socialCalItems[i].socialItemType,
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


      // handleChange = ({ fileList, info }) => {
      //
      //   if (info.file.originFileObj.type === "") {
      //     console.log("hi")
      //   fetch(URL.createObjectURL(info.file.originFileObj))
      //     .then((res) => res.blob())
      //     .then((blob) => heic2any({ blob, toType: "image/jpeg" }))
      //     .then((conversionResult) => {
      //       console.log("HEIC");
      //       this.setState({ fileList });
      //     })
      //     .catch((e) => {
      //       console.log("error");
      //
      //     });
      // } else {
      //   this.setState({ fileList });
      // }
      //
      //
      // }

      blobToFile(theBlob, fileName){
          //A Blob() is almost a File() - it's just missing the two properties below which we will add
          theBlob.lastModifiedDate = new Date();
          theBlob.name = fileName;
          return theBlob;
      }


      handleChange = ({ fileList, info}) => {
      console.log(info)
      console.log(fileList)
      console.log((fileList.length)-1)
      // console.log(fileList[fileList.length-1].originFileObj)

      // if (fileList[fileList.length-1].originFileObj.type === "") {
      //     console.log("hi")
      //   fetch(URL.createObjectURL(fileList[fileList.length-1].originFileObj))
      //     .then((res) => res.blob())
      //     .then((blob) => heic2any({ blob, toType: "image/jpeg" }))
      //     .then((conversionResult) => {
      //       console.log("HEIC");
      //       console.log(conversionResult)
      //        console.log(fileList[fileList.length-1].originFileObj)
      //
      //       // const newFile = this.blobToFile(conversionResult, "test")
      //
      //       const newFile = new File(conversionResult, "test")
      //       console.log(newFile)
      //        {/*
      //        fileList.push(
      //          {
      //            uid: 4,
      //            name: 'image.png',
      //            status: 'done',
      //            url: `test`,
      //          }
      //        )
      //        */}
      //
      //       //  this.setState(prevState => ({
      //       //   fileList: [...prevState.fileList,
      //       //     newFile
      //       //     ]
      //       // }))
      //       console.log(this.state.fileList)
      //
      //
      //     })
      //     .catch((e) => {
      //       console.log(e)
      //       console.log("error");
      //
      //     });
      // } else {
        this.setState({ fileList });
      // }



    }



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
      let truefileList = []
      let fileList = this.state.fileList
      let buttonDisabled = false

      if(this.props.curSocialCalCell){
        if(this.props.curSocialCalCell.get_socialCalItems){
          truefileList = this.props.curSocialCalCell.get_socialCalItems
        }
      }
      // Only in the case where there are photos then buttom should not be
      // disabled
      // if(caption !== "" && fileList.length > 0){
      //   buttonDisabled = false
      // }
      if(fileList.length === 0 && truefileList.length === 0){
        // This is at the beginnig when there are nothing on the picture so you
        // have to add pictures in so that is why it will be diabled
          buttonDisabled = true
      } else {
        buttonDisabled = false
      }

      return buttonDisabled


    }

    onCloseWarning = () => {
      // This function will close the warning
      this.setState({
        confirmationVisible: false
      })
    }


    onFormSubmitHolder = () => {
      // This one is used as a condition for the submiting, this is if they have
      // pictures but wanna erase all of them then it will show up a modal
      // asking if they are sure then to proceeed if not it will go its normal route


      const fileList = this.state.fileList;


      if(fileList.length === 0){
        // open a modal here
        this.setState({
          confirmationVisible: true
        })

      } else {
        // normal route, literally just do on formsubmit here


      }


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
      const curDate = dateFns.format(new Date(), "yyyy-MM-dd")

      formData.append('curDate', curDate)
      // first append the day caption
      formData.append("dayCaption", caption);

      // if(fileList.length !== 0){
        // Now append the length of the file list so you know how much you
        // will need to loop through
        formData.append("fileListLength", fileList.length);
        // Now you will loop through
        for(let i = 0; i<fileList.length; i++){
          if(fileList[i].originFileObj){
            // If this is a new uploaded file

            // Now you have to check if it has a file type or not
            // if it has the originFileObj then that means the social
            // file type will always be picture


            formData.append("image[" + i +']', fileList[i].originFileObj)
            formData.append("socialItemType["+i+"]", "picture" )
          } else {
            // If this is just an old one picture
            // formData.append("image[" + i +']', fileList[i].url.replace(global.IMAGE_ENDPOINT, ""))

            // For this one this is when the picture is already inputed
            // so when you input the information you will grab the socialcalitem type
            console.log(fileList[i])
            formData.append("image[" + i +']', fileList[i].url.replace(global.POSTLIST_SPEC, ""))
            formData.append("socialItemType["+i+"]", fileList[i].socialItemType )

          }
        }



      // }

      // Now you have all the caption and pictures uploaded



      authAxios.post(`${global.API_ENDPOINT}/mySocialCal/updateCurSocialCell/`+ownerId,
        formData,
        {headers: {"content-type": "multipart/form-data"}}
      )
      .then(res => {
        console.log(res.data)
        console.log(res.data.cell)
        // Have a condiation where if there are not social cal items you will
        // delete and remove the content type post
        if(res.data.cell.get_socialCalItems.length === 0) {
          // If there are no exisiting social cal cell you want to remove it and no need
          // to update teh coverpic

          // this one you removed the content type already

          // Put a consumer function here

          // Make sure to pass in the curdate.
          // the function you want is removeAllPhotoSocialPost

          const curDate = dateFns.format(new Date(), "yyyy-MM-dd")

          // just use this to send to the backend and send things to the
          // newsfeed websocket
          WebSocketSocialNewsfeedInstance.removeAllPhotoSocialPost(
            ownerId,
            curDate
          )

          message.success('You updated your day album.', 7);

          this.props.onCancel()


        } else {
          // This is if there are socialcalcellitems to post
          if( res.data.coverPicChange){

            const coverPicForm = new FormData()
            // Put the id of the cell in first so you can find it later
            coverPicForm.append("cellId", res.data.cell.id)
            coverPicForm.append("createdCell", res.data.created)
            // Now add the cover pic
            if(fileList[fileList.length-1].originFileObj){
              // If this is a new uploaded file
              console.log('not old pic')
              coverPicForm.append("coverImage", fileList[fileList.length-1].originFileObj)
            } else {
              console.log(fileList[fileList.length-1].url.replace(global.POSTLIST_SPEC, ""))
              // If this is just an old one picture
              console.log('old pic')
              coverPicForm.append("coverImage", fileList[fileList.length-1].url.replace(global.POSTLIST_SPEC, ""))
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

          this.props.onCancel()


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

        <div class="eventCard postModalMain" style={{width:'`50px', height:'500px',padding:'25px'}}>
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
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>

          <div className = "uploadOverFlow">


            {/*
              <ImgCrop
                  modalWidth={700}
                  modalTitle="Crop Image"
                  modalOk="Crop"
                  aspect={1}
                  onChange={this.handleChange}
                  beforeUpload={beforeUpload}
                  >


              </ImgCrop>

              */}

              <Upload
                  listType="picture-card"
                  multiple={true}
                  fileList={fileList}
                  onChange={this.handleChange}
                  beforeUpload={beforeUpload}

                  name = 'image'
                >
                  {(fileList.length >= 8) ? null : uploadButton}
                </Upload>


          </div>

          <div>
              <Button
                disabled = {this.handleValidation()}
                style={{fontSize:'24px', }} shape="round" type="primary"
                style={{float:'right', marginRight:'25px'}}
                onClick={this.onFormSubmit}>Update</Button>
          </div>

          <Modal
            visible = {this.state.confirmationVisible}
            onCancel = {this.onCloseWarning}
            >
            <Alert
               message="Warning"
               description="Updating will remove your day album from the newsfeed because there are no pictures to show."
               type="warning"
               showIcon
               closable
             />
           <Button>
             Cancel
           </Button>

           <Button>
             Accept
           </Button>
          </Modal>


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
