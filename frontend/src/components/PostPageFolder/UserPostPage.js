import React from 'react';
import {  Avatar, notification, Menu, Dropdown, Modal } from 'antd';
import { authAxios } from '../../components/util';
import Liking from '../../containers/NewsfeedItems/Liking';
import UserPostComments from './UserPostComments';
import UserPostPageWebSocketInstance from '../../UserPostPageWebsocket'
import { connect } from 'react-redux';
import PostPicCarousel from './PostPicCarousel';
import * as newsfeedActions from '../../store/actions/newsfeed';
import * as dateFns from 'date-fns';
import './UserPostPage.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';


class UserPostPage extends React.Component{

  state = {
    curCoverPic: 0,
    hasCaption: false
  }

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

  onCurPhotoChange = (picIndex) => {
    // This will be used for clipping

    this.setState({
      curCoverPic: picIndex
    })
  }

  onClipCurPhoto = () => {
    // This function will be similar to the clip function in the newsfeed post
    // It will clip to the soical calendar

    // So you will need the current picture that shows up in teh carousel.

    let curPic = ""
    let postOwnerId = ""
    let curId= ""

    const picIndex = this.state.curCoverPic
    if(this.props.post){
      if(this.props.post.post_images){
        curPic = this.props.post.post_images[picIndex]
      }
      if(this.props.post.user){
        postOwnerId = this.props.post.user.id
      }
    }

    if(this.props.curId){
      curId = this.props.curId
    }

    // Now you will then make an auth axios call because you are not doing this
    // in real time.

    console.log(curPic, postOwnerId)

    authAxios.post("http://127.0.0.1:8000/mySocialCal/pictureClipping",{
      clipPic: curPic,
      postOwnerId: postOwnerId,
      curId: curId
    })

    this.openNotification("bottomRight")


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


  deletePost = () => {

    // console.log(this.props.data.id)
    // authAxios.delete('http://127.0.0.1:8000/userprofile/post/delete/'+this.props.data.id);
    // message.success('Post deleted successfully!');
    Modal.confirm({
    title: 'Confirm',
    icon: <ExclamationCircleOutlined />,
    content: 'Are you sure you want to delete this post?',
    okText: 'OK',
    cancelText: 'Cancel',
    okButtonProps: { type: 'danger', onClick:this.DestroyPost},
  });

	}

  DestroyPost= () => {
    // Since this is its own page, you proboaly dont need to do websocket for this one
    // because you first have to exit cell into the new newsfeed. So authaxios call
    // should be enough

    authAxios.post("http://127.0.0.1:8000/userprofile/deletePost", {
      postId: this.props.post.id
    })

    this.props.history.push("/home")
    this.openDeleteNotification("bottomRight")
    Modal.destroyAll();
    //
  }

  openDeleteNotification = placement => {
  notification.info({
    message: `Post deleted`,
    description:"You have deleted a post.",
    placement,
  });
};


  cellThreeDots = () => {
    // This drop down is for the calendar cell in itself. To delete the cell
    // and write a post

    return(
      <div className = "cellThreeDots">
        <Dropdown overlay={
          <Menu>
            <Menu.Item
            >
                <i style={{marginLeft:'1px',marginRight:'4px' }} class="far fa-edit"></i>
                <span style={{marginLeft:'3px'}}> Write a caption</span>
            </Menu.Item>
            <Menu.Item
            >
                <i class="far fa-image"></i>
                <span style={{marginLeft:'5px'}}>Change cover picture</span>
            </Menu.Item>
            <Menu.Item danger
            onClick = {() => this.deletePost()}
             >
              <i style={{marginRight:'45px' }} class="fas fa-trash" style={{color:"#ff4d4f"}}></i>
              <span style={{marginLeft:'10px'}}>Delete post</span>
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



  render() {

    console.log(this.props)
    console.log(this.state)

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
    let caption = ""


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
      if(this.props.post.caption){
        caption = this.props.post.caption
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
             <PostPicCarousel
             picIndexChange = {this.onCurPhotoChange}
             items = {userPostImages} />
          </div>

        }


          <div className = "postModalRight">
              <div className = "postNameTag">
                <Avatar size = {45}
                src = {userPostProfilePic}
                className = 'socialProfileImage'/>
                <div>
                  <div className = 'ownerHolder'> {this.capitalize(userPostUsername)}</div>
                  <div className = "socialCalCellUsername"> @{this.capitalize(userPostUsername)} </div>
                  <div className = "postTimeStamp"> {userPostDate} </div>
                </div>
                {
                  userPostUserId === this.props.curId ?
                  this.cellThreeDots()

                  :

                  <div> </div>

                }

              </div>

              <div className = "caption">
              {caption}
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
               Comment
               </div>

               {
                 this.props.match.params.username === this.props.username   ?

                 <div></div>

                 :

                 <div
                 onClick = {() => this.onClipCurPhoto()}
                 className  = 'postComment'>
                   <span
                   style={{ marginRight:'10px'}}
                   class="fa fa-archive"></span>
                  Clip
                  </div>

               }



              </div>



              <UserPostComments
              caption = {caption}
              curUser = {this.props.curId}
              postId = {this.props.match.params.postId}
              items = {userPostComments}
              profilePic = {this.props.curProfilePic}
               />



          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    post: state.newsfeed.post,
    curId: state.auth.id,
    curProfilePic: state.auth.profilePic,
    username: state.auth.username
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closePost: () => dispatch(newsfeedActions.closePost()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPostPage);
