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
import NotificationWebSocketInstance from '../notificationWebsocket';

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

    authAxios.get(`${global.API_ENDPOINT}/userprofile/configSuggestSuggested`)
        .then(res=> {
          console.log(res)

          const newList = this.onRemoveDuplicates(res.data.focusList, res.data.userList)
          console.log(newList)
          this.setState({
            list:newList,
         });
       });
       console.log(this.state.list)
  }


  onRemoveDuplicates = (list1, list2 ) => {
    // This will remove all the dumplicates from the
    // list


    let newList = []
    let duplicate = false
    for(let i = 0; i< list1.length; i++){
      // check if the value of list1 is duplicate
      const length = newList.length
      for(let j = 0; j< length; j++){
        console.log('try here')
        if(newList[j].id === list1[i].id){
          //f the idea for any of the values exist within
          // the newlist you will stop this current loop
          duplicate = true
          break

        }

        console.log("does hit here")
        //if it makes it to the end without breaking then
        // add it in


      }
      if(duplicate === false){
          newList.push(list1[i])
      } else {
        duplicate = false
      }

    }

    let duplicate2 = false
    for(let i = 0; i< list2.length; i++){
      // check if the value of list1 is duplicate
      const length = newList.length
      for(let j = 0; j< length; j++){
        if(newList[j].id === list2[i].id){
          //f the idea for any of the values exist within
          // the newlist you will stop this current loop

          duplicate2 = true
          break
        }


      }
      if(duplicate2 === false){
        console.log("does it ever it here")
          newList.push(list2[i])
      } else {
        duplicate2 = false
      }



    }

    return newList
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

  onFollow = (privatePro, follower, following) => {
    // This function will be used to handle the follow or request
    // The parameter privatePro will be used to see if the account is private or not
    // to send the right request
    // The parameterfollower will you, and following will be the person you are
    // trying to follow.

    console.log(privatePro, follower, following)
    if(privatePro === true) {
      // if true then the perosn profile will be private and then when you click
      // follow it will show a reqeust instead of followed

      // Make an axios call here that creates taht sent request event and update
      // it in the front end and then send a notification to the other person
      authAxios.post(`${global.API_ENDPOINT}/userprofile/sendFollowRequest`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)
        // update your redux first and then send a notificaiton to the other person
        // and update their auth too as well
        this.props.updateSentRequestList(res.data)
        const notificationObject = {
          command: 'send_follow_request_notification',
          actor: follower,
          recipient: following
        }
        // ADD THE NOTIFICATIONI HERE TO UPDATE THE FOLLOWING AUTH
        NotificationWebSocketInstance.sendNotification(notificationObject)
      })
      // const notificationObject = {
      //   command: 'send_follow_request_notification',
      //   actor: follower,
      //   recipient: following
      // }
      //
      // // add auth here
      //
      // // Simlar to the personal profile but without sending it throught he weboscket
      // NotificationWebSocketInstance.sendNotification(notificationObject)
    } else {
      // This will be for when it is not a private event

      authAxios.post(`${global.API_ENDPOINT}/userprofile/onFollow`, {
        follower: follower,
        following: following
      })
      .then(res => {
        console.log(res.data)
        this.props.updateFollowing(res.data)
        // Send a notification to the other person here
        const notificationObject = {
          command: 'send_follow_notification',
          actor: follower,
          recipient: following
        }
        NotificationWebSocketInstance.sendNotification(notificationObject)

      })
    }
  }

  onUnfollow = (follower, following) => {
    // This will unfollow the person

    authAxios.post(`${global.API_ENDPOINT}/userprofile/onUnfollow`, {
      follower: follower,
      following: following
    })
    .then(res => {
      console.log(res.data)
      this.props.updateFollowing(res.data)

      // This will unsend the follow notification if the person decides to unfollow
      const notificationObject = {
        command: 'unsend_follow_notification',
        actor: follower,
        recipient: following
      }
      NotificationWebSocketInstance.sendNotification(notificationObject)

    })

  }

  onUnsendRequest = (follower, following) => {
    // axios then notification after wards
    authAxios.post (`${global.API_ENDPOINT}/userprofile/unsendFollowRequest`, {
      follower: follower,
      following: following
    })
    .then(res => {
      this.props.updateSentRequestList(res.data)

      const notificationObject = {
        command: 'unsend_follow_request_notification',
        actor: follower,
        recipient: following
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)


    })
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

    let following = []
    let sentRequestList = []
    let requestList = []

    if(this.props.following){
      for(let i = 0; i< this.props.following.length; i++){
        following.push(
          this.props.following[i].id
        )
      }
    }
    if(this.props.requestList){
      for(let i = 0; i< this.props.requestList.length; i++){
        requestList.push(
          this.props.requestList[i].id
        )
      }
    }
    if(this.props.sentRequestList){
      for(let i = 0; i< this.props.sentRequestList.length; i++){
        sentRequestList.push(
          this.props.sentRequestList[i].id
        )
      }
    }

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
          let id = ""
          let userPriv = ""
          if(userList[count]){
            id = userList[count].id
            username = userList[count].username
            profilePic = userList[count].profile_picture
            firstName = userList[count].first_name
            lastName = userList[count].last_name
            userPriv = userList[count].private
          }
          console.log(username)

          singleSlide.push(
            <div className = "singleCardArea">
               <div className = "suggestedUserCard">
                 <div className = "pictureHolder">
                   <img alt="example" src={`${global.IMAGE_ENDPOINT}`+profilePic} />
                 </div>

                 <div className = "nameHolder">
                   <div className = "suggestedFriendName"> {this.capitalize(firstName)} {this.capitalize(lastName)}</div>
                   <div className = "suggestedFriendUserName"> @{username}</div>
                   <div className = "suggestedFriendHolder">
                     {
                       following.includes(id) ?

                       <Button
                         className = "suggestedFriendButton"
                         type="primary"
                         shape="round"
                         onClick = {() => this.onUnfollow(this.props.id, id ) }
                         icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                         style={{fontSize:'15px'}} size="large"
                         > Following
                       </Button>
                       :

                       sentRequestList.includes(id) ?

                       <Button
                         className = "suggestedFriendButton"
                         type="primary"
                         shape="round"
                         onClick = {() => this.onUnsendRequest(this.props.id, id ) }
                         icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                         style={{fontSize:'15px'}} size="large"
                         > Requested
                       </Button>

                       :

                       <Button
                         className = "suggestedFriendButton"
                         type="primary"
                         shape="round"
                         icon={<i  style={{marginRight:'10px'}} class="fas fa-user-plus"></i>}
                         style={{fontSize:'15px'}} size="large"
                         onClick = {() => this.onFollow(userPriv, this.props.id, id ) }
                         > Follow
                       </Button>

                     }


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


const mapStateToProps = state => {

}

export default InitialSuggestFollowers;
