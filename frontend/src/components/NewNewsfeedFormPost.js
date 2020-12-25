import React from 'react';
import { Upload, Modal, Input, Avatar, Button, Divider, Switch } from 'antd';
import { PlusOutlined, CameraOutlined} from '@ant-design/icons';
import { connect } from "react-redux";
import { authAxios } from './util';

const {TextArea} = Input

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class NewNewsfeedFormPost extends React.Component{

    state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList :[],
      caption: '',
      cameraShow:false,
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
      console.log("Hi")
    }

    handleChange = ({ fileList }) => this.setState({ fileList });

    handleCaptionChange = (e) => {
      this.setState({
        caption: e.target.value
      })
    }

    onFormSubmit= () => {
      console.log(this.state)


      if(this.state.caption !== '' || this.state.fileList.length !== 0){
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

        authAxios.post('http://127.0.0.1:8000/userprofile/post',
          formData,
          {headers: {"content-type": "multipart/form-data"}}

      )
        // Now that you have the data all set up now you need to go to the back end and
        // start making the post function for the posting


      window.location.reload(true)

      }



    }

    render(){
      let firstName = ''
      let lastName = ''
      let profilePic = ''
      if (this.props.firstName){
        firstName = this.props.firstName
      } if (this.props.lastName){
        lastName = this.props.lastName
      } if (this.props.profilePic){
        profilePic = 'http://127.0.0.1:8000'+this.props.profilePic
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
      <div class="eventCard" style={{width:'800px', height:'500px', padding:'25px'}}>
        <div style={{marginTop:'10px', marginLeft:'20px', height:'125px'}} class="outerContainerPeople">
          <div class="innerContainerPeople">
            <Avatar
              style={{ top:'5%'}}
              size = {100} shape = 'circle'
              src = {profilePic} >

            </Avatar>
            <span style={{marginLeft:"20px", fontSize:'20px'}}>
              {firstName+" "+lastName}
            </span>
              <Switch defaultChecked style={{float:'right', marginRight:'50px', marginRight:'25px'}} onChange={this.onChange} />
              <br/><span style={{float:'right'}}>Clip to Social Calendar</span>
        </div>
        </div>
        <Divider style={{marginTop:'0px'}}/>
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
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload  = {() => false} // prevents it from uploading right away
            name = 'image'
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>

          <div>

              <Button style={{fontSize:'24px'}} shape="round" type="primary"
                style={{float:'right'}} onClick={this.onFormSubmit}>Post</Button>
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
