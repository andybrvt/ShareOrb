import React from 'react';
import {
  Carousel,
  Avatar,
  Dropdown,
  Menu
 } from 'antd';
import {
  RightCircleOutlined,
  LeftCircleOutlined
} from '@ant-design/icons';
import './SocialCalCSS/SocialCellPage.css';


class PictureCarousel extends React.Component{
  constructor(props){
    super(props);
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this);
    // createRef is used to refer to the DOM element in the render with the
    // ref in the tab
    this.carousel = React.createRef()
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  next() {
    this.carousel.next()
  }

  previous() {
    this.carousel.prev()
  }


  getChatUserName(postOwnerName){
    // This function will show the correct name of the user that you are chatting
    // with

    var name = ""

    if(postOwnerName.creator){
      name = this.capitalize(postOwnerName.creator.first_name)+ ' '
          +this.capitalize(postOwnerName.creator.last_name)

    }



    console.log(name)
    return name;

  }

  deleteSocialPost = () => {
    console.log('delete social post')
  }

  threeDotDropDown = () => {


    return (
      <div className = "threeDot">
      <Dropdown overlay={
        <Menu>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
              <i style={{marginLeft:'1px',marginRight:'4px' }} class="far fa-bookmark"></i>
              <span style={{marginLeft:'3px'}}> Save this post</span>
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
              <i class="far fa-eye-slash"></i>
              <span style={{marginLeft:'5px'}}>Hide this post</span>
            </a>
          </Menu.Item>
          <Menu.Item danger onClick={this.deleteSocialPost}>
            <i style={{marginRight:'45px' }} class="fas fa-trash" style={{color:"#ff4d4f"}}></i>
            <span style={{marginLeft:'10px'}}>Delete post</span>
          </Menu.Item>
        </Menu>
      }>
      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
        <i class="fas fa-ellipsis-v" style={{fontSize:'40px', padding:'5px', color: "white"}}></i>
      </a>
      </Dropdown>

      </div>
    )
  }




  renderPictures = pictureList => {
    console.log(pictureList)
    let socialItems = []


    {
      pictureList.map(
        item => {
          if(item.socialItemType === "clip"){
            socialItems.push(

              <div className = "clipPicBackground">
              {this.threeDotDropDown()}
              <img
              className = 'backgroundPic'
              src ={'http://127.0.0.1:8000'+item.itemImage} />

              <div className = 'clipPicturesRoll'>

                <div className = "ownerHolder">
                  <Avatar
                  src = {'http://127.0.0.1:8000'+item.creator.profile_picture}
                  size = {65}/>
                  <div className = "ownerName">
                    <div> {this.getChatUserName(item)} </div>
                    <div> @{item.creator.username} </div>
                  </div>
                </div>
                    <div className = "polaroidHolder">
                    <img
                    className = 'socialImages'
                    src ={'http://127.0.0.1:8000'+item.itemImage} />
                    </div>
              </div>



              </div>
            )
          }
          if(item.socialItemType === "picture"){
            socialItems.push(
              <div className = 'picturesRoll'>
              {this.threeDotDropDown()}


                <img
                className = 'socialImages'
                src ={'http://127.0.0.1:8000'+item.itemImage} />

              </div>
            )
          }

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
      <div className = 'socialLeftRight'>
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



export default PictureCarousel;
