import React, {useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom';
import {Container} from 'reactstrap';
import {uploadPost} from '../api';
import axios from 'axios';
import { authAxios } from './util';
import { connect } from "react-redux";
import { Input } from 'antd';
import {Button, Upload, message, Modal} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const NewsFeedFormPost = (props) => {
  // formData = new FormData();
  const[temp, setTemp] = useState(null);
  const {token} = props;
  const[image, setImage] = useState(null);
  const[fileList, setFileList] = useState([]);
  const[caption, setCaption] = useState('');
  const[id, setID] = useState(null);
  const[username, setUsername] = useState('');
  const[stage, setStage] = useState('empty');
  // const[imageblob, setImageblob] = useState("");
  const[previewImage, setPreviewImage] = useState("");
  const[previewVisible, setPreviewVisible] = useState(false)

  const { TextArea } = Input;


const uploadImageRainbowProgress = {

   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

   onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },


}

  useEffect(() => {
    console.log('hit')
    authAxios.get("current-user")
    .then(res => {
      console.log(res.data.id)
      setID(res.data.id);
      setUsername(res.data.username);
      });
  }, [token])

  const make_post=(post) =>{

    let data = uploadPost(post);

  	return data;
  }

  const uploadPost =(post) =>{
    console.log(props.token)
   var data = new FormData();
   console.log('right here')
   console.log(data)
   console.log(post)
   data.append("caption", post.caption);
   data.append("user", post.user_id);
   console.log(post.caption)
   console.log(post.user_id)
   console.log('hellooo')
   console.log(data)
   if (post.image !== null){
     data.append("image", post.image)
   }
   for (var pair of data.entries()) {
    console.log(pair[0]+ ', ' + pair[1]);
}
  console.log(localStorage.getItem('token'))
   // data.append("image", post.image);
   // data.append("image_filter", post.image_filter);

   fetch('http://127.0.0.1:8000/userprofile/list/',{
  	method: 'POST',
      headers: {
  	    Authorization: `Token ${localStorage.getItem('token')}`,
      },
      body:data
  })
   .then (res =>res.json())
   .then(json =>{
  	 console.log(json)
  	 return json
   })
  }

  const  onFormSubmit = (e) =>{
    e.preventDefault()
    if(fileList.length==0){
      console.log("ZERO")
      var temp=image;
    }
    else{
      var temp=fileList[0].originFileObj;
    }
		if (props.data.id && caption){
      console.log(fileList)
      console.log('it got summited')
			const post = {
				'image': temp,
				'caption': caption,
				'user_id': props.data.id,
				'username': props.data.username,
			};
			make_post(post);
			window.location.reload(true)
		}
		else{
			return <Redirect to='/'  />
		}
  }

  const onCaptionChange = (e) => {
    const value = e.target.value
    console.log(value)
    setCaption(value)
  }

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = file =>{
    setPreviewImage(file.thumbUrl)
    setPreviewVisible(true)
  }

  const onChange = ({ fileList })=> {

    console.log(fileList)
    // const type = e.target.name;
		// const value = e.target.value;
    // console.log(value)
		// if (type === "caption"){
		// 	setCaption(value)
		// }
		//  if (type === "image") {
				// setImageblob(URL.createObjectURL(e.target.files[0]))
				// setImage(e.target.files[0])
				// setStage("image")
    //   }
    setFileList(fileList)
    // fileList.forEach(element => setFileList(fileList[element]));
	}

  return (
	<Container style={{paddingTop: '10',zIndex:'-1'}}>
	  <form>
	    <div className="upload-container">
				{ stage !== "image" ?
				<div  className= "uploadImage upload" >




                <Upload
                {...props}
                listType = 'picture-card'
                fileList = {fileList}
                onPreview = {handlePreview}
                style={{marginBottom:100}}
                name="image"
                beforeUpload  = {() => false} // prevents it from uploading right away
                onChange= {onChange}>
                   <Button >
                     <UploadOutlined {...uploadImageRainbowProgress} /> Click to Upload
                   </Button>
                 </Upload>





				</div>

        :


				<div  className= "uploadImage upload " >

				</div>}

        <TextArea rows={4} type="text" name="caption" onChange= {onCaptionChange} value={caption}
        style={{width: '600px'}}/>


				<div>
                <Button  type="primary" style={{ background: "#0069FF" }} onClick={onFormSubmit}>Post</Button>
				</div>
			</div>
    </form>

    <Modal
          visible={previewVisible}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
    </Modal>
	</Container>
  );
};


const mapStateToProps = state => {
  return {
    token: state.auth.token,

  };
};

export default connect(mapStateToProps)(NewsFeedFormPost);
