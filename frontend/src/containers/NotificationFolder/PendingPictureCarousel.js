import React from 'react';
import { Carousel } from 'antd';
import {
  RightCircleOutlined,
  LeftCircleOutlined
} from '@ant-design/icons';


class PendingPictureCarousel extends React.Component{
  constructor(props){
    super(props);
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this);
    // createRef is used to refer to the DOM element in the render with the
    // ref in the tab
    this.carousel = React.createRef()
  }

  next() {
    this.carousel.next()
  }

  previous() {
    this.carousel.prev()
  }



  renderPictures = pictureList => {
    console.log(pictureList)
    let socialItems = []

    if(pictureList.length === 0){
      return
    } else {


      for (let i = 0 ; i< pictureList.length; i++){
        socialItems.push(
          <div className = ''>
            <img
            className = ''
            src ={'http://127.0.0.1:8000'+pictureList[i].itemImage} />
          </div>
        )
      }
    }

    return socialItems
  }

  render(){
    console.log(this.props)
    let itemList = []
    if(this.props.items.length !== 0){
      itemList = this.props.items
    }

    function onChange(a, b, c) {
      console.log(a, b, c);
    }

    const contentStyle = {
      height: '800px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <div className = ''>
        <LeftCircleOutlined
        className = 'socialArrowLeft'
        onClick = {this.previous} />
        <Carousel
        arrows = {true}
        effect = 'null'
        ref = {node => {this.carousel = node}}
        afterChange={onChange}>
          {this.renderPictures(itemList)}
        </Carousel>
        <RightCircleOutlined
        className = 'socialArrowRight'
        onClick = {this.next} />
      </div>
    )
  }

}



export default PendingPictureCarousel;
