import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js';
import PreviewComments from '../../containers/comments/PreviewComments.js';
import { authAxios } from '../../components/util';
import {Avatar, Icon, Tooltip, Row, Skeleton, Switch, Card,Divider, Comment, Button, List, Input, Popover, message, Space, Form, Modal} from 'antd';
import { EditOutlined, EllipsisOutlined, AntDesignOutlined, SettingOutlined, SearchOutlined,UserOutlined, ArrowRightOutlined, FolderAddTwoTone, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';
import WebSocketPostsInstance from  '../../postWebsocket';
import NotificationWebSocketInstance from  '../../notificationWebsocket';
import { connect } from 'react-redux';
import heart  from './heart.svg';
import { commentPic } from './comment.svg';
import DetailSwitch from '../DetailSwitch.js';
import 'antd/dist/antd.css';
import QueueAnim from 'rc-queue-anim';
import defaultPic from '../../components/images/default.png'
import UserAvatar from './UserAvatar'
import UserLikePlusUserAvatar from './UserLikePlusUserAvatar';
import Liking from './Liking';

class NewsfeedPost extends React.Component {
  constructor(props){
    super(props);
    // this.initialisePost()

    this.state = {
      visibleModal: false,
      commentPost:'',
      commentsCondition:false,
      show:false,
      stepCount:0,
      avatarColor:'',
    }
  }

  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }


  // initialisePost(){
  //   this.waitForSocketConnection(() =>{
  //     WebSocketPostsInstance.fetchLikes(this.props.data.id)
  //     WebSocketPostsInstance.fetchComments(this.props.data.id)
  //   })
  // }


  componentDidMount() {
    // WebSocketPostsInstance.connect()
  }

  // waitForSocketConnection(callback){
  //   const component = this
  //   setTimeout(
  //     function(){
  //       if(WebSocketPostsInstance.state() ===1){
  //         callback();
  //         return;
  //       } else {
  //         component.waitForSocketConnection(callback);
  //       }
  //     }, 100)
  // }
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

      if((this.props.data.post_images).length==1){
        return(
        <div class="imageContainer">

        <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[0]} alt="" /></a>

        </div>)
      }
        else if((this.props.data.post_images).length==2){
          return(
          <div class="TwoImageContainer">

            <div class="TwoHalfImageContainer">

              <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[0]} alt="" /></a>

              </div>
                <div class="TwoHalfImageContainer" style={{marginLeft:'3px'}}>

              <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[1]} alt="" /></a>

            </div>



          </div>)
        }
        else if((this.props.data.post_images).length==3){
          return(
            <div>
            <div class="ThreeImageContainer">

              <div class="FirstThirdImageContainer">

              <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[0]} alt="" /></a>

              </div>

              <div class="TopandBottomThirdContainer">
                <div class="SecondThirdImageContainer" style={{marginLeft:'3px'}}>

                <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[1]} alt="" /></a>

                </div>

                <div class="ThreeThirdImageContainer" style={{marginLeft:'3px'}}>

                <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[2]} alt="" /></a>

                </div>
              </div>

            </div>
          </div>
        )

        }
        else{

        }

 }

 randomAvatarColor = () => {

   this.setState({
     avatarColor:'#ff0000',
   });
 };

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

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
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visibleModal: false,
    });
  };

  OnClickPost=()=> {
    console.log("pressed on post")
    // return <NewsFeedPostModal /
    console.log(this.state.visibleModal);
    this.showModal();
    console.log(this.state.visibleModal);
  }


  handleCommentChange = e => {
        console.log(e.target.value);
    this.setState({
      commentPost: e.target.value,
    });
  };

  onProfileClick = (username) => {
    console.log(username)
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

    // var data = new FormData();
    // // change this later to curr user
    // data.append("name", localStorage.getItem('username'));
    // data.append("body", this.state.commentPost);
    // for (var pair of data.entries()) {
    //  console.log(pair[0]+ ', ' + pair[1]);
    // }
    // console.log(localStorage.getItem('token'))
    //
    // fetch('http://127.0.0.1:8000/userprofile/testComment/'+this.props.data.id+'/',{
    //  method: 'POST',NotificationWebNotificationWebSocketInstanceSocketInstance
    //    headers: {
    //      Authorization: `Token ${localStorage.getItem('token')}`,
    //    },
    //    body:data
    // })
    //   .then (res =>res.json())
    //   .then(json =>{
    //  	 console.log(json)
    //  	 return json
    //   })
     }



  ContentOfEvent() {

    let profilePic = ''


    if (this.props.data.user.profile_picture){
      profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    }

    return(

      <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

      <div style={{padding:20,}}>
      <Popover
         style={{width:'200px'}}
         content={<div>
           <Avatar
            shape="square"
            size="large"
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80"
            />
           <div> 110 followers </div>
         </div>}

        >
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
        </Popover>
           <span class="personName"  onClick = {() => this.onProfileClick(this.props.data.user.username)}>
             {this.capitalize(this.props.data.user.username)}

             <div>
             <span class="fb-group-date alignleft" > Tucson, Arizona</span>

              <span class="fb-group-date alignright" > {this.renderTimestamp(this.props.data.created_at)}</span>
             </div>



           </span>




      </div>
<div class="customDivider"/>

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
      profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    }

    console.log(profilePic)

    let temp="http://127.0.0.1:8000"+this.props.data.post_images;
    let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;

    const success = () => {
    message.success('Clipped to your album!');
    };
    console.log(temp)

    return(
      <div>

      <div>


      <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

      <div>
      <div style={{padding:20,}}>
      <Popover
         style={{width:'200px'}}
         content={<div>
           <Avatar
            shape="square"
            size="large"
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80"
            />
           <div> 110 followers </div>
         </div>}

        >
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


            </Popover>

            <span class="personName"  onClick = {() => this.onProfileClick(this.props.data.user.username)}>
              {this.capitalize(this.props.data.user.username)}

              <div>
              <span class="fb-group-date alignleft" > Tucson, Arizona</span>

               <span class="fb-group-date alignright" > {this.renderTimestamp(this.props.data.created_at)}</span>
              </div>



            </span>

            </div>

        </div>





      <div>
      {/*
      <div>
      {
        ((this.props.data.post_images).length==1)?
      <div class="imageContainer">

          <a href=""><img src={"http://127.0.0.1:8000/media/"+this.props.data.post_images[0]} alt="" /></a>

      </div>
      :
      <div> </div>
    }
    </div>

    */}

  <div style={{marginTop:'20px'}}>
  {this.revealPhoto()}

      </div>





      <Liking {...this.props}/>



    <p style={{marginLeft:'10px',fontSize: '16px', color:'black'}}>
              {

                 ((this.props.data.caption).length>600)?

                 <div class="outerSeeMore">

                   <span class="innerSeeMore">
                   {this.props.data.caption.substring(0,550)}


                   </span>
                   <span class="grayout" class="innerSeeMore"> {this.props.data.caption.substring(550,600)}</span>
                   <div style={{marginTop:10}} class="seeMore"> ... see more </div>
                 </div>
                 :
                 <div style={{padding:'10px'}}>
                   <p class="innerSeeMore boldedText" style={{fontSize:'14px', marginRight:'5px'}}>
                    {this.props.data.user.username}
                    </p>
                   <p class="innerSeeMore " style={{fontSize:'16px',}}>
                   {this.props.data.caption}

                   </p>

                   <div>


                   </div>
                  </div>
               }

    </p>

      <div class="box-buttons">
        <div class="row">
          {
            (like_people.includes(this.props.userId))?

              <button class="box-click" onClick ={this.AddOneToLike}><i class="fa fa-heart-o redHeart"></i> {like_people.length}</button>
            :
              <button class="box-click" onClick ={this.AddOneToLike} ><span class="fa fa-heart-o"></span> {like_people.length}</button>
          }
          <button onClick ={this.OnClickPost} ><span class="fa fa-comment-o"></span> {this.props.data.post_comments.length}</button>
          <button><span class="fa fa-archive"></span></button>
        </div>
      </div>

    <div>


      {
        (this.state.commentsCondition==true) ?


        <div>
           <div>{this.props.data.post_comments.length!=0 ? <PreviewComments className="fontTest" newsfeed={this.props} /> : ''}</div>
        </div>



        :

        <div>

        </div>

      }



      </div>

      <div>





      </div>
        </div>

      </div>



      </div>


        </div>
    )
  }

  // this renders the posts on the newsfeed

  ContentOfPost(){
    console.log(this.props.data)
    let like_people = this.props.data.people_like
    let profilePic = ''

    if (this.props.data.user.profile_picture){
      console.log(this.props.data.user.profile_picture)
      profilePic = 'http://127.0.0.1:8000'+this.props.data.user.profile_picture
    }



    return(
      // if you want anywhere in the post to click on and open modal put OnClickPost in this div
    <div>


    <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

    <div>
      <div style={{padding:20,}}>
      <Popover
         style={{width:'200px'}}
         content={<div>
           <Avatar
            shape="square"
            src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80" />
           <div> 110 followers </div>
         </div>}

        >
        {
          profilePic != '' ?
          <Avatar
          onClick = {() => this.onProfileClick(this.props.data.user.username)}
          size="large"
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
        </Popover>
           <span class="personName"  onClick = {() => this.onProfileClick(this.props.data.user.username)}>
             {this.capitalize(this.props.data.user.username)}

             <div>
             <span class="fb-group-date" style={{marginLeft:55}}> Tucson, Arizona</span>

              <span class="fb-group-date" style={{marginLeft:240}}> {this.renderTimestamp(this.props.data.created_at)}</span>
             </div>
           </span>

      </div>





    <p style={{color:'black'}} class="whiteSpacePost">
              {


                 ((this.props.data.caption).length>600)?

                 <div class="outerSeeMore">
                   <span class="innerSeeMore">


                   {this.props.data.caption.substring(0,550)}


                   </span>
                   <span class="grayout" class="innerSeeMore"> {this.props.data.caption.substring(550,600)}</span>
                   <div style={{marginTop:10}} class="seeMore"> ... see more </div>
                 </div>
                 :
                 <div class="whiteSpacePost innerSeeMore"  style={{padding:'50px', fontSize:'20px',}} >


                 {this.props.data.caption}


                 </div>
               }

    </p>

    <Liking {...this.props}/>

    {/* show the first 3 people
      like_people[0]'s avatar'
      like_people[1]'s avatar
      like_people[2]'s avatar
      and + like_people.length-3 like this
      */}

    <div class="box-buttons">
      <div class="row">
        {
          (like_people.includes(this.props.userId))?

            <button class="box-click" onClick ={this.AddOneToLike}><i class="fa fa-heart-o redHeart"></i> {like_people.length}</button>
          :
            <button class="box-click" onClick ={this.AddOneToLike} ><span class="fa fa-heart-o"></span> {like_people.length}</button>
        }
        <button onClick ={this.OnClickPost} ><span class="fa fa-comment-o"></span> {this.props.data.post_comments.length}</button>
        <button><span class="fa fa-archive"></span></button>
      </div>
    </div>

  <div>


    {
      (this.state.commentsCondition==true) ?


      <div style={{marginLeft:'20px'}}>
         <div>{this.props.data.post_comments.length!=0 ? <PreviewComments className="fontTest" newsfeed={this.props} /> : ''}</div>
      </div>



      :

      <div>

      </div>

    }



    </div>


      </div>

    </div>



    </div>
  )
  }


  ContentofComments(){

    let profilePic = ''

    if (this.props.currentProfilePic){
      profilePic = 'http://127.0.0.1:8000'+this.props.currentProfilePic
    }

    return(

    <div>
      {


        (this.props.data.post_comments.length==0) ?

        <div>

          <Comment
          style={{ width: 600 }}
          required={true}
           avatar={
             profilePic != '' ?
             <Avatar
             onClick = {() => this.onProfileClick(this.props.currentUser)}
             size="large"
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
           content={
            <div>
            <Form>
             <Form.Item name="note"  rules={[{ required: true }]}  >
               <Input
               placeholder="Write a comment"
                rows={4}
                onChange={this.handleCommentChange}
               />
               <Button type="primary"  onClick={this.handleSubmit}>
                 Add Comment
               </Button>
             </Form.Item>

             </Form>

            </div>
          }

         />

        </div>
        :

        <div>

        <Comments className="fontTest" newsfeed={this.props}/>
        <Form.Item>
          <Input
          placeholder="Write a comment"
           rows={4}
           class="fontTest"

           onChange={this.handleCommentChange}
          />
          <Button type="primary" onClick={this.handleSubmit}>
            Add Comment
          </Button>

        </Form.Item>


        </div>



      }

    </div>

    )

  }





  AddOneToLike = (e) => {
    e.stopPropagation();
    this.triggerComments();
    if ( this.props.data.people_like.includes(this.props.userId)){
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


    // authAxios.post('http://127.0.0.1:8000/userprofile/add-like/'+this.props.data.id+'/')


    }

    render() {
      console.log(this.props.data)
      let temp="http://127.0.0.1:8000"+this.props.data.post_images;
      console.log(temp);
      const success = () => {
      message.success('Clipped to your album!');
      };
      console.log(this.props);
      const { TextArea } = Input;
  return (
    <div>
    {/*
    <DetailSwitch/>
    */}` `

    {/*
    {this.ContentOfEvent()}
    */}
      <div>

        <Modal
          class="modalOuterContainer"
          title={`Post by ${this.props.data.user.username}`}
          visible={this.state.visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="1600px"
          height="800px"
          style={{marginTop:'-50px'}}
          >

          <div class="modalInnerContainer">

          {
                  this.props.data.post_images.length>0 ?

               <p class="modalCardBorder modalInnerPicture">{this.ContentOfPic()}</p>

          //
                  :

          <p  class="modalCardBorder modalInnerPicture"> {this.ContentOfPost()} </p>
          }
            <p  class="modalCardBorder">{this.ContentofComments()}</p>
          </div>
        </Modal>

      </div>

      {
            this.props.data.post_images.length>0 ?
           <p>{this.ContentOfPic()}</p>

      //
              :
      //         <div></div>
      //
      //
      //ContentOfPic

      <p> {this.ContentOfPost()} </p>
      }
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
