import React from 'react';
import { Upload, Modal, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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
      <div className="clearfix">
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
        <TextArea rows = {4} type = 'text' name = 'caption' onChange = {this.handleCaptionChange} value = {this.state.caption} />
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Button  type="primary" style={{ background: "#0069FF" }} onClick={this.onFormSubmit}>Post</Button>
      </div>
    );
    }
}

const mapStateToProps = state => {

  return {
    curUserId: state.auth.id
  }
}

export default connect(mapStateToProps)(NewNewsfeedFormPost);
