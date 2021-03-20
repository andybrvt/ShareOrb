import React from 'react';
import {
  Carousel,
  Avatar,
  Dropdown,
  Menu,
  Card,
 } from 'antd';
import {
 RightCircleOutlined,
 LeftCircleOutlined
} from '@ant-design/icons';
import { authAxios } from '../components/util';
import './InitialSuggestFollowers.css';
const { Meta } = Card;



// This class will be used to create a carousel that holds
// people's project picture

class InitialSuggestFollowers extends React.Component{

  constructor(props){
    super(props);
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this);
    // createRef is used to refer to the DOM element in the render with the
    // ref in the tab
    this.carousel = React.createRef()
  }

  state ={
    // list will be the list of followers
    list: [],
    start: 12,
    counter: 6,
  }

  componentDidMount(){
    this.getData()
  }

  getData = callback =>{
    authAxios.get(`${global.API_ENDPOINT}/userprofile/everyoneSuggested`)
        .then(res=> {

          this.setState({
            list:res.data,
         });
       });
       console.log(this.state.list)
  }

  next() {
    this.carousel.next()
  }

  previous() {
    this.carousel.prev()
  }

  renderUserProfiles = (userList) => {
    console.log(userList)
    // This fucntion will reunder and construct all the
    // user's profiles, it will be similar to that of the
    // UserAvaCarousel but differnet card


    // First things first find the number of users in the list
    // to gage the length


    //  so we are gonna hve a socialItems which will be one slide
    // and within tha tone slide there will be 3 cards

    // So pretty much what you do is put a list that has 3 items inside
    // another big list that will go into the carousel

    let socialItems = []
    let singleSlide = []

    // Figure out the number of slides you have
    const numSlides = Math.ceil(userList.length/3)

    let count = 0
    for(let i = 0; i< numSlides; i++){
      // This will make all the over all slides

      // Now you will make the smaller ones
      // will make sure it stops at 3
      const final = count + 3

      // This is for indexing the user list too

      while(count< final){
        console.log('why does this not hit ')
        // check if there is a count in the userList
        console.log(userList[count])
        if(userList[count]){

          let username = ""
          if(userList[count]){
            username = userList[count].username
          }
          console.log(username)

          singleSlide.push(
            <div className = "singleCardArea">
              <Card
                 hoverable
                 style={{ width:"220px" }}
                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
               >
                 <Meta title="Europe Street beat" description="www.instagram.com" />
               </Card>

            </div>
          )


        } else{
          //This is incase it is empty
          singleSlide.push(
            <div className = "singleCardArea">
              <Card
                 hoverable
                 style={{ width:"250px", display: "none" }}
                 cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
               >
                 <Meta title="Europe Street beat" description="www.instagram.com" />
               </Card>
            </div>
          )
        }

        count++;

      }

      //Now push the items int the socialItems
      socialItems.push(
        <div className = "slideHolder">
          {singleSlide}
        </div>
      )
      singleSlide = []
    }

    return socialItems

  }


  render(){



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
        {this.renderUserProfiles(this.state.list)}
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
export default InitialSuggestFollowers;
