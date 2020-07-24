import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js';
import PreviewComments from '../../containers/comments/PreviewComments.js';
import { authAxios } from '../../components/util';
import {Icon, Tooltip, Row, Skeleton, Switch, Card, Divider, Avatar, Comment, Button, List, Input, Popover, message, Space, Form, Modal} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined, ArrowRightOutlined, FolderAddTwoTone, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';
import WebSocketPostsInstance from  '../../postWebsocket';
import NotificationWebSocketInstance from  '../../notificationWebsocket';
import { connect } from 'react-redux';
import heart  from './heart.svg';
import { commentPic } from './comment.svg';





class NewsfeedPost extends React.Component {
  constructor(props){
    super(props);
    // this.initialisePost()

    this.state = {
      visibleModal: false,
      commentPost:'',
      commentsCondition:false,
    }
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

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };


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


  ContentOfPic() {
    let like_people = this.props.data.people_like
    console.log(this.props.data)
    let temp="http://127.0.0.1:8000"+this.props.data.image;
    const success = () => {
    message.success('Clipped to your album!');
    };
    return(
      <div>

      <div>


      <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

      <div>
        <div style={{padding:20,}}>
       <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

             <span class="personName">
               {this.props.data.user.username}

               <div>
               <span class="fb-group-date" style={{marginLeft:55}}> 110 followers</span>

               <span class="fb-group-date" style={{marginLeft:300}}> Yesterday 5:20pm</span>
               </div>
             </span>

            </div>



      <Divider />


      <p style={{color:'black'}}>
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
                   <div class="whiteSpacePost"  style={{padding:'20px'}} >
                   {this.props.data.caption}

                   </div>
                 }

      </p>
      <div class="row test4">
    <h3><a href=""><img src={temp} alt="" />Roswell Parian</a>
    </h3>

  </div>
  

      {
        (like_people.includes(this.props.userId)) ?

        <span>
          {
            (like_people.length == 2) ?
            <span>
              You and one person like this.
            </span>

            :

            <span>
              {
                (like_people.length == 1)?
                <span>
                  You like this.
                </span>
                :
                <span>
                  You and {like_people.length - 1} people like this.
                </span>
              }
            </span>
          }
        </span>

        :

        <span>
          {
            (like_people.length === 0) ?
            <span>
            </span>

            :

            <span>
              {like_people.length} people like this.
            </span>

          }
        </span>

      }

      {/*
      <div>
      <span class="fb-group-date" style={{marginLeft:55}}> 33 hearts </span>

      <span class="fb-group-date" style={{marginLeft:50}}>2 comments</span>
      </div>
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




      {/*
          <Popover content={
            <div>


              <a href="/current-user" className="nav-text">
                {this.props.data.user.username}
              </a>
              <p>Content</p>
            </div>
            }
            title={this.props.data.user.username}
            placement="topLeft"
            >
           <Button> {this.props.data.user.username} </Button>
          </Popover>



          {
              this.props.data.image ?
              <img src= {temp} height="250" width="450"/>
              // AND YOU HAVE
               // TO COPY IMAGE ADDRESS REPLACE WITH TEMP IN PRODUCTION
              // <div style="max-width: 100%; max-height: 100%;">
                // <div class="mock-img">
                //   <img src= {"https://images.unsplash.com/photo-1590118432058-f2744d6897db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1203&q=80"} height="250" width="450"/>
                // </div>
              // </div>

              :
              <div></div>

          }

        </Card>

        */}
        </div>
    )
  }

  // this renders the posts on the newsfeed

  ContentOfPost(){
    console.log(this.props.data)
    let like_people = this.props.data.people_like

    return(
      // if you want anywhere in the post to click on and open modal put OnClickPost in this div
    <div>


    <div class="card" style={{marginBottom:40}}>

    <div  style={{marginTop:20, marginLeft:20, marginRight:20, }}>
      <div>
     <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

           <span class="personName">
             {this.props.data.user.username}

             <div>
             <span class="fb-group-date" style={{marginLeft:55}}> 110 followers</span>

             <span class="fb-group-date" style={{marginLeft:300}}> Yesterday 5:20pm</span>
             </div>
           </span>

          </div>



    <Divider />


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
                 <div class="whiteSpacePost"  style={{padding:'50px'}} >
                 {this.props.data.caption}
                 </div>
               }

    </p>




    {
      (like_people.includes(this.props.userId)) ?

      <span>
        {
          (like_people.length == 2) ?
          <span>
            You and one person like this.
          </span>

          :

          <span>
            {
              (like_people.length == 1)?
              <span>
                You like this.
              </span>
              :
              <span>
                You and {like_people.length - 1} people like this.
              </span>
            }
          </span>
        }
      </span>

      :

      <span>
        {
          (like_people.length === 0) ?
          <span>
          </span>

          :

          <span>
            {like_people.length} people like this.
          </span>

        }
      </span>

    }

    {/*
    <div>
    <span class="fb-group-date" style={{marginLeft:55}}> 33 hearts </span>

    <span class="fb-group-date" style={{marginLeft:50}}>2 comments</span>
    </div>
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
  )
  }


  ContentofComments(){

    return(

    <div>
      {


        (this.props.data.post_comments.length==0) ?

        <div>

          <Comment
          style={{ width: 600 }}
          required={true}
           avatar={
             <Avatar
               src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
               alt="Han Solo"
               class="fontTest"
               />
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
      console.log(this.props)
      let temp="http://127.0.0.1:8000"+this.props.data.image;
      console.log(temp);
      const success = () => {
      message.success('Clipped to your album!');
      };
      console.log(this.props);
      const { TextArea } = Input;
  return (
    <div>


      <Modal

        title={`Post by ${this.props.data.user.username}`}
        visible={this.state.visibleModal}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="800px"
      >
        <p>{this.ContentOfPost()}</p>
        <p>{this.ContentofComments()}</p>

      </Modal>



      {
              this.props.data.image ?
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
    userId: state.auth.id
  }
}


export default connect(mapStateToProps)(NewsfeedPost);
