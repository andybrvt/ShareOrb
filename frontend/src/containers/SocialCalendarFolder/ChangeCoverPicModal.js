import React from 'react';
import { Modal,  notification, Carousel } from 'antd';
import "./SocialCalCSS/SocialCellPage.css";
import {
  RightCircleOutlined,
  LeftCircleOutlined
} from '@ant-design/icons';

class ChangeCoverPicModal extends React.Component{

  constructor(props){
    super(props);
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this);
    // createRef is used to refer to the DOM element in the render with the
    // ref in the tab
    this.carousel = React.createRef()
  }


  renderPictures = pictureList => {
    // This will render the pictures in side the carousel
    let socialItems = []

    if(pictureList.length === 0){
      return
    } else {

      for(let i = 0; i< pictureList.length; i++){
        socialItems.push(
          <div className = "coverPicRoll">
            <img
            className = "coverPicImg"
            src ={`${global.API_ENDPOINT}`+pictureList[i].itemImage}
             />
          </div>
        )
      }
    }


    return socialItems

  }

  next() {
    this.carousel.next()
  }

  previous() {
    this.carousel.prev()
  }

  onChange = (a) =>{
    console.log(a);
    this.props.onPicChange(a)
  }

  onChangeSubmit = () => {
    // This function will be used for submiting the change of the social cell

    this.props.onPicSubmit()
    this.props.onClose()
  }



  render(){

    console.log(this.props)

    let itemList = []
    if(this.props.items){
      if(this.props.items.length !== 0){
        itemList = this.props.items
      }
    }


    return (

      <Modal
      onCancel = {this.props.onClose}
      visible = {this.props.visible}
      footer = {null}
      className = "changeCoverPicModal"
      >
      Change cover picture
      <Carousel
      arrows = {true}
      effect = 'null'
      ref = {node => {this.carousel = node}}
      afterChange={this.onChange}
      >
        {this.renderPictures(itemList)}
      </Carousel>
      {
        itemList.length > 1 ?
        <div>
        <LeftCircleOutlined
        className = 'socialArrowLeft'
        onClick = {this.previous} />
        <RightCircleOutlined
        className = 'socialArrowRight'
        onClick = {this.next} />
        </div>
        :

        <div></div>

      }

      <div className = "buttons">
        <div
        className = "cancelButton"
        onClick = {this.props.onClose}
        > Cancel </div>
        <div
        onClick = {() =>this.onChangeSubmit()}
        className = "acceptButton"
        > Save </div>

      </div>




      </Modal>
    )
  }
}

export default ChangeCoverPicModal;
