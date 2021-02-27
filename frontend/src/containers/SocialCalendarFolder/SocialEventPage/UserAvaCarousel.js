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


class UserAvaCarousel extends React.Component{
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

  onProfileClick = (username) => {
    // This function will redirect the user to the person's profile

    this.props.history.push("/explore/"+username)
  }

  renderUserProfiles = (userList) => {
    // This function will render a list of all the people that are in thsi
    // event

    // This will be similar to the calendar

    // This is gonna be for the coursel itself
    let socialItems = []

    let singleSlide = []

    const numSlides = Math.ceil(userList.length/9)

    console.log(userList)
    let count = 0

    for(let i = 0; i< numSlides; i++){

        const final = count+9

        while(count < final){
          if(userList[count]){
            // see if it exist first
            let username = ""
            if(userList[count]){
              username = userList[count].username
            }

            singleSlide.push(
              <div
                onClick = {() => this.onProfileClick(username)}
                className = "singleProfile">
                <div className = "miniHolderHolder">
                  <div className = "miniAvatarHolder">
                    <Avatar src= {`${global.IMAGE_ENDPOINT}`+userList[count].profile_picture} />
                  </div>
                  <div className = "miniNameHolder">
                    {userList[count].username}
                  </div>
                </div>



              </div>
            )

          } else {
            singleSlide.push(
              <div
                className = "singleEmptyProfile"
                >

              </div>
            )

          }

          count++;

        }


      socialItems.push(
        <div
          className = "profileSlide"
          >{singleSlide}</div>
      )
      singleSlide = []
    //
    //
    }

    console.log(socialItems.length)
    return socialItems



  }

  render(){


    console.log(this.props)

    let persons = []

    if(this.props.persons){
      persons = this.props.persons
    }

    return (
      <div className = 'socialLeftRight'>
        <div class="miniArrowLeft">
          <i
            style={{color:'#d9d9d9'}}
            onClick = {this.previous}
            class="fas fa-chevron-left">
          </i>
        </div>
        <Carousel
        arrows = {true}
        effect = 'null'
        ref = {node => {this.carousel = node}}
        afterChange={this.onChange}>
        {this.renderUserProfiles(persons)}

        </Carousel>


        <div class="miniArrowRight">
          <i
            style={{color:'#d9d9d9'}}
            onClick = {this.next}
            class="fas fa-chevron-right">
          </i>
        </div>



      </div>
    )
  }
}

export default UserAvaCarousel;
