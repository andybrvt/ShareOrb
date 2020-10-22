import React from 'react';
import { Modal, notification, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';

const {Dragger}  = Upload;

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

function beforeUpload(file) {
  // Check if the file that you upload fits the requriements are set up
  console.log(file)
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


class ChangeBackgroundModal extends React.Component{
  //Remember when you are uploading a file you will need to do it through a
  // form data. The form data formats it and puts in the right form in order to be
  // passed through the axios or send it through the backend or else it would not be
  // sent correctly.



  state = {
    loading: false,
    imageFile: ""
  }

  handleChange = info => {

    console.log(info)
    // Handle the change of the picture
    if(info.file.status === "uploading"){
      this.setState({loading: true});
      return;
    }
    if(info.file.status  === "done"){
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
    }

  }


  render(){

    console.log(this.state)
    // This is just to render the uploadButton
    const uploadButton = (
      <div className = 'uploadBox'>
        {this.state.loading ? <LoadingOutlined className = 'plusOutlined' /> : <PlusOutlined className = 'plusOutlined'/>}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const { imageUrl } = this.state;

    return(
      <Modal
      visible = {this.props.visible}
      width = {700}
      okText = {'Save'}
      onCancel = {this.props.close}
      onOk = {() => this.props.onSubmit(this.state.imageFile)}
      >
      <span className = 'uploadProfileText'> Change background Picture </span>
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
    )
  }
}

export default ChangeBackgroundModal;
