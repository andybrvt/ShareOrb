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
   Spin,
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
import LazyLoad from 'react-lazyload';
import * as dateFns from 'date-fns';


class SocialNewsfeedPost extends React.Component {
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


    // DELETE SOCIAL CAL CELL OR DELETE SOCIAL CAL EVENT HERE
    // GENERALLY JUST DELETE THE CONTENT TYPE I GUESS


    this.openDeleteNotification("bottomRight")
    Modal.destroyAll();
    // window.location.reload();
  }

  openDeleteNotification = placement => {
  notification.info({
    message: `Social cell deleted`,
    description:"You have deleted your social calendar day.",
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

    // THESE ARE FOR THE SOCIAL CAL PICTURES
    // YOU ARE GONNA NEED THE CONTENT TYPE ID
    // THE USER WITH USER NAME

    // IF IT IS SOCAIL CAL CELL THEN IT WILL HOLD PHOTOS



    let userPostImages = []

    if(this.props.data){
      if(this.props.data.post){
        if(this.props.data.post.get_socialCalItems){
          userPostImages = this.props.data.post.get_socialCalItems;
        }
      }

    }

    if(userPostImages.length==1){
      return(

        <div
          onClick = {() => this.OnClickPost(postId, username)}


          class="imageContainerSingle">
          <LazyLoad
            once = {true}
            placeholder = {<Spin />}
            >

            <div
              style = {{
                  backgroundImage: `url(` + `${global.NEWSFEED_PICS}`+userPostImages[0].itemImage +")"
                }}
                className = "backgroundImageNewsSingle"
              >

            </div>

          </LazyLoad>

          {/*
            <img class="testMiddle" src={`${global.NEWSFEED_PICS}`+userPostImages[0]} />
            */}

        </div>

      )
    } else if(userPostImages.length>1){
      return(
        <div
        // onClick = {() => this.OnClickPost(postId, username)}
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

  OnClickPost=(calUsername, cellYear, cellMonth, cellDay, location)=> {
    // This is used to open up the social cell day post modal


    this.props.history.push({
      pathname:"/socialcal/"+calUsername+"/cell/"+cellYear+"/"+cellMonth+"/"+cellDay,
      state:{pathname: location}
    })

  }


  onProfileClick = (username) => {
    // REWRITE THIS SO THAT IT TARGETS THE PROFILE PAGE BETTER
    // BY DOING HISTORY.PUSH

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



    // GET CLIPPING DONE HERE --> RELOOK AT IT



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


  BottomLikeCommentPost(){


    let like_people = [];
    let profilePic = '';
    let peopleLikeId = [];
    let postId = 0;
    let userUsername = '';
    let caption = "";
    let commentList = [];
    let cellYear = ""
    let cellMonth = ""
    let cellDay = ""
    let location = ""



    location = this.props.history.location.pathname



    if(this.props.data){
      if(this.props.data.post){

        if(this.props.data.post.people_like){
          like_people = this.props.data.post.people_like
        }

        if(this.props.data.post.get_socialCalComment){
          commentList = this.props.data.post.get_socialCalComment
        }

        if(this.props.data.post.id){
          postId = this.props.data.post.id
        }

        if(this.props.data.post.dayCaption){
          caption = this.props.data.post.dayCaption
        }

        if(this.props.data.post.socialCaldate){
          const date = this.props.data.post.socialCaldate.split("-")
          cellYear = date[0]
          cellMonth = date[1]
          cellDay = date[2]
        }

      }
      if(this.props.data.owner){
        if(this.props.data.owner.username){
          userUsername = this.props.data.owner.username
        }

        if(this.props.data.owner.profile_picture){
          profilePic = this.props.data.owner.profile_picture
        }


      }

    }



    if(like_people.length > 0){
      for(let i = 0; i< like_people.length; i++){
        peopleLikeId.push(like_people[i].id)
      }
    }

    return (
      <div>


        <div class='postLikeContainer'>
          <div class="LeftinnerContainerLike">
            {
            (peopleLikeId.includes(this.props.userId))?
            <i class="fas fa-heart" style={{marginRight:'5px', color:'red', fontSize:'14px'}}></i>
              :
            <i class="far fa-heart" style={{marginRight:'5px', fontSize:'14px'}}></i>
            }
            <span class="LikeCommentHover" onClick={this.changeLikeListCondition}>
                  <span class="boldLikeComment" style={{fontSize:'14px'}}>{like_people.length} </span>
            </span>

            <Divider type="vertical" style={{background:'#d9d9d9'}}/>

            <span class="LikeCommentHover"
              onClick={() => this.OnClickPost(
                userUsername,
                cellYear,
                cellMonth,
                cellDay,
                location
              )}
              style={{marginTop:'-20px'}}>
              <i style={{ marginRight:'10px', fontSize:'14px'}} class="far fa-comments fa-lg"></i>
              <span class="boldLikeComment" style={{fontSize:'14px'}}>

                {commentList.length} comments</span>
            </span>


          </div>

          <div class='RightinnerContainerLike'>
            <div class="likingPostAvatarGroup">

            </div>
          </div>
        </div>
      { caption !== "" ?
        <Divider style={{marginTop:'5px'}}/>
        :
        <Divider style={{marginTop:'5px', marginBottom:'-10px'}}/>
      }
      { caption !== "" ?

        <p style={{ fontSize: '14px', color:'black', marginLeft:'15px', marginTop:'-10px' }}>
          {
            ((caption).length>140)?
              <div class="photoText">
                <span>
                  {caption.substring(0,140)}
                </span>
                <span class="grayout outerSeeMore"> {caption.substring(140,175)}</span>
                <div
                  style={{marginLeft: '10px', marginTop:'10px'}}
                  class="seeMore outerSeeMore"
                  onClick={() => this.OnClickPost(
                    userUsername,
                    cellYear,
                    cellMonth,
                    cellDay,
                    location
                  )}
                >
                  ... see more
                </div>

              </div>

            :

              <div style={{display:'flex'}}>
                <div class="photoText">
                    <span class="boldedText">
                    @{userUsername+" "}
                    </span>
                    <span>
                      {caption}
                    </span>
                </div>
              </div>
          }
        </p>
        :
        <span> </span>
      }

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
              <button onClick ={() => this.OnClickPost(
                userUsername,
                cellYear,
                cellMonth,
                cellDay,
                location
                )}>

                <i style={{ fontSize:'17px', marginRight:'10px'}} class="far fa-comments"></i> Comment
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
               <div>{commentList.length!=0 ?
                 <PreviewComments className="fontTest" commentList={commentList} />
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

  ContentOfPic() {
    let like_people = []
    let profilePic = ''
    let userUsername = ""
    let userFirstName = ""
    let userLastName = ""
    let userId = ""
    let postCreatedAt = ""

    if(this.props.data){
      if(this.props.data.owner){
        if(this.props.data.owner.profile_picture){
          profilePic = this.props.data.owner.profile_picture
        }

        if(this.props.data.owner.first_name){
          userFirstName = this.props.data.owner.first_name
        }
        if(this.props.data.owner.last_name){
          userLastName = this.props.data.owner.last_name
        }

        if(this.props.data.owner.id){
          userId = this.props.data.owner.id
        }

        if(this.props.data.owner.username){
          userUsername = this.props.data.owner.username
        }

      }

      if(this.props.data.post_date){
        postCreatedAt = this.props.data.post_date
      }

    }

    return(
    <div class="card" style={{marginLeft:5, marginRight:10, minHeight:10}}>
      <span class="profilePicHeader">
        <span class="headerContainer" >
            <span class="topleftNewsFeedPost">
              {
                profilePic != '' ?
              <Avatar
              size="large"
              onClick = {() => this.onProfileClick(userUsername)}
              size={42}
              style = {{cursor: 'pointer'}}
              src={`${global.IMAGE_ENDPOINT}`+profilePic} alt="avatar" />

              :

              <Avatar
              onClick = {() => this.onProfileClick(userUsername)}
              size="large"
              style = {{cursor: 'pointer' }}
              src={`${global.IMAGE_ENDPOINT}`+defaultPic} alt="avatar" />
            }

            </span>
            <span class="topRightNewsFeedPost">
              <span
                style={{color:'black', fontSize:'15px'}}
                class="headerPostText alignleft" >
                {this.capitalize(userFirstName)+" "+this.capitalize(userLastName)}
                <span
                  style={{fontSize:'13px'}}
                  class="headerPostText LikeCommentHover">
                  <br/>
                  @{userUsername}
                </span>

                </span>
                {
                 userId === this.props.userId ?
                   <span class="optionPostHeader">
                    <Dropdown placement="bottom" overlay={
                      <Menu>
                        <Menu.Item danger onClick={this.deletePost}>
                          <i style={{marginRight:'45px' }} class="fas fa-trash" style={{color:"#ff4d4f"}}></i>
                          <span style={{marginLeft:'10px'}}>Delete post</span>
                        </Menu.Item>
                      </Menu>
                    }>

                      <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <div class="threeDotPost">
                        <i class="fas fa-ellipsis-v" style={{fontSize:'20px'}}></i>
                        </div>
                      </a>

                    </Dropdown>
                    </span>
                  :
                  <div class="optionNoPostHeader"> </div>
                 }

                <span class="headerPostText alignright" style={{fontSize:'13px'}} >
                  <i style={{marginRight:'10px'}} class="fas fa-map-marker-alt"></i>
                    Tucson, Arizona <br/>
                  <span style={{float:'right'}}>
                      {this.renderTimestamp(postCreatedAt)}
                  </span>
                </span>

            </span>
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


  }

    render() {
      console.log(this.props)
      console.log(this.state)

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
    profilepic: state.auth.profilePic
  }
}


export default connect(mapStateToProps)(SocialNewsfeedPost);
