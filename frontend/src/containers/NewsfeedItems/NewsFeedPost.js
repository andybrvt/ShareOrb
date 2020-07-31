import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js';
import PreviewComments from '../../containers/comments/PreviewComments.js';
import { authAxios } from '../../components/util';
import {Icon, Tooltip, Row, Skeleton, Switch, Card, Divider, Avatar, Comment, Button, List, Input, Popover, message, Space, Form, Modal} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined,UserOutlined, ArrowRightOutlined, FolderAddTwoTone, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';
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
    let viewPersonPage="http://localhost:3000/explore/"+this.props.data.user.username;

    const success = () => {
    message.success('Clipped to your album!');
    };
    return(
      <div>

      <div>


      <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

      <div>
        <div style={{padding:20,}}>

          <Popover
             style={{width:'200px'}}
             content={<div>
               <Avatar shape="square" size="large" src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80" />
               <div> 110 followers </div>
             </div>}

            >
                <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />
            </Popover>

            <span class="personName">


                  {this.props.data.user.username}


               <div>
               <span class="fb-group-date" style={{marginLeft:50}}> Yosemite National Park</span>

               <span class="fb-group-date" style={{marginLeft:240}}> Yesterday 5:20pm</span>
               </div>
             </span>

            </div>

        </div>





      <div>

      <div class="imageContainer">

          <a href=""><img src={temp} alt="" /></a>

      </div>
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
                   <p class="innerSeeMore " style={{fontSize:'14px',}}>
                   {this.props.data.caption}
                   </p>
                  </div>
               }

    </p>




    <div class="likeCSS">

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

                <Avatar style={{marginRight:'10px'}} size="small" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />You like this
              </span>
              :
              <span>
                You and {like_people.length - 1} person like this.
              </span>
            }
          </span>
        }
      </span>

      :

      <span>
      {
        (like_people.length>3)?
        <span>
        <Avatar size="small" src="https://images.unsplash.com/photo-1507114845806-0347f6150324?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
        <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
        <Avatar size="small" src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
          +{like_people.length-3} people like this.
        </span>

        :

          <span>
            {
              (like_people.length === 0) ?
              <span>
              </span>

              :



              <div>
                {
                  (like_people.length==1)?
                  <span>
                  <Avatar src="https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=630&q=80" size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar> likes this
                  </span>


                  :
                  <span>
                  2  people like this
                  </span>

                }
                </div>



            }
          </span>
    }
    </span>

    }


    </div>

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


    <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

    <div>
      <div style={{padding:20,}}>
      <Popover
         style={{width:'200px'}}
         content={<div>
           <Avatar shape="square" size="large" src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80" />
           <div> 110 followers </div>
         </div>}

        >
            <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />
        </Popover>
           <span class="personName">
             {this.props.data.user.username}

             <div>
             <span class="fb-group-date" style={{marginLeft:55}}> Tucson, Arizona</span>

             <span class="fb-group-date" style={{marginLeft:300}}> Yesterday 5:20pm</span>
             </div>
           </span>

      </div>

      <Divider/>





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
                 <div class="whiteSpacePost innerSeeMore"  style={{padding:'50px', fontSize:'14px',}} >


                 {this.props.data.caption}

                 </div>
               }

    </p>

    <div class="likeCSS">

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

                <Avatar style={{marginRight:'10px'}} size="small" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />You like this
              </span>
              :
              <span>
                You and {like_people.length - 1} person like this.
              </span>
            }
          </span>
        }
      </span>

      :

      <span>
      {
        (like_people.length>3)?
        <span>
        <Avatar size="small" src="https://images.unsplash.com/photo-1507114845806-0347f6150324?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80" />
        <Avatar size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
        <Avatar size="small" src="https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"/>
          +{like_people.length-3} people like this.
        </span>

        :

          <span>
            {
              (like_people.length === 0) ?
              <span>
              </span>

              :



              <div>
                {
                  (like_people.length==1)?
                  <span>
                  <Avatar src="https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=630&q=80" size="small" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar> likes this
                  </span>


                  :
                  <span>
                  2  people like this
                  </span>

                }
                </div>



            }
          </span>
    }
    </span>

    }


    </div>


    {/* show the first 3 people
      like_people[0]'s avatar'
      like_people[1]'s avatar
      like_people[2]'s avatar
      and + like_people.length-3 like this
      */}

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


      <div style={{marginLeft:'20px'}}>
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
                  this.props.data.image ?
               <p class="modalCardBorder modalInnerPicture">{this.ContentOfPic()}</p>

          //
                  :
          //         <div></div>
          //
          //
          //ContentOfPic
          <p  class="modalCardBorder modalInnerPicture"> {this.ContentOfPost()} </p>
          }
            <p  class="modalCardBorder">{this.ContentofComments()}</p>
          </div>
        </Modal>

      </div>

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
