import React from 'react';
import {  Avatar } from 'antd';
import Liking from '../../containers/NewsfeedItems/Liking';
import UserPostComments from './UserPostComments';

class UserPostPage extends React.Component{


  render() {

    let socialCalItems = []
    let socialCalEvents = []
    let socialCalComments = []
    let socialCalUsername = ''
    let socialCalUserId = ''
    let socialCalProfilePic = ''
    let socialCalDate = ''
    let people_like = []
    // let curDate = year+"-"+month+"-"+day
    let socialCalCellId = ''

    // peopleLikeId is just used for the like and unlike button
    let peopleLikeId =[]

    return(
      <div
      className = "userPostModal"
      >
        <div
        className = "postHolder"
        >
          <div className = "postPicturesCarousel">
            <img />
          </div>

          <div className = "postModalRight">
              <div className = "postNameTag">
                <Avatar size = {50} className = 'socialProfileImage'/>
                <div>
                  <div className = 'postName'> Admin </div>
                  <div className = "postNameUsername"> @Admin Admin </div>
                </div>
              </div>

              <div className = "postLikeCommentNum">
              <span className = 'postLikeCommentText'> {people_like.length} Likes . {socialCalComments.length} comments </span>
              <div className = 'postLikeAvatar'>
                <Liking {...this.props} like_people={people_like}/>
              </div>
              </div>

              <div className = "postLikeComment">
              {
                peopleLikeId.includes(this.props.curId) ?

                <div
                // onClick = {() => this.onSocialUnLike(this.props.curId, socialCalUserId)}
                className ='postLike'>
                <i
                  style={{ marginRight:'10px', color:'red'}}
                  class="fa fa-heart">
                </i>
                Unlike
                </div>

                :

                <div
                // onClick = {() => this.onSocialLike(this.props.curId, socialCalUserId)}
                className ='postLike'>
                <i
                  style={{ marginRight:'10px'}}
                  class="fa fa-heart">
                </i>
                Like
                </div>



              }
              <div className  = 'postComment'>
              <i style={{ marginRight:'10px'}} class="far fa-comments fa-lg"></i>
               Comment </div>
              </div>
              <UserPostComments />



          </div>
        </div>
      </div>
    )
  }
}

export default UserPostPage;
