import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js';
import PreviewComments from '../../containers/comments/PreviewComments.js';
import { authAxios } from '../../components/util';
import {Avatar,
   Icon,
   Message,
   Menu,
   Dropdown,
   Tooltip,
   Row,
   Skeleton,
   Switch,
   Card,Divider,
   Comment,
   Button,
   List,
   Input,
   Popover,
   message,
   Space,
   Form,
   Modal,
   notification
 } from 'antd';
import { EditOutlined, EllipsisOutlined, AntDesignOutlined, ExclamationCircleOutlined, SettingOutlined, SearchOutlined,UserOutlined, FolderAddTwoTone, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';
import WebSocketPostsInstance from  '../../postWebsocket';
import NotificationWebSocketInstance from  '../../notificationWebsocket';
import { connect } from 'react-redux';
import heart  from './heart.svg';
import { commentPic } from './comment.svg';
import 'antd/dist/antd.css';
import QueueAnim from 'rc-queue-anim';
import defaultPic from '../../components/images/default.png'
import Liking from './Liking';
import LikeList from './LikeList';
import PostPicCarousel from '../../components/PostPageFolder/PostPicCarousel';
import NewsfeedSpecCarousel from './NewsfeedSpecCarousel';

import * as dateFns from 'date-fns';


class NewsfeedPost extends React.Component {
  constructor(props){
    super(props);
    // this.initialisePost()

    this.state = {
      visibleModal: false,
      commentPost:'',
      commentsCondition:true,
      show:false,
      stepCount:0,
      avatarColor:'',
      testLike: false,

      // The cur pic index will be used for the clipping
      curPicIndex: 0,
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  componentDidMount() {
    // WebSocketPostsInstance.connect()
  }

  deletePost = () => {

    // console.log(this.props.data.id)
    // message.success('Post deleted successfully!');
    Modal.confirm({
    centered:'true',
    title: 'Confirm',
    icon: <ExclamationCircleOutlined />,
    content: 'Are you sure you want to delete this post?',
    okText: 'OK',
    cancelText: 'Cancel',
    okButtonProps: { type: 'danger', onClick:this.DestroyPost},
  });
    // WebSocketPostsInstance.deletePost(this.props.data.id)
	  // need to delete post
    // document.location.href = '/';
	}

  DestroyPost= () => {
    WebSocketPostsInstance.deletePost(this.props.data.id)
    this.openDeleteNotification("bottomRight")
    Modal.destroyAll();
    // window.location.reload();
  }

  openDeleteNotification = placement => {
  notification.info({
    message: `Post deleted`,
    description:"You have deleted a post.",
    placement,
  });
};


   ShowNextSteps = () => {
    if(this.state.stepCount==1){
      return <h1>show step 1</h1>;
    }
    else if(this.state.stepCount==2){
      return <h1>show step 2</h1>;
    }
    else{
      return <h1> show last step </h1>
    }

  }

  revealPhoto = () => {
    let postId = ""
    let username = ""

    if(this.props.data.id){
      postId = this.props.data.id
    }
    if(this.props.data.user){
      username = this.props.data.user.username
    }
    let userPostImages = []
    if(this.props.data){
      if(this.props.data.post_images){
          userPostImages = this.props.data.post_images
      }
    }

    if(userPostImages.length==1){
      return(
        <div
          onClick = {() => this.OnClickPost(postId, username)}
          class="imageContainer">

            <img class="testMiddle" src={`${global.NEWSFEED_PICS}`+userPostImages[0]} alt="" />

        </div>
      )
    } else if(userPostImages.length>1){
      return(
        <div
        onClick = {() => this.OnClickPost(postId, username)}
        className = "postPicCarouselNews">


        <NewsfeedSpecCarousel
        picIndexChange = {this.onCurPhotoChange}
        items = {userPostImages} />

        </div>
      )
    }
 }


  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  changeLikeListCondition = () => {
    this.setState({
      testLike: true,
    });

  }

  onClick = () => {
    this.setState({
      show: !this.state.show,
      stepCount:this.state.stepCount+1,
    });
  }

  triggerComments = () => {
    this.setState({
      commentsCondition: !this.state.commentsCondition,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visibleModal: false,
      testLike:false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleModal: false,
      testLike:false,
    });
  };

  OnClickPost=(postId, username)=> {
    // This is used to open up the post modal

    this.props.history.push("/post/"+username+'/'+postId)
  }


  handleCommentChange = e => {
    this.setState({
      commentPost: e.target.value,
    });
  };

  onProfileClick = (username) => {
    if (username === this.props.currentUser){
      window.location.href = 'current-user/'
    } else {
      window.location.href = 'explore/'+username
    }
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
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
        prefix = `${new Date(timestamp)}`;
    }

    return prefix;
  }

  onClipPhoto = () => {
    // This function will be in charge of clipping the current photo and caption
    // into your social calendar in the social day. It will look like a polaroid

    // So you will need the current picture that shows up on the newsfeed,
    // to add in (it will probally be one photo)
    // Then you will put the caption on the polaroid (maybe not the caption)
    // but the post owner has to be a must

    let curPic = ""
    let postOwnerId = ""
    let curId = ""
    const picIndex = this.state.curPicIndex
    if(this.props.data){
      if(this.props.data.post_images){
        curPic = this.props.data.post_images[picIndex]
      }
      if(this.props.data.user){
        postOwnerId = this.props.data.user.id
      }
    }
    if(this.props.userId){
      curId = this.props.userId
    }

    // Now you would add the auth axios call. You do not need to do a websocket
    // because we are in a seperate page. You might need websocket for notification
    // but that pretty much it

    console.log(curPic, postOwnerId)
    authAxios.post(`${global.API_ENDPOINT}/mySocialCal/pictureClipping`, {
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


  onCurPhotoChange = (picIndex) => {
    // This function will be an on change for the current picture that is shown
    // on the profile picture
    this.setState({
      curPicIndex: picIndex
    })
  }


  handleSubmit = () => {
    WebSocketPostsInstance.sendComment(
      this.props.userId,
      this.props.data.id,
      this.state.commentPost
    )
    console.log(this.props.userId)
    console.log(this.props.data.user.id)

    if(this.props.userId !== this.props.data.user.id){
      const notificationObject = {
        command: 'comment_notification',
        actor: this.props.userId,
        recipient: this.props.data.user.id,
        postId: this.props.data.id
      }

      NotificationWebSocketInstance.sendNotification(notificationObject)
    }
  }

  BottomLikeCommentPost(){
    let like_people = this.props.data.people_like
    let profilePic = ''
    let peopleLikeId = []
    let postId = 0
    let userUsername = ''

    if (this.props.data.user.profile_picture){
      profilePic = `${global.IMAGE_ENDPOINT}`+this.props.data.user.profile_picture
    }
    if(this.props.data.id){
      postId = this.props.data.id
    }
    if(this.props.data.user){
      userUsername = this.props.data.user.username
    }



    let temp=`${global.IMAGE_ENDPOINT}`+this.props.data.post_images;
    let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;

    const success = () => {
      message.success('Clipped to your album!');
    };
    if(like_people.length > 0){
      for(let i = 0; i< like_people.length; i++){
        peopleLikeId.push(like_people[i].id)
      }
    }

    return (
      <div style={{marginLeft:'15px', fontSize:'14px'}}>


        <div class='outerContainerPeople'>
          <div class="innerContainerLike">
            {
            (peopleLikeId.includes(this.props.userId))?
            <i class="fas fa-heart" style={{marginRight:'5px', color:'red'}}></i>
              :
            <i class="far fa-heart" style={{marginRight:'5px'}}></i>
            }
            <span class="LikeCommentHover" onClick={this.changeLikeListCondition}>
                  <span class="boldLikeComment">{like_people.length} </span>
            </span>

            <Divider type="vertical" style={{background:'#d9d9d9'}}/>

            <span class="LikeCommentHover" onClick={() => this.OnClickPost(postId, userUsername)} style={{marginTop:'-20px'}}>
              <span class="boldLikeComment"> {this.props.data.post_comments.length} comments</span>
            </span>

            <div class='commentInPost'>
              <Liking
                num={10}
                history  = {this.props.history}
                specifySize={27}
                like_people={this.props.data.people_like} {...this.props}/>
            </div>
          </div>
        </div>

        <Divider style={{marginTop:'-10px'}}/>

        <p style={{ fontSize: '14px', color:'black'}}>
          {
            ((this.props.data.caption).length>140)?
              <div class="photoText">
                <span>
                  {this.props.data.caption.substring(0,140)}
                </span>
                <span class="grayout outerSeeMore"> {this.props.data.caption.substring(140,175)}</span>
                <div
                  style={{marginLeft: '10px', marginTop:'10px'}}
                  class="seeMore outerSeeMore"
                  onClick={() => this.OnClickPost(postId, userUsername)}
                >
                  ... see more
                </div>

              </div>

            :

              <div style={{display:'flex'}}>
                <div class="photoText">
                    <span>
                      {this.props.data.caption}
                    </span>
                </div>
              </div>
          }
        </p>


        <div>
          <div class="box-buttons">
            <div class="row">
              {(peopleLikeId.includes(this.props.userId))?
              <button
              class="box-click"
              onClick ={this.AddOneToLike}>
                <i style={{ marginRight:'10px', color:'red'}} class="fa fa-heart">
                </i>
                <span class="textHighlight">
                      Like
                </span>
              </button>
              :
              <button
              class="box-click"
              onClick ={this.AddOneToLike} >
                  <i
                    style={{ marginRight:'10px'}}
                    class="far fa-heart">
                  </i>
                  <span> Like </span>
              </button>
              }
              <button onClick ={() => this.OnClickPost(postId, userUsername)} >

                <i style={{ fontSize:'17px', marginRight:'10px'}} class="far fa-comment"></i> Comment
              </button>
              <button onClick = {() => this.onClipPhoto()}>
                <span style={{ marginRight:'10px'}} class="fa fa-archive"></span>
                Clip
              </button>
            </div>
          </div>


          {
            (this.state.commentsCondition==true) ?
            <div>
               <div>{this.props.data.post_comments.length!=0 ?
                 <PreviewComments className="fontTest" newsfeed={this.props} />
                 :
                 ''}
              </div>
            </div>
            :

            <div>

            </div>

          }
      </div>
    </div>
    )
  }

  ContentOfEvent() {

    let profilePic = ''


    if (this.props.data.user.profile_picture){
      profilePic = `${global.IMAGE_ENDPOINT}`+this.props.data.user.profile_picture
    }

    return(

      <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

      <div style={{padding:20,}}>

        {
          profilePic != '' ?
          <Avatar
          onClick = {() => this.onProfileClick(this.props.data.user.username)}

          style = {{
            cursor: 'pointer',
          }}
          src={profilePic} alt="avatar" />

          :

          <Avatar
          onClick = {() => this.onProfileClick(this.props.data.user.username)}
          size="large"
          style = {{
            cursor: 'pointer',
          }}
          src={defaultPic} alt="avatar" />

        }

           <span class="personName"  onClick = {() => this.onProfileClick(this.props.data.user.username)}>
             {this.capitalize(this.props.data.user.username)}
             <div>
             <span class="fb-group-date" > Tucson, Arizona</span>
             <span class="fb-group-date" > {this.renderTimestamp(this.props.data.created_at)}</span>
            </div>
        </span>




      </div>

      <Divider/>

      <div style={{marginLeft:'20px',fontSize: '30px', color:'black'}}>
      8/17 Thursday 3PM
      </div>
      <i  style={{marginLeft:'20px',fontSize: '20px', color:'#13c2c2'}} class="fa fa-users" aria-hidden="true"></i>



      </div>
    )
  }




  ContentOfPic() {
    let like_people = this.props.data.people_like
    let profilePic = ''

    if (this.props.data.user.profile_picture){
      profilePic = `${global.IMAGE_ENDPOINT}`+this.props.data.user.profile_picture
    }

    let temp=`${global.IMAGE_ENDPOINT}`+this.props.data.post_images;


    let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;

    const success = () => {
    message.success('Clipped to your album!');
    };

    return(
    <div class="card" style={{marginLeft:5, marginRight:10, minHeight:10}}>
      <span class="profilePicHeader">
        <span class="headerContainer" >
            <span class="g grid-13">
              {
                profilePic != '' ?
              <Avatar
              size="large"
              onClick = {() => this.onProfileClick(this.props.data.user.username)}
              size={42}
              style = {{cursor: 'pointer'}}
              src={profilePic} alt="avatar" />

              :

              <Avatar
              onClick = {() => this.onProfileClick(this.props.data.user.username)}
              size="large"
              style = {{cursor: 'pointer' }}
              src={defaultPic} alt="avatar" />
            }

            </span>
            <span class="g grid-33">
              <span class="headerPost">
                <span
                  style={{color:'black', fontSize:'15px', marginLeft:'-5px'}}
                  class="headerPostText alignleft" >
                  {this.capitalize(this.props.data.user.first_name)+" "+this.capitalize(this.props.data.user.last_name)}
                  <span
                    style={{fontSize:'13px'}}
                    class="headerPostText LikeCommentHover">

                    <br/>
                    @{this.props.data.user.username}
                  </span>

                </span>

                <span class="headerPostText alignright" style={{fontSize:'13px'}} >
                  <i style={{marginRight:'10px'}} class="fas fa-map-marker-alt"></i>
                    Tucson, Arizona <br/>
                  <span style={{float:'right'}}>
                      {this.renderTimestamp(this.props.data.created_at)}
                  </span>
                </span>
              </span>
            </span>
          </span>

          <span class="optionPostHeader">
            {
           this.props.data.user.id === this.props.userId ?
            <Dropdown overlay={
              <Menu>
                <Menu.Item danger onClick={this.deletePost}>
                  <i style={{marginRight:'45px' }} class="fas fa-trash" style={{color:"#ff4d4f"}}></i>
                  <span style={{marginLeft:'10px'}}>Delete post</span>
                </Menu.Item>
              </Menu>
            }>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              <i class="fas fa-ellipsis-v" style={{fontSize:'20px', padding:'5px'}}></i>
              </a>
            </Dropdown>
            :

            <div></div>



          }

            </span>

    </span>

    <div>
      <div>

        <Divider style={{'marginTop':'-5px', marginBottom:'-0.5px'}}/>
        {this.revealPhoto()}

      </div>


        {this.BottomLikeCommentPost()}

      </div>
    </div>
    )
  }

  // this renders the posts on the newsfeed

  AddOneToLike = (e) => {
    e.stopPropagation();
    this.triggerComments();
    let peopleLikeId = []

    const like_people = this.props.data.people_like

    if(like_people.length > 0){
      for(let i = 0; i< like_people.length; i++){
        peopleLikeId.push(like_people[i].id)
      }
    }
    if ( peopleLikeId.includes(this.props.userId)){
      console.log('unlike')
      WebSocketPostsInstance.unSendOneLike(this.props.userId, this.props.data.id)
    } else {
      // This websocket call will add one like to the post, but since only one user from
      // one end can like that post so we only need the current user
      const notificationObject = {
        command: 'like_notification',
        actor: this.props.userId,
        recipient: this.props.data.user.id,
        postId: this.props.data.id
      }

      console.log('like')
      WebSocketPostsInstance.sendOneLike(this.props.userId, this.props.data.id)
      if (this.props.userId !== this.props.data.user.id){
        console.log('like notification')
        NotificationWebSocketInstance.sendNotification(notificationObject)
      }
      // NotificationWebSocketInstance.sendNotification()
    }
  }

    render() {
      console.log(this.props)
      console.log(this.state)

      let temp=`${global.IMAGE_ENDPOINT}`+this.props.data.post_images;
      const success = () => {
        message.success('Clipped to your album!');
      };
      const { TextArea } = Input;


      return (
      <div>
        <div>


        <Modal
          class="modalOuterContainer"
          title={`Likes on Post`}
          visible={this.state.testLike}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="600px"
          height="1000px"
          style={{marginTop:'-50px'}}
          >
          <LikeList {...this.props}/>
        </Modal>


        </div>

        <p>{this.ContentOfPic()}</p>

        </div>
  );
};
}


const mapStateToProps = state => {
  return {
    userId: state.auth.id,
    currentUser: state.auth.username,
    currentProfilePic: state.auth.profilePic
  }
}


export default connect(mapStateToProps)(NewsfeedPost);
