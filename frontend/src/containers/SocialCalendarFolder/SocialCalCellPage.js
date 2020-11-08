import React from 'react';
import "./SocialCalCSS/SocialCellPage.css";
import * as dateFns from 'date-fns';
import {PictureOutlined} from '@ant-design/icons';
import PictureCarousel from './PictureCarousel';
import {  Avatar } from 'antd';
import Liking from'../NewsfeedItems/Liking.js';
import SocialComments from './SocialComments';
import SocialEventList from './SocialEventList';



class SocialCalCellPage extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  dateView(date) {
    // This will be presenting the calendar day on the modal
    // console.log(dateFns.format(new Date(date), ''))
    console.log(date)
    // let month = ''
    // let day = ''
    // if (date !== ''){
    //   month = dateFns.format(new Date(date), 'MMMM d, yyyy')
    // }
    //
    // console.log(month)
    // return (
    //   <div className = 'socialModalDate'>
    //   {month}
    //
    //   </div>
    // )

  }

  onSocialLike = (curDate, personLike, owner) => {
    // send out a like to the websocket, the curDate will be the current date and
    // The person like will be the perosn who like the post. Owner will be the
    // owner of the calendar
    console.log(personLike, owner)

    // ExploreWebSocketInstance.sendSocialLike(curDate, personLike, owner)

    // RECONFIG

  }

  onSocialUnLike = (curDate, personUnLike, owner) => {
    // This will send out a unlike to the websocket, teh curDate will be the current date
    // and be used to find the cell, the person will be the person that unlikes it and the
     // owener will be the owner of the calendar
     console.log(personUnLike, owner)

     // ExploreWebSocketInstance.sendSocialUnLike(curDate, personUnLike, owner)

     //RECONFIG
  }



  render(){
    console.log(this.props)
    console.log(this.props)

    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []
    let socialCalUsername = ''
    let socialCalUserId = ''
    let socialCalProfilePic = ''
    let socialCalDate = ''
    let people_like = []
    let curDate = ''
    let socialCalCellId = ''

    // peopleLikeId is just used for the like and unlike button
    let peopleLikeId =[]


    // if(this.props.socialObject[0]){
    //   if(this.props.socialObject[0].get_socialCalItems){
    //     socialCalItems = this.props.socialObject[0].get_socialCalItems
    //   }
    //   if(this.props.socialObject[0].get_socialCalEvent){
    //     socialCalEvents = this.props.socialObject[0].get_socialCalEvent
    //   }
    //   if(this.props.socialObject[0].get_socialCalComment){
    //     socialCalComments = this.props.socialObject[0].get_socialCalComment
    //   }
    //   socialCalUsername = this.props.socialObject[0].socialCalUser.username
    //   socialCalUserId = this.props.socialObject[0].socialCalUser.id
    //   socialCalProfilePic = 'http://127.0.0.1:8000'+this.props.socialObject[0].socialCalUser.profile_picture
    //   if(this.props.socialObject[0].socialCaldate){
    //     socialCalDate = this.props.socialObject[0].socialCaldate
    //   }
    //   if(this.props.socialObject[0].people_like){
    //     people_like = this.props.socialObject[0].people_like
    //   }
    //   if(this.props.curSocialDate){
    //     curDate = dateFns.format(this.props.curSocialDate, 'yyyy-MM-dd')
    //   }
    //   if(this.props.socialObject[0].id){
    //     socialCalCellId = this.props.socialObject[0].id
    //   }
    //
    // }
    //
    // if (people_like.length > 0){
    //   for (let i = 0; i < people_like.length; i++){
    //     peopleLikeId.push(people_like[i].id)
    //   }
    // }

    return(

         <div
          className = "socialCalCellModal"

         >
         <div className = 'socialHolder'>
         {
           socialCalItems.length === 1 ?

           <div className = 'socialCarouselSingle'>
             <img
             className = 'singlePic'
             src = {'http://127.0.0.1:8000'+ socialCalItems[0].itemImage} />
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


           <div className = 'socialModalRight'>

           <div className = 'socialNameTag'>

           <Avatar size = {50} src = {socialCalProfilePic} className = 'socialProfileImage'/>
           <div>
             <div className = 'socialName'> {this.capitalize(socialCalUsername)}</div>
             <div className = 'socialNameUsername'><b> @{this.capitalize(socialCalUsername)}</b></div>
           </div>
           {this.dateView(this.props.curSocialDate)}
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


           <span className = 'socialLikeCommentText'> {people_like.length} Likes . {socialCalComments.length} comments </span>
           <div className = 'socialLikeAvatar'>
             <Liking {...this.props} like_people={people_like}/>
           </div>
           </div>

           <div className = 'socialLikeComment'>

           {
             peopleLikeId.includes(this.props.curId) ?

             <div
             onClick = {() => this.onSocialUnLike(curDate, this.props.curId, socialCalUserId)}
             className ='socialLike'>
             <i
               style={{ marginRight:'10px', color:'red'}}
               class="fa fa-heart">
             </i>
             Unlike
             </div>

             :

             <div
             onClick = {() => this.onSocialLike(curDate, this.props.curId, socialCalUserId)}
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
           </div>
             <SocialComments
             // commentChange = {this.handleChange}
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
         </div>
    )
  }
}

export default SocialCalCellPage;
