import React from 'react';
import { Carousel } from 'antd';
import './labelCSS/SocialModal.css'


class PictureCarousel extends React.Component{


  renderPictures = pictureList => {
    console.log(pictureList)
    let socialItems = []

    // if(pictureList.length === 0){
    //   return
    // } else if (pictureList.length === 1){
    //
    // }
    {
      pictureList.map(
        item => {
          socialItems.push(
            <div className = 'picturesRoll'>
              <img
              className = 'socialImages'
              src ={'http://127.0.0.1:8000'+item.itemImage} />
            </div>
          )
        }
      )
    }

    return socialItems
  }

  render(){
    console.log(this.props)
    let itemList = []
    if(this.props.items !== []){
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
      <Carousel effect = 'null' afterChange={onChange}>
        {this.renderPictures(itemList)}
      </Carousel>
    )
  }

}



export default PictureCarousel;
