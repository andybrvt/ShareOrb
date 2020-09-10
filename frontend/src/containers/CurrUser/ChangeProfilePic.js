import React from 'react';
import { Upload, message, Modal } from 'antd';
import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import './EditProfile.css'



const { Dragger } = Upload;


function getBase64(img, callback) {
  console.log(img)
  const reader = new FileReader();
  console.log(reader)
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


class ChangeProfilePic extends React.Component{

  state = {
      loading: false,
      imageFile: '',
    };

    handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        console.log(info.file)
        this.setState({
          imageFile: info.file.originFileObj
        })
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
        );
      }
    };

    render() {
      console.log(this.props)
      console.log(this.state)


      const uploadButton = (
        <div className = 'uploadBox'>
          {this.state.loading ? <LoadingOutlined className = 'plusOutlined' /> : <PlusOutlined className = 'plusOutlined'/>}
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;
      return (
      <Modal
      visible = {this.props.visible}
      onCancel = {this.props.onCancel}
      width = {470}
      okText = {'Save'}
      onOk = {() => this.props.onSubmit(this.state.imageFile)}
      >
      <span className = 'uploadProfileText'> Upload Profile Picture </span>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}

        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '400px' }} /> : uploadButton}
        </Upload>
      </Modal>
      );
    }
}





export default ChangeProfilePic;
