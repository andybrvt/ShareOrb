import React from 'react';
import {
  Carousel,
  Avatar,
  Dropdown,
  Menu,
  Card,
  Button
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
    start: 13,
    counter: 6,
    carouselIndex: 0,
    loading: false,
  }


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  componentDidMount(){
    this.getData()
  }

  onChange = a => {
    console.log(a)
    this.setState({
      carouselIndex:a
    })

    // now if a equals to the final lenght minus 2 (two slides before the end
  // then you want to get more people)
  // console.log(this.state.list.length-2)
  // console.log(a === Math.ceil(this.state.list.length/3)-2)
    // if(a === Math.ceil(this.state.list.length/3)-2 ){
    //   console.log('hit here')
    //   this.onLoadMore()
    //   this.carousel.goTo(a)
    // }

  }

  getData = callback =>{

    authAxios.get(`${global.API_ENDPOINT}/userprofile/suggestSuggested`)
        .then(res=> {

          this.setState({
            list:res.data,
         });
       });
       console.log(this.state.list)
  }

  onLoadMore = (e) => {

    console.log(this.state.counter)
    console.log(this.state.data)
    console.log(this.state.list)

    const start = this.state.start
    const end = this.state.counter

    this.setState({
      loading: true
    })
    authAxios.get(`${global.API_ENDPOINT}/userprofile/loadSuggested`,{
      params:{
        start,
        end
      }
    })
    .then(res => {
      console.log(res)
      this.setState({
        list:this.state.list.concat(res.data),
        start: this.state.start+this.state.counter,
        loading: false
      })
    })


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
          let profilePic = ""
          let firstName = ""
          let lastName = ""
          if(userList[count]){
            username = userList[count].username
            profilePic = userList[count].profile_picture
            firstName = userList[count].first_name
            lastName = userList[count].last_name
          }
          console.log(username)

          singleSlide.push(
            <div className = "singleCardArea">
               <div className = "suggestedUserCard">
                 <div className = "pictureHolder">
                   <img alt="example" src={profilePic} />
                 </div>

                 <div className = "nameHolder">
                   <div className = "suggestedFriendName"> {this.capitalize(firstName)} {this.capitalize(lastName)}</div>
                   <div className = "suggestedFriendUserName"> @{username}</div>
                   <div className = "suggestedFriendHolder">
                     <Button
                       className = "suggestedFriendButton"
                       type="primary"
                       shape="round"
                       icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                       style={{fontSize:'15px'}} size="large"
                       // onClick = {() => this.onFollow(this.props.currentId, profileId)}
                       > Follow
                     </Button>
                   </div>

                 </div>

               </div>

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

    console.log(this.state.carouselIndex)
    console.log(Math.ceil(this.state.list.length/3))

    console.log(this.state.carouselIndex+1 === Math.ceil(this.state.list.length/3)-1)
    return (
      <div className = 'socialLeftRight'>
        {
          this.state.carouselIndex === 0 ?
          <div></div>

          :

          <div class="leftArrowSuggested">
            <i
              onClick = {this.previous}
              class="fas fa-chevron-left">
            </i>
          </div>
        }

        <Carousel
        arrows = {true}
        effect = 'null'
        ref = {node => {this.carousel = node}}
        afterChange={this.onChange}>
        {this.renderUserProfiles(this.state.list)}
        </Carousel>

        {
          this.state.carouselIndex+1 === Math.ceil(this.state.list.length/3) ?

          <div>
          </div>

          :

          <div class="rightArrowSuggested">
            <i
              onClick = {this.next}
              class="fas fa-chevron-right">
            </i>
          </div>


        }



      </div>
    )
  }



}
export default InitialSuggestFollowers;
