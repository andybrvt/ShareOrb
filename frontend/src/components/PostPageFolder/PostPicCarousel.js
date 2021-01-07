import React from 'react';
import { Carousel } from 'antd';
import {
  RightCircleOutlined,
  LeftCircleOutlined
} from '@ant-design/icons';
import '../../containers/SocialCalendarFolder/SocialCalCSS/SocialCellPage.css';


class PostPicCarousel extends React.Component{
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
              src ={'http://127.0.0.1:8000/media/'+item} />
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
      <div onClick = {this.previous} className = 'socialLeftRight'>
        <div class="leftArrowPost">
          <i style={{color:'#8c8c8c'}}
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

        <div class="leftArrowPost">
          <i style={{color:'#8c8c8c'}}
            class="fas fa-chevron-circle-left"></i>
        </div>

        <div class="rightArrowPost">
          <i style={{color:'#8c8c8c'}}
              onClick = {this.next}
            class="fas fa-chevron-circle-right"></i>
        </div>

      </div>
    )
  }

}



export default PostPicCarousel;
