import React from 'react';
import { Carousel } from 'antd';



class PictureCarousel extends React.Component{


  renderPictures = pictureList => {
    console.log(pictureList)
  }

  render(){
    console.log(this.props)
    let itemList = []
    if(this.props.items !== []){
      itemList = this.props.items
    }

    console.log(itemList)
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
      <Carousel afterChange={onChange}>
      
      </Carousel>
    )
  }

}



export default PictureCarousel;
