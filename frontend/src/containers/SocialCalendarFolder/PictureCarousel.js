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
    this.props.onOpenDelete()
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


                <img
                className = 'backgroundPic'
                src ={`${global.IMAGE_ENDPOINT}`+item.itemImage} />


                <div className = 'clipPicturesRoll'>

                      <div className = "ownerHolder">

                        <div className = "ownerHolderHolder">
                          <div className ="ownerAvatar">
                            <Avatar
                            src = {`${global.IMAGE_ENDPOINT}`+item.creator.profile_picture}
                            size = {50}/>
                          </div>

                          <div className = "ownerName">
                            <div className = "headerPostName"> {this.getChatUserName(item)} </div>
                            <div className = "headerPostText"> @{item.creator.username} </div>
                          </div>

                        </div>
                      </div>

                      <div className = "polaroidHolder">

                        <div className = "polaroidHolderHolder">
                          <img
                          className = 'socialImages'
                          src ={`${global.IMAGE_ENDPOINT}`+item.itemImage}
                          />
                        </div>

                      </div>
                    </div>
            </div>
            )
          }
          if(item.socialItemType === "picture"){
            socialItems.push(
              <div className = 'picturesRoll'>


                <img
                className = 'socialImages'
                src ={`${global.IMAGE_ENDPOINT}`+item.itemImage} />

              </div>
            )
          }

        }
      )
    }

    return socialItems
  }
  onChange =(a) => {
    console.log(a);
    this.props.onPicChange(a)
  }

  render(){
    console.log(this.props)
    let itemList = []
    if(this.props.items !== []){
      itemList = this.props.items
    }




    return (
      <div className = 'socialLeftRight'>
        <div class="socialArrowLeft">
          <i
            style={{color:'#d9d9d9'}}
            onClick = {this.previous}
            class="fas fa-chevron-circle-left">
          </i>
        </div>
        <Carousel
        arrows = {true}
        effect = 'null'
        ref = {node => {this.carousel = node}}
        afterChange={this.onChange}>
          {this.renderPictures(itemList)}
        </Carousel>


        <div class="socialArrowRight">
          <i
            style={{color:'#d9d9d9'}}
            onClick = {this.next}
            class="fas fa-chevron-circle-right">
          </i>
        </div>



      </div>
    )
  }

}



export default PictureCarousel;
