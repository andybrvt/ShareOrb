import React from 'react';
import {  Avatar } from 'antd';
import Liking from '../../containers/NewsfeedItems/Liking';
import UserPostComments from './UserPostComments';
import UserPostPageWebSocketInstance from '../../UserPostPageWebsocket'
import { connect } from 'react-redux';
import PostPicCarousel from './PostPicCarousel';
import * as newsfeedActions from '../../store/actions/newsfeed';
import * as dateFns from 'date-fns';


class UserPostPage extends React.Component{

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  initialisePage(){
    this.waitForSocketConnection(() => {
      UserPostPageWebSocketInstance.fetchUserPostInfo(
        this.props.match.params.postId
      )
    })
    if(this.props.match.params.postId && this.props.match.params.username){
      UserPostPageWebSocketInstance.connect(
        this.props.match.params.username,
        this.props.match.params.postId
      )
    }

  }

  componentDidMount(){
    this.initialisePage()
  }

  waitForSocketConnection(callback){
    // This is pretty much a recursion that tries to reconnect to the websocket
    // if it does not connect
    const component = this;
    setTimeout(
      function(){
        console.log(UserPostPageWebSocketInstance.state())
        if (UserPostPageWebSocketInstance.state() === 1){
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
    if(this.props.match.params.username !== newProps.match.params.username
      || this.props.match.params.postId !== newProps.match.params.postId
    ) {
      UserPostPageWebSocketInstance.disconnect();
      this.waitForSocketConnection(() =>{
        UserPostPageWebSocketInstance.fetchUserPostInfo(
          this.props.match.params.postId
        )
      })
      UserPostPageWebSocketInstance.connect(
        this.props.match.params.username,
        this.props.match.params.postId
      )

    }
  }

  componentWillUnmount(){
    UserPostPageWebSocketInstance.disconnect();
    this.props.closePost();

  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `Just now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff} minutes ago`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)} hours ago`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))} days ago`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }

  onPostLike = (personLike) => {
    // personLike will be the person that like the post
    // owner will be the owner of the of the post,
    // you probally just need the person like and the post id and then you
    // just add the person like to it

    console.log(personLike)
    UserPostPageWebSocketInstance.sendUserPostLike(personLike, this.props.match.params.postId)

  }

  onPostUnlike = (personUnlike) => {

    UserPostPageWebSocketInstance.sendUserPostUnlike(personUnlike, this.props.match.params.postId)
  }

  render() {

    console.log(this.props)

    let userPostImages = []
    let userPostComments = []
    let userPostUsername = ''
    let userPostUserId = ''
    let userPostProfilePic = ''

    let userPostDate = ''
    let people_like = []
    // let curDate = year+"-"+month+"-"+day
    let socialCalCellId = ''

    // peopleLikeId is just used for the like and unlike button
    let peopleLikeId =[]



    if(this.props.post){
      if(this.props.post.post_images){
        userPostImages = this.props.post.post_images
      }
      if(this.props.post.post_comments){
        userPostComments = this.props.post.post_comments
      }
      if(this.props.post.user){
        userPostUsername = this.props.post.user.username
        userPostProfilePic = 'http://127.0.0.1:8000'+this.props.post.user.profile_picture
        userPostUserId = this.props.post.user.id
      }
      if(this.props.post.created_at){
        userPostDate = this.renderTimestamp(this.props.post.created_at)
      }
      if(this.props.post.people_like){
        people_like = this.props.post.people_like
      }
    }

    if (people_like.length > 0){
      for (let i = 0; i < people_like.length; i++){
        peopleLikeId.push(people_like[i].id)
      }
    }

    return(
      <div
      className = "userPostModal"
      >
        <div
        className = "postHolder"
        >
        {
          userPostImages.length === 1 ?
          <div className = "postPicturesCarousel">
            <img
              className = 'singlePic'
              src = {'http://127.0.0.1:8000/media/'+userPostImages[0]}
             />
          </div>

          :

          <div className = "postPicturesCarousel">
             <PostPicCarousel items = {userPostImages} />
          </div>

        }


          <div className = "postModalRight">
              <div className = "postNameTag">
                <Avatar size = {50}
                src = {userPostProfilePic}
                className = 'socialProfileImage'/>
                <div>
                  <div className = 'postName'> {this.capitalize(userPostUsername)}</div>
                  <div className = "postNameUsername"> @{this.capitalize(userPostUsername)} </div>
                  <div className = "postTimeStamp"> {userPostDate} </div>
                </div>
              </div>

              <div className = "postLikeCommentNum">
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

              <span className = 'postLikeCommentText'> {people_like.length} Likes . {userPostComments.length} comments </span>
              <div className = 'postLikeAvatar'>
                <Liking {...this.props} like_people={people_like}/>
              </div>
              </div>

              <div className = "postLikeComment">
              {
                peopleLikeId.includes(this.props.curId) ?

                <div
                onClick = {() => this.onPostUnlike(this.props.curId)}
                className ='postLike'>
                <i
                  style={{ marginRight:'10px', color:'red'}}
                  class="fa fa-heart">
                </i>
                Unlike
                </div>

                :

                <div
                onClick = {() => this.onPostLike(this.props.curId)}
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

const mapStateToProps = state => {
  return {
    post: state.newsfeed.post,
    curId: state.auth.id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePost: () => dispatch(newsfeedActions.closePost()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPostPage);
