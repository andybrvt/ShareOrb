import React from "react";
import "./NewsfeedPost.css";
import Comments from '../../containers/comments/comments.js';
import { authAxios } from '../../components/util';
import {Icon, Tooltip, Row, Skeleton, Switch, Card, Divider, Avatar, Comment, Button, List, Input, Popover, message, Space, Form, Modal} from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, SearchOutlined, ArrowRightOutlined, FolderAddTwoTone, ShareAltOutlined, HeartTwoTone, EditTwoTone} from '@ant-design/icons';

class NewsfeedPost extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      visibleModal: false,
      commentPost:'',
    }
  }

  showModal = () => {
    this.setState({
      visibleModal: true,
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
    console.log("SUBMIT BUTTON1!!!!!!")
    console.log(this.props)
    console.log(this.props.data)
    console.log(this.props.data.id)
    var data = new FormData();
    // change this later to curr user
    data.append("name", localStorage.getItem('username'));
    data.append("body", this.state.commentPost);
    for (var pair of data.entries()) {
     console.log(pair[0]+ ', ' + pair[1]);
    }
    console.log(localStorage.getItem('token'))

    fetch('http://127.0.0.1:8000/userprofile/testComment/'+this.props.data.id+'/',{
     method: 'POST',
       headers: {
         Authorization: `Token ${localStorage.getItem('token')}`,
       },
       body:data
    })
      .then (res =>res.json())
      .then(json =>{
     	 console.log(json)
     	 return json
      })
     }


  ContentOfPic() {
    let temp="http://127.0.0.1:8000"+this.props.data.image;
    const success = () => {
    message.success('Clipped to your album!');
    };
    return(
      <Card
         className="cardborder"
         style={{ width: 700, marginTop: 50, marginBottom:50  }}
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
          <h2 className="RobotoFont">
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
    return(
    <div onClick={this.OnClickPost}>


    <div class="card" style={{marginLeft:10, marginRight:10, minHeight:10}}>
    <div  style={{marginTop:20, marginLeft:30, marginRight:10}}>
      <div>
     <Avatar size="large" src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="avatar" />

           <span class="personName">
             {this.props.data.user.username}
             <div>
             <span class="fb-group-date" style={{marginLeft:50}}> 110 followers</span>

             <span class="fb-group-date" style={{marginLeft:300}}> Yesterday 5:20pm</span>
             </div>
           </span>

          </div>



    <Divider />
    <p style={{padding:20, color:'black'}}>
              {
                 ((this.props.data.caption).length>600)?
                 <div>
                 {this.props.data.caption.substring(0,600)}
                <span style={{color:'blue'}}> ... see more </span>
                 </div>
                 :
                 <div>
                 {this.props.data.caption}
                 </div>
               }

    </p>

    <Divider />

    <Button shape="round" size="middle"  onClick ={this.AddOneToLike} style={{marginTop:'40px', marginRight: '15px',}}>
      <Icon type="heart" style={{ fontSize: '20px', color: 'red', marginRight:'12px', }} />
      {this.props.data.like_count}
    </Button>


    <Button shape="round" size="middle">
      <EditTwoTone  style={{ marginRight:'8px', fontSize: '20px'}}/>
      {this.props.data.post_comments.length}
    </Button>


    <Button shape="round" size="middle" style={{ marginLeft:'350px',}}>
      <FolderAddTwoTone  style={{ marginRight:'2px', fontSize: '20px', textAlign:'center'}}/>

    </Button>

    <div>
    <div class="testAvatar" style={{display:'flex'}}>
        <img style={{marginRight:10}} src="http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png" alt="profile" />
        <img style={{marginRight:10}} src="https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=562&q=80" alt="profile" />
        <img style={{marginRight:10}} src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" alt="profile" />
        <img style={{marginRight:10}} src="https://images.unsplash.com/photo-1572631382901-cf1a0a6087cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" alt="profile" />
        <img style={{marginRight:10}} src="https://images.unsplash.com/photo-1521038199265-bc482db0f923?ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="profile" />
    </div>
    + 5 others like this
    </div>


      </div>

    </div>


            <div>
            {


              (this.props.data.like_condition==false) ?




              <div className>

                {
                  (this.props.data.like_count==0) ?

                  <div>

                  </div>

                  :


                  <div>
                    {this.props.data.like_count} people like this
                  </div>

                }
              </div>


              :

              <div>

              {


                  (this.props.data.like_count==2) ?
                 <div>
                  You and one person like this
                  </div>

                :

                <div>

                {


                  (this.props.data.like_count==1) ?

                  <div>
                    You like this

                  </div>
                  :

                  <div>

                    You and {(this.props.data.like_count)-1} people like this
                  </div>
                }
                </div>
              }
              </div>
            }



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
           avatar={
             <Avatar
               src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
               alt="Han Solo"
               class="fontTest"
               />
           }
           content={
            <div>
             <Form.Item>
               <Input
               placeholder="Write a comment"
                rows={4}
                onChange={this.handleCommentChange}
               />
               <Button type="primary"  onClick={this.handleSubmit}>
                 Add Comment
               </Button>
             </Form.Item>

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
    console.log("hi");
    console.log(this.props);
    console.log(this.props.data.id);
  //   // const username = this.props.data.username;
  //   // console.log(this.props)
    authAxios.post('http://127.0.0.1:8000/userprofile/add-like/'+this.props.data.id+'/')

  //   this.setState({value: e.target.value});
    }
    render() {
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

export default NewsfeedPost;
