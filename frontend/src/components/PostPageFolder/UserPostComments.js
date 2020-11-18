import React from 'react';
import './UserPostPage.css';
import { Comment, Tooltip, List, Avatar, Input, Form, Button } from 'antd';


class UserPostComments extends React.Component{

  state = {
    comment: ''
  }


  render(){
    return(
      <div className = "postCommentBoxBox">
        <div className = 'postCommentBox'>
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={this.props.items}
          renderItem={item => (

              <div className = 'postCommentItem'>

              <div className = 'postCommentNameTag'>
                <Avatar size = {40} src = {'http://127.0.0.1:8000'+item.commentUser.profile_picture} />
                <div className = 'postCommentName'>
                  <div className = 'postCommentUsername'>
                  <b>{this.capitalize(item.commentUser.first_name)} {this.capitalize(item.commentUser.last_name)} </b>
                  </div>
                  <div className = 'postCommentDate'>
                  {this.renderTimestamp(new Date(item.created_on))}
                  </div>


                </div>
              </div>

              <div className = 'postCommentText'>
              {item.body}
              </div>

              </div>
          )}
        />
        <div className = 'postCommentInput'>
          <Avatar
          size = {40}
          className ='postPicInput'
          src = {'http://127.0.0.1:8000'+ this.props.profilePic}/>
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
