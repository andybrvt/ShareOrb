import React from 'react';
import "./SocialCalCSS/SocialCellPage.css";
import * as dateFns from 'date-fns';
import {PictureOutlined} from '@ant-design/icons';
import PictureCarousel from './PictureCarousel';
import {
  Avatar,
  Dropdown,
  Divider,
  Menu
 } from 'antd';
import Liking from'../NewsfeedItems/Liking.js';
import SocialComments from './SocialComments';
import SocialEventList from './SocialEventList';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import { connect } from 'react-redux';
import * as socialCalActions  from '../../store/actions/socialCalendar';
import DeleteSocialPostModal from './DeleteSocialPostModal';

class SocialCalCellPage extends React.Component{

  state ={
    showDelete: false,
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  initialisePage(){
    this.waitForSocketConnection(() =>{
      SocialCalCellPageWebSocketInstance.fetchSocialCalCellInfo(
        this.props.match.params.username,
        this.props.match.params.year,
        this.props.match.params.month,
        this.props.match.params.day
      )
    })
    if(this.props.match.params.username && this.props.match.params.year
      && this.props.match.params.month && this.props.match.params.day
    ) {
      SocialCalCellPageWebSocketInstance.connect(
        this.props.match.params.username,
        this.props.match.params.year,
        this.props.match.params.month,
        this.props.match.params.day
      )
    }

  }

  componentDidMount() {
    this.initialisePage()
  }


  waitForSocketConnection(callback){
		// This is pretty much a recursion that tries to reconnect to the websocket
		// if it does not connect
		const component = this;
		setTimeout(
			function(){
				console.log(SocialCalCellPageWebSocketInstance.state())
				if (SocialCalCellPageWebSocketInstance.state() === 1){
					console.log('connection is secure');
					callback();
					return;
				} else {
					console.log('waiting for connection...')
					component.waitForSocketConnection(callback)
				}
			}, 100)
	}

  componentWillReceiveProps(newProps){
    if(this.props.match.params.username !== newProps.match.params.username ||
      this.props.match.params.year !== newProps.match.params.year ||
      this.props.match.params.month !== newProps.match.params.month ||
      this.props.match.params.day !== newProps.match.params.day
    ) {
      SocialCalCellPageWebSocketInstance.disconnect();
      this.waitForSocketConnection(() =>{
        SocialCalCellPageWebSocketInstance.fetchSocialCalCellInfo(
          newProps.match.params.username,
          newProps.match.params.year,
          newProps.match.params.month,
          newProps.match.params.day
        )
      })
      SocialCalCellPageWebSocketInstance.connect(
          newProps.match.params.username,
          newProps.match.params.year,
          newProps.match.params.month,
          newProps.match.params.day
      )

    }
  }

  componentWillUnmount(){
    SocialCalCellPageWebSocketInstance.disconnect();
    this.props.closeSocialCalCellPage();
  }


  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(date)
    let month = ''
    // let day = ''
    if (date !== ''){
      month = dateFns.format(new Date(date), 'MMMM d, yyyy')
    }

    // console.log(month)
    return (
      <div className = 'socialModalDate'>
      {month}

      </div>
    )

  }


  onSocialLike = (personLike, owner) => {
    // STATUS: REDONE

    // send out a like to the websocket, the curDate will be the current date and
    // The person like will be the perosn who like the post(it will be the current user
    // and be indicated with id). Owner will be the
    // owner of the calendar

    // You will pull the date using the url on top.
    const year = this.props.match.params.year
    const month = this.props.match.params.month
    const day = this.props.match.params.day
    const cellDate = year+"-"+month+"-"+day

    SocialCalCellPageWebSocketInstance.sendSocialCalCellLike(cellDate, personLike, owner)


  }

  onSocialUnLike = (personUnLike, owner) => {
    // This will send out a unlike to the websocket, teh curDate will be the current date
    // and be used to find the cell, the person will be the person that unlikes it and the
     // owener will be the owner of the calendar
     console.log(personUnLike, owner)
     const year = this.props.match.params.year
     const month = this.props.match.params.month
     const day = this.props.match.params.day
     const cellDate = year+"-"+month+"-"+day


     SocialCalCellPageWebSocketInstance.sendSocialCalCellUnlike(cellDate, personUnLike, owner)
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
    this.setState({
      showDelete: true
    })

  }

  closeDelete = () => {
    // This function will be used close the delete
    this.setState({
      showDelete: false
    })
  }

  threeDotDropDown = () => {

    // This will hold the drop down for the pictures that incldues
    // deleting and all other functions

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


  render(){
    console.log(this.props)
    console.log(this.state)

    const year = this.props.match.params.year
    const month = this.props.match.params.month
    const day = this.props.match.params.day

    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []
    let socialCalUsername = ''
    let socialCalUserId = ''
    let socialCalProfilePic = ''
    let socialCalDate = ''
    let people_like = []
    let curDate = year+"-"+month+"-"+day
    let socialCalCellId = ''
    let socialCalFirstName = ''
    let socialCalLastName = ''

    // peopleLikeId is just used for the like and unlike button
    let peopleLikeId =[]

    console.log(people_like)
    console.log(curDate)
    if(this.props.socialCalCellInfo){
      if(this.props.socialCalCellInfo.get_socialCalItems){
        socialCalItems = this.props.socialCalCellInfo.get_socialCalItems
      }
      if(this.props.socialCalCellInfo.get_socialCalEvent){
        socialCalEvents = this.props.socialCalCellInfo.get_socialCalEvent
      }
      if(this.props.socialCalCellInfo.get_socialCalComment){
        socialCalComments = this.props.socialCalCellInfo.get_socialCalComment
      }
      if(this.props.socialCalCellInfo.socialCalUser){
        socialCalUsername = this.props.socialCalCellInfo.socialCalUser.username
        socialCalUserId = this.props.socialCalCellInfo.socialCalUser.id
        socialCalProfilePic = 'http://127.0.0.1:8000'+this.props.socialCalCellInfo.socialCalUser.profile_picture

      }
      if(this.props.socialCalCellInfo.socialCaldate){
        socialCalDate = this.props.socialCalCellInfo.socialCaldate
      }
      if(this.props.socialCalCellInfo.people_like){
        people_like = this.props.socialCalCellInfo.people_like
      }
      if(this.props.socialCalCellInfo.id){
        socialCalCellId = this.props.socialCalCellInfo.id
      }
      if(this.props.socialCalCellInfo.socialCalUser){
        socialCalFirstName = this.props.socialCalCellInfo.socialCalUser.first_name
        socialCalLastName = this.props.socialCalCellInfo.socialCalUser.last_name
      }

    }

    if (people_like.length > 0){
      for (let i = 0; i < people_like.length; i++){
        peopleLikeId.push(people_like[i].id)
      }
    }


    console.log(socialCalItems)
    return(

         <div className = "socialCalCellModal">
           <div className = 'socialHolder'>
           {
             socialCalItems.length === 1 ?
             <div className = "singlePicHolder">
               {socialCalItems[0].socialItemType === "clip" ?

               <div className = 'singlePic'>
                 <img
                 className = "backgroundPic"
                 src = {'http://127.0.0.1:8000'+ socialCalItems[0].itemImage}
                  />

                  {this.threeDotDropDown()}

                  <div className = "clipPicturesRoll">
                    <div className = "ownerHolder">
                       <Avatar
                       size = {65}
                       src = {'http://127.0.0.1:8000' +socialCalItems[0].creator.profile_picture}
                       />
                       <div className = "ownerName">
                         <div>{socialCalFirstName+' '+socialCalLastName} </div>

                       </div>
                       <div class="socialCalCellUsername"> @{socialCalItems[0].creator.username} </div>
                    </div>
                   <div className = "polaroidHolder">
                    <img
                    className = "socialImages"
                    src = {'http://127.0.0.1:8000'+ socialCalItems[0].itemImage}
                     />
                   </div>
                  </div>
               </div>

               :

               <div className = 'singlePic'>
              {this.threeDotDropDown()}
                 <img
                 className ="picture"
                 src = {'http://127.0.0.1:8000'+ socialCalItems[0].itemImage} />
               </div>

              }
            </div>

             : socialCalItems.length === 0 ?

             <div className = 'socialCarouselZero'>
             <div className = 'pictureFrame'>
               <PictureOutlined  />
               <br />
               <span> No posts </span>
             </div>
             </div>

             :

             <div className = 'socialCarousel'>
               <PictureCarousel items = {socialCalItems} />
             </div>
           }

           <Divider type="vertical" style={{height:'100%'}}/>
             <div className = 'socialModalRight'>

             <div className = 'socialNameTag'>

             <Avatar size = {50} src = {socialCalProfilePic} className = 'socialProfileImage'/>
             <div>
               <div className = 'socialName'>{socialCalFirstName+' '+socialCalLastName} </div>
               <div className = 'socialNameUsername'><b> @{socialCalUsername}</b></div>
             </div>
             {this.dateView(socialCalDate)}
             </div>
             <div className = 'socialLikeCommentNum'>
               {
                 peopleLikeId.includes(this.props.curId) ?

                 <div className = 'socialLikeCircle'>
                 <i class="fab fa-gratipay" style={{marginRight:'5px', color:'red'}}></i>
                 </div>

                 :

                 <div className = 'socialLikeCircle'>
                 <i class="fab fa-gratipay" style={{marginRight:'5px'}}></i>
                 </div>
               }


               <span className = 'socialLikeCommentText'>
                 {people_like.length} Likes
                 <Divider type="vertical" style={{height:'100%'}}/>
                {socialCalComments.length} comments
               </span>
               <div className = 'socialLikeAvatar'>
                 <Liking {...this.props} like_people={people_like}/>
               </div>
             </div>

             <div className = 'socialLikeComment'>

             {
               peopleLikeId.includes(this.props.curId) ?

               <div
               onClick = {() => this.onSocialUnLike(this.props.curId, socialCalUserId)}
               className ='socialLike'>
               <i
                 style={{ marginRight:'10px', color:'red'}}
                 class="fa fa-heart">
               </i>
               Unlike
               </div>

               :

               <div
               onClick = {() => this.onSocialLike(this.props.curId, socialCalUserId)}
               className ='socialLike'>
               <i
                 style={{ marginRight:'10px'}}
                 class="fa fa-heart">
               </i>
               Like
               </div>



             }

               <div className  = 'socialComment'>
               <i style={{ marginRight:'10px'}} class="far fa-comments fa-lg"></i>
                Comment </div>


                <div className  = 'socialComment'>
                  <span
                  style={{ marginRight:'10px'}}
                  class="fa fa-archive"></span>
                 Clip </div>

             </div>
               <SocialComments
               // commentChange = {this.handleCommentChange}
               // commentSubmit = {this.handleSubmit}
               // commentValue = {this.state.comment}
               currentDate = {curDate}
               curUser = {this.props.curId}
               owner = {socialCalUserId}
               items = {socialCalComments}
               profilePic = {this.props.curProfilePic}/>
               <SocialEventList
               history = {this.props.history}
               curId = {this.props.curId}
               socialCalCellId = {socialCalCellId}
               cellDate = {socialCalDate}
               items = {socialCalEvents}/>

             </div>
           </div>

           <DeleteSocialPostModal
           visible = {this.state.showDelete}
           onClose = {this.closeDelete}
            />
         </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    socialCalCellInfo: state.socialCal.socialCalCellInfo,
    curId: state.auth.id,
    curProfilePic: state.auth.profilePic
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeSocialCalCellPage: () => dispatch(socialCalActions.closeSocialCalCellPage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCalCellPage);
