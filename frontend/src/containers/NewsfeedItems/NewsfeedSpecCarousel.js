import React from 'react';
import { Carousel } from 'antd';
import {
  RightCircleOutlined,
  LeftCircleOutlined
} from '@ant-design/icons';
import './NewsfeedSpecCarousel.css';

class NewsfeedSpecCarousel extends React.Component{
  constructor(props){
    super(props);
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this);
    // createRef is used to refer to the DOM element in the render with the
    // ref in the tab
    this.carousel = React.createRef()
  }

  next= e => {

    this.carousel.next()
    e.stopPropagation();
  }

  previous= e => {

    this.carousel.prev()
    e.stopPropagation();
  }



  renderPictures = pictureList => {
    console.log(pictureList)
    let socialItems = []

    const contentStyle = {
      height: '160px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    // if(pictureList.length === 0){
    //   return
    // } else if (pictureList.length === 1){
    //
    // }
    {
      pictureList.map(
        item => {
          socialItems.push(

            <div


              className = 'imageContainer'>

              <div
                style = {{
                    backgroundImage: `url(` + `${global.IMAGE_ENDPOINT}`+item.itemImage +")"
                  }}
                  className = "backgroundImageNews"
                >
              </div>
              {/*
                <img
                className = "testMiddle"
              src ={`${global.NEWSFEED_PICS}`+item} />
                */}

            </div>

          )
        }
      )
    }

    return socialItems
  }

  onChange= (a) => {
    // This on change will show the indexes of the carousel
    console.log(a);
    this.props.picIndexChange(a)
  }




  render(){
    console.log(this.props)
    let itemList = []
    if(this.props.items !== []){
      itemList = this.props.items
    }


    const contentStyle = {
      height: '800px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <div className = 'specLeftRight'>

        <div class="newsFeedArrowLeft">
          <i style={{color:'#d9d9d9'}}
            onClick = {this.previous}
            class="fas fa-chevron-circle-left"></i>
        </div>

        <Carousel
        arrows = {true}
        effect = 'null'
        ref = {node => {this.carousel = node}}
        afterChange={this.onChange}>
          {this.renderPictures(itemList)}
        </Carousel>



        <div class="newsFeedArrowRight">
          <i
            style={{color:'#d9d9d9'}}
            onClick = {this.next}
            class="fas fa-chevron-circle-right"></i>
        </div>

      </div>
    )
  }

}



export default NewsfeedSpecCarousel;
