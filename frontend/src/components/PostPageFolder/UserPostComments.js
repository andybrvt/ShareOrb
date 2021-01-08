import React from 'react';
import './UserPostPage.css';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';
import UserPostPageWebSocketInstance from '../../UserPostPageWebsocket'
import * as dateFns from 'date-fns';


class UserPostComments extends React.Component{

  state = {
    comment: ''
  }


  capitalize (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  handleSubmit = e => {

    if(this.state.comment !== ''){
      UserPostPageWebSocketInstance.sendUserPostComment(
        this.props.curUser,
        this.state.comment,
        this.props.postId
      )

      this.setState({comment: ''})
    }
  }

  handleChange = e => {
    this.setState({
      comment: e.target.value
    })
  }

  heightCal = (captionLen) => {
    // This function is used to calculate the height of the comments by the
    // length of the caption

    const base = 75.5

    const final = base - (captionLen/30)
    const finalStr = final+"%"

    return finalStr;
  }

  renderTimestamp = timestamp =>{
    console.log(timestamp)
    let prefix = '';
    console.log(new Date().getTime())
    console.log(new Date(timestamp).getTime())
    const timeDiff = Math.round((new Date().getTime() - new Date(timestamp).getTime())/60000)
    console.log(timeDiff)
    if (timeDiff < 1 ) {
      prefix = `now`;
    } else if (timeDiff < 60 && timeDiff >= 1 ) {
      prefix = `${timeDiff}m`;
    }else if (timeDiff < 24*60 && timeDiff > 60) {
      prefix = `${Math.round(timeDiff/60)}h`;
    } else if (timeDiff < 31*24*60 && timeDiff > 24*60) {
      prefix = `${Math.round(timeDiff/(60*24))}d`;
    } else {
        prefix = `${dateFns.format(new Date(timestamp), "MMMM d, yyyy")}`;
    }

    return prefix;
  }


  render(){

    let caption = ""
    if (this.props.caption){
      caption = this.props.caption
    }
    console.log(this.props)
    return(
      <div
      style = {{
        height: this.heightCal(caption.length)
      }}
      className ='postCommentBoxBox'>
        <div className = 'postCommentBox'>
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={this.props.items}
          renderItem={item => (

              <div className = 'postCommentItem'>

                <div className = 'postCommentNameTag'>
                  <Avatar size = {35} src = {`${global.API_ENDPOINT}`+item.commentUser.profile_picture} />
                  <div className = 'postCommentName'>
                    <div className = 'postCommentUsername'>
                      <b>{this.capitalize(item.commentUser.first_name)} {this.capitalize(item.commentUser.last_name)} </b>

                        <span
                           class="headerPostText LikeCommentHover"
                           style={{marginLeft:'7.5px', fontSize:'12px'}}
                           >{"@"+item.commentUser.username}
                        </span>
                  </div>
                    <div className = 'postCommentDate'>
                      {/*
                      <i class="middleDot" style={{fontSize:'3px', marginLeft:'-10px', color:'#8c8c8c', marginTop:'5px', position:'absolute'}} class="fas fa-circle"></i>
                      */}
                      {this.renderTimestamp(new Date(item.created_on))}
                    </div>


                  </div>
                </div>

                <div className = 'postCommentText'>
                  {item.body}
                </div>
                <i style={{}} class="far fa-thumbs-up"></i>
                Like 1
              </div>
          )}
        />
        <div className = 'postCommentInput'>
          <Avatar
          size = {30}
          className ='postPicInput'
          // PICTURE URL
          src = {`${global.API_ENDPOINT}`+ this.props.profilePic}/>
          <Form>
            <Input
            className= 'postBoxInput'
            onChange ={this.handleChange}
            value = {this.state.comment}
            // bordered = {false}
            placeholder = 'Write a comment'
            name = 'postComment'
            onPressEnter = {this.handleSubmit}
            // rows = {1}
             />

            <button
            // type = 'submit'
            // onClick = {this.handleSubmit}
            style = {{display: 'none'}}
            />
          </Form>
        </div>
        </div>

      </div>
    )
  }
}

export default UserPostComments;
