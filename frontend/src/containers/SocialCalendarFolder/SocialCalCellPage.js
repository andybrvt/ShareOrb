import React from 'react';
import "./SocialCalCSS/SocialCellPage.css";
import * as dateFns from 'date-fns';
import {PictureOutlined} from '@ant-design/icons';
import PictureCarousel from './PictureCarousel';
import {
  Avatar,
  Dropdown,
  Divider,
  Menu,
  notification,
  Form,
  Input
 } from 'antd';
import Liking from'../NewsfeedItems/Liking.js';
import SocialComments from './SocialComments';
import SocialEventList from './SocialEventList';
import SocialCalCellPageWebSocketInstance from '../../socialCalCellWebsocket';
import { connect } from 'react-redux';
import * as socialCalActions  from '../../store/actions/socialCalendar';
import DeleteSocialPostModal from './DeleteSocialPostModal';
import AddDayCaptionModal from './AddDayCaptionModal';
import DeleteSocialCellModal from './DeleteSocialCellModal';
import ChangeCoverPicModal from './ChangeCoverPicModal';
import { authAxios } from '../../components/util';

const { TextArea } = Input

class SocialCalCellPage extends React.Component{

  state ={
    showDelete: false,
    showDeleteCell: false,
    curSocialPic: 0,
    comment: "",
    captionModal: false,
    coverPicModal: false,
    curCoverPic: 0,
    showCaptionInput: false,
    caption: "",
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

  changeCurSocialPic = (picIndex) => {
    this.setState({
      curSocialPic: picIndex
    })
  }

  changeCoverPic = (picIndex) =>{
    this.setState({
      curCoverPic: picIndex
    })
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

  onCommentChange = e =>{
    // This will be in charge of the onchange comments

    this.setState({
      comment: e.target.value
    })
  }

  handleCommentSubmit = (curDate, calOwner) => {
    if(this.state.comment !== ""){
      SocialCalCellPageWebSocketInstance.sendSocialCalCellComment(
        curDate,
        this.props.curId,
        this.state.comment,
        calOwner
      )
      this.setState({comment: ""})
    }
  }


  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(new Date(date))
    let month = ''
    // let day = ''
    if (date !== ''){
      month = dateFns.format(new Date(date), 'MMMM d, yyyy')
    }

    // console.log(month)
    return (
      <div className = 'socialModalDate'>
      {date}

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

  getPageName(postOwnerName){
    // This function will show the correct name of the user that you are chatting
    // with

    var name = ""
    console.log(postOwnerName)
    if(postOwnerName.socialCalUser){
      name = this.capitalize(postOwnerName.socialCalUser.first_name)+ ' '
          +this.capitalize(postOwnerName.socialCalUser.last_name)

    }



    console.log(name)
    return name;

  }

  onClipCurPhoto = () => {
    // This function will be used to clipp the current photo in the carousel
    // to their calendar and current day in the social calendar




    let curPic = ""
    let postOwnerId = ""
    let curId = ""

    const picIndex = this.state.curSocialPic
    if(this.props.socialCalCellInfo){

      if(this.props.socialCalCellInfo.get_socialCalItems){

        if(this.props.socialCalCellInfo.get_socialCalItems[picIndex]){
          // This checks if there is actuall a picture present

          const calItem = this.props.socialCalCellInfo.get_socialCalItems[picIndex]
          curPic = calItem.itemImage
          postOwnerId = calItem.creator.id

          if(this.props.curId){
            curId = this.props.curId
          }

          // Now you just do an auth axios call bc you are not on your own calendar so
          // you dont have to worry about websocket
          authAxios.post("http://127.0.0.1:8000/mySocialCal/pictureClipping", {
            clipPic: curPic,
            postOwnerId: postOwnerId,
            curId: curId
          })

          this.openNotification("bottomRight")



        } else {
          // This is if there is no pictures but there is a social cell present
          this.fullOpenNotification("bottomRight")

        }



      } else {
        // This is for when there is no socialcalcell
        this.fullOpenNotification("bottomRight")
      }
    }

  }

  changeCoverPicSubmit = () => {
    // This function will be used to change the cover photo of the day cell

    // So you will need the userid and the cell date to get the right cal cell
    // Then get the photo to change the cover photo

    let coverPic = ""
    let socialCalItems = []
    let socialCellId = 0
    let curId = ""

    const year = this.props.match.params.year
    const month = this.props.match.params.month
    const day = this.props.match.params.day
    const cellDate = year+"-"+month+"-"+day


    const coverPicIndex = this.state.curCoverPic

    if(this.props.socialCalCellInfo){
      if(this.props.socialCalCellInfo.get_socialCalItems){

        if(this.props.socialCalCellInfo.get_socialCalItems[coverPicIndex]){
          coverPic = this.props.socialCalCellInfo.get_socialCalItems[coverPicIndex].itemImage
          socialCellId = this.props.socialCalCellInfo.id
          authAxios.post("http://127.0.0.1:8000/mySocialCal/changeCoverPic",{
            coverPic: coverPic,
            socialCellId: socialCellId,
          })

          this.openCoverNotification("bottomRight")
        }
      }
    }

  }

  openCoverNotification = placement => {
    notification.info({
      message: `Cover photo changed`,
      description:
        'You have changed the cover photo of this cell.',
      placement,
    });
  }

  openNotification = placement => {

  const today = dateFns.format(new Date(), 'MMM dd, yyyy')

  notification.info({
    message: `Photo Clipped!`,
    description:
      'A photo has been clipped to your calendar on '+today+'.',
    placement,
  });
  };

  fullOpenNotification = placement => {


  notification.info({
    message: `No Photos`,
    description:
      'There are no photos to clip.',
    placement,
  });
  };


  onDeleteSocialPost = () => {
    // This function will be called when you accept deleting the picture
    // This function will get passed into the deletesocialPostModal

    // The way this function is gonna work is that the state has a current
    // pic index and then you get the picture list. Use the index to pull the
    // correct pic and then send it into the backend through the socket

    const year = this.props.match.params.year
    const month = this.props.match.params.month
    const day = this.props.match.params.day
    const cellDate = year+"-"+month+"-"+day

    let socialCalItems = []
    let socialCellId = 0

    if(this.props.socialCalCellInfo){
      if(this.props.socialCalCellInfo.get_socialCalItems){
        socialCalItems = this.props.socialCalCellInfo.get_socialCalItems
      }
      if(this.props.socialCalCellInfo.id){
        socialCellId = this.props.socialCalCellInfo.id
      }
    }

    // Now that you pulled the the list of socialcalitem, you can use the index
    // in state to pull the right item
    var cellItemId = socialCalItems[this.state.curSocialPic].id


    // start of the path to sending things in to the backend
    SocialCalCellPageWebSocketInstance.sendDeleteSocialPic(cellItemId, socialCellId, cellDate)

    console.log('delete post')
  }

  onDeleteCellSubmit = () => {
    // This function will be used for the submission to delete the social cal cell

    // You pretty just have to send the social cal cell id into the backedn
    // gotta take care of the content type tho as well.

    const year = this.props.match.params.year
    const month = this.props.match.params.month
    const day = this.props.match.params.day
    const cellDate = year+"-"+month+"-"+day

    let socialCellId = ""

    if(this.props.socialCalCellInfo){
      if(this.props.socialCalCellInfo.id){
        // This will check if the social cal cell exist
        socialCellId = this.props.socialCalCellInfo.id

        const curId = this.props.curId

        console.log(socialCellId)
        SocialCalCellPageWebSocketInstance.sendDeleteSocialCell(socialCellId, curId, cellDate)

        this.openDeleteCellNotification("bottomRight")

      } else {
        this.openNoCellNotification("bottomRight")
      }
    }

  }




  openDeleteCellNotification = placement => {
  notification.info({
    message: `Day deleted`,
    description:
      'Day cell has been deleted',
    placement,
  });
};

  openNoCellNotification = placement => {
    notification.info({
      message: `No info on day`,
      description:
        'There is information to delete',
      placement,
    });
  }

  deleteSocialPost = () => {
    // This function will just open the modal that will delete the post
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

  openCaptionModal = () => {
    // This function will open the caption modal
    this.setState({
      captionModal: true
    })
  }

  closeCaptionModal = () => {
    this.setState({
      captionModal: false
    })
  }

  openDeleteCellModal = () => {
    // open the delete cell modal
    if(this.props.socialCalCellInfo){
        if(this.props.socialCalCellInfo.id){
          this.setState({
            showDeleteCell: true
          })
        } else {
          this.openNoCellNotification("bottomRight")
        }
    } else {
      this.openNoCellNotification("bottomRight")
    }


  }

  closeDeleteCellModal = () => {
    // close the delete cell modal
    this.setState({
      showDeleteCell: false
    })
  }

  openChangeCoverModal = () => {
    // This will open up the change cover cell modal
    if(this.props.socialCalCellInfo){
        if(this.props.socialCalCellInfo.get_socialCalItems){
          if(this.props.socialCalCellInfo.get_socialCalItems.length > 0){
            this.setState({
              coverPicModal: true
            })
          } else {
            this.openNoPicsNotification('bottomRight')
          }
        } else {
          this.openNoPicsNotification('bottomRight')
        }
    } else {
      this.openNoPicsNotification('bottomRight')
    }

  }

  openNoPicsNotification = placement => {
    notification.info({
      message: `No pictures`,
      description:
        'There are no pictures avaliable.',
      placement,
    });
  }

  closeChangeCoverModal = () => {
    // This will close the change cover cell modal
    this.setState({
      coverPicModal: false
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
        <i class="fas fa-ellipsis-v" style={{fontSize:'40px', padding:'5px', color: "gray"}}></i>
      </a>
      </Dropdown>
      </div>
    )
  }

  cellThreeDots = () => {
    // This drop down is for the calendar cell in itself. To delete the cell
    // and write a post

    return(
      <div className = "cellThreeDots">
        <Dropdown overlay={
          <Menu>
            <Menu.Item
            onClick = {this.openCaptionModal}
            >
                <i style={{marginLeft:'1px',marginRight:'4px' }} class="far fa-edit"></i>
                <span style={{marginLeft:'3px'}}> Write a caption</span>
            </Menu.Item>
            <Menu.Item
            onClick = {this.openChangeCoverModal}
            >
                <i class="far fa-image"></i>
                <span style={{marginLeft:'5px'}}>Change cover picture</span>
            </Menu.Item>
            <Menu.Item danger
            onClick = {this.openDeleteCellModal}
             >
              <i style={{marginRight:'45px' }} class="fas fa-trash" style={{color:"#ff4d4f"}}></i>
              <span style={{marginLeft:'10px'}}>Delete day</span>
            </Menu.Item>
          </Menu>
        }>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          <i class="fas fa-ellipsis-v" style={{fontSize:'30px', padding:'0px', color: "gray"}}></i>
        </a>
        </Dropdown>

      </div>
    )
  }

  heightCal = (captionLen) => {
    // This function is used to calculate the height of the comments by the
    // length of the caption
    if(captionLen === 0){
      let base = 97

      if(this.state.showCaptionInput){
        base = 90
      }

      return base+"%";
    } else {

      let base = 99

      if(this.state.showCaptionInput){
        return "87%"
      } else {
        const final = base - (captionLen/16)
        const finalStr = final+"%"

        return finalStr;

      }


    }


      }

  showEditCaption = () => {
      this.setState({
        showCaptionInput: true,
        caption: this.props.socialCalCellInfo.dayCaption
      })
  }

  showNoCaptionEdit = () => {
    // This is for when there are no caption

    this.setState({
      showCaptionInput: true
    })
  }

  unShowEditCaption = () => {
    this.setState({
      showCaptionInput: false
    })
  }

  onCaptionChange = e => {
    this.setState({
      caption: e.target.value
    })
  }

  onCaptionSubmit = (e, curDate) => {
    if(this.state.caption !== ""){
      SocialCalCellPageWebSocketInstance.sendSocialDayCaption(
        curDate,
        this.props.curId,
        this.state.caption
      )

      this.setState({
        caption: "",
        showCaptionInput: false
      })
    }
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

    let socialUser = {}
    // peopleLikeId is just used for the like and unlike button
    let peopleLikeId =[]
    let dayCaption = ""

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
        socialUser = this.props.socialCalCellInfo
        socialCalFirstName = this.props.socialCalCellInfo.socialCalUser.first_name
        socialCalLastName = this.props.socialCalCellInfo.socialCalUser.last_name
      }

      if(this.props.socialCalCellInfo.dayCaption){
        dayCaption = this.props.socialCalCellInfo.dayCaption
      }


    }

    if (people_like.length > 0){
      for (let i = 0; i < people_like.length; i++){
        peopleLikeId.push(people_like[i].id)
      }
    }


    console.log(dayCaption === "")
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
                         <div>{this.getChatUserName(socialCalItems[0])} </div>
                         <div class="socialCalCellUsername"> @{socialCalItems[0].creator.username} </div>

                       </div>
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
               <PictureCarousel
               onOpenDelete = {this.deleteSocialPost}
               onPicChange = {this.changeCurSocialPic}
               items = {socialCalItems} />
             </div>
           }

             <div className = 'socialModalRight'>

             <div className = 'socialNameTag'>

             <Avatar size = {50} src = {socialCalProfilePic} className = 'socialProfileImage'/>
             <div>
               <div className = 'socialName'>{this.getPageName(socialUser)} </div>
               <div className = 'socialNameUsername'><b> @{socialCalUsername}</b></div>
             </div>

             {this.dateView(socialCalDate)}


             { socialCalUserId === this.props.curId ?
               this.cellThreeDots()

               :

               <div> </div>

             }

             </div>
             {
               this.props.curId === socialCalUserId ?

               <div className = "dayCaption">
               {
                 dayCaption.length > 0 ?

                 this.state.showCaptionInput ?

                 <div className = "textAreaHolder">
                  <TextArea
                  className = "captionTextHolder"
                  placeHolder = "Write a caption"
                  maxLength = {250}
                  showCount
                  onChange = {this.onCaptionChange}
                  value = {this.state.caption}
                  onPressEnter = {e => this.onCaptionSubmit(e, curDate)}
                   />
                   <div className = "penIcon">
                   <i
                   onClick = {() => this.unShowEditCaption()}
                   class="fas fa-pen"></i>
                   </div>
                 </div>

                 :

                 <div>
                 {dayCaption} <span
                 className = "editCaptionPen"
                 onClick = {() => this.showEditCaption()}
                 > <i class="fas fa-pen"></i> </span>
                 </div>

                 :

                 this.state.showCaptionInput ?
                 <div className = "textAreaHolder">
                  <TextArea
                  className = "captionTextHolder"
                  placeHolder = "Write a caption"
                  maxLength = {250}
                  showCount
                  onChange = {this.onCaptionChange}
                  onPressEnter = {e => this.onCaptionSubmit(e, curDate)}
                   />
                   <div className = "penIcon">
                   <i
                   onClick = {() => this.unShowEditCaption()}
                   class="fas fa-pen"></i>
                   </div>
                 </div>

                 :

                 <div
                 onClick = {() => this.showNoCaptionEdit()}
                 className = "writeCaptionText">
                 Write a caption <i class="fas fa-pen"></i>

                 </div>

               }
              </div>


              :

              <div className = "dayCaption">
              {dayCaption}
             </div>


             }


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
                Comment
                </div>

                {
                  this.props.match.params.username === this.props.username   ?

                  <div></div>

                  :

                  <div
                  onClick = {() => this.onClipCurPhoto()}
                  className  = 'socialComment'>
                    <span
                    style={{ marginRight:'10px'}}
                    class="fa fa-archive"></span>
                   Clip
                   </div>

                }


             </div>

             <div
             style = {{
               height: this.heightCal(dayCaption.length)
             }}
             className = {`commentEventHolder ${dayCaption === ""  ? "" : "hasCaption"}`}>
               <SocialComments
               currentDate = {curDate}
               curUser = {this.props.curId}
               owner = {socialCalUserId}
               items = {socialCalComments}
               />
               <div className = 'socialCommentInput'>
                 <Avatar
                 size = {40}
                 className ='socialPicInput'
                 src = {'http://127.0.0.1:8000'+ this.props.curProfilePic}/>
                 <Form className = "socialInputForm">
                   <Input
                   className= 'socialBoxInput'
                   onChange ={this.onCommentChange}
                   value = {this.state.comment}
                   // bordered = {false}
                   placeholder = 'Write a comment'
                   name = 'socialComment'
                   onPressEnter = {() => this.handleCommentSubmit(curDate, socialCalUserId)}
                   // rows = {1}
                    />

                   <button
                   // type = 'submit'
                   // onClick = {this.handleSubmit}
                   style = {{display: 'none'}}
                   />
                 </Form>
               </div>
               <SocialEventList
               history = {this.props.history}
               curId = {this.props.curId}
               socialCalCellId = {socialCalCellId}
               cellDate = {socialCalDate}
               items = {socialCalEvents}/>
              </div>


             </div>
           </div>

           <DeleteSocialPostModal
           visible = {this.state.showDelete}
           onClose = {this.closeDelete}
           onDeleteSubmit = {this.onDeleteSocialPost}
            />

          <AddDayCaptionModal
          visible = {this.state.captionModal}
          onClose = {this.closeCaptionModal}
          curDate = {curDate}
          curId = {this.props.curId}
          />

          <DeleteSocialCellModal
          visible = {this.state.showDeleteCell}
          onClose = {this.closeDeleteCellModal}
          onDeleteSubmit = {this.onDeleteCellSubmit}
           />

           <ChangeCoverPicModal
           visible = {this.state.coverPicModal}
           onClose = {this.closeChangeCoverModal}
           items = {socialCalItems}
           onPicChange = {this.changeCoverPic}
           onPicSubmit = {this.changeCoverPicSubmit}
            />

         </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    socialCalCellInfo: state.socialCal.socialCalCellInfo,
    curId: state.auth.id,
    curProfilePic: state.auth.profilePic,
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeSocialCalCellPage: () => dispatch(socialCalActions.closeSocialCalCellPage())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialCalCellPage);
