import React from 'react';
import {  Avatar, notification, Menu, Dropdown, Form, Input, Modal, Divider} from 'antd';
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

  handleSubmit = e => {

    if(this.state.comment !== ''){
      UserPostPageWebSocketInstance.sendUserPostComment(
        this.props.curId,
        this.state.comment,
        this.props.post.id
      )

      this.setState({comment: ''})
    }
  }

  handleChange = e => {
    this.setState({
      comment: e.target.value
    })
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

    authAxios.post(`${global.API_ENDPOINT}/mySocialCal/pictureClipping`,{
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
    // authAxios.delete(`${global.API_ENDPOINT}/userprofile/post/delete/`+this.props.data.id);
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

    authAxios.post(`${global.API_ENDPOINT}/userprofile/deletePost`, {
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

getPageName(postOwnerName){
  // This function will show the correct name of the user that you are chatting
  // with

  var name = ""
  console.log(postOwnerName)
  if(postOwnerName.first_name && postOwnerName.last_name){
    name = this.capitalize(postOwnerName.first_name)+ ' '
        +this.capitalize(postOwnerName.last_name)

  }

  if(name.length > 20){
    name = name.substring(0,20)+'...'
  }


  console.log(name)
  return name;

}


  cellThreeDots = () => {
    // This drop down is for the calendar cell in itself. To delete the cell
    // and write a post

    return(
      <div className = "cellThreeDots">
        <Dropdown overlay={
          <Menu>
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

    let userUser = {}
    let userPostImages = []
    let userPostComments = []
    let userPostUsername = ''
    let userPostUserId = ''
    let userPostProfilePic = ''
    let userFirstName=''
    let userLastName=''
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
        userUser = this.props.post.user
        userPostUsername = this.props.post.user.username
        userPostProfilePic = `${global.API_ENDPOINT}`+this.props.post.user.profile_picture
        userPostUserId = this.props.post.user.id
        userFirstName=this.props.post.user.first_name
        userLastName=this.props.post.user.last_name
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
      <div className = "socialCalCellModal">

      <div className = "socialModalLeft">
        {
          userPostImages.length === 1 ?
          <div className = "singlePicHolder">
            <img
              className = 'singlePic'
              src = {`${global.API_ENDPOINT}/media/`+userPostImages[0]}
             />
          </div>

          :

          <div className = "socialCarousel">
             <PostPicCarousel
             picIndexChange = {this.onCurPhotoChange}
             items = {userPostImages} />
          </div>

        }
      </div>


      <div className = "socialModalRight">

        {
          userPostUserId === this.props.curId ?
          this.cellThreeDots()

          :

          <div> </div>

        }

        <div className = "postTopSection">
          <div className = "socialNameSect">
            <div className = "socialName">
              <div className = "socialNameTag">
                <div className = "socialProfileHolder">
                  <Avatar
                    size = {40}
                    src = {userPostProfilePic}
                    className = 'socialProfileImage'
                  />
                </div>

                <div className = "socialNameHolder">
                  <div className = "socialNameName"> {this.getPageName(userUser)} </div>
                  <div className = "socialUsername"> @{userPostUsername}</div>
                </div>

              </div>

            </div>

            <div className = "socialDate">
              <div className = "socialDateDate">
                {userPostDate}
              </div>
            </div>
          </div>

          <div className = "socialCaptionSect">
            <div className = "dayCaption">
                {caption}
            </div>

          </div>

          <div className = "socialLikingSect">

            <div className = "socialLikeCommentNum">
              <div className = "socialLikeCommentNumHolder">
                {
                  peopleLikeId.includes(this.props.curId) ?

                  <div className = ''>
                    <i class="fab fa-gratipay" style={{marginRight:'5px', color:'red'}}></i>
                  </div>

                  :

                  <div className = ''>
                    <i class="fab fa-gratipay" style={{marginRight:'5px'}}></i>

                  </div>
                }
                <div className = "socialLikeCommentText">
                  <div>
                    {people_like.length} <span className = "disappearLikes"> Likes</span>
                  </div>
                  <Divider type="vertical" style={{height:'100%'}}/>

                  <div>
                    {userPostComments.length} <span className = 'disappearComments'> Comments </span>

                  </div>

                </div>

              </div>
            </div>

            <div className = "socialLikingLiking">
              <div className = "socialLikeAvatar">

                <Liking {...this.props} like_people={people_like} specifySize={25} num={10}/>

              </div>
            </div>


          </div>

          <div className = 'socialLikeCommentSect'>

            <div className = "socialLikeComment">
              {
                peopleLikeId.includes(this.props.curId) ?

                <div
                onClick = {() => this.onPostUnlike(this.props.curId)}
                className ='socialLike'>
                <div className = "textHeightCenter">
                  <i
                    style={{ marginRight:'10px', color:'red'}}
                    class="fas fa-heart">
                  </i>
                  Unlike
                </div>

                </div>

                :

                <div
                onClick = {() => this.onPostLike(this.props.curId)}
                className ='socialLike'>
                <div className = 'textHeightCenter'>
                  <i
                    style={{ marginRight:'10px'}}
                    class="fa fa-heart">
                  </i>
                  Like
                </div>
                </div>

              }
              <div className  = 'socialComment'>
               <div className = 'textHeightCenter'>
                 <i style={{ marginRight:'10px'}} class="far fa-comments fa-lg"></i>
                  Comment
               </div>
              </div>

              {
                this.props.match.params.username === this.props.username   ?

                <div></div>

                :

                <div
                onClick = {() => this.onClipCurPhoto()}
                className  = 'socialComment'>
                <div className = "textHeightCenter">
                  <i
                  style={{ marginRight:'10px'}}
                  class="fa fa-archive"></i>
                 Clip
                </div>
                </div>

              }



            </div>

          </div>

          <div className = "socialCommentListSect">
            <UserPostComments
            caption = {caption}
            curUser = {this.props.curId}
            postId = {this.props.match.params.postId}
            items = {userPostComments}
            profilePic = {this.props.curProfilePic}
             />

         </div>


        </div>

        <div className ="postBottomSection">

          <div className = "socialCommentInputSect">
            <div className = "socialCommentInput">
              <Avatar
              size = {30}
              className ='postPicInput'
              src = {`${global.IMAGE_ENDPOINT}`+this.props.curProfilePic}/>
              <Form>
                <Input
                className= 'postBoxInput'
                onChange ={this.handleChange}
                value = {this.state.comment}
                // bordered = {false}
                placeholder = 'Write a comment'
                name = 'postComment'
                onPressEnter = {() =>this.handleSubmit()}
                // rows = {1}
                 />

                <button
                type = 'submit'
                onClick = {() => this.handleSubmit()}
                style = {{display: 'none'}}
                />
              </Form>

            </div>

          </div>

        </div>
      </div>

      {/*
        <div
        className = "postHolder"
        >



          <div className = "postModalRight">
              <div className = "postNameTag">


                <span
                  style={{color:'black', fontSize:'15px', marginLeft:'10px'}}
                  class="headerPostText alignleft" >
                    <b>{userFirstName}{' '}{userLastName}</b> <br/>
                  <span>
                    <span
                      style={{fontSize:'13px'}}
                      class="headerPostText LikeCommentHover">
                      @{userPostUsername}
                    </span>
                  </span>
                </span>

              </div>

              <div className = "captionUniversal">
              {caption}
              </div>


              <div className = "postLikeCommentNum">


                <span className = 'postLikeCommentText' style={{color:'#595959'}}>
                  {people_like.length}
                  <Divider type="vertical" style={{background:'#d9d9d9'}}/>
                  <i style={{marginRight:'5px'}} class="far fa-comment"></i>
                  {userPostComments.length} comments </span>
                <div className = 'postLikeAvatar'>
                </div>
              </div>

              <div style={{color:'#595959'}} className = "postLikeComment">





              </div>




               <div className = 'postCommentInput'>

               </div>


          </div>
        </div>

        */}

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
