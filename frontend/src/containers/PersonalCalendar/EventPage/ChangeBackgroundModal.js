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

  handleSubmit = value => {
    // This will handle the submitting of changing the background picture of the
    // event. It will do this by changing all the states back to normal and then
    // call the submit funciton taht was pass in the props

    this.setState({
      loading: false,
      imageFile: "",
      imageUrl: null,
    })

    this.props.onSubmit(value)
  }

  handleCancel = () => {
    //This will just handle the canceling of modal. It will clear out the
    // state
    this.setState({
      loading: false,
      imageFile: "",
      imageUrl: null,
    })
    this.props.close();
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
      bodyStyle={{height:'450px'}}
      width={800}
      okText = {'Save'}
      okButtonProps={{ disabled: this.state.imageFile == "" ? true : false }}
      onCancel = {() => this.handleCancel()}
      onOk = {() => this.handleSubmit(this.state.imageFile)}
      >
        <div class="sideContainer">

          <span className = 'uploadProfileText'> Change Background Picture </span>
          <div class="side1">

            {
            (this.props.pic!=null)?
                <div>
                  <img class="changeProfilePic"
                    src={'http://127.0.0.1:8000'+this.props.pic}></img>



                </div>

              :
              <div></div>


             }
          </div>
          <div class="side2">

            <Upload
              name="avatar"
              listType="picture-card"
              className="uploadBox"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}


            >
              <div>
                {
                  (imageUrl) ?
                  <img src={imageUrl} alt="avatar" />
                  :

                  <i style={{fontSize:'75px', marginTop:'100px'}} class="fas fa-upload uploadBox"></i>
                }
              </div>

            </Upload>

          </div>



        </div>
      </Modal>
    )
  }
}

export default ChangeBackgroundModal;
