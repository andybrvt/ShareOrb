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
      commentsCondition: true,
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
    let temp="http://127.0.0.1:8000"+this.props.data.image;
    const success = () => {
    message.success('Clipped to your album!');
    };
    return(
      <Card
         className="cardborder"
         style={{ width: 300, marginTop: 50, marginBottom:20  }}
         actions={[
          <Icon type="heart" style={{ fontSize: '20px', color: 'red', marginRight:'12px', }} />,
           <EditTwoTone  style={{ marginRight:'12px', fontSize: '20px'}}/>,
           <EllipsisOutlined key="ellipsis" />,
         ]}
       >


          <span>
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

          </span>
          <br></br>
          <span>
            <b>Date:</b> {this.props.data.created_at}
          </span>
          <br></br>
          <h2>
            {this.props.data.caption}
          </h2>

          <FolderAddTwoTone
          style={{ marginLeft: 550, fontSize:'30px' }}
          size="32px"
          onClick={success}


          />
          <ShareAltOutlined
          style={{ marginLeft: 550, fontSize:'30px' }}

          />
          <br></br>



          {
              this.props.data.image ?
              // <img src= {temp} height="250" width="450"/> AND YOU HAVE
               // TO COPY IMAGE ADDRESS REPLACE WITH TEMP IN PRODUCTION
              // <div style="max-width: 100%; max-height: 100%;">
                <div class="mock-img">
                  <img src= {"https://images.unsplash.com/photo-1590118432058-f2744d6897db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1203&q=80"} height="250" width="450"/>
                </div>
              // </div>

              :
              <div></div>

          }

        </Card>

    )
  }

  // this renders the posts on the newsfeed

  ContentOfPost(){
    let like_people = this.props.data.people_like
    let num_like = this.props.data.people_like.length
    console.log(num_like)
    return(
    <div onClick={this.OnClickPost}>


    <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10, marginBottom:40}}>

    <div  style={{marginTop:20, marginLeft:30, marginRight:10, marginBottom:50}}>
      <div>
     <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

           <span class="personName">
             {this.props.data.user.username}
             <Button shape="round" size="middle" style={{ marginLeft:'350px',}}>
               <FolderAddTwoTone  style={{ marginRight:'2px', fontSize: '20px', textAlign:'center'}}/>

             </Button>
             <div>
             <span class="fb-group-date" style={{marginLeft:50}}> 110 followers</span>

             <span class="fb-group-date" style={{marginLeft:300}}> Yesterday 5:20pm</span>
             </div>
           </span>

          </div>



    <Divider />


    <p style={{padding:10, color:'black'}} class="whiteSpacePost">
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
                 <div class="whiteSpacePost">
                 {this.props.data.caption}
                 </div>
               }

    </p>

    <Divider />


    {
      (like_people.includes(this.props.userId)) ?

      <div>
        {
          (num_like == 2) ?
          <div>
            You and one person like this.
          </div>

          :

          <div>
            {
              (num_like == 1)?
              <div>
                You like this.
              </div>
              :
              <div>
                You and {num_like - 1} people like this.
              </div>
            }
          </div>
        }
      </div>

      :

      <div>
        {
          (num_like === 0) ?
          <div>
          </div>

          :

          <div>
            {num_like} people like this.
          </div>

        }
      </div>

    }

    <heart />
  <div style={{padding:10}}>
    {
      (like_people.includes(this.props.userId))?
      <span>
      <Button size="medium" shape="round" onClick ={this.AddOneToLike} style={{fontSize:'14px', marginRight: '15px',}}>
          <i class="fa fa-heart-o" ></i>
          <i style={{marginLeft:'10px'}}> {num_like}</i>

      </Button>


      </span>

      :
      <span>
      <Button size="medium" shape="round" onClick ={this.AddOneToLike} style={{fontSize:'14px', marginRight: '15px',}}>
          <i class="fa fa-heart-o" ></i>
          <i style={{marginLeft:'10px'}}> {num_like}</i>

      </Button>


      </span>


    }


    <Button size="medium" shape="round" onClick ={this.triggerComments} style={{fontSize:'14px', marginRight: '15px',}}>
        <i class="fa fa-pencil" ></i>

        <i style={{marginLeft:'10px'}}>   {this.props.data.post_comments.length}</i>

    </Button>


    {
      (this.state.commentsCondition && (like_people.includes(this.props.userId))) ?


      <div style={{marginTop:'50px'}}>
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
